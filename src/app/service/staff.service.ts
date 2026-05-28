import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface StaffResponseItem {
  id?: number;
  staff_id?: number;
  username?: string;
  email?: string;
  phone?: string;
  address?: string;
  image_profile?: string;
  url_idcard?: string;
}

export interface CreateStaffPayload {
  username: string;
  phone: string;
  email: string;
  address?: string;
  password: string;
  image?: File | null;
  url_idcard?: File | null;
}

export interface UpdateStaffPayload {
  username: string;
  phone: string;
  email: string;
  address?: string;
  password?: string;
  image?: File | null;
  url_idcard?: File | null;
}

@Injectable({ providedIn: 'root' })
export class StaffService {
  private apiBase = environment.apiBaseUrl;
  private uploadsBase = environment.uploadsBaseUrl;

  constructor(private http: HttpClient) {}

  getStaff(username: string = '') {
    let params = new HttpParams();
    if (username.trim()) {
      params = params.set('username', username.trim());
    }
    return this.http.get<StaffResponseItem[] | { data: StaffResponseItem[] }>(
      `${this.apiBase}/staff`,
      { params },
    );
  }

  createStaff(payload: CreateStaffPayload) {
    const formData = new FormData();
    formData.append('username', payload.username);
    formData.append('phone', payload.phone);
    formData.append('email', payload.email);
    formData.append('address', payload.address ?? '');
    formData.append('password', payload.password);
    if (payload.image) {
      formData.append('image', payload.image);
    }
    if (payload.url_idcard) {
      formData.append('url_idcard', payload.url_idcard);
    }
    return this.http.post(`${this.apiBase}/staff`, formData);
  }

  updateStaff(staffId: number, payload: UpdateStaffPayload) {
    const formData = new FormData();
    formData.append('username', payload.username);
    formData.append('phone', payload.phone);
    formData.append('email', payload.email);
    formData.append('address', payload.address ?? '');
    if (payload.password) {
      formData.append('password', payload.password);
    }
    if (payload.image) {
      formData.append('image', payload.image);
    }
    if (payload.url_idcard) {
      formData.append('url_idcard', payload.url_idcard);
    }
    return this.http.put(`${this.apiBase}/staff/${staffId}`, formData);
  }

  deleteStaff(staffId: number) {
    return this.http.delete(`${this.apiBase}/staff/${staffId}`);
  }

  getImageUrl(path?: string) {
    if (!path) return 'assets/profile.png';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return `${this.uploadsBase}/${path}`;
  }
}
