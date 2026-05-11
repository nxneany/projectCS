import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';

import { AuthService } from '../../service/auth.service';
import { Member, MemberService } from '../../service/member.service';

@Component({
  selector: 'app-profile-member',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule],
  templateUrl: './profile-member.html',
  styleUrls: ['./profile-member.scss']
})
export class ProfileMember implements OnInit {
  member: Member = { member_id: 0, username: '', email: '', phone: '', address: '', image_profile: '' };
  loading = true;
  editMode = false;

  // ✅ base URL โฟลเดอร์อัปโหลดจาก backend + รูป fallback
  imageUrl = 'assets/default-avatar.png';

  constructor(
    private dialogRef: MatDialogRef<ProfileMember>,
    private memberService: MemberService,
    private auth: AuthService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    const id = localStorage.getItem('member_id');
    if (id) {
      this.memberService.getMemberById(+id).subscribe({
        next: (res) => {
          this.member = res;
          // ถ้ามีชื่อไฟล์รูปใน DB ให้ชี้ไปที่ /uploads/<filename> ไม่งั้นใช้ default
          this.imageUrl = this.memberService.getProfileImageUrl(res.image_profile);
          this.loading = false;
        },
        error: (err) => {
          console.error('❌ Error loading member:', err);
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
    }
  }

  /** fallback เมื่อโหลดรูปไม่ได้ */
  onImgError(e: Event) {
    (e.target as HTMLImageElement).src = 'assets/default-avatar.jpg';
  }

  close() { this.dialogRef.close(); }

  toggleEdit() {
    this.dialogRef.close();
    this.router.navigate(['/edit-profile']); // ไปหน้าแก้ไขข้อมูล
  }

  logout() {
    this.auth.logout();
    this.dialogRef.close('logged-out');
  }
}
