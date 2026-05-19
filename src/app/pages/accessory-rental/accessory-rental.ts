import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';
import { Product, ProductService, ProductVariant } from '../../service/product.service';

import { CartService } from '../../service/cart.service';

interface RentalAccessory {
  id: number;
  image: string;
  name: string;
  price: number;
  detail: string;
  stock: number;
  sizes: string[];
  variants: ProductVariant[];
}
interface GalleryImage {
  label: string;
  src: string;
}

@Component({
  selector: 'app-accessory-rental',
  imports: [CommonModule, FormsModule, RouterLink, Header, Footer],
  templateUrl: './accessory-rental.html',
  styleUrl: './accessory-rental.scss',
})
export class AccessoryRentalComponent implements OnInit {
  selectedDuration = 4;
  quantity = 1;
  rentalStartDate = '';
  rentalEndDate = '';
  cartMessage = '';
  relatedStartIndex = 0;
  accessory?: RentalAccessory;
  loadingProduct = true;
  selectedGalleryImage = '';
  selectedSize = '40';

  accessories: RentalAccessory[] = [
    {
      id: 1,
      image: 'assets/accessories/m1.png',
      name: 'มงกุฎเพชรเจ้าหญิง',
      price: 1200,
      detail: 'มงกุฎเพชรประกายหรู เหมาะกับชุดเจ้าหญิง งานเวที และงานถ่ายภาพ',
      stock: 4,
      sizes: ['40', '41', '42', '43'],
      variants: [],
    },
    {
      id: 2,
      image: 'assets/accessories/m2.jpg',
      name: 'มงกุฎคริสตัลราชินี',
      price: 1350,
      detail: 'มงกุฎคริสตัลทรงสูง เพิ่มลุคราชินีให้โดดเด่นสำหรับงานสำคัญ',
      stock: 3,
      sizes: ['40', '41', '42', '43'],
      variants: [],
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
  ) {}
  ngOnInit() {
    this.loadProduct();
  }

  get totalPrice() {
    return (this.accessory?.price ?? 0) * this.quantity;
  }

  get relatedAccessories() {
    return this.accessories.filter((item) => item.id !== this.accessory?.id);
  }

  get visibleRelatedAccessories() {
    return this.relatedAccessories.slice(
      this.relatedStartIndex,
      this.relatedStartIndex + 3,
    );
  }

  get selectedVariant() {
    return (
      this.accessory?.variants.find(
        (variant) => variant.size === this.selectedSize,
      ) ?? this.accessory?.variants[0]
    );
  }

  get previewImage() {
    return (
      this.selectedGalleryImage ||
      this.galleryImages[0]?.src ||
      this.accessory?.image ||
      'assets/clothing/w3.jpg'
    );
  }

  get galleryImages(): GalleryImage[] {
    const variant = this.selectedVariant;

    if (!variant) {
      return this.accessory?.image
        ? [{ label: 'ด้านหน้า', src: this.accessory.image }]
        : [];
    }

    return [
      { label: 'ด้านหน้า', src: variant.image_front },
      { label: 'ด้านหลัง', src: variant.image_back },
      { label: 'ตอนสวมใส่', src: variant.image_wear },
    ].filter((image) => !!image.src);
  }

  get currentStock() {
    return this.selectedVariant?.quantity ?? this.accessory?.stock ?? 0;
  }

  get minRentalStartDate() {
    return this.formatInputDate(new Date());
  }

  get isRentalDateValid() {
    return !!this.rentalStartDate && !!this.rentalEndDate;
  }

  get canSubmitRental() {
    return this.isRentalDateValid && this.quantity > 0 && this.currentStock > 0;
  }

  selectDuration(days: number) {
    this.selectedDuration = days;
    this.updateRentalEndDate();
  }

  selectSize(size: string) {
    this.selectedSize = size;
    if (this.quantity > this.currentStock)
      this.quantity = Math.max(this.currentStock, 1);
    this.selectedGalleryImage = this.galleryImages[0]?.src || '';
  }

  selectGalleryImage(src: string) {
    this.selectedGalleryImage = src;
  }

  onStartDateChange() {
    this.updateRentalEndDate();
  }

  onEndDateChange() {
    this.updateRentalEndDate();
  }

  decreaseQuantity() {
    if (this.quantity > 1) this.quantity -= 1;
  }

  increaseQuantity() {
    if (this.accessory && this.quantity < this.accessory.stock)
      this.quantity += 1;
  }

  previousRelated() {
    const maxStartIndex = Math.max(this.relatedAccessories.length - 3, 0);
    this.relatedStartIndex =
      this.relatedStartIndex === 0
        ? maxStartIndex
        : Math.max(this.relatedStartIndex - 3, 0);
  }

  nextRelated() {
    const maxStartIndex = Math.max(this.relatedAccessories.length - 3, 0);
    this.relatedStartIndex =
      this.relatedStartIndex >= maxStartIndex
        ? 0
        : Math.min(this.relatedStartIndex + 3, maxStartIndex);
  }

  addToCart() {
    if (!this.accessory) return;

    const memberId = Number(localStorage.getItem('member_id'));

    if (!memberId) {
      this.cartMessage = 'กรุณาเข้าสู่ระบบ';

      return;
    }

    if (!this.selectedVariant) {
      this.cartMessage = 'กรุณาเลือกสินค้า';

      return;
    }

    const payload = {
      user_id: memberId,

      variant_id: this.selectedVariant.variant_id,

      quantity: this.quantity,

      price: this.totalPrice,

      day_type: `${this.selectedDuration}วัน`,

      day_start: this.rentalStartDate,

      day_end: this.rentalEndDate,
    };

    console.log(payload);

    this.cartService.addToCart(payload).subscribe({
      next: () => {
        this.cartMessage = 'เพิ่มสินค้าไปยังตะกร้าแล้ว';
      },

      error: (err) => {
        console.log(err);

        this.cartMessage = 'ไม่สามารถเพิ่มสินค้าได้';
      },
    });
  }

  rentNow() {
    if (!this.accessory) return;
    localStorage.setItem(
      'selectedRentalAccessory',
      JSON.stringify(this.buildRentalPayload()),
    );
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
      variantId: this.selectedVariant?.variant_id,
      color: this.selectedVariant?.color,
      duration: this.selectedDuration,
      rentalStartDate: this.rentalStartDate,
      rentalEndDate: this.rentalEndDate,
      size: this.selectedSize,
      quantity: this.quantity,
    };
  }

