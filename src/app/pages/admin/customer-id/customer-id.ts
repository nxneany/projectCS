import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  OrderService,
  PendingCustomerVerificationItem,
} from '../../../service/order.service';

interface CustomerIdentityOrder {
  orderId: number;
  orderNo: string;
  customerName: string;
  memberId: number;
  phone: string;
  email: string;
  date: string;
  totalPrice: number;
  status: string;
}

@Component({
  selector: 'app-customer-id',
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-id.html',
  styleUrl: './customer-id.scss',
})
export class CustomerIdComponent implements OnInit {
  searchText = '';

  loading = false;

  errorMessage = '';

  private searchTimer: ReturnType<typeof setTimeout> | null = null;

  pendingIdentityOrders: CustomerIdentityOrder[] = [];

  selectedOrder: CustomerIdentityOrder | null = null;
  selectedFileName = '';
  selectedFile: File | null = null;
  uploadErrorMessage = '';
  uploading = false;

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadPendingIdentityOrders();
  }

  loadPendingIdentityOrders() {
    this.loading = true;
    this.errorMessage = '';

    this.orderService.getPendingCustomerVerifications(this.searchText).subscribe({
      next: (response) => {
        this.pendingIdentityOrders = (response.items ?? []).map((item) =>
          this.mapPendingOrder(item),
        );
        this.loading = false;
      },
      error: (error) => {
        console.error('Load pending customer verifications failed', error);
        this.errorMessage = 'ไม่สามารถโหลดรายการยืนยันตัวตนได้ กรุณาลองใหม่อีกครั้ง';
        this.pendingIdentityOrders = [];
        this.loading = false;
      },
    });
  }

  onSearchInput() {
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }

    this.searchTimer = setTimeout(() => {
      this.loadPendingIdentityOrders();
    }, 350);
  }

  openUploadPopup(order: CustomerIdentityOrder) {
    this.selectedOrder = order;
    this.selectedFileName = '';
    this.selectedFile = null;
    this.uploadErrorMessage = '';
  }

  closeUploadPopup() {
    if (this.uploading) {
      return;
    }

    this.selectedOrder = null;
    this.selectedFileName = '';
    this.selectedFile = null;
    this.uploadErrorMessage = '';
  }

  onIdentityPhotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.selectedFile = input.files[0];
    this.selectedFileName = this.selectedFile.name;
    this.uploadErrorMessage = '';
  }

  saveIdentityPhoto() {
    if (!this.selectedOrder || !this.selectedFile || this.uploading) return;

    const role = this.getBackofficeRole();
    const userId = Number(localStorage.getItem('member_id') || '0');

    if (!role || !userId) {
      this.uploadErrorMessage = 'ไม่พบข้อมูลผู้ใช้งาน กรุณาเข้าสู่ระบบใหม่';
      return;
    }

    this.uploading = true;
    this.uploadErrorMessage = '';

    this.orderService
      .createCustomerVerification({
        order_id: this.selectedOrder.orderId,
        role,
        user_id: userId,
        image_idcard: this.selectedFile,
      })
      .subscribe({
        next: () => {
          this.uploading = false;
          this.selectedOrder = null;
          this.selectedFileName = '';
          this.selectedFile = null;
          this.uploadErrorMessage = '';
          this.loadPendingIdentityOrders();
        },
        error: (error) => {
          console.error('Create customer verification failed', error);
          this.uploading = false;
          this.uploadErrorMessage = 'บันทึกรูปไม่สำเร็จ กรุณาลองใหม่อีกครั้ง';
        },
      });
  }

  formatPrice(price: number) {
    return `${price.toLocaleString('en-US')} ฿`;
  }

  private formatDate(dateValue: string) {
    if (!dateValue) {
      return '-';
    }

    return new Intl.DateTimeFormat('th-TH', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(dateValue));
  }

  private mapPendingOrder(item: PendingCustomerVerificationItem): CustomerIdentityOrder {
    return {
      orderId: item.order_id,
      orderNo: `ORD-${item.order_id}`,
      customerName: item.username || `สมาชิก #${item.member_id}`,
      memberId: item.member_id,
      phone: item.phone || '-',
      email: item.email || '-',
      date: this.formatDate(item.day_rental),
      totalPrice: Number(item.total_price) || 0,
      status: this.getStatusLabel(item.status),
    };
  }

  private getStatusLabel(status: string | null) {
    switch (status) {
      case '2':
        return 'รอเพิ่มรูปยืนยันตัวตน';
      default:
        return 'รอดำเนินการ';
    }
  }

  private getBackofficeRole(): 'admin' | 'staff' | null {
    const role = localStorage.getItem('user_role');

    if (role === 'admin') {
      return 'admin';
    }

    if (role === 'staff' || role === 'employee') {
      return 'staff';
    }

    return null;
  }
}
