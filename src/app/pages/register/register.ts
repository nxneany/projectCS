import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthApiService } from '../../service/auth-api.service';
import { LoginService } from '../../service/login.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class Register {
  user = {
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  isLoading = false;
  selectedImageFile: File | null = null;
  selectedImagePreview = 'assets/default-avatar.jpg';
  selectedImageName = '';

  constructor(
    private router: Router,
    private loginService: LoginService,
    private authApi: AuthApiService
  ) {}

  closeRegister() {
    this.router.navigate(['/']);
    this.loginService.reopenLogin();
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    this.selectedImageFile = input.files[0];
    this.selectedImageName = this.selectedImageFile.name;
    this.selectedImagePreview = URL.createObjectURL(this.selectedImageFile);
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/default-avatar.jpg';
  }

  // ⬇️ helper สำหรับทำ SHA-256 (ไม่มี salt/pepper)
  private async sha256(text: string): Promise<string> {
    const data = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // ⬇️ เปลี่ยนให้เป็น async และใช้รหัสผ่านที่ถูก hash
  async onSubmit() {
    if (!this.user.name.trim() || !this.user.phone.trim() || !this.user.email.trim() || !this.user.password) {
      alert('กรุณากรอกข้อมูลให้ครบ');
      return;
    }
    if (this.user.password !== this.user.confirmPassword) {
      alert('รหัสผ่านไม่ตรงกัน');
      return;
    }
    if (this.user.password.length < 6) {
      alert('รหัสผ่านควรมีอย่างน้อย 6 ตัวอักษร');
      return;
    }
    const phoneOk = /^0\d{8,9}$/.test(this.user.phone.replace(/[^0-9]/g, ''));
    if (!phoneOk) {
      alert('รูปแบบเบอร์โทรไม่ถูกต้อง');
      return;
    }

    // ทำ hash ก่อนส่งขึ้นเซิร์ฟเวอร์
    const hashedPassword = await this.sha256(this.user.password);

    const payload = new FormData();
    payload.append('username', this.user.name.trim());
    payload.append('phone', this.user.phone.trim());
    payload.append('email', this.user.email.trim());
    payload.append('password', hashedPassword);
    if (this.selectedImageFile) {
      payload.append('image', this.selectedImageFile);
    }

    this.isLoading = true;

    this.authApi.register(payload)
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          alert('สมัครสมาชิกสำเร็จ 🎉');
          this.closeRegister();
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading = false;
          const msg = err.error?.error || 'สมัครไม่สำเร็จ กรุณาลองใหม่';
          alert(msg);
          console.error('Register error:', err);
        }
      });
  }
}
