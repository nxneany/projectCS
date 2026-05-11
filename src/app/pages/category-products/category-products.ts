import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Category, CategoryService } from '../../service/category.service';
import { CategoryProduct, ProductService, ProductType } from '../../service/product.service';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';

@Component({
  selector: 'app-category-products',
  imports: [CommonModule, RouterLink, Header, Footer],
  templateUrl: './category-products.html',
  styleUrl: './category-products.scss'
})
export class CategoryProductsComponent implements OnInit {
  categoryId = 0;
  selectedSize = 'ทั้งหมด';
  categories: Category[] = [];
  products: CategoryProduct[] = [];
  loadingCategories = true;
  loadingProducts = true;

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private productService: ProductService
  ) {}

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

  private loadProducts() {
    this.loadingProducts = true;

    this.productService.getByCategory(this.categoryId).subscribe({
      next: (products) => {
        this.products = products;
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
    return this.products.filter(product => product.categoryId === this.categoryId);
  }

  get categoryType(): ProductType {
    return this.categoryProducts[0]?.type ?? this.inferTypeFromCategoryId();
  }

  get categoryTitle() {
    return this.findCategoryName(this.categoryId) ?? 'สินค้าทั้งหมด';
  }

  get sizeOptions() {
    if (this.categoryType === 'clothing') {
      return ['ทั้งหมด', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', 'FREE'];
    }

    if (this.categoryType === 'shoe') {
      return ['ทั้งหมด', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];
    }

    return ['ทั้งหมด', 'FREE'];
  }

  get filteredProducts() {
    if (this.selectedSize === 'ทั้งหมด') return this.categoryProducts;
    return this.categoryProducts.filter(product => product.sizes.includes(this.selectedSize));
  }

  detailLink(product: CategoryProduct) {
    if (product.type === 'clothing') return ['/clothing-m', product.id];
    return ['/accessories-m', product.id];
  }

  selectSize(size: string) {
    this.selectedSize = size;
  }

  formatPrice(price: number) {
    return `${price.toLocaleString('en-US')} บาท`;
  }

  private inferTypeFromCategoryId(): ProductType {
    if (this.categoryId >= 1 && this.categoryId <= 8) return 'clothing';
    if (this.categoryId === 10) return 'shoe';
    return 'accessory';
  }

  private findCategoryName(categoryId: number) {
    return this.categories.find(category => category.category_id === categoryId)?.name;
  }
}
