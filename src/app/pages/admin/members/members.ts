import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
export class MembersComponent {
  searchText = '';

  membersData: Member[] = [
    {
      memberId: 'M-013',
      image: 'assets/profile.png',
      fullName: 'DFN Tv',
      phone: '097-193-9481',
      email: 'dfn31tv@gmail.com',
      rentalHistory: '4 ออเดอร์',
      address: 'สมุทรปราการ',
      orders: [
        {
          orderId: 'ORD-20260520-001',
          rentDate: '20 พ.ค. 2026',
          total: 2400,
          items: [
            {
              productId: 'P-001',
              detail: 'ชุดไทยจักรี สีทอง ไซส์ S',
              quantity: 2,
              price: 1200,
            },
          ],
        },
        {
          orderId: 'ORD-20260518-003',
          rentDate: '18 พ.ค. 2026',
          total: 1350,
          items: [
            {
              productId: 'P-005',
              detail: 'มงกุฎคริสตัลราชินี สีเงิน',
              quantity: 1,
              price: 1350,
            },
          ],
        },
      ],
    },

    {
      memberId: 'M-014',
      image: 'assets/profile.png',
      fullName: 'Ananya S.',
      phone: '099-911-1555',
      email: 'ananya@gmail.com',
      rentalHistory: '2 ออเดอร์',
      address: 'กรุงเทพมหานคร',
      orders: [
        {
          orderId: 'ORD-20260515-010',
          rentDate: '15 พ.ค. 2026',
          total: 3200,
          items: [
            {
              productId: 'P-012',
              detail: 'ชุดราตรีสีแดง ไซส์ M',
              quantity: 1,
              price: 3200,
            },
          ],
        },
      ],
    },
  ];

  members: Member[] = [...this.membersData];

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

  get filteredMembers() {
    if (!this.searchText.trim()) {
      return this.members;
    }

    return this.members.filter(
      (member) =>
        member.memberId.toLowerCase().includes(this.searchText.toLowerCase()) ||
        member.fullName.toLowerCase().includes(this.searchText.toLowerCase()),
    );
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
}
