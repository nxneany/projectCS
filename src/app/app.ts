import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./pages/header/header";

@Component({
  selector: 'app-root',
  standalone: true,                 // ✅ ต้องมี เพื่อให้เป็น Standalone component
  imports: [CommonModule, RouterOutlet, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'Rental';
}
