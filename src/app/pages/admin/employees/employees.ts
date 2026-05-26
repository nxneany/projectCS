import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Employee {
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

  profileImage: string;

  address: string;
}

@Component({
  selector: 'app-employees',
  imports: [CommonModule, FormsModule],
  templateUrl: './employees.html',
  styleUrl: './employees.scss',
})
export class EmployeesComponent {
  employeeData: Employee[] = [
    {
      staffId: 'EMP-001',
      image: 'assets/profile.png',
      fullName: 'อริดา ใจดี',
      phone: '099-111-5555',
      email: 'arida.staff@gmail.com',
      address: 'บางแสน ชลบุรี',
      idCardImage: 'id-card-001.jpg',
    },
    {
      staffId: 'EMP-002',
      image: 'assets/profile.png',
      fullName: 'ธนกฤต สวัสดี',
      phone: '088-222-4411',
      email: 'tanakrit.staff@gmail.com',
      address: 'บางนา กรุงเทพฯ',
      idCardImage: 'id-card-002.jpg',
    },
  ];

  employees: Employee[] = [...this.employeeData];

  isEmployeeFormOpen = false;

  editingStaffId = '';

  employeeToDelete: Employee | null = null;

  employeeFormError = '';

  employeeForm: EmployeeForm = this.getEmptyEmployeeForm();

  openAddEmployeePopup() {
    this.employeeForm = this.getEmptyEmployeeForm();

    this.employeeFormError = '';

    this.editingStaffId = '';

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

      profileImage: employee.image,

      address: employee.address,
    };

    this.employeeFormError = '';

    this.editingStaffId = employee.staffId;

    this.isEmployeeFormOpen = true;
  }

  closeEmployeeFormPopup() {
    this.isEmployeeFormOpen = false;

    this.editingStaffId = '';
  }

  saveEmployee() {
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

    // EDIT
    if (this.editingStaffId) {
      this.employees = this.employees.map((employee) =>
        employee.staffId === this.editingStaffId
          ? {
              ...employee,

              image: this.employeeForm.profileImage || employee.image,

              fullName: this.employeeForm.username,

              phone: this.employeeForm.phone,

              email: this.employeeForm.email,

              address: this.employeeForm.address,

              idCardImage:
                this.employeeForm.idCardImage || employee.idCardImage,
            }
          : employee,
      );

      this.closeEmployeeFormPopup();

      return;
    }

    // ADD
    this.employees = [
      {
        staffId: `EMP-${String(this.employees.length + 1).padStart(3, '0')}`,

        image: this.employeeForm.profileImage || 'assets/profile.png',

        fullName: this.employeeForm.username,

        phone: this.employeeForm.phone,

        email: this.employeeForm.email,

        address: this.employeeForm.address || '-',

        idCardImage: this.employeeForm.idCardImage || '-',
      },

      ...this.employees,
    ];

    this.closeEmployeeFormPopup();
  }

  onIdCardSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) return;

    this.employeeForm.idCardImage = input.files[0].name;
  }

  onProfileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) return;

    const file = input.files[0];

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

    this.employees = this.employees.filter(
      (employee) => employee.staffId !== this.employeeToDelete?.staffId,
    );

    this.closeDeleteConfirm();
  }

  private getEmptyEmployeeForm(): EmployeeForm {
    return {
      username: '',

      phone: '',

      email: '',

      password: '',

      confirmPassword: '',

      idCardImage: '',

      profileImage: '',

      address: '',
    };
  }
}
