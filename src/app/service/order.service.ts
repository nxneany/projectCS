import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

export interface OrderItem {
  order_item_id: number;
  product_id: number;
  variant_id: number;
  name: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  price_sum: number;
  image_front: string;
  image_back: string | null;
  image_wear: string | null;
}

export interface OrderRes {
  order_id: number;
  member_id: number;
  staff_id: number | null;
  admin_id: number | null;

  day_rental: string;
  day_start: string;
  day_end: string;

  day_type: string;

  status: string | null;

  total_price: number;
  deposit: number;
  balances: number;
  late_fees: number;

  items: OrderItem[];
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiBase = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  //ดึงข้อมูลหน้าออณืเดอร์
  getOrder(id: number) {
    return this.http.get<OrderRes[]>(`${this.apiBase}/orders/member/${id}`);
  }
}
