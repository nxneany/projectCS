import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from "../footer/footer";
import { Header } from "../header/header";
import { PaginatedResponse, Product, ProductService } from '../../service/product.service';

@Component({
  selector: 'app-accessories',
  imports: [ Header, Footer,CommonModule,RouterOutlet],
  templateUrl: './accessories.html',
  styleUrl: './accessories.scss'
})
export class Accessories implements OnInit {

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