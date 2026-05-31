import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../service/auth.service';
import { PaginatedResponse, Product, ProductService } from '../../service/product.service';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';

@Component({
  selector: 'app-search-results',
  imports: [CommonModule, RouterLink, Header, Footer],
  templateUrl: './search-results.html',
  styleUrl: './search-results.scss',
})
export class SearchResultsComponent implements OnInit {
  isLoggedIn$!: Observable<boolean>;
  keyword = '';
  products: Product[] = [];
  loading = true;
  limit = 9;
  currentPage = 1;
  totalPages = 1;
  hasNextPage = false;
  hasPrevPage = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private authService: AuthService,
  ) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      this.keyword = params.get('name')?.trim() || '';
      this.currentPage = Number(params.get('page')) || 1;
      this.limit = Number(params.get('limit')) || 9;

      if (!this.keyword) {
        this.products = [];
        this.loading = false;
        return;
      }

      this.loadProducts();
    });
  }

  detailLink(product: Product) {
    if (product.category_id >= 1 && product.category_id <= 8) {
      return ['/clothing-m', product.product_id];
    }

    return ['/accessories-m', product.product_id];
  }

  getSizes(product: Product) {
    return product.variants?.map((variant) => variant.size).join(', ') || 'ไม่ระบุไซส์';
  }

  formatPrice(price: number) {
    return `${price.toLocaleString('en-US')} บาท`;
  }

  nextPage() {
    if (this.hasNextPage) this.goToPage(this.currentPage + 1);
  }

  prevPage() {
    if (this.hasPrevPage) this.goToPage(this.currentPage - 1);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages || page === this.currentPage) return;

    this.router.navigate(['/search'], {
      queryParams: {
        name: this.keyword,
        page,
        limit: this.limit,
      },
    });
  }

  get pages() {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  private loadProducts() {
    this.loading = true;

    this.productService.searchProducts(this.keyword, this.currentPage, this.limit).subscribe({
      next: (res: PaginatedResponse<Product>) => {
        this.products = res.data;
        this.currentPage = res.page;
        this.limit = res.limit;
        this.totalPages = res.totalPages;
        this.hasNextPage = res.hasNextPage;
        this.hasPrevPage = res.hasPrevPage;
        this.loading = false;
      },
      error: () => {
        this.products = [];
        this.loading = false;
      },
    });
  }
}
