import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';

interface BillingInfo {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

interface ShippingInfo {
  recipientName: string;
}

interface BillItem {
  brand: string;
  code: string;
  retailPrice: number;
  size: string;
  arrival: string;
  returnDate: string;
  price: number;
}

@Component({
  selector: 'app-payment',
  imports: [CommonModule, FormsModule, Header, Footer],
  templateUrl: './payment.html',
  styleUrl: './payment.scss'
})
export class PaymentComponent {
  constructor(private router: Router) {}

  billingInfo: BillingInfo = {
    firstName: '',
    lastName: '',
    phone: '',
    email: ''
  };

  shippingInfo: ShippingInfo = {
    recipientName: ''
  };

  isBillingSaved = false;
  isShippingSaved = false;
  isAgreementPopupOpen = false;

  billItems: BillItem[] = [
    {
      brand: 'Gucci',
      code: 'GG4287/S',
      retailPrice: 34900,
      size: 'FREE',
      arrival: 'Sat, 08/03/25',
      returnDate: 'Tue, 11/03/25',
      price: 1990
    },
    {
      brand: 'Gucci',
      code: 'GG4287/S',
      retailPrice: 34900,
      size: 'FREE',
      arrival: 'Sat, 08/03/25',
      returnDate: 'Tue, 11/03/25',
      price: 1990
    }
  ];

  get rentalTotal() {
    return this.billItems.reduce((total, item) => total + item.price, 0);
  }

  get depositTotal() {
    return this.rentalTotal / 2;
  }

  get payableTotal() {
    return this.rentalTotal;
  }

  get grandTotal() {
    return this.depositTotal;
  }

  get isPaymentInfoComplete() {
    return [
      this.billingInfo.firstName,
      this.billingInfo.lastName,
      this.billingInfo.phone,
      this.billingInfo.email,
      this.shippingInfo.recipientName
    ].every(value => value.trim().length > 0);
  }

  saveBillingInfo() {
    localStorage.setItem('billingInfo', JSON.stringify(this.billingInfo));
    this.isBillingSaved = true;
  }

  saveShippingInfo() {
    localStorage.setItem('shippingInfo', JSON.stringify(this.shippingInfo));
    this.isShippingSaved = true;
  }

  openAgreementPopup() {
    if (!this.isPaymentInfoComplete) return;
    this.isAgreementPopupOpen = true;
  }

  closeAgreementPopup() {
    this.isAgreementPopupOpen = false;
  }

  confirmRental() {
    this.isAgreementPopupOpen = false;
    this.router.navigate(['/qr-payment']);
  }

  formatPrice(price: number) {
    return `${price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })} ฿`;
  }
}
