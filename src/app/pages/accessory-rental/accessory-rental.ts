import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';

interface RentalAccessory {
  id: number;
  image: string;
  name: string;
  price: number;
  detail: string;
  stock: number;
}

@Component({
  selector: 'app-accessory-rental',
  imports: [CommonModule, FormsModule, RouterLink, Header, Footer],
  templateUrl: './accessory-rental.html',
  styleUrl: './accessory-rental.scss'
})
export class AccessoryRentalComponent {
  selectedDuration = 4;
  quantity = 1;
  rentalStartDate = '';
  rentalEndDate = '';
  cartMessage = '';
  relatedStartIndex = 0;
  accessory?: RentalAccessory;

  accessories: RentalAccessory[] = [
    { id: 1, image: 'assets/accessories/m1.png', name: 'มงกุฎเพชรเจ้าหญิง', price: 1200, detail: 'มงกุฎเพชรประกายหรู เหมาะกับชุดเจ้าหญิง งานเวที และงานถ่ายภาพ', stock: 4 },
    { id: 2, image: 'assets/accessories/m2.jpg', name: 'มงกุฎคริสตัลราชินี', price: 1350, detail: 'มงกุฎคริสตัลทรงสูง เพิ่มลุคราชินีให้โดดเด่นสำหรับงานสำคัญ', stock: 3 },
    { id: 3, image: 'assets/accessories/m3.jpg', name: 'มงกุฎดอกไม้ทองคำ', price: 1100, detail: 'มงกุฎลายดอกไม้โทนทอง เหมาะกับงานแฟนซีและงานธีมวัฒนธรรม', stock: 5 },
    { id: 4, image: 'assets/accessories/a1.jpg', name: 'สร้อยเพชรหรู', price: 900, detail: 'สร้อยเพชรดีไซน์หรู ใช้จับคู่กับชุดราตรีและชุดเจ้าหญิง', stock: 6 },
    { id: 5, image: 'assets/accessories/a2.jpg', name: 'ต่างหูไข่มุกแท้', price: 850, detail: 'ต่างหูไข่มุกโทนสุภาพ เพิ่มความเรียบหรูให้กับทุกชุด', stock: 8 },
    { id: 6, image: 'assets/accessories/m4.jpg', name: 'มงกุฎเจ้าสาววินเทจ', price: 1250, detail: 'มงกุฎสไตล์วินเทจสำหรับงานแต่ง งานถ่ายภาพ และงานพิธี', stock: 2 },
    { id: 7, image: 'assets/accessories/m6.jpg', name: 'มงกุฎแฟนซีประกายดาว', price: 1000, detail: 'มงกุฎแฟนซีประกายดาว น้ำหนักเบา เหมาะกับงานแสดง', stock: 5 },
    { id: 8, image: 'assets/accessories/m5.png', name: 'มงกุฎมินิสีเงิน', price: 950, detail: 'มงกุฎมินิสีเงิน ใส่ง่าย เหมาะกับชุดแฟนซีหลากหลายสไตล์', stock: 7 },
    { id: 9, image: 'assets/accessories/m6.jpg', name: 'มงกุฎมุกสีชมพู', price: 1200, detail: 'มงกุฎมุกโทนชมพูหวาน เหมาะกับลุคเจ้าหญิงและงานธีมหวาน', stock: 3 },
    { id: 10, image: 'assets/accessories/a1.jpg', name: 'สร้อยคริสตัลเจ้าหญิง', price: 950, detail: 'สร้อยคริสตัลสำหรับเพิ่มประกายให้ชุดเจ้าหญิงและชุดราตรี', stock: 6 },
    { id: 11, image: 'assets/accessories/a1.jpg', name: 'ต่างหูเพชรเรียบหรู', price: 850, detail: 'ต่างหูเพชรแบบเรียบหรู ใช้ได้กับหลายโอกาส', stock: 8 },
    { id: 12, image: 'assets/accessories/a1.jpg', name: 'เซ็ตมงกุฎและสร้อยหรู', price: 1500, detail: 'เซ็ต accessories ครบชุดสำหรับงานที่ต้องการความหรูเป็นพิเศษ', stock: 2 }
  ];

  constructor(private route: ActivatedRoute, private router: Router) {
    this.accessory = this.accessories.find(item => item.id === Number(this.route.snapshot.paramMap.get('id')));
  }

  get totalPrice() {
    return (this.accessory?.price ?? 0) * this.quantity;
  }

  get relatedAccessories() {
    return this.accessories.filter(item => item.id !== this.accessory?.id);
  }

  get visibleRelatedAccessories() {
    return this.relatedAccessories.slice(this.relatedStartIndex, this.relatedStartIndex + 3);
  }

  selectDuration(days: number) {
    this.selectedDuration = days;
  }

  decreaseQuantity() {
    if (this.quantity > 1) this.quantity -= 1;
  }

  increaseQuantity() {
    if (this.accessory && this.quantity < this.accessory.stock) this.quantity += 1;
  }

  previousRelated() {
    const maxStartIndex = Math.max(this.relatedAccessories.length - 3, 0);
    this.relatedStartIndex = this.relatedStartIndex === 0 ? maxStartIndex : Math.max(this.relatedStartIndex - 3, 0);
  }

  nextRelated() {
    const maxStartIndex = Math.max(this.relatedAccessories.length - 3, 0);
    this.relatedStartIndex = this.relatedStartIndex >= maxStartIndex ? 0 : Math.min(this.relatedStartIndex + 3, maxStartIndex);
  }

  addToCart() {
    if (!this.accessory) return;
    localStorage.setItem('selectedRentalAccessory', JSON.stringify(this.buildRentalPayload()));
    this.cartMessage = 'เพิ่มสินค้าไปยังตะกร้าแล้ว';
  }

  rentNow() {
    if (!this.accessory) return;
    localStorage.setItem('selectedRentalAccessory', JSON.stringify(this.buildRentalPayload()));
    this.router.navigate(['/payment']);
  }

  formatPrice(price: number) {
    return `${price.toLocaleString('en-US')} บาท`;
  }

  private buildRentalPayload() {
    return {
      id: this.accessory?.id,
      name: this.accessory?.name,
      image: this.accessory?.image,
      price: this.accessory?.price,
      duration: this.selectedDuration,
      rentalStartDate: this.rentalStartDate,
      rentalEndDate: this.rentalEndDate,
      quantity: this.quantity
    };
  }
}
