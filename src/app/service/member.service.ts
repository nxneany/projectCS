import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
  private apiUrl = 'http://localhost:3000/api/members'; // URL backend

  constructor(private http: HttpClient) {}

  // ✅ ดึงข้อมูลสมาชิกตาม id
  getMemberById(id: number): Observable<Member> {
    return this.http.get<Member>(`${this.apiUrl}/${id}`);
  }

  // ✅ เพิ่มเมธอดนี้
  updateMemberFormData(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, formData);
  }
}
