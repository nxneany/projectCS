import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { Category, CategoryService } from '../../../service/category.service';

interface ProductVariant {
  size: string;
  color: string;
  quantity: number;
}

interface Product {
  id: number;
  productId: string;
  image: string;
  imageFront: string;
  imageBack: string;
  imageWear: string;
  name: string;
  price: number;
  description: string;
  category: string;
  categoryId: number;
  variants: ProductVariant[];
}

interface ProductForm {
  productId: string;
  name: string;
  price: number;
  description: string;
  categoryId: number | null;
  image: string;
  imageFrontName: string;
  imageBackName: string;
  imageWearName: string;
  imageFrontFile: File | null;
  imageBackFile: File | null;
  imageWearFile: File | null;
  imageFrontUrl: string;
  imageBackUrl: string;
  imageWearUrl: string;
  variants: ProductVariant[];
}

interface AdminProductApiItem {
  product_id: number;
  name: string;
  description: string;
  price: number;
  category_id: number;
  image_front?: string;
  image_back?: string;
  image_wear?: string;
  variants?: Array<{
    size?: string | null;
    color?: string | null;
    quantity?: number | null;
    image_front?: string | null;
    image_back?: string | null;
    image_wear?: string | null;
  }>;
}

interface AdminProductsResponse {
  data?: AdminProductApiItem[];
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}

