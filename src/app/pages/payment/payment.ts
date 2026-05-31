import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';
import { ActivatedRoute } from '@angular/router';
import {
  BillingResponse,
  CartService,
  CreateOrderResponse,
} from '../../service/cart.service';

interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
}

interface PaymentUser {
  member_id: number;
  username: string;
  phone: string;
  email: string;
  address: string;
}

interface BillItem {
  cart_item_id: number;
  product_id: number;
  name: string;
  variant_id: number;
  size: string;
  color: string;
  quantity: number;
  price: number;
  day_type: string;
  day_start: string;
  day_end: string;
  image_front: string;
}

interface PaymentSummary {
  subtotal: number;
  deposit: number;
  grand_total: number;
  total_items: number;
}

interface PaymentData {
  user: PaymentUser;
  items: BillItem[];
  summary: PaymentSummary;
}

@Component({
  selector: 'app-payment',
  imports: [CommonModule, Header, Footer],
  templateUrl: './payment.html',
  styleUrl: './payment.scss',
})
export class PaymentComponent implements OnInit {
  billing?: BillingResponse;
  cartId = 0;
  cartItemIds: number[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cartService: CartService,
  ) {}

  customerInfo: CustomerInfo = {
    name: '',
    phone: '',
    email: '',
    address: '',
  };

  isAgreementPopupOpen = false;
  isCustomerLoading = false;
  loadingPayment = true;

  billItems: BillItem[] = [];
  summary: PaymentSummary = {
    subtotal: 0,
    deposit: 0,
    grand_total: 0,
    total_items: 0,
  };

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.cartId = Number(params['cart_id']);

      this.cartItemIds =
        params['cart_item_ids']
          ?.split(',')
          .map(Number)
          .filter((id: number) => !Number.isNaN(id)) || [];

      if (!this.cartId) {
        this.loadingPayment = false;

        return;
      }

      this.loadPaymentData(this.cartId);
    });
  }

  openAgreementPopup() {
    if (this.isCustomerLoading) return;
    this.isAgreementPopupOpen = true;
  }

  closeAgreementPopup() {
    this.isAgreementPopupOpen = false;
  }

  confirmRental() {
    const cartItemIds = this.cartItemIds.length
      ? this.cartItemIds
      : this.billItems.map((item) => item.cart_item_id);

    if (!cartItemIds.length) return;

    this.isCustomerLoading = true;

    this.cartService.addOrder(this.cartId, cartItemIds).subscribe({
      next: (res: CreateOrderResponse) => {
        console.log(res);

        this.isAgreementPopupOpen = false;

        this.isCustomerLoading = false;

        this.router.navigate(['/qr-payment'], {
          queryParams: {
            order_id: res.order_id,
          },
        });
      },

      error: (err) => {
        console.log(err);

        this.isCustomerLoading = false;
      },
    });
  }

  formatPrice(price: number) {
    return `${price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} ฿`;
  }

  formatDate(date: string) {
    return new Intl.DateTimeFormat('th-TH', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(date));
  }

  private loadPaymentData(cartId: number) {
    this.loadingPayment = true;

    this.cartService.getBilling(cartId).subscribe({
      next: (res: BillingResponse) => {
        console.log(res);

        this.billing = res;

        const selectedItems = this.filterSelectedItems(res.items);

        this.billItems = selectedItems;

        if (!this.cartItemIds.length) {
          this.cartItemIds = selectedItems.map((item) => item.cart_item_id);
        }

        this.summary = this.cartItemIds.length
          ? this.createSelectedSummary(selectedItems)
          : res.summary;

        this.customerInfo = {
          name: res.user.username || '-',

          phone: res.user.phone || '-',

          email: res.user.email || '-',

          address: res.user.address || '-',
        };

        this.loadingPayment = false;
      },

      error: (err) => {
        console.log(err);

        this.loadingPayment = false;
      },
    });
  }

  private filterSelectedItems(items: BillItem[]) {
    if (!this.cartItemIds.length) return items;

    const selectedIds = new Set(this.cartItemIds.map(Number));

    return items.filter((item) => selectedIds.has(Number(item.cart_item_id)));
  }

  private createSelectedSummary(items: BillItem[]): PaymentSummary {
    const subtotal = items.reduce((sum, item) => sum + Number(item.price || 0), 0);

    return {
      subtotal,
      deposit: subtotal / 2,
      grand_total: subtotal,
      total_items: items.length,
    };
  }
}
