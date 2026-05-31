import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { switchMap } from 'rxjs';
import {
  AdminOrder,
  AdminOrderDetailResponse,
  AdminOrderItem,
  OrderService,
} from '../../../service/order.service';
import { formatOrderNo } from '../../../utils/order-format';

interface OrderViewItem {
  productId: string;
  image: string;
  name: string;
  description: string;
  detail: string;
  quantity: number;
  price: number;
  total: number;
}

interface OrderView {
  id: number;
  orderNo: string;
  rawStatus: string | null;
  customerId: string;
  customerName: string;
  phone: string;
  email: string;
  date: string;
  startDate: string;
  endDate: string;
  products: string;
  total: number;
  deposit: number;
  balance: number;
  lateFees: number;
  identityPhoto: string;
  duration: string;
  status: string;
  totalItems: number;
  totalQuantity: number;
  items: OrderViewItem[];
}

@Component({
  selector: 'app-orders',
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.html',
  styleUrl: './orders.scss',
})
export class OrdersComponent implements OnInit {
  orders: OrderView[] = [];

  selectedOrder: OrderView | null = null;

  searchText = '';

  loading = false;

  detailLoading = false;

  errorMessage = '';

  detailErrorMessage = '';

  statusUpdatingOrderId: number | null = null;

  statusErrorMessage = '';

  private searchTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    this.errorMessage = '';

