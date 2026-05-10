import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface Category {
  category_id: number;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private apiBase = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Category[]>(`${this.apiBase}/categories`);
  }
}
