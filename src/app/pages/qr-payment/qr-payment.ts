import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../service/cart.service';
import { PaymentChannel, PaymentsService } from '../../service/payments.service';

interface PaymentAccount {
  accountName: string;
  bankName: string;
  bankLogo: string;
  accountNumber: string;
  promptPayNumber: string;
  qrImage: string;
}

@Component({
  selector: 'app-qr-payment',
  imports: [CommonModule, FormsModule, Header, Footer],
  templateUrl: './qr-payment.html',
  styleUrl: './qr-payment.scss',
})
export class QrPaymentComponent implements OnInit {
  selectedSlip?: File;
  orderId = 0;
  uploading = false;
  depositAmount = 0;
  loadingPaymentChannel = true;

  transferTime = '';
  slipFileName = '';
  isSubmitted = false;
  isSuccessPopupOpen = false;
  cartId = 0;
  slipPreview = '';
  copiedField = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cartService: CartService,
    private paymentsService: PaymentsService,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.orderId = Number(params['order_id']);

      console.log(this.orderId);

      if (this.orderId) {
        this.loadDeposit();
      }
    });

    this.loadPaymentChannel();
  }

  paymentAccount: PaymentAccount = {
    accountName: '-',
    bankName: 'ธนาคารกสิกรไทย',
    bankLogo: 'assets/payment/logo.png',
    accountNumber: '-',
    promptPayNumber: '-',
    qrImage: 'assets/payment/qr-mock.svg',
  };

  submitPaymentSlip() {
    if (!this.selectedSlip || !this.transferTime || !this.orderId) {
      return;
    }

    const now = new Date();

    const date = now.toISOString().split('T')[0];

    const fullTime = `${date} ${this.transferTime}:00`;

    this.uploading = true;

    this.cartService
      .createPayment(this.orderId, fullTime, this.selectedSlip)
      .subscribe({
        next: (res) => {
          console.log(res);

          this.uploading = false;
          this.isSubmitted = true;

          this.isSuccessPopupOpen = true;
        },

        error: (err) => {
          console.log(err);

          this.uploading = false;
        },
      });
  }

  closeSuccessPopup() {
    this.isSuccessPopupOpen = false;
    this.router.navigate(['/order-status']);
  }

  onSlipSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) return;

    this.selectedSlip = input.files[0];

    this.slipFileName = this.selectedSlip.name;

    const reader = new FileReader();

    reader.onload = () => {
      this.slipPreview = reader.result as string;
    };

    reader.readAsDataURL(this.selectedSlip);
  }

  loadDeposit() {
    this.paymentsService.getMoney(this.orderId).subscribe({
      next: (res) => {
        console.log(res);

        this.depositAmount = res.deposit;
      },

      error: (err) => {
        console.log(err);
      },
    });
  }

  loadPaymentChannel() {
    this.loadingPaymentChannel = true;

    this.paymentsService.getPaymentChannel().subscribe({
      next: (res: PaymentChannel) => {
        this.paymentAccount = {
          ...this.paymentAccount,
          accountName: res.name_account || '-',
          accountNumber: res.account_number || '-',
          promptPayNumber: res.promptpay || '-',
          qrImage: res.qr_code || 'assets/payment/qr-mock.svg',
        };

        this.loadingPaymentChannel = false;
      },
      error: (err) => {
        console.log(err);

        this.loadingPaymentChannel = false;
      },
    });
  }

  formatAccountNumber(value: string) {
    const digits = this.onlyDigits(value);
    if (digits.length !== 10) return value;

    return `${digits.slice(0, 3)}-${digits.slice(3, 4)}-${digits.slice(4, 9)}-${digits.slice(9)}`;
  }

  formatPhoneNumber(value: string) {
    const digits = this.onlyDigits(value);
    if (digits.length !== 10) return value;

    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  copyText(value: string, field: string) {
    const text = this.onlyDigits(value) || value;

    navigator.clipboard.writeText(text).then(() => {
      this.copiedField = field;

      window.setTimeout(() => {
        if (this.copiedField === field) this.copiedField = '';
      }, 1600);
    });
  }

  private onlyDigits(value: string) {
    return value.replace(/\D/g, '');
  }
}
