import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core'; // ← ADD AfterViewInit
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from "@angular/material/icon";
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthApiService, LoginResponse } from '../../service/auth-api.service';
import { AuthRole, AuthService } from '../../service/auth.service';


declare const google: any; // ← ADD: ใช้ตัวแปร global จาก GIS

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login implements AfterViewInit {   // ← ADD: implements
  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  private googleClientId = environment.googleClientId;
  private static gisInitialized = false; // ✅ ป้องกัน init ซ้ำ
  private readonly mockEmail = 'test@test.com';
  private readonly mockPassword = '123456';

  constructor(
    private dialogRef: MatDialogRef<Login>,
    private router: Router,
    private authApi: AuthApiService,
    private auth: AuthService
  ) {}

  private redirectByRole(role: AuthRole) {
    if (role === 'admin' || role === 'staff' || role === 'employee' || role === 'staf') {
      this.router.navigate(['/admin/overview']);
      return;
    }
    this.router.navigate(['/']);
  }

  private applyLoginResponse(res: LoginResponse) {
    const raw = res.user ?? res.member;
    if (!raw) {
      this.errorMessage = 'ข้อมูลผู้ใช้ไม่ถูกต้อง';
      this.isLoading = false;
      return;
    }

    const role = (res.role ?? raw.role ?? 'member') as AuthRole;
    const normalizedRole = role === 'employee' || role === 'staf' ? 'staff' : role;
    const fallbackId = raw.id ?? raw.member_id ?? raw.staff_id ?? raw.admin_id ?? 0;
    const memberId = raw.member_id ?? fallbackId;

    this.auth.login({
      member_id: memberId,
      username: raw.username,
      email: raw.email,
      role: normalizedRole,
      phone: raw.phone,
      auth_provider: 'password',
    });

    this.isLoading = false;
    this.dialogRef.close();
    this.redirectByRole(normalizedRole);
  }

  private exchangeCodeWithBackend(code: string) {
  this.isLoading = true;
  this.errorMessage = '';

  this.authApi.loginWithGoogleCode(code).subscribe({
    next: (res) => {
      this.auth.login({ ...res.member, auth_provider: 'google' });
      this.isLoading = false;
      this.dialogRef.close();
      this.router.navigate(['/']);
    },
    error: (err) => {
      this.isLoading = false;
      this.errorMessage = err?.error?.error || 'เข้าสู่ระบบด้วย Google ไม่สำเร็จ';
    }
  });
}


  // ====== (ADD) เตรียม Google Identity ======
  ngAfterViewInit(): void {
    const boot = () => {
      const g = (window as any).google;
      if (g?.accounts?.id) {
        if (!Login.gisInitialized) {
          g.accounts.id.initialize({
            client_id: this.googleClientId,
            callback: (resp: any) => this.handleGoogleCredential(resp),
            auto_select: false,
            cancel_on_tap_outside: true,
            itp_support: true
          });
          Login.gisInitialized = true;
        }
        // เรนเดอร์ปุ่ม Google มาตรฐานไว้เป็น fallback
        const el = document.getElementById('gsi-btn');
        if (el && el.childElementCount === 0) {
          g.accounts.id.renderButton(el, { theme: 'outline', size: 'large', shape: 'pill', text: 'continue_with' });
        }
      } else {
        setTimeout(boot, 200);
      }
    };
    boot();
  }

  ngOnDestroy(): void {
    const g = (window as any).google;
    try { g?.accounts?.id?.cancel(); } catch {}
  }

  // ปุ่ม Google (One-Tap / FedCM)
  loginWithGoogle() {
  const g = (window as any).google;
  if (!g?.accounts?.oauth2) {
    this.errorMessage = 'Google SDK ยังโหลดไม่เสร็จ ลองใหม่อีกครั้ง';
    return;
  }

  const codeClient = g.accounts.oauth2.initCodeClient({
    client_id: this.googleClientId,
    scope: 'openid email profile',
    ux_mode: 'popup',
    callback: ({ code }: any) => this.exchangeCodeWithBackend(code)  // ⬅️ ส่ง code ไป backend
  });

  codeClient.requestCode();  // ⬅️ เปิด popup ให้ผู้ใช้เลือกบัญชี Google
}


  // ได้ credential (id_token) → ส่งให้ backend ตรวจ
  private handleGoogleCredential(response: any) {
    const idToken = response?.credential;
    if (!idToken) return;

    this.isLoading = true; this.errorMessage = '';
    this.authApi.loginWithGoogleIdToken(idToken).subscribe({
      next: (res) => {
        this.auth.login({ ...res.member, auth_provider: 'google' });
        this.isLoading = false;
        this.dialogRef.close();
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.error || 'เข้าสู่ระบบด้วย Google ไม่สำเร็จ';
      }
    });
  }
  private async sha256(text: string): Promise<string> {
    const data = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private getBackendErrorMessage(err: any) {
    if (typeof err?.error === 'string') {
      return err.error;
    }

    return (
      err?.error?.error ||
      err?.error?.message ||
      err?.message ||
      'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
    );
  }

  private showLoginError(message: string) {
    this.errorMessage = message;
  }

  // ====== (ไม่แก้) อีเมล/รหัสผ่านแบบเดิม ======
  closeDialog() { this.dialogRef.close(); }

  async login() {
    this.errorMessage = '';
    this.isLoading = true;

    try {
      if (this.email.trim().toLowerCase() === this.mockEmail && this.password === this.mockPassword) {
        this.auth.login({
          member_id: 1,
          username: 'Test User',
          email: this.mockEmail,
          role: 'member',
          auth_provider: 'password',
        });
        this.isLoading = false;
        this.dialogRef.close();
        this.router.navigate(['/']);
        return;
      }

      const hashedPassword = await this.sha256(this.password);

      this.authApi.login({ email: this.email, password: hashedPassword }).subscribe({
        next: (res) => {
          this.applyLoginResponse(res);
        },
        error: (err) => {
          this.isLoading = false;
          this.showLoginError(this.getBackendErrorMessage(err));
        }
      });
    } catch (e) {
      this.isLoading = false;
      this.errorMessage = 'ไม่สามารถแฮ็ชรหัสผ่านได้';
      console.error(e);
    }
  }



}
