import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ReportOrderItem,
  ReportResponse,
  ReportService,
  ReportSummary,
  ReportType,
} from '../../../service/report.service';

@Component({
  selector: 'app-reports',
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.html',
  styleUrl: './reports.scss',
})
export class ReportsComponent {
  reportType: ReportType = 'day';
  selectedDate = this.toDateInputValue(new Date());
  weekStart = this.toDateInputValue(new Date());
  selectedMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
  selectedYear = String(new Date().getFullYear());

  loading = false;
  errorMessage = '';

  summary: ReportSummary = {
    total_orders: 0,
    total_income: 0,
    total_deposit: 0,
    total_balances: 0,
  };

  items: ReportOrderItem[] = [];

  constructor(private reportService: ReportService) {
    this.fetchReport();
  }

  fetchReport() {
    this.loading = true;
    this.errorMessage = '';
    const { type, query } = this.buildRequestParams();

    this.reportService.getOrdersReport(type, query).subscribe({
      next: (response: ReportResponse) => {
        this.summary = response.summary;
        this.items = response.items;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'ไม่สามารถโหลดรายงานได้ กรุณาลองใหม่อีกครั้ง';
        this.loading = false;
      },
    });
  }

  onTypeChange() {
    this.fetchReport();
  }

  formatMoney(value: number | string) {
    const numeric = typeof value === 'number' ? value : Number(value);
    return `${numeric.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ฿`;
  }

  formatDate(value: string) {
    return new Date(value).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  private buildRequestParams(): { type: ReportType; query: Record<string, string> } {
    if (this.reportType === 'day') {
      return { type: 'day', query: { date: this.selectedDate } };
    }

    if (this.reportType === 'week') {
      const startDate = new Date(`${this.weekStart}T00:00:00`);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      return {
        type: 'week',
        query: {
          start: this.toDateInputValue(startDate),
          end: this.toDateInputValue(endDate),
        },
      };
    }

    if (this.reportType === 'month') {
      const [year, month] = this.selectedMonth.split('-');
      return {
        type: 'month',
        query: { year, month: String(Number(month)) },
      };
    }

    return { type: 'year', query: { year: this.selectedYear } };
  }

  private toDateInputValue(date: Date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
