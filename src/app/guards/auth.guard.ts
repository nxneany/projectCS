import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private readonly toPublic: Record<string, string> = {
    '/clothing-m': '/clothing',
    '/accessories-m': '/accessories',
  };

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(_: any, state: { url: string; }): boolean | UrlTree {
    if (this.auth.isLoggedInSync) return true;
    const path = state.url.split('?')[0];
    return this.router.parseUrl(this.toPublic[path] ?? '/');
  }
}
