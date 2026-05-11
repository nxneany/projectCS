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

@Injectable({ providedIn: 'root' })
export class MemberService {
  private apiUrl = `${environment.apiBaseUrl}/members`;
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

  getProfileImageUrl(imageProfile?: string) {
    return imageProfile ? `${this.uploadsBaseUrl}/${imageProfile}` : 'assets/default-avatar.png';
  }
}
