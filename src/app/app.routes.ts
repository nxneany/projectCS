import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AccessoriesM } from './pages/accessories-m/accessories-m';
import { Accessories } from './pages/accessories/accessories';
import { ClothingM } from './pages/clothing-m/clothing-m';
import { Clothing } from './pages/clothing/clothing';
import { EditProfile } from './pages/edit-profile/edit-profile';
import { Footer } from './pages/footer/footer';
import { Login } from './pages/login/login';
import { Main } from './pages/main/main';
import { ProfileMember } from './pages/profile-member/profile-member';
import { Register } from './pages/register/register';
import { CartComponent } from './pages/cart/cart';
import { PaymentComponent } from './pages/payment/payment';
import { QrPaymentComponent } from './pages/qr-payment/qr-payment';
import { OrderStatusComponent } from './pages/order-status/order-status';
import { UsageGuideComponent } from './pages/usage-guide/usage-guide';
import { ClothingRentalComponent } from './pages/clothing-rental/clothing-rental';
import { AccessoryRentalComponent } from './pages/accessory-rental/accessory-rental';
import { CategoryProductsComponent } from './pages/category-products/category-products';
import { SearchResultsComponent } from './pages/search-results/search-results';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard';


import { OverviewComponent } from './pages/admin/overview/overview';

import { ProfileComponent } from './pages/admin/profile/profile';

import { EmployeesComponent } from './pages/admin/employees/employees';

import { ProductsComponent } from './pages/admin/products/products';

import { PaymentChannelComponent } from './pages/admin/payment-channel/payment-channel';

import { MembersComponent } from './pages/admin/members/members';

import { WalkinBillComponent } from './pages/admin/walkin-bill/walkin-bill';

import { PaymentReviewComponent } from './pages/admin/payment-review/payment-review';

import { CustomerIdComponent } from './pages/admin/customer-id/customer-id';

import { OrdersComponent } from './pages/admin/orders/orders';

import { ReportsComponent } from './pages/admin/reports/reports';

export const routes: Routes = [
  { path: '', component: Main },
  { path: 'about', component: Footer },
  { path: 'clothing', component: Clothing },
  { path: 'accessories', component: Accessories },
  { path: 'products', component: CategoryProductsComponent },
  { path: 'search', component: SearchResultsComponent },
  {
    path: 'clothing-m/:id',
    component: ClothingRentalComponent,
    canActivate: [AuthGuard],
  },
  { path: 'clothing-m', component: ClothingM, canActivate: [AuthGuard] },
  {
    path: 'accessories-m/:id',
    component: AccessoryRentalComponent,
    canActivate: [AuthGuard],
  },
  { path: 'accessories-m', component: AccessoriesM, canActivate: [AuthGuard] },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'edit-profile', component: EditProfile },
  { path: 'profile-member', component: ProfileMember },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  { path: 'payment', component: PaymentComponent, canActivate: [AuthGuard] },
  {
    path: 'qr-payment',
    component: QrPaymentComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'order-status',
    component: OrderStatusComponent,
    canActivate: [AuthGuard],
  },
  { path: 'usage-guide', component: UsageGuideComponent },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: OverviewComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'employees', component: EmployeesComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'payment-channel', component: PaymentChannelComponent },
      { path: 'members', component: MembersComponent },
      { path: 'walkin-bill', component: WalkinBillComponent },
      { path: 'payment-review', component: PaymentReviewComponent },
      { path: 'customer-id', component: CustomerIdComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'reports', component: ReportsComponent },
    ],
  },
  { path: 'backoffice', redirectTo: 'admin/overview', pathMatch: 'full' },
];
