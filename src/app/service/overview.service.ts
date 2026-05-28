import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface OverviewSummary {
  total_orders: number;
  pending_slip_orders: number;
  monthly_income: number;
  rented_product_count: number;
}

export interface OverviewLatestOrderItem {
  order_item_id: number;
  name: string;
  quantity: number;
}

export interface OverviewLatestOrder {
  order_id: number;
  order_code: string;
  member_id: number;
  username: string;
  status: string | null;
  status_label: string | null;
  total_price: number;
  deposit: number;
  balances: number;
  day_rental: string;
  items: OverviewLatestOrderItem[];
}

export interface OverviewResponse {
  summary: OverviewSummary;
  latest_orders: OverviewLatestOrder[];
}

@Injectable({ providedIn: 'root' })
export class OverviewService {
  private apiBase = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getOverview(limit: number = 5) {
    const params = new HttpParams().set('limit', String(limit));
    return this.http.get<OverviewResponse>(`${this.apiBase}/overview`, { params });
  }
}
