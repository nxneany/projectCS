import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';

interface PaymentSlipStatus {
  slipFileName: string;
  transferTime: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface RentalOrder {
  orderNo: string;
  productNames: string[];
  depositAmount: number;
  rentalStart: string;
  rentalEnd: string;
  paymentSlip: PaymentSlipStatus;
}

@Component({
  selector: 'app-order-status',
  imports: [CommonModule, Header, Footer],
  templateUrl: './order-status.html',
  styleUrl: './order-status.scss'
})
export class OrderStatusComponent {
  paymentSlip: PaymentSlipStatus = this.loadPaymentSlip();
  expandedOrderNo = 'DMU-20260511-0001';

  orders: RentalOrder[] = [
    {
      orderNo: 'DMU-20260511-0001',
      productNames: ['Gucci GG4287/S', 'ชุดราตรีสีแดง'],
      depositAmount: 1990,
      rentalStart: '2026-05-12',
      rentalEnd: '2026-05-15',
      paymentSlip: this.paymentSlip
    },
    {
      orderNo: 'DMU-20260511-0002',
      productNames: ['ชุดเจ้าหญิงเบล'],
      depositAmount: 700,
      rentalStart: '2026-05-18',
      rentalEnd: '2026-05-20',
      paymentSlip: {
        slipFileName: 'belle-slip.png',
        transferTime: '14:25',
        status: 'approved'
      }
    },
    {
      orderNo: 'DMU-20260511-0003',
      productNames: ['ชุดแฟนซีฟ้า', 'มงกุฎเจ้าหญิง', 'รองเท้าส้นสูงสีเงิน'],
      depositAmount: 550,
      rentalStart: '2026-05-22',
      rentalEnd: '2026-05-24',
      paymentSlip: {
        slipFileName: 'blue-fancy-slip.jpg',
        transferTime: '09:10',
        status: 'pending'
      }
    }
  ];

  toggleOrder(orderNo: string) {
    this.expandedOrderNo = this.expandedOrderNo === orderNo ? '' : orderNo;
  }

  isExpanded(orderNo: string) {
    return this.expandedOrderNo === orderNo;
  }

  statusLabel(order: RentalOrder) {
    if (order.paymentSlip.status === 'approved') return 'ตรวจสอบสลิปแล้ว';
    if (order.paymentSlip.status === 'rejected') return 'สลิปไม่ถูกต้อง';
    return 'รอตรวจสอบสลิป';
  }

  statusDetail(order: RentalOrder) {
    if (order.paymentSlip.status === 'approved') return 'พนักงานตรวจสอบเรียบร้อยแล้ว สามารถรอรับชุดตามวันที่จองได้';
    if (order.paymentSlip.status === 'rejected') return 'กรุณาแนบสลิปใหม่ หรือติดต่อพนักงานเพื่อแก้ไขข้อมูล';
    return 'ส่งสลิปสำเร็จแล้ว กรุณารอพนักงานตรวจสอบและอัปเดตสถานะรายการ';
  }

  statusIcon(order: RentalOrder) {
    if (order.paymentSlip.status === 'approved') return 'verified';
    if (order.paymentSlip.status === 'rejected') return 'error';
    return 'schedule';
  }

  formatPrice(price: number) {
    return `${price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })} ฿`;
  }

  private loadPaymentSlip(): PaymentSlipStatus {
    const savedSlip = localStorage.getItem('latestPaymentSlip');

    if (!savedSlip) {
      return {
        slipFileName: 'ยังไม่มีข้อมูลสลิป',
        transferTime: '-',
        status: 'pending'
      };
    }

    try {
      return JSON.parse(savedSlip) as PaymentSlipStatus;
    } catch {
      return {
        slipFileName: 'ยังไม่มีข้อมูลสลิป',
        transferTime: '-',
        status: 'pending'
      };
    }
  }
}
