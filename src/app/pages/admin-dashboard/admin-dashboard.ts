import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AdminLoadingService } from '../../service/admin-loading.service';
import { AuthService } from '../../service/auth.service';

type BackofficeRole = 'admin' | 'employee';

interface BackofficeMenu {
  id: string;
  label: string;
  icon: string;
  path: string;
  adminOnly?: boolean;
}

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  role: BackofficeRole = this.resolveRole();

  menus: BackofficeMenu[] = [
    { id: 'overview', label: 'แดชบอร์ด', icon: 'dashboard', path: '/admin/overview' },
    { id: 'profile', label: 'ข้อมูลส่วนตัว', icon: 'account_circle', path: '/admin/profile' },
    { id: 'employees', label: 'พนักงานร้าน', icon: 'badge', path: '/admin/employees', adminOnly: true },
    { id: 'products', label: 'สินค้า', icon: 'checkroom', path: '/admin/products', adminOnly: true },
    { id: 'payment-channel', label: 'ช่องทางชำระเงิน', icon: 'qr_code_2', path: '/admin/payment-channel', adminOnly: true },
    { id: 'members', label: 'สมาชิก', icon: 'groups', path: '/admin/members', },
    { id: 'walkin-bill', label: 'ออกบิลหน้าร้าน', icon: 'receipt_long', path: '/admin/walkin-bill' },
    { id: 'payment-review', label: 'ตรวจสลิป', icon: 'fact_check', path: '/admin/payment-review' },
    { id: 'customer-id', label: 'รูปคู่บัตรประชาชน', icon: 'assignment_ind', path: '/admin/customer-id' },
    { id: 'orders', label: 'ออเดอร์ทั้งหมด', icon: 'inventory_2', path: '/admin/orders' },
    { id: 'reports', label: 'รายงาน', icon: 'monitoring', path: '/admin/reports'},
  ];

  constructor(
    private router: Router,
    private auth: AuthService,
    public adminLoading: AdminLoadingService,
  ) {}

  private readonly preventBackHandler = () => {
    if (this.router.url.startsWith('/admin')) {
      history.pushState(null, '', location.href);
      this.router.navigateByUrl('/admin/overview');
    }
  };

  ngOnInit() {
    history.pushState(null, '', location.href);
    window.addEventListener('popstate', this.preventBackHandler);
  }

  ngOnDestroy() {
    window.removeEventListener('popstate', this.preventBackHandler);
  }

  get visibleMenus() {
    return this.menus.filter((menu) => this.role === 'admin' || !menu.adminOnly);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  private resolveRole(): BackofficeRole {
    const savedRole = localStorage.getItem('user_role');
    return savedRole === 'employee' || savedRole === 'staff' ? 'employee' : 'admin';
  }
}
