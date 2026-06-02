import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AdminMemberDetailResponse,
  AdminMemberListItem,
  MemberService,
} from '../../../service/member.service';
import { formatOrderNo } from '../../../utils/order-format';

interface OrderItem {
  productId: string;
  detail: string;
  quantity: number;
  price: number;
  total: number;
}

interface MemberOrder {
  orderId: string;
  rentDate: string;
  total: number;
  items: OrderItem[];
}

interface Member {
  id: number;
  memberId: string;
  image: string;
  fullName: string;
  phone: string;
  email: string;
  rentalHistory: string;
  address: string;
  orders: MemberOrder[];
}

@Component({
  selector: 'app-members',
  imports: [CommonModule, FormsModule],
  templateUrl: './members.html',
  styleUrl: './members.scss',
})
export class MembersComponent implements OnInit {
  loading = false;
  detailLoading = false;
  errorMessage = '';
  searchText = '';
  private searchTimer?: ReturnType<typeof setTimeout>;

  members: Member[] = [];

  selectedMember: Member | null = null;

  editingMember: Member | null = null;
  isEditPasswordOpen = false;
  editPassword = '';
  editConfirmPassword = '';
  editImageFile: File | null = null;
  editErrorMessage = '';
  editSaving = false;

  deleteMember: Member | null = null;
  deleteSaving = false;

  isAddPopupOpen = false;
  addSaving = false;
  addErrorMessage = '';

  newMember = {
    fullName: '',
    phone: '',
    email: '',
    address: '',
    password: '',
  };

  constructor(private memberService: MemberService) {}

  ngOnInit() {
    this.loadMembers();
  }

  get filteredMembers() {
    return this.members;
  }

