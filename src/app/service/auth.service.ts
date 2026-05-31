import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

export interface AuthUser {
  member_id: number;
  username: string;
  email: string;
  role?: AuthRole;
  phone?: string;
  auth_provider?: 'password' | 'google';
}

export type AuthRole = 'member' | 'admin' | 'staff' | 'employee' | 'staf';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _isLoggedIn$ = new BehaviorSubject<boolean>(localStorage.getItem('isLoggedIn') === 'true');
  isLoggedIn$ = this._isLoggedIn$.asObservable();

  // แมปหน้า -m -> หน้า public
  private readonly toPublic: Record<string, string> = {
    '/clothing-m': '/clothing',
    '/accessories-m': '/accessories',
  };

  constructor(private router: Router) {}

  login(user: AuthUser) {
    const normalizedRole = this.normalizeRole(user.role);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('member_id', String(user.member_id));
    localStorage.setItem('username', user.username);
    localStorage.setItem('email', user.email);
    localStorage.setItem('user_role', normalizedRole);
    localStorage.setItem('auth_provider', user.auth_provider ?? 'password');
    if (user.phone) {
      localStorage.setItem('phone', user.phone);
    }
    this._isLoggedIn$.next(true);
  }

  logout() {
    // 1) เคลียร์สถานะ
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('member_id');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('phone');
    localStorage.removeItem('user_role');
    localStorage.removeItem('auth_provider');
    localStorage.removeItem('role');
    this._isLoggedIn$.next(false);

    // 2) รีไดเรกต์จากหน้า -m ไปหน้า public ที่คู่กัน (ถ้าไม่แมป ให้กลับหน้าแรก)
    const current = this.router.url.split('?')[0];
    const target = this.toPublic[current] ?? '/';
    this.router.navigateByUrl(target, { replaceUrl: true });
  }

  get isLoggedInSync(): boolean {
    return this._isLoggedIn$.value;
  }

  get roleSync(): AuthRole {
    const role = localStorage.getItem('user_role');
    if (role === 'admin' || role === 'staff' || role === 'employee' || role === 'staf') {
      return this.normalizeRole(role);
    }
    return 'member';
  }

  private normalizeRole(role?: AuthRole | string): AuthRole {
    if (role === 'employee' || role === 'staf') {
      return 'staff';
    }

    return (role as AuthRole) ?? 'member';
  }
}
