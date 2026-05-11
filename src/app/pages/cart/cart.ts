import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';

interface CartItem {
  id: number;
  image: string;
  name: string;
  rentalDays: number;
  startDate: string;
  returnDate: string;
}

@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterLink, Header, Footer],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class CartComponent {
  isConfirmPopupOpen = false;

  cartItems: CartItem[] = [
    {
      id: 1,
      image: 'assets/clothing/w3.jpg',
      name: 'ชุดเจ้าหญิงขาว',
      rentalDays: 3,
      startDate: '2026-05-12',
      returnDate: '2026-05-15'
    },
    {
      id: 2,
      image: 'assets/clothing/RT.jpg',
      name: 'ชุดเจ้าหญิงเบล',
      rentalDays: 2,
      startDate: '2026-05-18',
      returnDate: '2026-05-20'
    }
  ];

  removeItem(itemId: number) {
    this.cartItems = this.cartItems.filter(item => item.id !== itemId);

    if (this.cartItems.length === 0) {
      this.closeConfirmPopup();
    }
  }

  openConfirmPopup() {
    if (this.cartItems.length === 0) return;
    this.isConfirmPopupOpen = true;
  }

  closeConfirmPopup() {
    this.isConfirmPopupOpen = false;
  }
}
