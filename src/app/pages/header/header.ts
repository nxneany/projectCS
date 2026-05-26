// src/app/pages/header/header.ts  (ตามที่คุณส่งมา)
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../service/auth.service'; // ✅ path นี้ให้ตรงจริง
import { Categories } from '../categories/categories';
import { Login } from '../login/login';
import { ProfileMember } from '../profile-member/profile-member';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, MatToolbarModule, MatButtonModule, MatIconModule, RouterLink,MatDialogModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class Header {
  isLoggedIn$!: Observable<boolean>;
  isMenuOpen = false;
  searchKeyword = '';

  constructor(
    private dialog: MatDialog,
    private auth: AuthService,
    private router: Router
  ) {
    this.isLoggedIn$ = this.auth.isLoggedIn$;
  }

  openLoginDialog() { this.dialog.open(Login); }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  toggleMenu() { this.isMenuOpen = !this.isMenuOpen; }

  searchProducts() {
    const name = this.searchKeyword.trim();
    if (!name) return;

    this.isMenuOpen = false;
    this.router.navigate(['/search'], {
      queryParams: {
        name,
        page: 1,
        limit: 9
      }
    });
  }

  // ⬇️ เพิ่มเมธอดนี้เท่านั้น
  openCategories() {
    this.isMenuOpen = false; // ปิดเมนูมือถือถ้าเปิดอยู่
    this.dialog.open(Categories, {
      width: '360px',
      height: '100vh',
      maxWidth: '95vw',
      position: { right: '0', top: '0' },
      backdropClass: 'blur-backdrop', // ใช้ของเดิม
      panelClass: 'profile-panel'     // reuse สไตล์เดิมให้ชิดขวา เต็มสูง
    });
  }

  scrollToFooter() {
    const footerElement = document.getElementById('about');
    if (footerElement) footerElement.scrollIntoView({ behavior: 'smooth' });
  }

  openProfile() {
    const username = localStorage.getItem('username') || '';
    const email = localStorage.getItem('email') || '';
    const phone = localStorage.getItem('phone') || '';

    this.dialog.open(ProfileMember, {
      width: '380px',
      height: '100vh',
      maxWidth: '95vw',
      position: { right: '0', top: '0' },
      backdropClass: 'blur-backdrop',
      panelClass: 'profile-panel',
      data: { username, email, phone }
    }).afterClosed().subscribe((result) => {
      if (result === 'logged-out') {
        // ออกจากระบบจากใน dialog แล้ว — header จะรีแอคทีฟเอง
      }
    });
  }
}
