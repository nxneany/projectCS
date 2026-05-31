import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  CompletedOrderItem,
  OrderReceiptResponse,
  OrderService,
} from '../../../service/order.service';

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
  id: number;
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
export class WalkinBillComponent implements OnInit {
  loading = false;
  billLoading = false;
  errorMessage = '';
  searchText = '';
  private searchTimer?: ReturnType<typeof setTimeout>;

  selectedOrder: OrderBill | null = null;

  orders: OrderBill[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadCompletedOrders();
  }

  get filteredOrders() {
    return this.orders;
  }

  onSearchInput() {
    if (this.searchTimer) clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => this.loadCompletedOrders(), 350);
  }

  loadCompletedOrders() {
    this.loading = true;
    this.errorMessage = '';

    this.orderService.getCompletedOrders(this.searchText).subscribe({
      next: (res) => {
        this.orders = (res.items || []).map((item) => this.mapOrder(item));
        this.loading = false;
      },
      error: () => {
        this.orders = [];
        this.loading = false;
        this.errorMessage = 'โหลดรายการออเดอร์ไม่สำเร็จ';
      },
    });
  }

  openBill(order: OrderBill) {
    this.selectedOrder = order;
    this.billLoading = true;

    this.orderService.getOrderReceipt(order.id).subscribe({
      next: (res) => {
        this.selectedOrder = this.mapReceipt(res);
        this.billLoading = false;
      },
      error: () => {
        this.billLoading = false;
      },
    });
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

  private mapOrder(item: CompletedOrderItem): OrderBill {
    const total = Number(item.total_price || 0);
    return {
      id: item.order_id,
      orderId: `ORD-${String(item.order_id).padStart(3, '0')}`,
      customerName: item.username || `สมาชิก #${item.member_id}`,
      phone: '-',
      address: '-',
      total,
      deposit: total,
      status: item.status === '3' ? 'ชำระเงินสำเร็จ' : item.status,
      createdAt: this.formatDate(item.day_rental),
      items: [],
    };
  }

  private mapReceipt(res: OrderReceiptResponse): OrderBill {
    return {
      id: res.order.order_id,
      orderId: `ORD-${String(res.order.order_id).padStart(3, '0')}`,
      customerName: res.member.username || `สมาชิก #${res.member.member_id}`,
      phone: res.member.phone || '-',
      address: res.member.address || '-',
      total: Number(res.order.total_price || 0),
      deposit: Number(res.order.deposit || 0),
      status: 'ชำระเงินสำเร็จ',
      createdAt: this.formatDate(res.order.day_rental),
      items: (res.items || []).map((item) => ({
        name: item.name,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: Number(item.price_sum || item.price || 0),
        startDate: this.formatDate(res.order.day_start),
        endDate: this.formatDate(res.order.day_end),
      })),
    };
  }

  private formatDate(value: string) {
    return new Date(value).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}
