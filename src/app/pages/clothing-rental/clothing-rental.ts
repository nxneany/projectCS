import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Product, ProductService, ProductVariant } from '../../service/product.service';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';
import { CartService } from '../../service/cart.service';

interface RentalDress {
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
  selector: 'app-clothing-rental',
  imports: [CommonModule, FormsModule, RouterLink, Header, Footer],
  templateUrl: './clothing-rental.html',
  styleUrl: './clothing-rental.scss',
})
export class ClothingRentalComponent implements OnInit {
  selectedDuration = 4;
  selectedSize = 'M';
  quantity = 1;
  cartMessage = '';
  rentalStartDate = '';
  rentalEndDate = '';
  relatedStartIndex = 0;
  dress?: RentalDress;
  loadingProduct = true;
  selectedGalleryImage = '';

  dresses: RentalDress[] = [
    {
      id: 1,
      image: 'assets/clothing/w3.jpg',
      name: 'ชุดเจ้าหญิงขาว',
      price: 1200,
      detail:
        'ชุดเจ้าหญิงสีขาวสำหรับงานแฟนซี งานแสดง และงานถ่ายภาพ ให้ลุคหวานเรียบหรู',
      stock: 5,
      sizes: ['S', 'M', 'L', 'XL'],
      variants: [],
    },
    {
      id: 2,
      image: 'assets/clothing/w1.jpg',
      name: 'ชุดเจ้าหญิงขาว',
      price: 1500,
      detail: 'ชุดเดรสสีขาวทรงฟู เหมาะกับงานพาเหรด งานเวที และงานธีมเจ้าหญิง',
      stock: 3,
      sizes: ['S', 'M', 'L', 'XL'],
      variants: [],
    },
    {
      id: 3,
      image: 'assets/clothing/w2.jpg',
      name: 'ชุดเจ้าหญิงครีม',
      price: 1300,
      detail: 'ชุดโทนครีมสุภาพ เพิ่มความอ่อนหวาน เหมาะกับงานพิธีและงานถ่ายภาพ',
      stock: 4,
      sizes: ['S', 'M', 'L', 'XL'],
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
    return (this.dress?.price ?? 0) * this.quantity;
  }

  get relatedDresses() {
    return this.dresses.filter((item) => item.id !== this.dress?.id);
  }

  get visibleRelatedDresses() {
    return this.relatedDresses.slice(
      this.relatedStartIndex,
      this.relatedStartIndex + 3,
    );
  }

  get selectedVariant() {
    return (
      this.dress?.variants.find(
        (variant) => variant.size === this.selectedSize,
      ) ?? this.dress?.variants[0]
    );
  }

  get previewImage() {
    return (
      this.selectedGalleryImage ||
      this.galleryImages[0]?.src ||
      this.dress?.image ||
      'assets/clothing/w3.jpg'
    );
  }

  get galleryImages(): GalleryImage[] {
    const variant = this.selectedVariant;

    if (!variant) {
      return this.dress?.image
        ? [{ label: 'ด้านหน้า', src: this.dress.image }]
        : [];
    }

    return [
      { label: 'ด้านหน้า', src: variant.image_front },
      { label: 'ด้านหลัง', src: variant.image_back },
      { label: 'ตอนสวมใส่', src: variant.image_wear },
    ].filter((image) => !!image.src);
  }

  get currentStock() {
    return this.selectedVariant?.quantity ?? this.dress?.stock ?? 0;
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

  decreaseQuantity() {
    if (this.quantity > 1) this.quantity -= 1;
  }

  increaseQuantity() {
    if (this.dress && this.quantity < this.currentStock) this.quantity += 1;
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

  previousRelated() {
    const maxStartIndex = Math.max(this.relatedDresses.length - 3, 0);
    this.relatedStartIndex =
      this.relatedStartIndex === 0
        ? maxStartIndex
        : Math.max(this.relatedStartIndex - 3, 0);
  }

  nextRelated() {
    const maxStartIndex = Math.max(this.relatedDresses.length - 3, 0);
    this.relatedStartIndex =
      this.relatedStartIndex >= maxStartIndex
        ? 0
        : Math.min(this.relatedStartIndex + 3, maxStartIndex);
  }

  addToCart() {
    if (!this.dress) return;

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
    if (!this.dress || !this.canSubmitRental) return;
    localStorage.setItem(
      'selectedRentalDress',
      JSON.stringify(this.buildRentalPayload()),
    );
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
        this.dress = this.mapProductToDress(product);
        this.selectedSize = this.dress.sizes[0] || '';
        this.quantity = this.currentStock > 0 ? 1 : 0;
        this.selectedGalleryImage = this.galleryImages[0]?.src || '';
        this.loadingProduct = false;
      },
      error: () => {
        this.dress = undefined;
        this.loadingProduct = false;
      },
    });
  }

  private mapProductToDress(product: Product): RentalDress {
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
