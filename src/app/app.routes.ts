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

export const routes: Routes = [
    { path: '', component: Main },
    { path: 'about', component: Footer },
    { path: 'clothing', component: Clothing },
    { path: 'accessories', component: Accessories },
    { path: 'clothing-m', component: ClothingM, canActivate: [AuthGuard] },
    { path: 'accessories-m', component: AccessoriesM, canActivate: [AuthGuard] },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'edit-profile', component: EditProfile },
    { path: 'profile-member', component: ProfileMember },
];
