import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';

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
  styleUrl: './qr-payment.scss'
})
export class QrPaymentComponent {
  constructor(private router: Router) {}

  transferTime = '';
  slipFileName = '';
  isSubmitted = false;
  isSuccessPopupOpen = false;

  paymentAccount: PaymentAccount = {
    accountName: 'บริษัท เดรส มี อัพ จำกัด',
    bankName: 'ธนาคารกสิกรไทย',
    bankLogo: 'assets/payment/logo.png',
    accountNumber: '123-4-56789-0',
    promptPayNumber: '088-888-8888',
    qrImage: 'assets/payment/qr-mock.svg'
  };

  onSlipSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.slipFileName = file?.name ?? '';
    this.isSubmitted = false;
  }

  submitPaymentSlip() {
    if (!this.slipFileName || !this.transferTime) return;
    localStorage.setItem('latestPaymentSlip', JSON.stringify({
      slipFileName: this.slipFileName,
      transferTime: this.transferTime,
      status: 'pending'
    }));
    this.isSubmitted = true;
    this.isSuccessPopupOpen = true;
  }

  closeSuccessPopup() {
    this.isSuccessPopupOpen = false;
    this.router.navigate(['/order-status']);
  }
}
