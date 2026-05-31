import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

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

export interface CompletedOrderItem {
  order_id: number;
  total_price: string;
  day_rental: string;
  status: string;
  member_id: number;
  username: string;
}

export interface CompletedOrdersResponse {
  items: CompletedOrderItem[];
}

export interface LatePaymentItem {
  order_id: number;
  order_code: string;
  member: {
    member_id: number;
    username: string;
    phone: string | null;
    email: string | null;
  };
  day_end: string;
  status: number;
  overdue_days: number;
  products_total: number;
  total_price: number;
  deposit: number;
  balances: number;
  late_fees: number;
  outstanding_amount: number;
  display_item: string | null;
  total_quantity: number;
}

export interface LatePaymentsResponse {
  items: LatePaymentItem[];
}

export interface AdminOrderItem {
  order_item_id: number;
  product_id?: number;
  product_code?: string;
  variant_id: number;
  name: string;
  description?: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  price_sum: number;
  image_front?: string | null;
  image_back?: string | null;
  image_wear?: string | null;
}

export interface AdminOrder {
  order_id: number;
  order_code: string;
  member_id: number;
  member_name: string;
  phone: string | null;
  email: string | null;
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
  items: AdminOrderItem[];
  display_item: string | null;
  total_items: number;
  total_quantity: number;
}

export interface AdminOrdersResponse {
  items: AdminOrder[];
}

export interface AdminOrderDetailResponse {
  order_id: number;
  order_code: string;
  status: string | null;
  member: {
    member_id: number;
    member_code: string;
    username: string;
    phone: string | null;
    email: string | null;
    address: string | null;
  };
  staff_id: number | null;
  admin_id: number | null;
  day_rental: string;
  day_start: string;
  day_end: string;
  day_type: string;
  total_price: number;
  deposit: number;
  balances: number;
  late_fees: number;
  verification: {
    url_idcard: string | null;
  } | null;
  items: AdminOrderItem[];
}

export interface PendingCustomerVerificationItem {
  order_id: number;
  day_rental: string;
  total_price: string;
  status: string | null;
  member_id: number;
  username: string;
  phone: string | null;
  email: string | null;
}

export interface PendingCustomerVerificationsResponse {
  items: PendingCustomerVerificationItem[];
}

export interface CreateCustomerVerificationPayload {
  order_id: number;
  role: 'admin' | 'staff';
  user_id: number;
  image_idcard: File;
}

export interface OrderReceiptResponse {
  order: {
    order_id: number;
    day_rental: string;
    day_start: string;
    day_end: string;
    total_price: number;
    deposit: number;
    balances: number;
  };
  member: {
    member_id: number;
    username: string;
    phone: string | null;
    address: string | null;
  };
  items: Array<{
    order_item_id: number;
    name: string;
    size: string;
    color: string;
    quantity: number;
    price: number;
    price_sum: number;
  }>;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiBase = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  //ดึงข้อมูลหน้าออณืเดอร์
  getOrder(id: number) {
    return this.http.get<OrderRes[]>(`${this.apiBase}/orders/member/${id}`);
  }

  getCompletedOrders(search: string = '') {
    let params = new HttpParams();
    if (search.trim()) {
      params = params.set('search', search.trim());
    }
    return this.http.get<CompletedOrdersResponse>(
      `${this.apiBase}/admin/orders/completed`,
      { params },
    );
  }

  getLatePayments(memberId?: number) {
    let params = new HttpParams();
    if (memberId) {
      params = params.set('member_id', String(memberId));
    }

    return this.http.get<LatePaymentsResponse>(
      `${this.apiBase}/admin/orders/late-payments`,
      { params },
    );
  }

  getAdminOrders(search: string = '') {
    let params = new HttpParams();
    if (search.trim()) {
      params = params.set('search', search.trim());
    }
    return this.http.get<AdminOrdersResponse>(`${this.apiBase}/admin/orders`, {
      params,
    });
  }

  getAdminOrderDetail(id: number) {
    return this.http.get<AdminOrderDetailResponse>(
      `${this.apiBase}/admin/orders/${id}`,
    );
  }

  updateAdminOrderStatus(id: number, status: '4' | '5') {
    return this.http.put<{ message?: string }>(
      `${this.apiBase}/admin/orders/${id}/status`,
      { status },
    );
  }

  calculateAdminOrderLateFees(id: number) {
    return this.http.put<{ message?: string; late_fees?: number }>(
      `${this.apiBase}/admin/orders/${id}/late-fees/calculate`,
      {},
    );
  }

  getPendingCustomerVerifications(search: string = '') {
    let params = new HttpParams();
    if (search.trim()) {
      params = params.set('search', search.trim());
    }
    return this.http.get<PendingCustomerVerificationsResponse>(
      `${this.apiBase}/customer-verifications/pending`,
      { params },
    );
  }

  createCustomerVerification(payload: CreateCustomerVerificationPayload) {
    const formData = new FormData();
    formData.append('order_id', String(payload.order_id));
    formData.append('role', payload.role);
    formData.append('user_id', String(payload.user_id));
    formData.append('image_idcard', payload.image_idcard);

    return this.http.post<{ message?: string }>(
      `${this.apiBase}/customer-verifications`,
      formData,
    );
  }

  getOrderReceipt(id: number) {
    return this.http.get<OrderReceiptResponse>(
      `${this.apiBase}/admin/orders/receipt/${id}`,
    );
  }
}
