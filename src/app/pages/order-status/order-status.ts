import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';
import { CartService } from '../../service/cart.service';
import { OrderRes, OrderService } from '../../service/order.service';
import { RouterLink } from '@angular/router';


interface PaymentSlipStatus {
  slipFileName: string;
  transferTime: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface RentalOrder {
  orderNo: string;
  productNames: string[];
  depositAmount: number;
  rentalStart: string;
  rentalEnd: string;
  paymentSlip: PaymentSlipStatus;
}

@Component({
  selector: 'app-order-status',
  imports: [CommonModule, Header, Footer, RouterLink],
  templateUrl: './order-status.html',
  styleUrl: './order-status.scss',
})
export class OrderStatusComponent implements OnInit {
  // paymentSlip: PaymentSlipStatus = this.loadPaymentSlip();
  // expandedOrderNo = 'DMU-20260511-0001';

  orders: OrderRes[] = [];

  expandedOrderId = 0;

  loadingOrders = true;

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loadingOrders = true;

    const memberId = Number(localStorage.getItem('member_id'));

    if (!memberId) {
      this.orders = [];

      this.loadingOrders = false;

      return;
    }

    this.orderService.getOrder(memberId).subscribe({
      next: (res) => {
        console.log(res);

        this.orders = res;

        if (res.length > 0) {
          this.expandedOrderId = res[0].order_id;
        }

        this.loadingOrders = false;
      },

      error: (err) => {
        console.log(err);

        this.orders = [];

        this.loadingOrders = false;
      },
    });
  }

  toggleOrder(orderId: number) {
    this.expandedOrderId = this.expandedOrderId === orderId ? 0 : orderId;
  }

  isExpanded(orderId: number) {
    return this.expandedOrderId === orderId;
  }

  isPaidStatus(status: string | null) {
    return status === '2' || status === '3' || status === '4' || status === '5';
  }

  statusLabel(status: string | null) {
    if (this.isPaidStatus(status)) {
      return 'ชำระเงินสำเร็จ';
    }

    if (status === '1') {
      return 'รอตรวจสอบสลิป';
    }

    return 'ยังไม่ชำระเงิน';
  }

  statusDetail(status: string | null) {
    if (this.isPaidStatus(status)) {
      return 'ชำระเงินสำเร็จแล้ว';
    }

    if (status === '1') {
      return 'ส่งสลิปเรียบร้อยแล้ว กรุณารอพนักงานตรวจสอบ';
    }

    return 'กรุณาชำระเงินเพื่อยืนยันรายการเช่า';
  }

  statusIcon(status: string | null) {
    if (this.isPaidStatus(status)) {
      return 'verified';
    }

    if (status === '1') {
      return 'schedule';
    }

    return 'payments';
  }

  formatPrice(price: number) {
    return `${price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} ฿`;
  }
}
