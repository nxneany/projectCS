import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface PaymentReview {
  orderNo: string;
  customerName: string;
  slipImage: string;
  transferTime: string;
  amount: number;
  status: string;
}

@Component({
  selector: 'app-payment-review',
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-review.html',
  styleUrl: './payment-review.scss',
})
export class PaymentReviewComponent {
  searchText = '';

  showSuccessPopup = false;

  successMessage = '';

  showDeletePopup = false;

  selectedDeleteOrderNo = '';

  payments: PaymentReview[] = [
    {
      orderNo: 'ORD-20260520-001',
      customerName: 'DFN Tv',
      slipImage:
        'https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=1200&auto=format&fit=crop',
      transferTime: '14:25',
      amount: 1200,
      status: 'รอตรวจสอบ',
    },
    {
      orderNo: 'ORD-20260520-002',
      customerName: 'Ananya S.',
      slipImage:
        'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1200&auto=format&fit=crop',
      transferTime: '15:42',
      amount: 3500,
      status: 'รอตรวจสอบ',
    },
    {
      orderNo: 'ORD-20260520-003',
      customerName: 'Napat K.',
      slipImage:
        'https://images.unsplash.com/photo-1579621970795-87facc2f976d?q=80&w=1200&auto=format&fit=crop',
      transferTime: '17:18',
      amount: 850,
      status: 'รอตรวจสอบ',
    },
    {
      orderNo: 'ORD-20260520-004',
      customerName: 'Pimchanok',
      slipImage:
        'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=1200&auto=format&fit=crop',
      transferTime: '18:06',
      amount: 4200,
      status: 'รอตรวจสอบ',
    },
  ];

  get filteredPayments() {
    if (!this.searchText.trim()) {
      return this.payments;
    }

    return this.payments.filter((payment) =>
      payment.orderNo.toLowerCase().includes(this.searchText.toLowerCase()),
    );
  }

  approvePayment(orderNo: string) {
    this.payments = this.payments.map((payment) =>
      payment.orderNo === orderNo
        ? {
            ...payment,
            status: 'ยืนยันแล้ว',
          }
        : payment,
    );

    this.successMessage = `ยืนยันการโอนของ ${orderNo} เรียบร้อยแล้ว`;

    this.showSuccessPopup = true;

    setTimeout(() => {
      this.showSuccessPopup = false;
    }, 2200);
  }

  rejectPayment(orderNo: string) {
    this.payments = this.payments.filter(
      (payment) => payment.orderNo !== orderNo,
    );
  }

  formatPrice(price: number) {
    return `${price.toLocaleString('en-US')} ฿`;
  }

  openDeletePopup(orderNo: string) {
    this.selectedDeleteOrderNo = orderNo;

    this.showDeletePopup = true;
  }

  closeDeletePopup() {
    this.showDeletePopup = false;

    this.selectedDeleteOrderNo = '';
  }

  confirmDeletePayment() {
    this.payments = this.payments.filter(
      (payment) => payment.orderNo !== this.selectedDeleteOrderNo,
    );

    this.closeDeletePopup();

    this.successMessage = 'ลบรายการเรียบร้อยแล้ว';

    this.showSuccessPopup = true;

    setTimeout(() => {
      this.showSuccessPopup = false;
    }, 2200);
  }
}
