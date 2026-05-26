import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class ProfileComponent {
  profile = {
    image: 'assets/logob.png',
    fullName: 'ภูมิภัทร์ นาดี',
    phone: '097-193-9481',
    email: 'owner@dressmeup.com',
    password: '********',
  };
  isProfilePopupOpen = false;
  profileFormError = '';
  profileForm = this.getProfileForm();

  openEditProfilePopup() {
    this.profileForm = this.getProfileForm();
    this.profileFormError = '';
    this.isProfilePopupOpen = true;
  }

  closeEditProfilePopup() {
    this.isProfilePopupOpen = false;
  }

  saveProfile() {
    this.profileFormError = '';

    if (
      !this.profileForm.fullName.trim() ||
      !this.profileForm.phone.trim() ||
      !this.profileForm.email.trim()
    ) {
      this.profileFormError = 'กรุณากรอกข้อมูลให้ครบ';
      return;
    }

    if (
      (this.profileForm.password || this.profileForm.confirmPassword) &&
      this.profileForm.password !== this.profileForm.confirmPassword
    ) {
      this.profileFormError = 'รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน';
      return;
    }

    this.profile = {
      image: this.profileForm.imagePreview || this.profile.image,
      fullName: this.profileForm.fullName,
      phone: this.profileForm.phone,
      email: this.profileForm.email,
      password: this.profileForm.password ? '********' : this.profile.password,
    };

    this.closeEditProfilePopup();
  }

  onProfileImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    this.profileForm.imageFileName = file.name;
    this.profileForm.imagePreview = URL.createObjectURL(file);
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
    };
  }
}
