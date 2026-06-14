import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminProfileService, BackofficeProfileRole } from '../../../service/admin-profile.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class ProfileComponent implements OnInit {
  loading = false;
  errorMessage = '';
  userRole: 'admin' | 'staff' = 'admin';
  profileId = 0;
  roleForApi: BackofficeProfileRole = 'admin';

  profile = {
    image: 'assets/logob.png',
    fullName: '',
    phone: '',
    email: '',
    password: '',
  };
  isProfilePopupOpen = false;
  profileFormError = '';
  profileForm = this.getProfileForm();

  constructor(private adminProfileService: AdminProfileService) {}

  ngOnInit() {
    this.loadProfile();
  }

  get roleLabel() {
    return this.userRole === 'staff' ? 'พนักงาน' : 'ผู้ดูแลระบบ';
  }

  get canEditProfile() {
    return this.userRole === 'admin';
  }

  openEditProfilePopup() {
    if (!this.canEditProfile) {
      return;
    }

    this.profileForm = this.getProfileForm();
    this.profileFormError = '';
    this.isProfilePopupOpen = true;
  }

  closeEditProfilePopup() {
    this.isProfilePopupOpen = false;
  }

  onPhoneInput(value: string) {
    this.profileForm.phone = value.replace(/\D/g, '').slice(0, 10);
  }

  private async sha256(text: string): Promise<string> {
    const data = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  async saveProfile() {
    this.profileFormError = '';

    const fullName = this.profileForm.fullName.trim();
    const phone = this.profileForm.phone.trim();
    const email = this.profileForm.email.trim();
    const password = this.profileForm.password.trim();
    const confirmPassword = this.profileForm.confirmPassword.trim();

    if (
      !fullName ||
      !phone ||
      !email
    ) {
      this.profileFormError = 'กรุณากรอกข้อมูลให้ครบ';
      return;
    }

    const phoneOk = /^0\d{8,9}$/.test(phone.replace(/[^0-9]/g, ''));
    if (!phoneOk) {
      this.profileFormError = 'รูปแบบเบอร์โทรไม่ถูกต้อง';
      return;
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      this.profileFormError = 'กรุณากรอกอีเมลให้ถูกต้อง';
      return;
    }

    if ((password || confirmPassword) && password.length < 6) {
      this.profileFormError = 'รหัสผ่านควรมีอย่างน้อย 6 ตัวอักษร';
      return;
    }

    if (
      (password || confirmPassword) &&
      password !== confirmPassword
    ) {
      this.profileFormError = 'รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน';
      return;
    }

    if (!this.profileId) {
      this.profileFormError = 'ไม่พบรหัสผู้ใช้สำหรับแก้ไขข้อมูล';
      return;
    }

    try {
      this.loading = true;
      const formData = new FormData();
      formData.append('username', fullName);
      formData.append('phone', phone);
      formData.append('email', email);

      if (password) {
        const hashedPassword = await this.sha256(password);
        formData.append('password', hashedPassword);
      }

      if (this.profileForm.imageFile) {
        formData.append('image', this.profileForm.imageFile);
      }

      this.adminProfileService
        .updateProfile(this.profileId, this.roleForApi, formData)
        .subscribe({
          next: (res) => {
            const updatedImage = res.user?.image_profile
              ? this.adminProfileService.getImageUrl(res.user.image_profile)
              : this.profileForm.imagePreview || this.profile.image;

            this.profile = {
              image: updatedImage,
              fullName,
              phone,
              email,
              password: password
                ? '********'
                : this.profile.password,
            };

            localStorage.setItem('username', this.profile.fullName);
            localStorage.setItem('email', this.profile.email);
            localStorage.setItem('phone', this.profile.phone);

            this.loading = false;
            this.closeEditProfilePopup();
          },
          error: (err) => {
            this.loading = false;
            this.profileFormError =
              err?.error?.error || 'บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่';
          },
        });
    } catch {
      this.loading = false;
      this.profileFormError = 'ไม่สามารถแฮ็ชรหัสผ่านได้';
    }
  }

  onProfileImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    this.profileForm.imageFileName = file.name;
    this.profileForm.imagePreview = URL.createObjectURL(file);
    this.profileForm.imageFile = file;
  }

  private getProfileForm() {
    return {
      fullName: this.profile.fullName,
      phone: this.profile.phone,
      email: this.profile.email,
      password: '',
      confirmPassword: '',
      imageFileName: '',
      imagePreview: '',
      imageFile: null as File | null,
    };
  }

  private loadProfile() {
    const id = Number(localStorage.getItem('member_id'));
    const rawRole = localStorage.getItem('user_role');
    const normalizedRole = rawRole === 'staff' || rawRole === 'staf' || rawRole === 'employee'
      ? 'staff'
      : 'admin';

    localStorage.setItem('user_role', normalizedRole);
    this.userRole = normalizedRole;
    this.roleForApi = normalizedRole;
    this.profileId = id;

    if (!id) {
      this.errorMessage = 'ไม่พบข้อมูลผู้ใช้ในระบบ';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.adminProfileService.getProfile(id, this.roleForApi).subscribe({
      next: (res) => {
        this.profile = {
          image: this.adminProfileService.getImageUrl(res.image_profile),
          fullName: res.username || res.full_name || res.name || '-',
          phone: res.phone || '-',
          email: res.email || '-',
          password: '********',
        };
        this.profileForm = this.getProfileForm();
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'โหลดข้อมูลโปรไฟล์ไม่สำเร็จ';
        this.loading = false;
      },
    });
  }
}
