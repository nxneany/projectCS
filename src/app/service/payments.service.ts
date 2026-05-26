import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

export interface Deposit {
    deposit: number;
}

export interface PaymentChannel {
  channel_id: number;
  name_account: string;
  account_number: string;
  promptpay: string;
  qr_code: string;
  admin_id_fk: number;
}


@Injectable({ providedIn: 'root' })
export class PaymentsService {
  private apiBase = environment.apiBaseUrl;

    constructor(private http: HttpClient) { }
    
    //ดึงเงินที่ต้องจ่ายมาโชว์หน้า Qr
    getMoney(id:number) {
        return this.http.get<Deposit>(`${this.apiBase}/cart/${id}/deposit`);
    }

    // ดึงช่องทางการชำระเงิน
    getPaymentChannel() {
        return this.http.get<PaymentChannel>(`${this.apiBase}/payment-channel`);
    }
}
