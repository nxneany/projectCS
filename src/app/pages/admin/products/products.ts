import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface ProductVariant {
  size: string;
  color: string;
  quantity: number;
}

interface Product {
  productId: string;
  image: string;
  name: string;
  price: number;
  description: string;
  category: string;
  variants: ProductVariant[];
}

interface ProductForm {
  productId: string;
  name: string;
  price: number;
  description: string;
  category: string;

  image: string;

  imageFrontName: string;
  imageBackName: string;
  imageWearName: string;

  variants: ProductVariant[];
}

@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class ProductsComponent {
  productsData: Product[] = [
    {
      productId: 'P-001',

      image:
        'https://res.cloudinary.com/dfk8wkzrs/image/upload/v1778584104/rental/fqb9eokv3eynotpfujex.png',

      name: 'ชุดราตรีสีแดง',

      price: 1500,

      description: 'ชุดราตรียาวผ้าซาตินสีแดง',

      category: 'ชุดรวมสำหรับผู้หญิง',

      variants: [
        {
          size: 'M',
          color: 'แดง',
          quantity: 5,
        },
        {
          size: 'L',
          color: 'แดงเข้ม',
          quantity: 3,
        },
      ],
    },

    {
      productId: 'P-002',

      image:
        'https://res.cloudinary.com/dfk8wkzrs/image/upload/v1778584372/rental/ozzfjxya0uq03vlzvedz.png',

      name: 'ชุดไทยจักรี',

      price: 1200,

      description: 'ชุดไทยจักรีผ้าไหมทอง',

      category: 'ชุดไทย',

      variants: [
        {
          size: 'S',
          color: 'ทอง',
          quantity: 4,
        },
      ],
    },
  ];

  categoriesData: string[] = [
    'ชุดรวมสำหรับผู้หญิง',
    'ชุดรวมสำหรับผู้ชาย',
    'ชุดไทย',
    'ชุดแฟนตาซีสำหรับขบวนพาเหรด',
    'ชุดเชียร์หลีดเดอร์',
    'ชุดราชา-ราชินีประจำสี',
    'ชุดสำหรับถือป้าย',
    'ชุดนางรำ',
    'เครื่องประดับ',
    'รองเท้า',
    'คฑา',
  ];

  products: Product[] = [...this.productsData];

  categories: string[] = [...this.categoriesData];

  isProductPopupOpen = false;

  editingProductId = '';

  productFormError = '';

  productForm: ProductForm = this.getEmptyProductForm();

  formatPrice(price: number) {
    return `${price.toLocaleString('en-US')} ฿`;
  }

  openAddProductPopup() {
    this.productForm = this.getEmptyProductForm();

    this.productFormError = '';

    this.editingProductId = '';

    this.isProductPopupOpen = true;
  }

  openEditProductPopup(product: Product) {
    this.productForm = {
      productId: product.productId,

      name: product.name,

      price: product.price,

      description: product.description,

      category: product.category,

      image: product.image,

      imageFrontName: 'รูปเดิม',

      imageBackName: '',

      imageWearName: '',

      variants: [...product.variants],
    };

    this.productFormError = '';

    this.editingProductId = product.productId;

    this.isProductPopupOpen = true;
  }

  closeProductPopup() {
    this.isProductPopupOpen = false;

    this.editingProductId = '';
  }

  addVariant() {
    this.productForm.variants.push({
      size: '',
      color: '',
      quantity: 1,
    });
  }

  removeVariant(index: number) {
    this.productForm.variants.splice(index, 1);
  }

  onProductImageSelected(event: Event, type: 'front' | 'back' | 'wear') {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) return;

    const file = input.files[0];

    if (type === 'front') {
      this.productForm.imageFrontName = file.name;

      this.productForm.image = URL.createObjectURL(file);
    }

    if (type === 'back') {
      this.productForm.imageBackName = file.name;
    }

    if (type === 'wear') {
      this.productForm.imageWearName = file.name;
    }
  }

  saveProduct() {
    this.productFormError = '';

    if (
      !this.productForm.productId.trim() ||
      !this.productForm.name.trim() ||
      !this.productForm.description.trim() ||
      !this.productForm.category ||
      this.productForm.price <= 0
    ) {
      this.productFormError = 'กรุณากรอกข้อมูลสินค้าให้ครบ';

      return;
    }

    const invalidVariant = this.productForm.variants.some(
      (variant) =>
        !variant.size.trim() || !variant.color.trim() || variant.quantity < 0,
    );

    if (invalidVariant) {
      this.productFormError = 'กรุณากรอกข้อมูลไซส์ สี และจำนวนให้ครบ';

      return;
    }

    const savedProduct: Product = {
      productId: this.productForm.productId,

      image: this.productForm.image || 'assets/clothing/w3.jpg',

      name: this.productForm.name,

      price: this.productForm.price,

      description: this.productForm.description,

      category: this.productForm.category,

      variants: [...this.productForm.variants],
    };

    // edit
    if (this.editingProductId) {
      this.products = this.products.map((product) =>
        product.productId === this.editingProductId ? savedProduct : product,
      );

      this.closeProductPopup();

      return;
    }

    // add
    this.products = [savedProduct, ...this.products];

    this.closeProductPopup();
  }

  getTotalQuantity(product: Product) {
    return product.variants.reduce((sum, variant) => sum + variant.quantity, 0);
  }

  private getEmptyProductForm(): ProductForm {
    return {
      productId: `P-${String(this.products.length + 1).padStart(3, '0')}`,

      name: '',

      price: 0,

      description: '',

      category: '',

      image: '',

      imageFrontName: '',

      imageBackName: '',

      imageWearName: '',

      variants: [
        {
          size: '',
          color: '',
          quantity: 1,
        },
      ],
    };
  }
}