@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class ProductsComponent implements OnInit {
  private apiBase = environment.apiBaseUrl;

  loading = false;
  isSaving = false;
  isDeleting = false;
  errorMessage = '';
  searchKeyword = '';
  selectedCategoryId: number | null = null;
  page = 1;
  limit = 10;
  total = 0;
  totalPages = 1;
  hasNextPage = false;
  hasPrevPage = false;
  private searchTimer?: ReturnType<typeof setTimeout>;

  categories: Category[] = [];
  products: Product[] = [];

  isProductPopupOpen = false;
  editingProductId = '';
  productFormError = '';
  productForm: ProductForm = this.getEmptyProductForm();

  constructor(
    private http: HttpClient,
    private categoryService: CategoryService,
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.loadProducts();
  }

  formatPrice(price: number) {
    return `${price.toLocaleString('en-US')} ฿`;
  }

  onSearchInput() {
    if (this.searchTimer) clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      this.page = 1;
      this.loadProducts();
    }, 350);
  }

  selectCategory(categoryId: number | null) {
    this.selectedCategoryId = categoryId;
    this.page = 1;
    this.loadProducts();
  }

  goPrevPage() {
    if (!this.hasPrevPage || this.loading) return;
    this.page -= 1;
    this.loadProducts();
  }

  goNextPage() {
    if (!this.hasNextPage || this.loading) return;
    this.page += 1;
    this.loadProducts();
  }

  private loadCategories() {
    this.categoryService.getAll().subscribe({
      next: (rows) => {
        this.categories = rows;
      },
      error: () => {
        this.categories = [];
      },
    });
  }

  private loadProducts() {
    this.loading = true;
    this.errorMessage = '';

    let params = new HttpParams()
      .set('page', String(this.page))
      .set('limit', String(this.limit));

    if (this.searchKeyword.trim()) {
      params = params.set('name', this.searchKeyword.trim());
    }
    if (this.selectedCategoryId) {
      params = params.set('category_id', String(this.selectedCategoryId));
    }

    this.http
      .get<AdminProductsResponse | AdminProductApiItem[]>(
        `${this.apiBase}/admin/products`,
        { params },
      )
      .subscribe({
        next: (res) => {
          const rows = Array.isArray(res) ? res : (res.data ?? []);
          this.products = rows.map((row) => this.mapApiProduct(row));
          if (Array.isArray(res)) {
            this.total = rows.length;
            this.totalPages = 1;
            this.hasPrevPage = false;
            this.hasNextPage = false;
          } else {
            this.page = res.page ?? this.page;
            this.limit = res.limit ?? this.limit;
            this.total = res.total ?? rows.length;
            this.totalPages = res.totalPages ?? 1;
            this.hasPrevPage = res.hasPrevPage ?? this.page > 1;
            this.hasNextPage = res.hasNextPage ?? this.page < this.totalPages;
          }
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.products = [];
          this.total = 0;
          this.totalPages = 1;
          this.hasNextPage = false;
          this.hasPrevPage = false;
          this.errorMessage = 'โหลดข้อมูลสินค้าไม่สำเร็จ';
        },
      });
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
      categoryId: product.categoryId,
      image: product.image,
      imageFrontName: product.imageFront,
      imageBackName: product.imageBack,
      imageWearName: product.imageWear,
      imageFrontFile: null,
      imageBackFile: null,
      imageWearFile: null,
      imageFrontUrl: product.imageFront,
      imageBackUrl: product.imageBack,
      imageWearUrl: product.imageWear,
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

  deleteProduct(product: Product) {
    if (!product.id || this.isDeleting) return;
    this.isDeleting = true;
    this.http.delete(`${this.apiBase}/admin/products/${product.id}`).subscribe({
      next: () => {
        this.isDeleting = false;
        this.loadProducts();
      },
      error: () => {
        this.isDeleting = false;
        this.errorMessage = 'ลบสินค้าไม่สำเร็จ';
      },
    });
  }

  addVariant() {
    this.productForm.variants.push({ size: '', color: '', quantity: 1 });
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
      this.productForm.imageFrontFile = file;
    }
    if (type === 'back') {
      this.productForm.imageBackName = file.name;
      this.productForm.imageBackFile = file;
      this.productForm.imageBackUrl = URL.createObjectURL(file);
    }
    if (type === 'wear') {
      this.productForm.imageWearName = file.name;
      this.productForm.imageWearFile = file;
      this.productForm.imageWearUrl = URL.createObjectURL(file);
    }
  }

  getImagePreview(type: 'front' | 'back' | 'wear') {
    if (type === 'front') {
      return this.productForm.imageFrontFile
        ? this.productForm.image
        : this.productForm.imageFrontUrl;
    }
    if (type === 'back') {
      return this.productForm.imageBackUrl;
    }
    return this.productForm.imageWearUrl;
  }

  async saveProduct() {
    this.productFormError = '';

    if (
      !this.productForm.name.trim() ||
      this.productForm.price <= 0 ||
      !this.productForm.categoryId
    ) {
      this.productFormError = 'กรุณากรอกชื่อ ราคา และหมวดหมู่ให้ครบ';
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

    if (this.editingProductId) {
      const target = this.products.find(
        (product) => product.productId === this.editingProductId,
      );
      if (!target?.id) {
        this.productFormError = 'ไม่พบรหัสสินค้าสำหรับแก้ไข';
        return;
      }

      try {
        const adminId = Number(localStorage.getItem('member_id') || '0');
        const formData = new FormData();
        formData.append('name', this.productForm.name.trim());
        formData.append('description', this.productForm.description.trim());
        formData.append('price', String(this.productForm.price));
        formData.append('category_id', String(this.productForm.categoryId));
        if (adminId) {
          formData.append('admin_id', String(adminId));
        }
        formData.append('variants', JSON.stringify(this.productForm.variants));

        await this.appendImageField(
          formData,
          'image_front',
          this.productForm.imageFrontFile,
          this.productForm.imageFrontUrl,
          'front.jpg',
        );
        await this.appendImageField(
          formData,
          'image_back',
          this.productForm.imageBackFile,
          this.productForm.imageBackUrl,
          'back.jpg',
        );
        await this.appendImageField(
          formData,
          'image_wear',
          this.productForm.imageWearFile,
          this.productForm.imageWearUrl,
          'wear.jpg',
        );

        this.isSaving = true;
        this.http
          .put<{ data?: AdminProductApiItem }>(
            `${this.apiBase}/admin/products/${target.id}`,
            formData,
          )
          .subscribe({
            next: () => {
              this.isSaving = false;
              this.closeProductPopup();
              this.loadProducts();
            },
            error: (err) => {
              this.isSaving = false;
              this.productFormError =
                err?.error?.error || 'แก้ไขสินค้าไม่สำเร็จ';
            },
          });
      } catch {
        this.productFormError = 'ไม่สามารถเตรียมไฟล์รูปเดิมสำหรับบันทึกได้';
      }
      return;
    }

    if (
      !this.productForm.imageFrontFile ||
      !this.productForm.imageBackFile ||
      !this.productForm.imageWearFile
    ) {
      this.productFormError = 'กรุณาเลือกรูปสินค้าให้ครบทั้ง 3 มุม';
      return;
    }

    const adminId = Number(localStorage.getItem('member_id') || '0');
    const formData = new FormData();
    formData.append('name', this.productForm.name.trim());
    formData.append('description', this.productForm.description.trim());
    formData.append('price', String(this.productForm.price));
    formData.append('category_id', String(this.productForm.categoryId));
    if (adminId) {
      formData.append('admin_id', String(adminId));
    }
    formData.append('variants', JSON.stringify(this.productForm.variants));
    formData.append('image_front', this.productForm.imageFrontFile);
    formData.append('image_back', this.productForm.imageBackFile);
    formData.append('image_wear', this.productForm.imageWearFile);

    this.isSaving = true;
    this.http.post<{ data: AdminProductApiItem }>(`${this.apiBase}/admin/products`, formData).subscribe({
      next: (res) => {
        this.isSaving = false;
        this.closeProductPopup();
        if (res?.data) {
          const mapped = this.mapApiProduct(res.data);
          this.products = [mapped, ...this.products];
        } else {
          this.loadProducts();
        }
      },
      error: (err) => {
        this.isSaving = false;
        this.productFormError = err?.error?.error || 'เพิ่มสินค้าไม่สำเร็จ';
      },
    });
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
      categoryId: null,
      image: '',
      imageFrontName: '',
      imageBackName: '',
      imageWearName: '',
      imageFrontFile: null,
      imageBackFile: null,
      imageWearFile: null,
      imageFrontUrl: '',
      imageBackUrl: '',
      imageWearUrl: '',
      variants: [{ size: '', color: '', quantity: 1 }],
    };
  }

  private async appendImageField(
    formData: FormData,
    key: 'image_front' | 'image_back' | 'image_wear',
    newFile: File | null,
    fallbackUrl: string,
    fallbackName: string,
  ) {
    if (newFile) {
      formData.append(key, newFile);
      return;
    }
    if (!fallbackUrl) {
      return;
    }
    const res = await fetch(fallbackUrl);
    const blob = await res.blob();
    const file = new File([blob], fallbackName, {
      type: blob.type || 'image/jpeg',
    });
    formData.append(key, file);
  }

  private mapApiProduct(row: AdminProductApiItem): Product {
    const categoryName =
      this.categories.find((cat) => cat.category_id === row.category_id)?.name ||
      `หมวด ${row.category_id}`;

    const image =
      row.image_front ||
      row.variants?.find((v) => !!v.image_front)?.image_front ||
      'assets/clothing/w3.jpg';
    const imageFront =
      row.image_front ||
      row.variants?.find((v) => !!v.image_front)?.image_front ||
      image;
    const imageBack =
      row.image_back ||
      row.variants?.find((v) => !!v.image_back)?.image_back ||
      imageFront;
    const imageWear =
      row.image_wear ||
      row.variants?.find((v) => !!v.image_wear)?.image_wear ||
      imageFront;

    return {
      id: row.product_id,
      productId: `P-${String(row.product_id).padStart(3, '0')}`,
      image,
      imageFront: imageFront || image,
      imageBack: imageBack || image,
      imageWear: imageWear || image,
      name: row.name,
      price: Number(row.price ?? 0),
      description: row.description || '-',
      category: categoryName,
      categoryId: row.category_id,
      variants: (row.variants || []).map((variant) => ({
        size: variant.size || '-',
        color: variant.color || '-',
        quantity: Number(variant.quantity ?? 0),
      })),
    };
  }
}
