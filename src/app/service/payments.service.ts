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

export interface UpdatePaymentChannelPayload {
  name_account: string;
  account_number: string;
  promptpay: string;
  admin_id_fk: number;
  qr_code?: File | null;
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

    updatePaymentChannel(payload: UpdatePaymentChannelPayload) {
        const formData = new FormData();
        formData.append('name_account', payload.name_account);
        formData.append('account_number', payload.account_number);
        formData.append('promptpay', payload.promptpay);
        formData.append('admin_id_fk', String(payload.admin_id_fk));
        if (payload.qr_code) {
            formData.append('qr_code', payload.qr_code);
        }
        return this.http.put<PaymentChannel>(`${this.apiBase}/payment-channel`, formData);
    }
}
