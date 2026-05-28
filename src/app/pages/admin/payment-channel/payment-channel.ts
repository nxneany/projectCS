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
          accountNumber: res.account_number,
          promptPay: res.promptpay,
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

  savePaymentChannel() {
    this.errorMessage = '';
    this.successMessage = '';

    if (
      !this.payment.accountName.trim() ||
      !this.payment.accountNumber.trim() ||
      !this.payment.promptPay.trim()
    ) {
      this.errorMessage = 'กรุณากรอกข้อมูลช่องทางชำระเงินให้ครบ';
      return;
    }

    const adminId =
      this.payment.adminId || Number(localStorage.getItem('member_id') || '0');

    this.saving = true;
    this.paymentsService
      .updatePaymentChannel({
        name_account: this.payment.accountName.trim(),
        account_number: this.payment.accountNumber.trim(),
        promptpay: this.payment.promptPay.trim(),
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
}
