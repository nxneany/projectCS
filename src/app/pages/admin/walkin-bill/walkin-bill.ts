import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface BillItem {
  name: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  startDate: string;
  endDate: string;
}

interface OrderBill {
  orderId: string;
  customerName: string;
  phone: string;
  address: string;
  total: number;
  deposit: number;
  status: string;
  createdAt: string;
  items: BillItem[];
}

@Component({
  selector: 'app-walkin-bill',
  imports: [CommonModule, FormsModule],
  templateUrl: './walkin-bill.html',
  styleUrl: './walkin-bill.scss',
})
export class WalkinBillComponent {
  searchText = '';

  selectedOrder: OrderBill | null = null;

  orders: OrderBill[] = [
    {
      orderId: 'ORD-20260520-001',
      customerName: 'DFN Tv',
      phone: '097-193-9481',
      address: 'สมุทรปราการ',
      total: 2400,
      deposit: 1200,
      status: 'ชำระเงินสำเร็จ',
      createdAt: '20 พ.ค. 2026',
      items: [
        {
          name: 'ชุดไทยจักรี',
          size: 'S',
          color: 'ทอง',
          quantity: 2,
          price: 1200,
          startDate: '20 พ.ค. 2026',
          endDate: '24 พ.ค. 2026',
        },
      ],
    },

    {
      orderId: 'ORD-20260518-003',
      customerName: 'Ananya S.',
      phone: '099-911-1555',
      address: 'กรุงเทพมหานคร',
      total: 1350,
      deposit: 675,
      status: 'ชำระเงินสำเร็จ',
      createdAt: '18 พ.ค. 2026',
      items: [
        {
          name: 'มงกุฎคริสตัลราชินี',
          size: '36',
          color: 'เงิน',
          quantity: 1,
          price: 1350,
          startDate: '18 พ.ค. 2026',
          endDate: '22 พ.ค. 2026',
        },
      ],
    },
  ];

  get filteredOrders() {
    return this.orders.filter((order) =>
      order.orderId.toLowerCase().includes(this.searchText.toLowerCase()),
    );
  }

  openBill(order: OrderBill) {
    this.selectedOrder = order;
  }

  closeBill() {
    this.selectedOrder = null;
  }

  printBill() {
    window.print();
  }

  formatPrice(price: number) {
    return `${price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} ฿`;
  }
}
