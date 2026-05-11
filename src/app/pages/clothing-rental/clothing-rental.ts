import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';

interface RentalDress {
  id: number;
  image: string;
  name: string;
  price: number;
  detail: string;
  stock: number;
  sizes: string[];
}

@Component({
  selector: 'app-clothing-rental',
  imports: [CommonModule, FormsModule, RouterLink, Header, Footer],
  templateUrl: './clothing-rental.html',
  styleUrl: './clothing-rental.scss'
})
export class ClothingRentalComponent {
  selectedDuration = 4;
  selectedSize = 'M';
  quantity = 1;
  cartMessage = '';
  rentalStartDate = '';
  rentalEndDate = '';
  relatedStartIndex = 0;
  dress?: RentalDress;

  dresses: RentalDress[] = [
    { id: 1, image: 'assets/clothing/w3.jpg', name: 'ชุดเจ้าหญิงขาว', price: 1200, detail: 'ชุดเจ้าหญิงสีขาวสำหรับงานแฟนซี งานแสดง และงานถ่ายภาพ ให้ลุคหวานเรียบหรู', stock: 5, sizes: ['S', 'M', 'L', 'XL'] },
    { id: 2, image: 'assets/clothing/w1.jpg', name: 'ชุดเจ้าหญิงขาว', price: 1500, detail: 'ชุดเดรสสีขาวทรงฟู เหมาะกับงานพาเหรด งานเวที และงานธีมเจ้าหญิง', stock: 3, sizes: ['S', 'M', 'L', 'XL'] },
    { id: 3, image: 'assets/clothing/w2.jpg', name: 'ชุดเจ้าหญิงครีม', price: 1300, detail: 'ชุดโทนครีมสุภาพ เพิ่มความอ่อนหวาน เหมาะกับงานพิธีและงานถ่ายภาพ', stock: 4, sizes: ['S', 'M', 'L', 'XL'] },
    { id: 4, image: 'assets/clothing/RT.jpg', name: 'ชุดเจ้าหญิงเบล', price: 1400, detail: 'ชุดเจ้าหญิงโทนเหลืองทอง ให้ลุคโดดเด่น เหมาะกับงานแฟนซีและการแสดง', stock: 2, sizes: ['S', 'M', 'L', 'XL'] },
    { id: 5, image: 'assets/clothing/FT.jpg', name: 'ชุดแฟนซีฟ้า', price: 1100, detail: 'ชุดแฟนซีสีฟ้าสดใส น้ำหนักเบา ใส่สบายสำหรับกิจกรรมและงานแสดง', stock: 6, sizes: ['S', 'M', 'L', 'XL'] },
    { id: 6, image: 'assets/clothing/r1.jpg', name: 'ชุดเจ้าหญิงแดง', price: 1250, detail: 'ชุดสีแดงสดสำหรับงานธีม งานเวที และงานที่ต้องการความโดดเด่น', stock: 4, sizes: ['S', 'M', 'L', 'XL'] },
    { id: 7, image: 'assets/clothing/OP1.jpg', name: 'ชุดค็อกเทล', price: 1350, detail: 'ชุดค็อกเทลเรียบหรูสำหรับงานเลี้ยง งานถ่ายภาพ และงานพิเศษ', stock: 5, sizes: ['S', 'M', 'L', 'XL'] },
    { id: 8, image: 'assets/clothing/RP3.jpg', name: 'ชุดเจ้าหญิง', price: 1600, detail: 'ชุดเจ้าหญิงดีไซน์จัดเต็ม เหมาะกับงานประกวด งานแสดง และงานธีมแฟนตาซี', stock: 2, sizes: ['S', 'M', 'L', 'XL'] },
    { id: 9, image: 'assets/clothing/RP2.jpg', name: 'ชุดแฟนซีฟ้าแดงทอง', price: 1450, detail: 'ชุดแฟนซีสีฟ้าแดงทองสำหรับขบวนพาเหรดและงานแสดงที่ต้องการสีสัน', stock: 3, sizes: ['S', 'M', 'L', 'XL'] },
    { id: 10, image: 'assets/clothing/RP.jpg', name: 'ชุดแฟนซีฟ้าแดงทอง', price: 1550, detail: 'ชุดแฟนซีโทนฟ้าแดงทอง ทรงสวย เหมาะกับงานเวทีและงานเดินขบวน', stock: 3, sizes: ['S', 'M', 'L', 'XL'] },
    { id: 11, image: 'assets/clothing/WP2.jpg', name: 'ชุดเจ้าหญิงขาว', price: 1200, detail: 'ชุดเจ้าหญิงขาวแบบคลาสสิก ใส่ได้หลายโอกาส ทั้งงานแสดงและงานถ่ายภาพ', stock: 5, sizes: ['S', 'M', 'L', 'XL'] },
    { id: 12, image: 'assets/clothing/WP1.jpg', name: 'ชุดเจ้าหญิงขาว', price: 1700, detail: 'ชุดเจ้าหญิงขาวดีไซน์พิเศษ เหมาะกับงานสำคัญและงานที่ต้องการความหรูหรา', stock: 2, sizes: ['S', 'M', 'L', 'XL'] }
  ];

  constructor(private route: ActivatedRoute, private router: Router) {
    this.dress = this.dresses.find(item => item.id === Number(this.route.snapshot.paramMap.get('id')));
  }

  get totalPrice() {
    return (this.dress?.price ?? 0) * this.quantity;
  }

  get relatedDresses() {
    return this.dresses.filter(item => item.id !== this.dress?.id);
  }

  get visibleRelatedDresses() {
    return this.relatedDresses.slice(this.relatedStartIndex, this.relatedStartIndex + 3);
  }

  decreaseQuantity() {
    if (this.quantity > 1) this.quantity -= 1;
  }

  increaseQuantity() {
    if (this.dress && this.quantity < this.dress.stock) this.quantity += 1;
  }

  selectDuration(days: number) {
    this.selectedDuration = days;
  }

  selectSize(size: string) {
    this.selectedSize = size;
  }

  previousRelated() {
    const maxStartIndex = Math.max(this.relatedDresses.length - 3, 0);
    this.relatedStartIndex = this.relatedStartIndex === 0 ? maxStartIndex : Math.max(this.relatedStartIndex - 3, 0);
  }

  nextRelated() {
    const maxStartIndex = Math.max(this.relatedDresses.length - 3, 0);
    this.relatedStartIndex = this.relatedStartIndex >= maxStartIndex ? 0 : Math.min(this.relatedStartIndex + 3, maxStartIndex);
  }

  addToCart() {
    if (!this.dress) return;
    localStorage.setItem('selectedRentalDress', JSON.stringify(this.buildRentalPayload()));
    this.cartMessage = 'เพิ่มสินค้าไปยังตะกร้าแล้ว';
  }

  rentNow() {
    if (!this.dress) return;
    localStorage.setItem('selectedRentalDress', JSON.stringify(this.buildRentalPayload()));
    this.router.navigate(['/payment']);
  }

  formatPrice(price: number) {
    return `${price.toLocaleString('en-US')} บาท`;
  }

  private buildRentalPayload() {
    return {
      id: this.dress?.id,
      name: this.dress?.name,
      image: this.dress?.image,
      price: this.dress?.price,
      duration: this.selectedDuration,
      rentalStartDate: this.rentalStartDate,
      rentalEndDate: this.rentalEndDate,
      size: this.selectedSize,
      quantity: this.quantity
    };
  }
}
