import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

export interface CartItem {
  cart_item_id: number;
  cart_id: number;
  quantity: number;
  price: string;
  day_type: string;
  day_start: string;
  day_end: string;
  variant_id: number;
  size: string;
  color: string;
  image_front: string;
  image_back: string;
  image_wear: string;
  product_id: number;
  name: string;
  description: string;
  selected?: boolean;
}

export interface AddToCartPayload {
  user_id: number;
  variant_id: number;
  quantity: number;
  price: number;
  day_type: string;
  day_start: string;
  day_end: string;
}

export interface AddToCartResponse {
  cart_id?: number;
  cart_item_id?: number;
  cart_item_ids?: number[];
  item?: CartItem;
  items?: CartItem[];
  data?: {
    cart_id?: number;
    cart_item_id?: number;
    cart_item_ids?: number[];
    item?: CartItem;
    items?: CartItem[];
  };
  message?: string;
}

export interface CartResponse {
  items: CartItem[];
}

////response billing
export interface BillingUser {
  member_id: number;

  username: string;

  phone: string | null;

  email: string;

  address: string | null;
}

export interface BillingItem {
  cart_item_id: number;

  product_id: number;

  name: string;

  variant_id: number;

  size: string;

  color: string;

  quantity: number;

  price: number;

  day_type: string;

  day_start: string;

  day_end: string;

  image_front: string;
}

export interface BillingSummary {
  subtotal: number;

  deposit: number;

  grand_total: number;

  total_items: number;
}

export interface BillingResponse {
  user: BillingUser;

  items: BillingItem[];

  summary: BillingSummary;
}

export interface CreateOrderResponse {
  message: string;

  order_id: number;
}

export interface CreatePaymentResponse {
  message: string;
}
@Injectable({ providedIn: 'root' })
export class CartService {
  private apiBase = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  //ดึงข้อมูล ในตะกร้าของแต่ละผู้ใช้
  getCart(id: number) {
    return this.http.get<CartResponse>(
      `${this.apiBase}/cart/member/${id}/items`,
    );
  }

  //เพิ่มสินค้าเข้าตะกร้า
  addToCart(payload: AddToCartPayload) {
    return this.http.post<AddToCartResponse>(`${this.apiBase}/cart/add`, payload);
  }

  //ลบสินค้าออกจากตะกร้า
  removeCartItem(cartItemId: number) {
    return this.http.delete(`${this.apiBase}/cart/item/${cartItemId}`);
  }

  //ดึงข้อมูลบิลออเดอร์
  getBilling(cartId: number) {
    return this.http.get<BillingResponse>(
      `${this.apiBase}/cart/billing/${cartId}`,
    );
  }

  //addordrt เพิ่มออร์เดอร์
  addOrder(cart_id: number, cart_item_ids: number[]) {
    const payload = {
      cart_id,
      cart_item_ids,
    };

    return this.http.post<CreateOrderResponse>(
      `${this.apiBase}/orders/create`,
      payload,
    );
  }

  createPayment(order_id: number, time: string, image: File) {
    const formData = new FormData();

    formData.append('order_id', String(order_id));

    formData.append('time', time);

    formData.append('image', image);

    return this.http.post<CreatePaymentResponse>(
      `${this.apiBase}/payments/create`,
      formData,
    );
  }
}
