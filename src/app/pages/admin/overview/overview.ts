import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OverviewLatestOrder, OverviewService, OverviewSummary } from '../../../service/overview.service';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './overview.html',
  styleUrl: './overview.scss',
})
export class OverviewComponent {
  loading = false;
  errorMessage = '';

  summary: OverviewSummary = {
    total_orders: 0,
    pending_slip_orders: 0,
    monthly_income: 0,
    rented_product_count: 0,
  };

  orders: OverviewLatestOrder[] = [];

  constructor(private overviewService: OverviewService) {
    this.fetchOverview();
  }

  get stats() {
    return [
      { label: 'ออเดอร์ทั้งหมด', value: this.summary.total_orders, icon: 'inventory_2' },
      { label: 'รอตรวจสลิป', value: this.summary.pending_slip_orders, icon: 'schedule' },
      { label: 'รายได้เดือนนี้', value: this.formatMoney(this.summary.monthly_income), icon: 'payments' },
      { label: 'สินค้าถูกเช่า', value: this.summary.rented_product_count, icon: 'local_mall' },
    ];
  }

  fetchOverview() {
    this.loading = true;
    this.errorMessage = '';
    this.overviewService.getOverview(5).subscribe({
      next: (res) => {
        this.summary = res.summary;
        this.orders = res.latest_orders;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'ไม่สามารถโหลดข้อมูลภาพรวมได้';
      },
    });
  }

  getOrderProducts(order: OverviewLatestOrder) {
    if (!order.items?.length) {
      return '-';
    }
    return order.items.map((item) => `${item.name} x${item.quantity}`).join(', ');
  }

  getOrderStatus(order: OverviewLatestOrder) {
    switch (order.status) {
      case '1':
        return 'จอง';
      case '2':
        return 'ชำระค่ามัดจำแล้ว';
      case '3':
        return 'ชำระเงินแล้ว';
      case '4':
        return 'คืนของแล้ว';
      case '5':
        return 'ยกเลิกการเช่า';
      default:
        return 'ยังไม่ระบุสถานะ';
    }
  }

  formatMoney(value: number) {
    return `${value.toLocaleString('th-TH')} ฿`;
  }
}
