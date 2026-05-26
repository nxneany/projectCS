import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './overview.html',
  styleUrl: './overview.scss',
})
export class OverviewComponent {
  stats = [
    { label: 'ออเดอร์ทั้งหมด', value: '128', icon: 'inventory_2' },
    { label: 'รอตรวจสลิป', value: '9', icon: 'schedule' },
    { label: 'รายได้เดือนนี้', value: '84,500 ฿', icon: 'payments' },
    { label: 'สินค้าถูกเช่า', value: '312', icon: 'local_mall' },
  ];

  orders = [
    {
      orderNo: 'ORD-20260520-001',
      customerId: 'M-013',
      customerName: 'DFN Tv',
      date: '2026-05-20',
      products: 'ชุดไทยจักรี x2',
      total: 2400,
      deposit: 1200,
      duration: '4 วัน',
      status: 'รอตรวจสลิป',
      identityPhoto: 'assets/profile.png',
      items: [
        {
          productId: 'P-002',
          name: 'ชุดไทยจักรี',
          detail: 'ชุดไทยจักรีผ้าไหมทอง สีทอง ไซส์ S',
          quantity: 2,
          price: 1200,
          total: 2400,
        },
      ],
    },
    {
      orderNo: 'ORD-20260518-003',
      customerId: 'M-014',
      customerName: 'Ananya S.',
      date: '2026-05-18',
      products: 'มงกุฎคริสตัลราชินี x1',
      total: 1350,
      deposit: 675,
      duration: '4 วัน',
      status: 'ยืนยันแล้ว',
      identityPhoto: 'assets/profile.png',
      items: [
        {
          productId: 'P-005',
          name: 'มงกุฎคริสตัลราชินี',
          detail: 'เครื่องประดับ สีเงิน ไซส์ 36',
          quantity: 1,
          price: 1350,
          total: 1350,
        },
      ],
    },
  ];
}
