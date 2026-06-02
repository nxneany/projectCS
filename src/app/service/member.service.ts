import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Member {
  member_id: number;
  username: string;
  email: string;
  phone: string;
  address: string;
  image_profile?: string;
}

export interface AdminMemberListItem {
  member_id: number;
  username: string;
  phone: string | null;
  email: string;
  address: string | null;
  image_profile: string | null;
  total_orders: number;
}

export interface AdminMemberListResponse {
  items: AdminMemberListItem[];
}

export interface AdminMemberOrderItem {
  order_item_id: number;
  name: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  price_sum: number;
}

export interface AdminMemberDetailResponse {
  member: {
    member_id: number;
    username: string;
    email: string;
    phone: string | null;
    address: string | null;
    image_profile: string | null;
  };
  orders: Array<{
    order_id: number;
    total_price: number;
    day_rental: string;
    items: AdminMemberOrderItem[];
  }>;
}

export interface CreateMemberPayload {
  username: string;
  phone: string;
  email: string;
  address: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class MemberService {
  private apiUrl = `${environment.apiBaseUrl}/members`;
  private adminMemberApiUrl = `${environment.apiBaseUrl}/admin/member`;
  private adminMemberDetailApiUrl = `${environment.apiBaseUrl}/admin/members`;
  private uploadsBaseUrl = environment.uploadsBaseUrl;

  constructor(private http: HttpClient) {}

  // ✅ ดึงข้อมูลสมาชิกตาม id
  getMemberById(id: number): Observable<Member> {
    return this.http.get<Member>(`${this.apiUrl}/${id}`);
  }

  // ✅ เพิ่มเมธอดนี้
  updateMemberFormData(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, formData);
  }

  createMember(payload: CreateMemberPayload) {
    return this.http.post(`${this.apiUrl}`, payload);
  }

  getAdminMembers(search: string = '') {
    const query = search.trim() ? `?search=${encodeURIComponent(search.trim())}` : '';
    return this.http.get<AdminMemberListResponse>(`${this.adminMemberApiUrl}${query}`);
  }

  getAdminMemberDetail(id: number) {
    return this.http.get<AdminMemberDetailResponse>(`${this.adminMemberDetailApiUrl}/${id}`);
  }

  deleteAdminMember(id: number) {
    return this.http.delete(`${this.adminMemberDetailApiUrl}/${id}`);
  }

  getProfileImageUrl(imageProfile?: string) {
    if (!imageProfile) return 'assets/default-avatar.png';
    if (imageProfile.startsWith('http://') || imageProfile.startsWith('https://')) {
      return imageProfile;
    }
    return `${this.uploadsBaseUrl}/${imageProfile}`;
  }
}
