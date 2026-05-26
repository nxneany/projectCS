import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { Product, ProductService } from '../../service/product.service';
import { Footer } from "../footer/footer";
import { Header } from "../header/header";

@Component({
  selector: 'app-main',
  imports: [Header, RouterOutlet, RouterLink, CommonModule, Footer],
  templateUrl: './main.html',
  styleUrl: './main.scss'
})
export class Main implements OnInit {
  dresses = [
    'assets/clothing/RT.jpg',
    'assets/clothing/FT.jpg',
    'assets/clothing/TY.jpg',
    'assets/clothing/RP.jpg',
    'assets/clothing/RP2.jpg',
    'assets/clothing/RP3.jpg',
    'assets/clothing/WP1.jpg',
    'assets/clothing/WP2.jpg',
    'assets/clothing/PP1.jpg',
    'assets/clothing/OP1.jpg',
  ];

  currentIndex = 0;
  popularProducts: Product[] = [];
  popularLimit = 4;
  loadingPopular = true;

  constructor(
    private route: ActivatedRoute,
    private scroller: ViewportScroller,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadPopularProducts(this.popularLimit);

    // ตรวจสอบ fragment (เช่น #about)
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        // รอให้ footer render เสร็จก่อนค่อย scroll
        setTimeout(() => this.scroller.scrollToAnchor(fragment), 200);
      }
    });
  }

  get visibleDresses() {
    return this.dresses.slice(this.currentIndex, this.currentIndex + 3);
  }

  nextSlide() {
    if (this.currentIndex + 3 < this.dresses.length) {
      this.currentIndex += 3;
    } else {
      this.currentIndex = 0;
    }
  }

  prevSlide() {
    if (this.currentIndex - 3 >= 0) {
      this.currentIndex -= 3;
    } else {
      this.currentIndex = Math.max(this.dresses.length - 3, 0);
    }
  }

  showAllPopular() {
    this.popularLimit = 12;
    this.loadPopularProducts(this.popularLimit);
  }

  detailLink(product: Product) {
    if (product.category_id >= 1 && product.category_id <= 8) {
      return ['/clothing-m', product.product_id];
    }

    return ['/accessories-m', product.product_id];
  }

  formatPrice(price: number) {
    return `${price.toLocaleString('en-US')} บาท`;
  }

  private loadPopularProducts(limit: number) {
    this.loadingPopular = true;

    this.productService.getPopularProducts(limit).subscribe({
      next: (products) => {
        this.popularProducts = products;
        this.loadingPopular = false;
      },
      error: () => {
        this.popularProducts = [];
        this.loadingPopular = false;
      }
    });
  }
}
