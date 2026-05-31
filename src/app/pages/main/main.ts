import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../service/auth.service';
import { LatePaymentItem, OrderService } from '../../service/order.service';
import { Product, ProductService } from '../../service/product.service';
import { Footer } from "../footer/footer";
import { Header } from "../header/header";

@Component({
  selector: 'app-main',
  imports: [Header, RouterOutlet, RouterLink, CommonModule, Footer],
  templateUrl: './main.html',
  styleUrl: './main.scss'
})
export class Main implements OnInit, OnDestroy {
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
  latePayments: LatePaymentItem[] = [];
  latePaymentsLoading = false;
  showLateAlert = true;
  private authSub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private scroller: ViewportScroller,
    private productService: ProductService,
    private orderService: OrderService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.loadPopularProducts(this.popularLimit);
    this.authSub = this.auth.isLoggedIn$.subscribe((isLoggedIn) => {
      if (isLoggedIn && localStorage.getItem('member_id')) {
        this.loadLatePayments();
      } else {
        this.latePayments = [];
      }
    });

    // ตรวจสอบ fragment (เช่น #about)
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        // รอให้ footer render เสร็จก่อนค่อย scroll
        setTimeout(() => this.scroller.scrollToAnchor(fragment), 200);
      }
    });
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
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

  formatMoney(value: number) {
    return `${Number(value || 0).toLocaleString('th-TH')} ฿`;
  }

  formatDate(value: string) {
    if (!value) {
      return '-';
    }

    return new Intl.DateTimeFormat('th-TH', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(value));
  }

  closeLateAlert() {
    this.showLateAlert = false;
  }

  private loadLatePayments() {
    const memberId = Number(localStorage.getItem('member_id') || '0');
    if (!memberId) {
      this.latePayments = [];
      return;
    }

    this.latePaymentsLoading = true;
    this.showLateAlert = true;

    this.orderService.getLatePayments(memberId).subscribe({
      next: (res) => {
        this.latePayments = res.items || [];
        this.latePaymentsLoading = false;
      },
      error: () => {
        this.latePayments = [];
        this.latePaymentsLoading = false;
      },
    });
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
