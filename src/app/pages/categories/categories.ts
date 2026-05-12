import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { Category, CategoryService } from '../../service/category.service';

@Component({
  selector: 'app-category-drawer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './categories.html',
  styleUrls: ['./categories.scss']
})
export class Categories {
  
  categories: Category[] = [];
  loading = true;

  constructor(
    private categoryService: CategoryService,
    private dialogRef: MatDialogRef<Categories>   // ⬅️ เพิ่ม
  ) {}

  ngOnInit() {
    this.categoryService.getAll().subscribe({
      next: (rows) => { this.categories = rows; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  close() { this.dialogRef.close(); } 
}
