import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaymentsService, PaymentSlipItem } from '../../../service/payments.service';
import { formatOrderNo } from '../../../utils/order-format';

interface PaymentReview {
  paymentId: number;
  orderId: number;
  memberId: number;
  orderNo: string;
  customerName: string;
  slipImage: string;
  transferTime: string;
  amount: number;
  approveAmount: number;
  status: string;
}

@Component({
  selector: 'app-payment-review',
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-review.html',
  styleUrl: './payment-review.scss',
})
export class PaymentReviewComponent implements OnInit {
  searchText = '';

  loading = false;

  errorMessage = '';

  approvingOrderId: number | null = null;

  private searchTimer: ReturnType<typeof setTimeout> | null = null;

  showSuccessPopup = false;

  successMessage = '';

  previewImageUrl = '';

  previewImageTitle = '';

  payments: PaymentReview[] = [];

  constructor(private paymentsService: PaymentsService) {}

  ngOnInit() {
    this.loadPaymentSlips();
  }

  loadPaymentSlips() {
    this.loading = true;
    this.errorMessage = '';

    this.paymentsService.getPaymentSlips(this.searchText).subscribe({
      next: (response) => {
        this.payments = (response.items ?? []).map((item) => this.mapPaymentSlip(item));
        this.loading = false;
      },
      error: (error) => {
        console.error('Load payment slips failed', error);
        this.errorMessage = 'ไม่สามารถโหลดข้อมูลสลิปได้ กรุณาลองใหม่อีกครั้ง';
        this.payments = [];
        this.loading = false;
      },
    });
  }

  onSearchInput() {
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }

    this.searchTimer = setTimeout(() => {
      this.loadPaymentSlips();
    }, 350);
  }

  approvePayment(payment: PaymentReview) {
    const amount = Number(payment.approveAmount);
    if (!amount || amount <= 0) {
      this.successMessage = 'กรุณากรอกจำนวนเงินให้ถูกต้อง';
      this.showSuccessPopup = true;

      setTimeout(() => {
        this.showSuccessPopup = false;
      }, 2200);

      return;
    }

    this.approvingOrderId = payment.orderId;

    this.paymentsService.approvePayment(payment.orderId, amount).subscribe({
      next: () => {
        this.successMessage = `ยืนยันการโอนของ ${payment.orderNo} เรียบร้อยแล้ว`;
        this.showSuccessPopup = true;
        this.approvingOrderId = null;
        this.loadPaymentSlips();

        setTimeout(() => {
          this.showSuccessPopup = false;
        }, 2200);
      },
      error: (error) => {
        console.error('Approve payment failed', error);
        this.successMessage = 'ยืนยันการโอนไม่สำเร็จ กรุณาลองใหม่อีกครั้ง';
        this.showSuccessPopup = true;
        this.approvingOrderId = null;

        setTimeout(() => {
          this.showSuccessPopup = false;
        }, 2600);
      },
    });
  }

  formatPrice(price: number) {
    return `${price.toLocaleString('en-US')} ฿`;
  }

  formatDateTime(dateValue: string) {
    if (!dateValue) {
      return '-';
    }

    return new Intl.DateTimeFormat('th-TH', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateValue));
  }

  openSlipPreview(payment: PaymentReview) {
    if (!payment.slipImage) {
      return;
    }

    this.previewImageUrl = payment.slipImage;
    this.previewImageTitle = payment.orderNo;
  }

  closeSlipPreview() {
    this.previewImageUrl = '';
    this.previewImageTitle = '';
  }

  private mapPaymentSlip(item: PaymentSlipItem): PaymentReview {
    return {
      paymentId: item.payment_id,
      orderId: item.order_id,
      memberId: item.member_id,
      orderNo: formatOrderNo(item.order_id),
      customerName: item.username || `สมาชิก #${item.member_id}`,
      slipImage: this.paymentsService.getPaymentSlipImageUrl(item.slip),
      transferTime: this.formatDateTime(item.time),
      amount: Number(item.deposit) || 0,
      approveAmount: Number(item.deposit) || 0,
      status: this.getStatusLabel(item.status),
    };
  }

  private getStatusLabel(status: string | null) {
    switch (status) {
      case '2':
        return 'ยืนยันแล้ว';
      case '3':
        return 'ปฏิเสธแล้ว';
      case '1':
      default:
        return 'รอตรวจสอบ';
    }
  }
}
