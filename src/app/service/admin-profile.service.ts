import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

export type BackofficeProfileRole = 'admin' | 'staff';

export interface UserProfileResponse {
  id?: number;
  admin_id?: number;
  staff_id?: number;
  username?: string;
  full_name?: string;
  name?: string;
  email?: string;
  phone?: string;
  image_profile?: string;
  address?: string;
  role?: string;
}

@Injectable({ providedIn: 'root' })
export class AdminProfileService {
  private apiBase = environment.apiBaseUrl;
  private uploadsBase = environment.uploadsBaseUrl;

  constructor(private http: HttpClient) {}

  getProfile(id: number, role: BackofficeProfileRole) {
    const params = new HttpParams().set('role', role);
    return this.http.get<UserProfileResponse>(`${this.apiBase}/users/profile/${id}`, { params });
  }

  updateProfile(
    id: number,
    role: BackofficeProfileRole,
    formData: FormData,
  ) {
    const params = new HttpParams().set('role', role);
    return this.http.put<{ message: string; user?: UserProfileResponse }>(
      `${this.apiBase}/users/profile/${id}`,
      formData,
      { params },
    );
  }

  getImageUrl(fileName?: string) {
    if (!fileName) {
      return 'assets/logob.png';
    }
    if (fileName.startsWith('http://') || fileName.startsWith('https://')) {
      return fileName;
    }
    return `${this.uploadsBase}/${fileName}`;
  }
}
