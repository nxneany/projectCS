import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-customer-id',
  imports: [CommonModule],
  templateUrl: './customer-id.html',
  styleUrl: './customer-id.scss',
})
export class CustomerIdComponent {
  pendingIdentityOrders = [
    {
      orderNo: 'ORD-20260520-001',
      customerName: 'DFN Tv',
      date: '2026-05-20',
      products: 'ชุดไทยจักรี x2',
      duration: '4 วัน',
    },
    {
      orderNo: 'ORD-20260521-004',
      customerName: 'Kanya P.',
      date: '2026-05-21',
      products: 'ชุดราตรีสีแดง x1, มงกุฎคริสตัล x1',
      duration: '8 วัน',
    },
  ];

  selectedOrder: (typeof this.pendingIdentityOrders)[number] | null = null;
  selectedFileName = '';

  openUploadPopup(order: (typeof this.pendingIdentityOrders)[number]) {
    this.selectedOrder = order;
    this.selectedFileName = '';
  }

  closeUploadPopup() {
    this.selectedOrder = null;
    this.selectedFileName = '';
  }

  onIdentityPhotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.selectedFileName = input.files[0].name;
  }

  saveIdentityPhoto() {
    if (!this.selectedOrder || !this.selectedFileName) return;

    this.pendingIdentityOrders = this.pendingIdentityOrders.filter(
      (order) => order.orderNo !== this.selectedOrder?.orderNo,
    );
    this.closeUploadPopup();
  }
}
