import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaymentsService } from '../../../service/payments.service';

@Component({
  selector: 'app-payment-channel',
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-channel.html',
  styleUrl: './payment-channel.scss',
})
export class PaymentChannelComponent implements OnInit {
  loading = false;
  saving = false;
  errorMessage = '';
  successMessage = '';
  qrFile: File | null = null;
  accountNumberHasInvalidInput = false;
  promptPayHasInvalidInput = false;

  payment = {
    channelId: 0,
    accountName: '',
    accountNumber: '',
    promptPay: '',
    qrCode: '',
    adminId: 0,
  };

  constructor(private paymentsService: PaymentsService) {}

  ngOnInit() {
    this.loadPaymentChannel();
  }

  loadPaymentChannel() {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.paymentsService.getPaymentChannel().subscribe({
      next: (res) => {
        this.payment = {
          channelId: res.channel_id,
          accountName: res.name_account,
          accountNumber: this.formatAccountNumber(res.account_number || ''),
          promptPay: this.onlyDigits(res.promptpay || ''),
          qrCode: res.qr_code,
          adminId: res.admin_id_fk,
        };
        this.qrFile = null;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'โหลดข้อมูลช่องทางชำระเงินไม่สำเร็จ';
      },
    });
  }

  onQrSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.qrFile = input.files[0];
    this.payment.qrCode = URL.createObjectURL(this.qrFile);
  }

  onAccountNumberInput(value: string) {
    const digitOnly = this.onlyDigits(value);
    this.accountNumberHasInvalidInput = value.replace(/-/g, '') !== digitOnly;
    this.payment.accountNumber = this.formatAccountNumber(value);

    if (this.accountNumberHasInvalidInput) {
      this.errorMessage = 'เลขบัญชีกรอกได้เฉพาะตัวเลขเท่านั้น';
      this.successMessage = '';
      return;
    }

    if (this.errorMessage === 'เลขบัญชีกรอกได้เฉพาะตัวเลขเท่านั้น') {
      this.errorMessage = '';
    }
  }

  onPromptPayInput(value: string) {
    const digitOnly = this.onlyDigits(value);
    this.promptPayHasInvalidInput = value !== digitOnly;
    this.payment.promptPay = digitOnly;

    if (this.promptPayHasInvalidInput) {
      this.errorMessage = 'พร้อมเพย์กรอกได้เฉพาะตัวเลขเท่านั้น';
      this.successMessage = '';
      return;
    }

    if (this.errorMessage === 'พร้อมเพย์กรอกได้เฉพาะตัวเลขเท่านั้น') {
      this.errorMessage = '';
    }
  }

  savePaymentChannel() {
    this.errorMessage = '';
    this.successMessage = '';
    const accountNumber = this.formatAccountNumber(this.payment.accountNumber);
    const promptPay = this.onlyDigits(this.payment.promptPay);
    this.payment.accountNumber = accountNumber;
    this.payment.promptPay = promptPay;

    if (
      !this.payment.accountName.trim() ||
      !accountNumber ||
      !promptPay
    ) {
      this.errorMessage = 'กรุณากรอกข้อมูลช่องทางชำระเงินให้ครบ';
      return;
    }

    if (this.promptPayHasInvalidInput) {
      this.errorMessage = 'พร้อมเพย์มีตัวอักษร กรุณากรอกเฉพาะตัวเลขก่อนบันทึก';
      return;
    }

    if (this.accountNumberHasInvalidInput) {
      this.errorMessage = 'เลขบัญชีมีตัวอักษร กรุณากรอกเฉพาะตัวเลขก่อนบันทึก';
      return;
    }

    const adminId =
      this.payment.adminId || Number(localStorage.getItem('member_id') || '0');

    this.saving = true;
    this.paymentsService
      .updatePaymentChannel({
        name_account: this.payment.accountName.trim(),
        account_number: accountNumber,
        promptpay: promptPay,
        admin_id_fk: adminId,
        qr_code: this.qrFile,
      })
      .subscribe({
        next: (res) => {
          this.qrFile = null;
          this.saving = false;
          this.successMessage = 'บันทึกช่องทางชำระเงินเรียบร้อย';
          this.loadPaymentChannel();
        },
        error: (err) => {
          this.saving = false;
          this.errorMessage =
            err?.error?.error || 'บันทึกช่องทางชำระเงินไม่สำเร็จ';
        },
      });
  }

  private onlyDigits(value: string) {
    return String(value || '').replace(/\D/g, '');
  }

  private formatAccountNumber(value: string) {
    const digits = this.onlyDigits(value).slice(0, 10);
    const groups = [
      digits.slice(0, 3),
      digits.slice(3, 4),
      digits.slice(4, 9),
      digits.slice(9, 10),
    ].filter(Boolean);

    return groups.join('-');
  }
}
