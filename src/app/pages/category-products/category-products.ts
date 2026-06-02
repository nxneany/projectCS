import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../service/auth.service';
import { Category, CategoryService } from '../../service/category.service';
import { CategoryProduct, PaginatedResponse, Product, ProductService, ProductType } from '../../service/product.service';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';

@Component({
  selector: 'app-category-products',
  imports: [CommonModule, RouterLink, Header, Footer],
  templateUrl: './category-products.html',
  styleUrl: './category-products.scss'
})
export class CategoryProductsComponent implements OnInit {
  isLoggedIn$!: Observable<boolean>;
  categoryId = 0;
  selectedSize = 'ทั้งหมด';
  categories: Category[] = [];
  products: Product[] = [];
  loadingCategories = true;
  loadingProducts = true;
  limit = 8;
  currentPage = 1;
  totalPages = 1;
  hasNextPage = false;
  hasPrevPage = false;

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private productService: ProductService,
    private authService: AuthService,
  ) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  ngOnInit() {
    this.watchCategoryId();
    this.loadCategories();
  }

  private watchCategoryId() {
    this.route.queryParamMap.subscribe(params => {
      this.categoryId = Number(params.get('category_id')) || 0;
      this.selectedSize = 'ทั้งหมด';
      this.loadProducts();
    });
  }

  private loadCategories() {
    this.loadingCategories = true;

    this.categoryService.getAll().subscribe({
      next: (rows) => {
        this.categories = rows;
        this.loadingCategories = false;
      },
      error: () => {
        this.categories = [];
        this.loadingCategories = false;
      }
    });
  }

  private loadProducts(page: number = 1) {
    this.loadingProducts = true;
      this.currentPage = page;
    this.productService.getByCategory(this.categoryId, page, this.limit).subscribe({
      next: (res: PaginatedResponse<Product>) => {
          this.products = res.data;

        this.currentPage = res.page;

        this.totalPages = res.totalPages;

        this.hasNextPage = res.hasNextPage;

        this.hasPrevPage = res.hasPrevPage;

        this.loadingProducts = false;
      },
      error: () => {
        this.products = [];
        this.loadingProducts = false;
      }
    });
  }

  get categoryProducts() {
    if (!this.categoryId) return this.products;
    return this.products.filter(product => product.category_id === this.categoryId);
  }

  get categoryType(): ProductType {

  // หมวด 1-8 = clothing
  if (this.categoryId >= 1 && this.categoryId <= 8) {
    return 'clothing';
  }

  // หมวด 9-11 = accessory / shoe
  return 'accessory';
}

  get categoryTitle() {
    return this.findCategoryName(this.categoryId) ?? 'สินค้าทั้งหมด';
  }

 get sizeOptions() {
  // หมวดเสื้อผ้า
  if (this.categoryId >= 1 && this.categoryId <= 8) {

    return [
      'ทั้งหมด',
      'XS',
      'S',
      'M',
      'L',
      'XL',
      '2XL',
      '3XL',
      'FREE'
    ];
  }

  // หมวด 9-11
  return [
    'ทั้งหมด',
    '35',
    '36',
    '37',
    '38',
    '39',
    '40',
    '41',
    '42',
    '43',
    '44',
    '45'
  ];
}

  get filteredProducts() {
    if (this.selectedSize === 'ทั้งหมด') return this.categoryProducts;
    return this.categoryProducts.filter(product => product.variants.some(variant => variant.size === this.selectedSize));
  }

 detailLink(product: Product) {
  // หมวด 1-8
  if (product.category_id >= 1 &&
      product.category_id <= 8) {

    return ['/clothing-m', product.product_id];
  }
  // หมวด 9-11
  return ['/accessories-m', product.product_id];
}

  selectSize(size: string) {
    this.selectedSize = size;
  }

  formatPrice(price: number) {
    return `${price.toLocaleString('en-US')} บาท`;
  }

  private findCategoryName(categoryId: number) {
    return this.categories.find(category => category.category_id === categoryId)?.name;
  }

  getSizes(product: Product): string {

  return product.variants
    ?.map(v => v.size)
    ?.join(', ') || 'ไม่ระบุไซส์';
  }
  
  nextPage() {
    if (this.hasNextPage) {
      this.loadProducts(this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.hasPrevPage) {
      this.loadProducts(this.currentPage - 1);
    }
  }

  goToPage(page: number) {
    if (
      page >= 1 &&
      page <= this.totalPages &&
      page !== this.currentPage
    ) {
      this.loadProducts(page);
    }
  }

  get pages(): number[] {
    return Array.from(
      { length: this.totalPages },
      (_, i) => i + 1
    );
  }
}
