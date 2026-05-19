import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';

interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
}

interface PaymentUser {
  member_id: number;
  username: string;
  phone: string;
  email: string;
  address: string;
}

interface BillItem {
  cart_item_id: number;
  product_id: number;
  name: string;
  variant_id: number;
  size: string;
  color: string;
  quantity: number;
  price: number;
  price_sum: number;
  day_type: string;
  day_start: string;
  day_end: string;
  image_front: string;
}

interface PaymentSummary {
  subtotal: number;
  deposit: number;
  grand_total: number;
  total_items: number;
}

interface PaymentData {
  user: PaymentUser;
  items: BillItem[];
  summary: PaymentSummary;
}

@Component({
  selector: 'app-payment',
  imports: [CommonModule, Header, Footer],
  templateUrl: './payment.html',
  styleUrl: './payment.scss',
})
export class PaymentComponent implements OnInit {
  constructor(private router: Router) {}

  customerInfo: CustomerInfo = {
    name: '',
    phone: '',
    email: '',
    address: '',
  };

  isAgreementPopupOpen = false;
  isCustomerLoading = false;

  paymentData: PaymentData = {
    user: {
      member_id: 1,
      username: 'Arida',
      phone: '09991115555',
      email: 'ananya@gmail.com',
      address: '123/7 กาฬสินธุ์',
    },
    items: [
      {
        cart_item_id: 1,
        product_id: 1,
        name: 'ชุดราตรีสีแดง',
        variant_id: 1,
        size: 'M',
        color: 'แดง',
        quantity: 2,
        price: 1500,
        price_sum: 3000,
        day_type: '4วัน',
        day_start: '2025-10-19T17:00:00.000Z',
        day_end: '2025-10-23T17:00:00.000Z',
        image_front:
          'https://res.cloudinary.com/dfk8wkzrs/image/upload/v1778584104/rental/fqb9eokv3eynotpfujex.png',
      },
      {
        cart_item_id: 5,
        product_id: 1,
        name: 'ชุดราตรีสีแดง',
        variant_id: 2,
        size: 'L',
        color: 'แดงเข้ม',
        quantity: 1,
        price: 1500,
        price_sum: 1500,
        day_type: '4วัน',
        day_start: '2026-05-19T17:00:00.000Z',
        day_end: '2026-05-23T17:00:00.000Z',
        image_front:
          'https://res.cloudinary.com/dfk8wkzrs/image/upload/v1778584104/rental/fqb9eokv3eynotpfujex.png',
      },
    ],
    summary: {
      subtotal: 9000,
      deposit: 4500,
      grand_total: 9000,
      total_items: 2,
    },
  };

  billItems: BillItem[] = [];
  summary: PaymentSummary = {
    subtotal: 0,
    deposit: 0,
    grand_total: 0,
    total_items: 0,
  };

  ngOnInit() {
    this.loadPaymentData();
  }

  openAgreementPopup() {
    if (this.isCustomerLoading) return;
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
      maximumFractionDigits: 2,
    })} ฿`;
  }

  formatDate(date: string) {
    return new Intl.DateTimeFormat('th-TH', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(date));
  }

  private loadPaymentData() {
    this.billItems = this.paymentData.items;
    this.summary = this.paymentData.summary;
    this.customerInfo = {
      name: this.paymentData.user.username || '-',
      phone: this.paymentData.user.phone || '-',
      email: this.paymentData.user.email || '-',
      address: this.paymentData.user.address ||'-',
    };
  }
}
