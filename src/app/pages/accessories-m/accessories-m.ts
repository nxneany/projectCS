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
    { id: 1, image: 'assets/accessories/m1.png', name: 'มงกุฎเพชรเจ้าหญิง', price: 1200 },
    { id: 2, image: 'assets/accessories/m2.jpg', name: 'มงกุฎคริสตัลราชินี', price: 1350 },
    { id: 3, image: 'assets/accessories/m3.jpg', name: 'มงกุฎดอกไม้ทองคำ', price: 1100 },
    { id: 4, image: 'assets/accessories/a1.jpg', name: 'สร้อยเพชรหรู', price: 900 },
    { id: 5, image: 'assets/accessories/a2.jpg', name: 'ต่างหูไข่มุกแท้', price: 850 },
    { id: 6, image: 'assets/accessories/m4.jpg', name: 'มงกุฎเจ้าสาววินเทจ', price: 1250 },
    { id: 7, image: 'assets/accessories/m6.jpg', name: 'มงกุฎแฟนซีประกายดาว', price: 1000 },
    { id: 8, image: 'assets/accessories/m5.png', name: 'มงกุฎมินิสีเงิน', price: 950 },
    { id: 9, image: 'assets/accessories/m6.jpg', name: 'มงกุฎมุกสีชมพู', price: 1200 },
    { id: 10, image: 'assets/accessories/a1.jpg', name: 'สร้อยคริสตัลเจ้าหญิง', price: 950 },
    { id: 11, image: 'assets/accessories/a1.jpg', name: 'ต่างหูเพชรเรียบหรู', price: 850 },
    { id: 12, image: 'assets/accessories/a1.jpg', name: 'เซ็ตมงกุฎและสร้อยหรู', price: 1500 },
  ];
}
