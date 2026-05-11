import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

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

@Injectable({ providedIn: 'root' })
export class ProductService {
  private products: CategoryProduct[] = [
    { id: 1, categoryId: 1, type: 'clothing', image: 'assets/clothing/w3.jpg', name: 'ชุดเจ้าหญิงขาว', price: 1200, sizes: ['S', 'M', 'L', 'FREE'] },
    { id: 2, categoryId: 1, type: 'clothing', image: 'assets/clothing/w1.jpg', name: 'ชุดเจ้าหญิงขาว', price: 1500, sizes: ['XS', 'S', 'M', 'L'] },
    { id: 3, categoryId: 1, type: 'clothing', image: 'assets/clothing/w2.jpg', name: 'ชุดเจ้าหญิงครีม', price: 1300, sizes: ['M', 'L', 'XL', '2XL'] },
    { id: 4, categoryId: 1, type: 'clothing', image: 'assets/clothing/RT.jpg', name: 'ชุดเจ้าหญิงเบล', price: 1400, sizes: ['S', 'M', 'L', 'XL'] },
    { id: 5, categoryId: 2, type: 'clothing', image: 'assets/clothing/RP.jpg', name: 'ชุดแฟนซีฟ้าแดงทอง', price: 1550, sizes: ['M', 'L', 'XL'] },
    { id: 6, categoryId: 3, type: 'clothing', image: 'assets/clothing/TY.jpg', name: 'ชุดไทย', price: 1600, sizes: ['S', 'M', 'L', 'XL', 'FREE'] },
    { id: 7, categoryId: 4, type: 'clothing', image: 'assets/clothing/RP2.jpg', name: 'ชุดแฟนตาซีสำหรับขบวนพาเหรด', price: 1450, sizes: ['S', 'M', 'L', 'XL'] },
    { id: 8, categoryId: 5, type: 'clothing', image: 'assets/clothing/FT.jpg', name: 'ชุดเชียร์หลีดเดอร์', price: 1100, sizes: ['XS', 'S', 'M', 'L'] },
    { id: 9, categoryId: 6, type: 'clothing', image: 'assets/clothing/RP3.jpg', name: 'ชุดราชา-ราชินีประจำสี', price: 1600, sizes: ['S', 'M', 'L', 'XL', '2XL'] },
    { id: 10, categoryId: 7, type: 'clothing', image: 'assets/clothing/WP1.jpg', name: 'ชุดสำหรับถือป้าย', price: 1700, sizes: ['M', 'L', 'XL', 'FREE'] },
    { id: 11, categoryId: 8, type: 'clothing', image: 'assets/clothing/PP1.jpg', name: 'ชุดนางรำ', price: 1500, sizes: ['S', 'M', 'L', 'FREE'] },
    { id: 12, categoryId: 9, type: 'accessory', image: 'assets/accessories/m1.png', name: 'มงกุฎเพชรเจ้าหญิง', price: 1200, sizes: ['FREE'] },
    { id: 13, categoryId: 9, type: 'accessory', image: 'assets/accessories/a1.jpg', name: 'สร้อยเพชรหรู', price: 900, sizes: ['FREE'] },
    { id: 14, categoryId: 10, type: 'shoe', image: 'assets/accessories/m5.png', name: 'รองเท้าส้นสูงสีเงิน', price: 950, sizes: ['36', '37', '38', '39'] },
    { id: 15, categoryId: 10, type: 'shoe', image: 'assets/accessories/m6.jpg', name: 'รองเท้าแฟนซีประกายดาว', price: 1000, sizes: ['38', '39', '40', '41'] },
    { id: 16, categoryId: 11, type: 'accessory', image: 'assets/accessories/m4.jpg', name: 'คฑาแฟนซี', price: 750, sizes: ['FREE'] }
  ];

  getByCategory(categoryId: number): Observable<CategoryProduct[]> {
    if (!categoryId) return of(this.products);
    return of(this.products.filter(product => product.categoryId === categoryId));
  }
}
