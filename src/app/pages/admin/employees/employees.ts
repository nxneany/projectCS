import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  CreateStaffPayload,
  StaffResponseItem,
  StaffService,
  UpdateStaffPayload,
} from '../../../service/staff.service';

interface Employee {
  id: number;
  staffId: string;
  image: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  idCardImage: string;
}

interface EmployeeForm {
  username: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  idCardImage: string;
  idCardFile: File | null;

  profileImage: string;
  profileImageFile: File | null;

  address: string;
}

@Component({
  selector: 'app-employees',
  imports: [CommonModule, FormsModule],
  templateUrl: './employees.html',
  styleUrl: './employees.scss',
})
export class EmployeesComponent implements OnInit {
  loading = false;
  isSaving = false;
  isDeleting = false;
  errorMessage = '';
  searchKeyword = '';
  private searchTimer?: ReturnType<typeof setTimeout>;

  employees: Employee[] = [];

  isEmployeeFormOpen = false;

  editingStaffId = '';
  editingId = 0;

  employeeToDelete: Employee | null = null;

  employeeFormError = '';

  employeeForm: EmployeeForm = this.getEmptyEmployeeForm();

  constructor(private staffService: StaffService) {}

  ngOnInit() {
    this.loadEmployees();
  }

  onSearchInput() {
    if (this.searchTimer) clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => this.loadEmployees(), 350);
  }

  loadEmployees() {
    this.loading = true;
    this.errorMessage = '';
    this.staffService.getStaff(this.searchKeyword).subscribe({
      next: (res) => {
        const rows = Array.isArray(res) ? res : (res?.data ?? []);
        this.employees = rows.map((row) => this.mapStaffToEmployee(row));
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'โหลดข้อมูลพนักงานไม่สำเร็จ';
        this.employees = [];
      },
    });
  }

  openAddEmployeePopup() {
    this.employeeForm = this.getEmptyEmployeeForm();

    this.employeeFormError = '';

    this.editingStaffId = '';
    this.editingId = 0;

    this.isEmployeeFormOpen = true;
  }

  openEditEmployeePopup(employee: Employee) {
    this.employeeForm = {
      username: employee.fullName,

      phone: employee.phone,

      email: employee.email,

      password: '',

      confirmPassword: '',

      idCardImage: employee.idCardImage,
      idCardFile: null,

      profileImage: employee.image,
      profileImageFile: null,

      address: employee.address,
    };

    this.employeeFormError = '';

    this.editingStaffId = employee.staffId;
    this.editingId = employee.id;

    this.isEmployeeFormOpen = true;
  }

  closeEmployeeFormPopup() {
    this.isEmployeeFormOpen = false;

    this.editingStaffId = '';
    this.editingId = 0;
  }

  private async sha256(text: string): Promise<string> {
    const data = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  async saveEmployee() {
    this.employeeFormError = '';

    if (
      !this.employeeForm.username.trim() ||
      !this.employeeForm.phone.trim() ||
      !this.employeeForm.email.trim()
    ) {
      this.employeeFormError = 'กรุณากรอกข้อมูลให้ครบ';

      return;
    }

    if (
      !this.editingStaffId &&
      (!this.employeeForm.password || !this.employeeForm.confirmPassword)
    ) {
      this.employeeFormError = 'กรุณากรอกรหัสผ่านและยืนยันรหัสผ่าน';

      return;
    }

    if (
      this.editingStaffId &&
      (this.employeeForm.password || this.employeeForm.confirmPassword) &&
      (!this.employeeForm.password || !this.employeeForm.confirmPassword)
    ) {
      this.employeeFormError = 'กรุณากรอกรหัสผ่านและยืนยันรหัสผ่านให้ครบ';

      return;
    }

    if (this.employeeForm.password !== this.employeeForm.confirmPassword) {
      this.employeeFormError = 'รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน';

      return;
    }
    if (this.employeeForm.password !== this.employeeForm.confirmPassword) {
  this.employeeFormError = 'รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน';
  return;
}

// << -- เพิ่มการตรวจสอบรูปแบบอีเมลและเบอร์โทร -- >>
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^0[0-9]{9}$/;

if (!emailPattern.test(this.employeeForm.email.trim())) {
  this.employeeFormError = 'รูปแบบอีเมลไม่ถูกต้อง';
  return;
}

if (!phonePattern.test(this.employeeForm.phone.trim())) {
  this.employeeFormError =
    'เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก และขึ้นต้นด้วย 0';
  return;
}

if (
  this.employeeForm.password &&
  this.employeeForm.password.length < 6
) {
  this.employeeFormError = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
  return;
}


    // EDIT
    if (this.editingStaffId) {
      if (!this.editingId) {
        this.employeeFormError = 'ไม่พบรหัสพนักงานสำหรับแก้ไข';
        return;
      }
      try {
        const updatePayload: UpdateStaffPayload = {
          username: this.employeeForm.username.trim(),
          phone: this.employeeForm.phone.trim(),
          email: this.employeeForm.email.trim(),
          address: this.employeeForm.address.trim(),
          image: this.employeeForm.profileImageFile,
          url_idcard: this.employeeForm.idCardFile,
        };

        if (this.employeeForm.password) {
          updatePayload.password = await this.sha256(this.employeeForm.password);
        }

        this.isSaving = true;
        this.staffService.updateStaff(this.editingId, updatePayload).subscribe({
          next: () => {
            this.isSaving = false;
            this.closeEmployeeFormPopup();
            this.loadEmployees();
          },
          error: (err) => {
            this.isSaving = false;
            this.employeeFormError =
              err?.error?.error || 'แก้ไขพนักงานไม่สำเร็จ กรุณาลองใหม่';
          },
        });
      } catch {
        this.employeeFormError = 'ไม่สามารถแฮ็ชรหัสผ่านได้';
      }
      return;
    }

    try {
      const hashedPassword = await this.sha256(this.employeeForm.password);
      const payload: CreateStaffPayload = {
        username: this.employeeForm.username.trim(),
        phone: this.employeeForm.phone.trim(),
        email: this.employeeForm.email.trim(),
        address: this.employeeForm.address.trim(),
        password: hashedPassword,
        image: this.employeeForm.profileImageFile,
        url_idcard: this.employeeForm.idCardFile,
      };

      this.isSaving = true;
      this.staffService.createStaff(payload).subscribe({
        next: () => {
          this.isSaving = false;
          this.closeEmployeeFormPopup();
          this.loadEmployees();
        },
        error: (err) => {
          this.isSaving = false;
          this.employeeFormError =
            err?.error?.error || 'เพิ่มพนักงานไม่สำเร็จ กรุณาลองใหม่';
        },
      });
    } catch {
      this.employeeFormError = 'ไม่สามารถแฮ็ชรหัสผ่านได้';
    }
  }

  onIdCardSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) return;

    const file = input.files[0];
    this.employeeForm.idCardFile = file;
    this.employeeForm.idCardImage = URL.createObjectURL(file);
  }

  onProfileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) return;

    const file = input.files[0];

    this.employeeForm.profileImageFile = file;
    this.employeeForm.profileImage = URL.createObjectURL(file);
  }

  openDeleteConfirm(employee: Employee) {
    this.employeeToDelete = employee;
  }

  closeDeleteConfirm() {
    this.employeeToDelete = null;
  }

  confirmDeleteEmployee() {
    if (!this.employeeToDelete) return;
    if (!this.employeeToDelete.id) return;

    this.isDeleting = true;
    this.staffService.deleteStaff(this.employeeToDelete.id).subscribe({
      next: () => {
        this.isDeleting = false;
        this.closeDeleteConfirm();
        this.loadEmployees();
      },
      error: () => {
        this.isDeleting = false;
        this.errorMessage = 'ลบพนักงานไม่สำเร็จ กรุณาลองใหม่';
      },
    });
  }

  private getEmptyEmployeeForm(): EmployeeForm {
    return {
      username: '',

      phone: '',

      email: '',

      password: '',

      confirmPassword: '',

      idCardImage: '',
      idCardFile: null,

      profileImage: '',
      profileImageFile: null,

      address: '',
    };
  }

  private mapStaffToEmployee(row: StaffResponseItem): Employee {
    const staffNo = row.staff_id ?? row.id ?? 0;
    return {
      id: row.staff_id ?? row.id ?? 0,
      staffId: `EMP-${String(staffNo).padStart(3, '0')}`,
      image: this.staffService.getImageUrl(row.image_profile),
      fullName: row.username || '-',
      phone: row.phone || '-',
      email: row.email || '-',
      address: row.address || '-',
      idCardImage: this.staffService.getImageUrl(row.url_idcard),
    };
  }
}
