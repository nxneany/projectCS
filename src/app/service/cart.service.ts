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
  product_id: number
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

export interface CartResponse {
  items: CartItem[];
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
    return this.http.post(`${this.apiBase}/cart/add`, payload);
  }

  //ลบสินค้าออกจากตะกร้า
  removeCartItem(cartItemId: number) {
    return this.http.delete(`${this.apiBase}/cart/item/${cartItemId}`);
  }
}
