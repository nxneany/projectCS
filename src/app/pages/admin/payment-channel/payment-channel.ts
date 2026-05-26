import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment-channel',
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-channel.html',
  styleUrl: './payment-channel.scss',
})
export class PaymentChannelComponent {
  payment = {
    accountName: 'ภูมิภัทร์ นาดี',
    accountNumber: '678-3-31492-8',
    promptPay: '097-193-9481',
    qrCode:
      'https://res.cloudinary.com/dfk8wkzrs/image/upload/v1779293519/rental/pnwtcm1pig5jducwvakx.png',
  };
}
