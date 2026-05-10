import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Footer } from "../footer/footer";
import { Header } from "../header/header";

@Component({
  selector: 'app-accessories',
  imports: [RouterLink, Header, Footer,CommonModule,RouterOutlet],
  templateUrl: './accessories-m.html',
  styleUrl: './accessories-m.scss'
})
export class AccessoriesM {
dresses = [
    { image: 'assets/accessories/m1.png', name: 'มงกุฎเพชรเจ้าหญิง', price: 1200 },
    { image: 'assets/accessories/m2.jpg', name: 'มงกุฎคริสตัลราชินี', price: 1350 },
    { image: 'assets/accessories/m3.jpg', name: 'มงกุฎดอกไม้ทองคำ', price: 1100 },
    { image: 'assets/accessories/a1.jpg', name: 'สร้อยเพชรหรู', price: 900 },
    { image: 'assets/accessories/a2.jpg', name: 'ต่างหูไข่มุกแท้', price: 850 },
    { image: 'assets/accessories/m4.jpg', name: 'มงกุฎเจ้าสาววินเทจ', price: 1250 },
    { image: 'assets/accessories/m6.jpg', name: 'มงกุฎแฟนซีประกายดาว', price: 1000 },
    { image: 'assets/accessories/m5.png', name: 'มงกุฎมินิสีเงิน', price: 950 },
    { image: 'assets/accessories/m6.jpg', name: 'มงกุฎมุกสีชมพู', price: 1200 },
    { image: 'assets/accessories/a1.jpg', name: 'สร้อยคริสตัลเจ้าหญิง', price: 950 },
    { image: 'assets/accessories/a1.jpg', name: 'ต่างหูเพชรเรียบหรู', price: 850 },
    { image: 'assets/accessories/a1.jpg', name: 'เซ็ตมงกุฎและสร้อยหรู', price: 1500 },
  ];
}