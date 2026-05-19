import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';
import { CartItem, CartService } from '../../service/cart.service';


@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterLink, Header, Footer],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class CartComponent implements OnInit {
  isConfirmPopupOpen = false;
  cartItems: CartItem[] = [];
  loadingCart = true;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.loadingCart = true;
    const memberId = Number(localStorage.getItem('member_id'));

    if (!memberId) {
      console.log('ไม่พบ member_id');

      this.cartItems = [];
      this.loadingCart = false;
      return;
    }

    this.cartService.getCart(memberId).subscribe({
      next: (res) => {
        console.log(res);

        this.cartItems = res.items.map((item) => ({
          ...item,
          selected: true,
        }));
        this.loadingCart = false;
      },

      error: (err) => {
        console.log(err);

        this.cartItems = [];
        this.loadingCart = false;
      },
    });
  }

  get selectedItems() {
    return this.cartItems.filter((item) => item.selected);
  }

  get selectedCount() {
    return this.selectedItems.length;
  }

  get hasSelectedItems() {
    return this.selectedCount > 0;
  }

  get isAllSelected() {
    return (
      this.cartItems.length > 0 && this.cartItems.every((item) => item.selected)
    );
  }

  toggleItem(item: CartItem, checked: boolean) {
    item.selected = checked;
  }

  toggleAll(checked: boolean) {
    this.cartItems = this.cartItems.map((item) => ({
      ...item,
      selected: checked,
    }));
  }

  removeItem(itemId: number) {
    this.cartService.removeCartItem(itemId).subscribe({
      next: () => {
        this.cartItems = this.cartItems.filter(
          (item) => item.cart_item_id !== itemId,
        );

        if (this.cartItems.length === 0) {
          this.closeConfirmPopup();
        }
      },

      error: (err) => {
        console.log(err);
      },
    });
  }

  openConfirmPopup() {
    if (!this.hasSelectedItems) return;
    this.isConfirmPopupOpen = true;
  }

  closeConfirmPopup() {
    this.isConfirmPopupOpen = false;
  }
}