    this.orderService.getAdminOrders(this.searchText).subscribe({
      next: (response) => {
        this.orders = (response.items ?? []).map((order) => this.mapOrder(order));
        this.loading = false;
      },
      error: (error) => {
        console.error('Load admin orders failed', error);
        this.orders = [];
        this.errorMessage = 'โหลดข้อมูลออเดอร์ไม่สำเร็จ';
        this.loading = false;
      },
    });
  }

  onSearchInput() {
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }

    this.searchTimer = setTimeout(() => {
      this.loadOrders();
    }, 350);
  }

  openOrderDetail(order: OrderView) {
    this.selectedOrder = order;
    this.detailLoading = true;
    this.detailErrorMessage = '';

    this.orderService.getAdminOrderDetail(order.id).subscribe({
      next: (response) => {
        this.selectedOrder = this.mapOrderDetail(response);
        this.detailLoading = false;
      },
      error: (error) => {
        console.error('Load admin order detail failed', error);
        this.detailErrorMessage = 'โหลดรายละเอียดออเดอร์ไม่สำเร็จ';
        this.detailLoading = false;
      },
    });
  }

  closeOrderDetail() {
    this.selectedOrder = null;
    this.detailLoading = false;
    this.detailErrorMessage = '';
  }

  formatPrice(price: number) {
    return `${price.toLocaleString('en-US')} ฿`;
  }

  canUpdateStatus(order: OrderView) {
    return order.rawStatus === '2' || order.rawStatus === '3';
  }

  getStatusActionLabel(order: OrderView) {
    if (order.rawStatus === '2') {
      return 'ยกเลิกการจอง';
    }

    if (order.rawStatus === '3') {
      return 'คืนของ';
    }

    return '';
  }

  updateOrderStatus(order: OrderView) {
    const nextStatus = this.getNextStatus(order);
    if (!nextStatus || this.statusUpdatingOrderId) {
      return;
    }

    this.statusUpdatingOrderId = order.id;
    this.statusErrorMessage = '';

    const request$ =
      order.rawStatus === '3'
        ? this.orderService
            .calculateAdminOrderLateFees(order.id)
            .pipe(
              switchMap(() =>
                this.orderService.updateAdminOrderStatus(order.id, nextStatus),
              ),
            )
        : this.orderService.updateAdminOrderStatus(order.id, nextStatus);

    request$.subscribe({
      next: () => {
        this.statusUpdatingOrderId = null;
        this.loadOrders();

        if (this.selectedOrder?.id === order.id) {
          this.openOrderDetail(order);
        }
      },
      error: (error) => {
        console.error('Update order status failed', error);
        this.statusErrorMessage = 'อัปเดตสถานะออเดอร์ไม่สำเร็จ';
        this.statusUpdatingOrderId = null;
      },
    });
  }

  private mapOrder(order: AdminOrder): OrderView {
    return {
      id: order.order_id,
      orderNo: formatOrderNo(order.order_id),
      rawStatus: order.status,
      customerId: `M-${String(order.member_id).padStart(3, '0')}`,
      customerName: order.member_name || '-',
      phone: order.phone || '-',
      email: order.email || '-',
      date: this.formatDate(order.day_rental),
      startDate: this.formatDate(order.day_start),
      endDate: this.formatDate(order.day_end),
      products: order.display_item || this.getDisplayItem(order.items),
      total: Number(order.total_price || 0),
      deposit: Number(order.deposit || 0),
      balance: Number(order.balances || 0),
      lateFees: Number(order.late_fees || 0),
      identityPhoto: '',
      duration: order.day_type || '-',
      status: this.getStatusLabel(order.status),
      totalItems: Number(order.total_items || 0),
      totalQuantity: Number(order.total_quantity || 0),
      items: (order.items || []).map((item) => this.mapOrderItem(item)),
    };
  }

  private mapOrderDetail(order: AdminOrderDetailResponse): OrderView {
    const items = order.items || [];

    return {
      id: order.order_id,
      orderNo: formatOrderNo(order.order_id),
      rawStatus: order.status,
      customerId:
        order.member?.member_code ||
        `M-${String(order.member?.member_id || 0).padStart(3, '0')}`,
      customerName: order.member?.username || '-',
      phone: order.member?.phone || '-',
      email: order.member?.email || '-',
      date: this.formatDate(order.day_rental),
      startDate: this.formatDate(order.day_start),
      endDate: this.formatDate(order.day_end),
      products: this.getDisplayItem(items),
      total: Number(order.total_price || 0),
      deposit: Number(order.deposit || 0),
      balance: Number(order.balances || 0),
      lateFees: Number(order.late_fees || 0),
      identityPhoto: order.verification?.url_idcard || '',
      duration: order.day_type || '-',
      status: this.getStatusLabel(order.status),
      totalItems: items.length,
      totalQuantity: items.reduce(
        (sum, item) => sum + Number(item.quantity || 0),
        0,
      ),
      items: items.map((item) => this.mapOrderItem(item)),
    };
  }

  private mapOrderItem(item: AdminOrderItem): OrderViewItem {
    return {
      productId: item.product_code || `#${item.order_item_id}`,
      image: item.image_front || '',
      name: item.name || '-',
      description: item.description || '-',
      detail: `ตัวเลือก #${item.variant_id} | ${item.size || '-'} | ${item.color || '-'}`,
      quantity: Number(item.quantity || 0),
      price: Number(item.price || 0),
      total: Number(item.price_sum || 0),
    };
  }

  private getDisplayItem(items: AdminOrderItem[]) {
    if (!items?.length) {
      return 'ไม่มีรายการสินค้า';
    }

    const firstItem = items[0];
    const totalQuantity = items.reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0,
    );

    return `${firstItem.name} x${totalQuantity}`;
  }

  private formatDate(value: string) {
    if (!value) {
      return '-';
    }

    return new Intl.DateTimeFormat('th-TH', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(value));
  }

  private getStatusLabel(status: string | null) {
    switch (status) {
      case '1':
        return 'จอง';
      case '2':
        return 'ชำระค่ามัดจำแล้ว';
      case '3':
        return 'ชำระเงินแล้ว';
      case '4':
        return 'คืนสินค้าแล้ว';
      case '5':
        return 'ยกเลิกการเช่า';
      default:
        return 'รอดำเนินการ';
    }
  }

  private getNextStatus(order: OrderView): '4' | '5' | null {
    if (order.rawStatus === '2') {
      return '5';
    }

    if (order.rawStatus === '3') {
      return '4';
    }

    return null;
  }
}
