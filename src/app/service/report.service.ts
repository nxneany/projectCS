import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

export type ReportType = 'day' | 'week' | 'month' | 'year';

export interface ReportSummary {
  total_orders: number;
  total_income: number;
  total_deposit: number;
  total_balances: number;
}

export interface ReportOrderItem {
  order_id: number;
  member_id: number;
  total_price: string;
  deposit: string;
  balances: string;
  day_type: string;
  day_start: string;
  day_end: string;
  day_rental: string;
}

export interface ReportResponse {
  summary: ReportSummary;
  items: ReportOrderItem[];
}

@Injectable({ providedIn: 'root' })
export class ReportService {
  private apiBase = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getOrdersReport(type: ReportType, query: Record<string, string>) {
    let params = new HttpParams().set('type', type);

    Object.entries(query).forEach(([key, value]) => {
      if (value) {
        params = params.set(key, value);
      }
    });

    return this.http.get<ReportResponse>(`${this.apiBase}/reports/orders`, {
      params,
    });
  }
}
