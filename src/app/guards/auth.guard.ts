import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, UrlTree } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {
  private readonly toPublic: Record<string, string> = {
    '/clothing-m': '/clothing',
    '/accessories-m': '/accessories',
  };
  private readonly adminOnlyPaths = new Set([
    '/admin/employees',
    '/admin/products',
    '/admin/payment-channel',
  ]);

  constructor(private router: Router) {}

  canActivate(_: any, state: { url: string; }): boolean | UrlTree {
    const path = state.url.split('?')[0];
    const role = localStorage.getItem('user_role');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (!isLoggedIn || !role) {
      return this.router.parseUrl(this.toPublic[path] ?? '/');
    }

    if (path.startsWith('/admin')) {
      if (role !== 'admin' && role !== 'staff' && role !== 'employee') {
        return this.router.parseUrl('/');
      }
      if (role !== 'admin' && this.adminOnlyPaths.has(path)) {
        return this.router.parseUrl('/admin/overview');
      }
    }

    return true;
  }

  canActivateChild(_: any, state: { url: string }): boolean | UrlTree {
    return this.canActivate(_, state);
  }
}
