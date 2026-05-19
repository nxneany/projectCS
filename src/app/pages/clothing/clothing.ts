import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from "../footer/footer";
import { Header } from "../header/header";
import { PaginatedResponse, Product, ProductService } from '../../service/product.service';

@Component({
  selector: 'app-clothing',
  imports: [Header, Footer,CommonModule,RouterOutlet],
  templateUrl: './clothing.html',
  styleUrl: './clothing.scss'
})
export class Clothing {
  products: Product[] = [];
  loading = true;
   limit = 9;
  currentPage = 1;
  totalPages = 1;
  hasNextPage = false;
  hasPrevPage = false;  
  showLoginPopup = false;
  constructor(
      private productService: ProductService,
    ) {}
  
    ngOnInit(): void {
      this.loadProducts();
    }
  
  loadProducts(page: number = 1) {
      this.loading = true;
      this.currentPage = page;
  
      this.productService.getProducts(page, this.limit).subscribe({
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
  


openLoginPopup() {
  this.showLoginPopup = true;
}

closeLoginPopup() {
  this.showLoginPopup = false;
   window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}
  
  
}