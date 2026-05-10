import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // ✅ เพิ่ม
import { Router } from '@angular/router';
import { Member, MemberService } from '../../service/member.service';
import { ProfileMember } from '../profile-member/profile-member'; // ✅ path ให้ตรงโปรเจกต์จริง

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule], // ✅ ใส่ MatDialogModule เผื่อไม่มีที่อื่น
  templateUrl: './edit-profile.html',
  styleUrls: ['./edit-profile.scss']
})
export class EditProfile implements OnInit {
  member: Member = { member_id: 0, username: '', email: '', phone: '', address: '', image_profile: '' };
  password = '';
  confirmPassword = '';
  passMismatch = false;
  loading = true;
  imageUrl = 'assets/default-avatar.png';
  selectedFile: File | null = null;

  constructor(
    private memberService: MemberService,
    private router: Router,
    private dialog: MatDialog,                        // ✅ ฉีด MatDialog
  ) {}

  ngOnInit(): void {
    const id = localStorage.getItem('member_id');
    if (id) {
      this.memberService.getMemberById(+id).subscribe({
        next: (res) => {
          this.member = res;
          this.imageUrl = res.image_profile
            ? `http://localhost:3000/uploads/${res.image_profile}`
            : 'assets/default-avatar.png';
          this.loading = false;
        },
        error: (err) => {
          console.error('❌ Error loading member:', err);
          this.loading = false;
        },
      });
    } else {
      this.loading = false;
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => (this.imageUrl = e.target.result);
      reader.readAsDataURL(file);
    }
  }

  // ✅ ฟังก์ชันกลับไปหน้าโปรไฟล์ (เปิด dialog หลัง navigate)
  private backToProfile(): void {
    // เลือกเส้นทางที่ต้องการกลับ เช่น '/' หรือ route ที่คุณเปิด dialog จากตรงนั้น
    this.router.navigate(['/']).then(() => {
   this.dialog.open(ProfileMember, {
  panelClass: 'profile-panel',        // ✅ ใช้คลาสนี้ไปจับ .cdk-overlay-pane
  backdropClass: 'blur-backdrop',     // (คุณมีคลาสนี้แล้ว)
  width: '380px',
  maxWidth: 'none',                   // ✅ กันเด้งกลางจอเพราะ 80vw
  position: { right: '0', top: '0' }, // ✅ ชิดขวาบน
});

    });
  }

  save(): void {
    this.passMismatch = !!this.password && !!this.confirmPassword && this.password !== this.confirmPassword;
    if (this.passMismatch) return;

    const formData = new FormData();
    formData.append('username', this.member.username);
    formData.append('phone', this.member.phone);
    formData.append('email', this.member.email);
    formData.append('address', this.member.address);
    if (this.password) formData.append('password', this.password);
    if (this.selectedFile) formData.append('image', this.selectedFile);

    this.memberService.updateMemberFormData(this.member.member_id, formData).subscribe({
      next: () => {
        alert('✅ บันทึกข้อมูลเรียบร้อย');
        this.backToProfile();                     // ✅ กลับไปเปิด ProfileMember
      },
      error: (err: HttpErrorResponse) => {
        console.error('❌ Save error:', err);
        alert(err.error?.error || 'เกิดข้อผิดพลาดในการบันทึก');
      },
    });
  }

  onImgError(e: Event): void {
    (e.target as HTMLImageElement).src = 'assets/default-avatar.png';
  }

  // ✅ ปิดแล้วกลับไปหน้าโปรไฟล์ (เปิด dialog)
  close() {
    this.backToProfile();
  }
}
