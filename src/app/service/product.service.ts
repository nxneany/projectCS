import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

export type ProductType = 'clothing' | 'accessory' | 'shoe';

export interface CategoryProduct {
  id: number;
  categoryId: number;
  type: ProductType;
  image: string;
  name: string;
  price: number;
  sizes: string[];
}
// Variant ของสินค้า
export interface ProductVariant {
  variant_id: number | null;
  size: string | null;
  color: string | null;
  quantity: number | null;
  image_front: string | null;
  image_back: string | null;
  image_wear: string | null;
}

// Product หลัก
export interface Product {
  product_id: number;
  name: string;
  description: string;
  price: number;
  category_id: number;
  image_front: string | null;
  variants: ProductVariant[];
  rental_count?: number;
}

// Paginated Response
export interface PaginatedResponse<T> {

  data: T[];

  page: number;

  limit: number;

  total: number;

  totalPages: number;

  hasNextPage: boolean;

  hasPrevPage: boolean;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiBase = environment.apiBaseUrl;
  constructor(private http: HttpClient) {}

  // ดึงข้อมูลสินค้าตามหมวดหมู่ ด้วย pagination
  getByCategory(categoryId: number, page: number = 1, limit: number = 8) {
    return this.http.get<PaginatedResponse<Product>>(
      `${this.apiBase}/categories/${categoryId}/products?page=${page}&limit=${limit}`,
    );
  }

  //ดึงข้อมูลสินค้าทั้งหมด (รายการชุด) ด้วย pagination
  getProducts(page: number = 1, limit: number = 9) {
    return this.http.get<PaginatedResponse<Product>>(
      `${this.apiBase}/products?page=${page}&limit=${limit}`,
    );
  }

  //ดึงข้อมูลสินค้า (รายการเครื่องประดับ) ด้วย pagination
  getAccessories(page: number = 1, limit: number = 9) {
    return this.http.get<PaginatedResponse<Product>>(
      `${this.apiBase}/decorative-products?page=${page}&limit=${limit}`,
    );
  }

  // ดึงข้อมูลสินค้า ตาม id (หน้าสินค้าแต่ละอย่าง)
  getProductsId(id: number) {
    return this.http.get<Product>(`${this.apiBase}/products/${id}`);
  }

  // ค้นหาสินค้าจากชื่อสินค้า
  searchProducts(name: string, page: number = 1, limit: number = 9) {
    return this.http.get<PaginatedResponse<Product>>(
      `${this.apiBase}/products/search?name=${encodeURIComponent(name)}&page=${page}&limit=${limit}`,
    );
  }

  // ดึงข้อมูลสินค้าใกล้เคียง ตาม id สินค้าปัจจุบัน
  getRelatedProducts(id: number) {
    return this.http.get<Product[]>(`${this.apiBase}/products/${id}/related`);
  }

  // ดึงสินค้ายอดนิยม
  getPopularProducts(limit: number = 4) {
    return this.http.get<Product[]>(
      `${this.apiBase}/products/popular?limit=${limit}`,
    );
  }
}
