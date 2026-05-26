import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

const orders = [
  {
    orderNo: 'ORD-20260520-001',
    customerId: 'M-013',
    customerName: 'DFN Tv',
    date: '2026-05-20',
    products: 'ชุดไทยจักรี x2',
    total: 2400,
    deposit: 1200,
    duration: '4 วัน',
    status: 'รอตรวจสลิป',
    identityPhoto: 'assets/profile.png',

    items: [
      {
        productId: 'P-002',
        name: 'ชุดไทยจักรี',
        detail: 'ชุดไทยจักรีผ้าไหมทอง สีทอง ไซส์ S',
        quantity: 2,
        price: 1200,
        total: 2400,
      },
    ],
  },

  {
    orderNo: 'ORD-20260518-003',
    customerId: 'M-014',
    customerName: 'Ananya S.',
    date: '2026-05-18',
    products: 'มงกุฎคริสตัลราชินี x1',
    total: 1350,
    deposit: 675,
    duration: '4 วัน',
    status: 'ยืนยันแล้ว',
    identityPhoto: 'assets/profile.png',

    items: [
      {
        productId: 'P-005',
        name: 'มงกุฎคริสตัลราชินี',
        detail: 'เครื่องประดับ สีเงิน ไซส์ 36',
        quantity: 1,
        price: 1350,
        total: 1350,
      },
    ],
  },
];

@Component({
  selector: 'app-orders',
  imports: [CommonModule],
  templateUrl: './orders.html',
  styleUrl: './orders.scss',
})
export class OrdersComponent {
  orders = orders;

  selectedOrder: (typeof orders)[number] | null = null;

  openOrderDetail(order: (typeof orders)[number]) {
    this.selectedOrder = order;
  }

  closeOrderDetail() {
    this.selectedOrder = null;
  }

  formatPrice(price: number) {
    return `${price.toLocaleString('en-US')} ฿`;
  }
}
