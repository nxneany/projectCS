import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthRole, AuthUser } from './auth.service';

export interface RegisterPayload {
  username: string;
  phone: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginApiUser {
  role?: AuthRole;
  id?: number;
  member_id?: number;
  staff_id?: number;
  admin_id?: number;
  username: string;
  email: string;
  phone?: string;
  image_profile?: string;
  address?: string;
  url_idcard?: string;
}

export interface LoginResponse {
  message: string;
  role: AuthRole;
  user?: LoginApiUser;
  member?: LoginApiUser;
}

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private apiBase = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  login(payload: LoginPayload) {
    return this.http.post<LoginResponse>(`${this.apiBase}/login`, payload);
  }

  register(payload: RegisterPayload) {
    return this.http.post<{ message: string; member_id: number }>(`${this.apiBase}/register`, payload);
  }

  loginWithGoogleIdToken(idToken: string) {
    return this.http.post<{ member: AuthUser }>(`${this.apiBase}/google-login`, { idToken });
  }

  loginWithGoogleCode(code: string) {
    return this.http.post<{ member: AuthUser }>(`${this.apiBase}/google-login-code`, { code });
  }
}
