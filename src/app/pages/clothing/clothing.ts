import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from "../footer/footer";
import { Header } from "../header/header";

@Component({
  selector: 'app-clothing',
  imports: [Header, Footer,CommonModule,RouterOutlet],
  templateUrl: './clothing.html',
  styleUrl: './clothing.scss'
})
export class Clothing {
dresses = [
    { image: 'assets/clothing/w3.jpg', name: 'ชุดเจ้าหญิงขาว', price: 1200 },
    { image: 'assets/clothing/w1.jpg', name: 'ชุดเจ้าหญิงขาว', price: 1500 },
    { image: 'assets/clothing/w2.jpg', name: 'ชุดเจ้าหญิงครีม', price: 1300 },
    { image: 'assets/clothing/RT.jpg', name: 'ชุดเจ้าหญิงเบล', price: 1400 },
    { image: 'assets/clothing/FT.jpg', name: 'ชุดแฟนซีฟ้า', price: 1100 },
    { image: 'assets/clothing/r1.jpg', name: 'ชุดเจ้าหญิงแดง', price: 1250 },
    { image: 'assets/clothing/OP1.jpg', name: 'ชุดค็อกเทล', price: 1350 },
    { image: 'assets/clothing/RP3.jpg', name: 'ชุดเจ้าหญิง', price: 1600 },
    { image: 'assets/clothing/RP2.jpg', name: 'ชุดแฟนซีฟ้าแดงทอง', price: 1450 },
    { image: 'assets/clothing/RP.jpg', name: 'ชุดแฟนซีฟ้าแดงทอง', price: 1550 },
    { image: 'assets/clothing/WP2.jpg', name: 'ชุดเจ้าหญิงขาว', price: 1200 },
    { image: 'assets/clothing/WP1.jpg', name: 'ชุดเจ้าหญิงขาว', price: 1700 }
  ];
}