  onSearchInput() {
    if (this.searchTimer) clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => this.loadMembers(), 350);
  }

  loadMembers() {
    this.loading = true;
    this.errorMessage = '';

    this.memberService.getAdminMembers(this.searchText).subscribe({
      next: (res) => {
        this.members = (res.items || []).map((item) => this.mapMember(item));
        this.loading = false;
      },
      error: () => {
        this.members = [];
        this.loading = false;
        this.errorMessage = 'โหลดข้อมูลสมาชิกไม่สำเร็จ';
      },
    });
  }

  openViewPopup(member: Member) {
    this.selectedMember = member;
    this.detailLoading = true;

    this.memberService.getAdminMemberDetail(member.id).subscribe({
      next: (res) => {
        this.selectedMember = this.mapMemberDetail(res);
        this.detailLoading = false;
      },
      error: () => {
        this.detailLoading = false;
      },
    });
  }

  closeViewPopup() {
    this.selectedMember = null;
  }

  openEditPopup(member: Member) {
    this.editingMember = { ...member };
    this.isEditPasswordOpen = false;
    this.editPassword = '';
    this.editConfirmPassword = '';
    this.editImageFile = null;
    this.editErrorMessage = '';
  }

  closeEditPopup() {
    this.editingMember = null;
    this.isEditPasswordOpen = false;
    this.editPassword = '';
    this.editConfirmPassword = '';
    this.editImageFile = null;
    this.editErrorMessage = '';
  }

  toggleEditPassword() {
    this.isEditPasswordOpen = !this.isEditPasswordOpen;
    this.editPassword = '';
    this.editConfirmPassword = '';
    this.editErrorMessage = '';
  }

  async saveEditMember() {
    if (!this.editingMember) return;

    const username = this.editingMember.fullName.trim();
    const email = this.editingMember.email.trim();
    const password = this.editPassword.trim();
    const confirmPassword = this.editConfirmPassword.trim();

    if (!username || !email) {
      this.editErrorMessage = 'กรุณากรอก username และอีเมล';
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.editErrorMessage = 'กรุณากรอกอีเมลให้ถูกต้อง';
      return;
    }

    if (this.isEditPasswordOpen) {
      if (!password || !confirmPassword) {
        this.editErrorMessage = 'กรุณากรอกรหัสผ่านและยืนยันรหัสผ่าน';
        return;
      }

      if (password.length < 6) {
        this.editErrorMessage = 'รหัสผ่านควรมีอย่างน้อย 6 ตัวอักษร';
        return;
      }

      if (password !== confirmPassword) {
        this.editErrorMessage = 'รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน';
        return;
      }
    }

    const formData = new FormData();
    formData.append('username', username);
    formData.append('phone', this.cleanValue(this.editingMember.phone));
    formData.append('email', email);
    formData.append('address', this.cleanValue(this.editingMember.address));
    if (this.isEditPasswordOpen && password) {
      const hashedPassword = await this.sha256(password);
      formData.append('password', hashedPassword);
    }
    if (this.editImageFile) {
      formData.append('image', this.editImageFile);
    }

    this.editSaving = true;
    this.memberService
      .updateMemberFormData(this.editingMember.id, formData)
      .subscribe({
        next: () => {
          this.editSaving = false;
          this.closeEditPopup();
          this.loadMembers();
        },
        error: (err) => {
          this.editSaving = false;
          this.editErrorMessage =
            err?.error?.error || 'แก้ไขข้อมูลสมาชิกไม่สำเร็จ';
        },
      });
  }

  onEditImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length || !this.editingMember) return;

    this.editImageFile = input.files[0];
    this.editingMember.image = URL.createObjectURL(this.editImageFile);
  }

  openDeletePopup(member: Member) {
    this.deleteMember = member;
  }

  closeDeletePopup() {
    this.deleteMember = null;
  }

  confirmDeleteMember() {
    if (!this.deleteMember) return;

    this.deleteSaving = true;
    this.memberService.deleteAdminMember(this.deleteMember.id).subscribe({
      next: () => {
        this.deleteSaving = false;
        this.closeDeletePopup();
        this.loadMembers();
      },
      error: () => {
        this.deleteSaving = false;
        this.errorMessage = 'ลบสมาชิกไม่สำเร็จ';
      },
    });
  }

  formatPrice(price: number) {
    return `${price.toLocaleString('en-US')} ฿`;
  }

  //เพิ่มผู้ใช้
  openAddPopup() {
    this.newMember = {
      fullName: '',
      phone: '',
      email: '',
      address: '',
      password: '',
    };
    this.addErrorMessage = '';
    this.addSaving = false;

    this.isAddPopupOpen = true;
  }

  closeAddPopup() {
    if (this.addSaving) return;

    this.isAddPopupOpen = false;
    this.addErrorMessage = '';
  }

  async saveNewMember() {
    if (
      !this.newMember.fullName.trim() ||
      !this.newMember.phone.trim() ||
      !this.newMember.email.trim() ||
      !this.newMember.address.trim() ||
      !this.newMember.password.trim()
    ) {
      this.addErrorMessage = 'กรุณากรอกข้อมูลให้ครบ';
      return;
    }

    if (this.newMember.password.length < 6) {
      this.addErrorMessage = 'รหัสผ่านควรมีอย่างน้อย 6 ตัวอักษร';
      return;
    }

    const phoneOk = /^0\d{8,9}$/.test(
      this.newMember.phone.replace(/[^0-9]/g, ''),
    );
    if (!phoneOk) {
      this.addErrorMessage = 'รูปแบบเบอร์โทรไม่ถูกต้อง';
      return;
    }

    const hashedPassword = await this.sha256(this.newMember.password);

    this.addSaving = true;
    this.addErrorMessage = '';

    this.memberService
      .createMember({
        username: this.newMember.fullName.trim(),
        phone: this.newMember.phone.trim(),
        email: this.newMember.email.trim(),
        address: this.newMember.address.trim(),
        password: hashedPassword,
      })
      .subscribe({
        next: () => {
          this.addSaving = false;
          this.closeAddPopup();
          this.loadMembers();
        },
        error: (err) => {
          this.addSaving = false;
          this.addErrorMessage =
            err?.error?.error || 'เพิ่มสมาชิกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง';
        },
      });
  }

  private async sha256(text: string): Promise<string> {
    const data = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  formatDate(value: string) {
    return new Date(value).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  private mapMember(item: AdminMemberListItem): Member {
    return {
      id: item.member_id,
      memberId: `M-${String(item.member_id).padStart(3, '0')}`,
      image: this.memberService.getProfileImageUrl(item.image_profile || undefined),
      fullName: item.username || '-',
      phone: item.phone || '-',
      email: item.email || '-',
      rentalHistory: `${item.total_orders || 0} ออเดอร์`,
      address: item.address || '',
      orders: [],
    };
  }

  private mapMemberDetail(res: AdminMemberDetailResponse): Member {
    return {
      id: res.member.member_id,
      memberId: `M-${String(res.member.member_id).padStart(3, '0')}`,
      image: this.memberService.getProfileImageUrl(
        res.member.image_profile || undefined,
      ),
      fullName: res.member.username || '-',
      phone: res.member.phone || '-',
      email: res.member.email || '-',
      rentalHistory: `${res.orders.length} ออเดอร์`,
      address: res.member.address || '-',
      orders: res.orders.map((order) => ({
        orderId: formatOrderNo(order.order_id),
        rentDate: this.formatDate(order.day_rental),
        total: Number(order.total_price || 0),
        items: (order.items || []).map((item) => ({
          productId: `#${item.order_item_id}`,
          detail: `${item.name} | ${item.size} | ${item.color}`,
          quantity: item.quantity,
          price: Number(item.price || 0),
          total: Number(item.price_sum || 0),
        })),
      })),
    };
  }

  private cleanValue(value: string) {
    return value === '-' ? '' : value.trim();
  }
}
