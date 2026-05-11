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

export const routes: Routes = [
    { path: '', component: Main },
    { path: 'about', component: Footer },
    { path: 'clothing', component: Clothing },
    { path: 'accessories', component: Accessories },
    { path: 'products', component: CategoryProductsComponent },
    { path: 'clothing-m/:id', component: ClothingRentalComponent, canActivate: [AuthGuard] },
    { path: 'clothing-m', component: ClothingM, canActivate: [AuthGuard] },
    { path: 'accessories-m/:id', component: AccessoryRentalComponent, canActivate: [AuthGuard] },
    { path: 'accessories-m', component: AccessoriesM, canActivate: [AuthGuard] },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'edit-profile', component: EditProfile },
    { path: 'profile-member', component: ProfileMember },
    { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
    { path: 'payment', component: PaymentComponent, canActivate: [AuthGuard] },
    { path: 'qr-payment', component: QrPaymentComponent, canActivate: [AuthGuard] },
    { path: 'order-status', component: OrderStatusComponent, canActivate: [AuthGuard] },
    { path: 'usage-guide', component: UsageGuideComponent },
];
