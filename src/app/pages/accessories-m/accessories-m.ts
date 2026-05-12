import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Footer } from "../footer/footer";
import { Header } from "../header/header";
import { PaginatedResponse, Product, ProductService } from '../../service/product.service';

@Component({
  selector: 'app-accessories',
  imports: [RouterLink, Header, Footer,CommonModule,RouterOutlet],
  templateUrl: './accessories-m.html',
  styleUrl: './accessories-m.scss'
})
export class AccessoriesM implements OnInit {
  
  products: Product[] = [];
  loading = true;
  limit = 9;
  currentPage = 1;
  totalPages = 1;
  hasNextPage = false;
  hasPrevPage = false;

  constructor(
    private productService: ProductService,
  ) { }
  
  ngOnInit(): void {
    this.loadProducts();
  }
  
  loadProducts(page: number = 1) {
    this.loading = true;
    this.currentPage = page;

    this.productService.getAccessories(page, this.limit).subscribe({
      next: (res: PaginatedResponse<Product>) => {
        console.log('products => ', res);
       this.products = res.data;

        this.currentPage = res.page;

        this.totalPages = res.totalPages;

        this.hasNextPage = res.hasNextPage;

        this.hasPrevPage = res.hasPrevPage;

        this.loading = false;
      },
      error: (err) => {
        console.log(err);
        this.products = [];
        this.loading = false;
      }
    });
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
