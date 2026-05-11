import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthUser } from './auth.service';

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

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private apiBase = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  login(payload: LoginPayload) {
    return this.http.post<{ message: string; member: AuthUser }>(`${this.apiBase}/login`, payload);
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
