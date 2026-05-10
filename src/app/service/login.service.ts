import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Login } from '../pages/login/login';

@Injectable({ providedIn: 'root' })
export class LoginService {
  private dialogRef: any = null;

  constructor(private dialog: MatDialog) {}

  openLogin() {
    if (!this.dialogRef) {
      this.dialogRef = this.dialog.open(Login);
      this.dialogRef.afterClosed().subscribe(() => {
        this.dialogRef = null;
      });
    }
  }

  reopenLogin() {
    this.openLogin();
  }
}