  private loadProduct() {
    const productId = Number(this.route.snapshot.paramMap.get('id'));

    if (!productId) {
      this.loadingProduct = false;
      return;
    }

    this.productService.getProductsId(productId).subscribe({
      next: (product) => {
        this.accessory = this.mapProductToDress(product);
        this.selectedSize = this.accessory.sizes[0] || '';
        this.quantity = this.currentStock > 0 ? 1 : 0;
        this.selectedGalleryImage = this.galleryImages[0]?.src || '';
        this.loadingProduct = false;
      },
      error: () => {
        this.accessory = undefined;
        this.loadingProduct = false;
      },
    });
  }
  private mapProductToDress(product: Product): RentalAccessory {
    const variants = product.variants ?? [];

    return {
      id: product.product_id,
      image:
        product.image_front ||
        variants[0]?.image_front ||
        'assets/clothing/w3.jpg',
      name: product.name,
      price: product.price,
      detail: product.description,
      stock: variants.reduce((total, variant) => total + variant.quantity, 0),
      sizes: [...new Set(variants.map((variant) => variant.size))],
      variants,
    };
  }

  private updateRentalEndDate() {
    if (!this.rentalStartDate) {
      this.rentalEndDate = '';
      return;
    }

    const startDate = this.parseInputDate(this.rentalStartDate);
    startDate.setDate(startDate.getDate() + this.selectedDuration);
    this.rentalEndDate = this.formatInputDate(startDate);
  }

  private parseInputDate(value: string) {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  private formatInputDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
