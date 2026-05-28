import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';

interface OrderItem {
  productId: string;
  detail: string;
  quantity: number;
  price: number;
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

interface AdminMemberApiItem {
  member_id: number;
  username: string;
  phone: string | null;
  email: string;
  image_profile: string | null;
  total_orders: number;
}

interface AdminMemberResponse {
  items: AdminMemberApiItem[];
}

@Component({
  selector: 'app-members',
  imports: [CommonModule, FormsModule],
  templateUrl: './members.html',
  styleUrl: './members.scss',
})
export class MembersComponent implements OnInit {
  private apiBase = environment.apiBaseUrl;
  private uploadsBase = environment.uploadsBaseUrl;

  loading = false;
  errorMessage = '';
  searchText = '';
  private searchTimer?: ReturnType<typeof setTimeout>;

  members: Member[] = [];

  selectedMember: Member | null = null;

  editingMember: Member | null = null;

  deleteMember: Member | null = null;

  isAddPopupOpen = false;

  newMember = {
    fullName: '',
    phone: '',
    email: '',
    address: '',
    password: '',
  };

  constructor(private http: HttpClient) {}

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

    let params = new HttpParams();
    if (this.searchText.trim()) {
      params = params.set('search', this.searchText.trim());
    }

    this.http
      .get<AdminMemberResponse>(`${this.apiBase}/admin/member`, { params })
      .subscribe({
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
  }

  closeViewPopup() {
    this.selectedMember = null;
  }

  openEditPopup(member: Member) {
    this.editingMember = { ...member };
  }

  closeEditPopup() {
    this.editingMember = null;
  }

  saveEditMember() {
    if (!this.editingMember) return;

    this.members = this.members.map((member) =>
      member.memberId === this.editingMember?.memberId
        ? this.editingMember
        : member,
    );

    this.closeEditPopup();
  }

  openDeletePopup(member: Member) {
    this.deleteMember = member;
  }

  closeDeletePopup() {
    this.deleteMember = null;
  }

  confirmDeleteMember() {
    if (!this.deleteMember) return;

    this.members = this.members.filter(
      (member) => member.memberId !== this.deleteMember?.memberId,
    );

    this.closeDeletePopup();
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

    this.isAddPopupOpen = true;
  }

  closeAddPopup() {
    this.isAddPopupOpen = false;
  }

  saveNewMember() {
    if (
      !this.newMember.fullName.trim() ||
      !this.newMember.phone.trim() ||
      !this.newMember.email.trim() ||
      !this.newMember.address.trim() ||
      !this.newMember.password.trim()
    ) {
      alert('กรุณากรอกข้อมูลให้ครบ');

      return;
    }

    const newId = `M-${String(this.members.length + 13).padStart(3, '0')}`;

    this.members = [
      {
        id: this.members.length + 13,
        memberId: newId,

        image: 'assets/profile.png',

        fullName: this.newMember.fullName,

        phone: this.newMember.phone,

        email: this.newMember.email,

        address: this.newMember.address,

        rentalHistory: '0 ออเดอร์',

        orders: [],
      },

      ...this.members,
    ];

    this.closeAddPopup();

    alert('เพิ่มสมาชิกสำเร็จ');
  }

  private mapMember(item: AdminMemberApiItem): Member {
    return {
      id: item.member_id,
      memberId: `M-${String(item.member_id).padStart(3, '0')}`,
      image: this.getProfileImage(item.image_profile),
      fullName: item.username || '-',
      phone: item.phone || '-',
      email: item.email || '-',
      rentalHistory: `${item.total_orders || 0} ออเดอร์`,
      address: '-',
      orders: [],
    };
  }

  private getProfileImage(image?: string | null) {
    if (!image) return 'assets/profile.png';
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }
    return `${this.uploadsBase}/${image}`;
  }
}
