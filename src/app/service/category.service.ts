import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export interface Category {
  category_id: number;
  name: string;
}


@Injectable({ providedIn: 'root' })
export class CategoryService {
  private apiBase = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}
  // ดึงข้อมูลหมวดหมู่ทั้งหมด
  getAll() {
    return this.http.get<Category[]>(`${this.apiBase}/categories`);
  }


}
