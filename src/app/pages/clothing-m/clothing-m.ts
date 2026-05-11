import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Footer } from "../footer/footer";
import { Header } from "../header/header";

@Component({
  selector: 'app-clothing-m',
  imports: [RouterLink, Header, Footer,CommonModule,RouterOutlet],
  templateUrl: './clothing-m.html',
  styleUrl: './clothing-m.scss'
})
export class ClothingM {
dresses = [
    { id: 1, image: 'assets/clothing/w3.jpg', name: 'ชุดเจ้าหญิงขาว', price: 1200 },
    { id: 2, image: 'assets/clothing/w1.jpg', name: 'ชุดเจ้าหญิงขาว', price: 1500 },
    { id: 3, image: 'assets/clothing/w2.jpg', name: 'ชุดเจ้าหญิงครีม', price: 1300 },
    { id: 4, image: 'assets/clothing/RT.jpg', name: 'ชุดเจ้าหญิงเบล', price: 1400 },
    { id: 5, image: 'assets/clothing/FT.jpg', name: 'ชุดแฟนซีฟ้า', price: 1100 },
    { id: 6, image: 'assets/clothing/r1.jpg', name: 'ชุดเจ้าหญิงแดง', price: 1250 },
    { id: 7, image: 'assets/clothing/OP1.jpg', name: 'ชุดค็อกเทล', price: 1350 },
    { id: 8, image: 'assets/clothing/RP3.jpg', name: 'ชุดเจ้าหญิง', price: 1600 },
    { id: 9, image: 'assets/clothing/RP2.jpg', name: 'ชุดแฟนซีฟ้าแดงทอง', price: 1450 },
    { id: 10, image: 'assets/clothing/RP.jpg', name: 'ชุดแฟนซีฟ้าแดงทอง', price: 1550 },
    { id: 11, image: 'assets/clothing/WP2.jpg', name: 'ชุดเจ้าหญิงขาว', price: 1200 },
    { id: 12, image: 'assets/clothing/WP1.jpg', name: 'ชุดเจ้าหญิงขาว', price: 1700 }
  ];
}
