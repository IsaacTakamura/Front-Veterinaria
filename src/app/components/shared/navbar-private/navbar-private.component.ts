import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';

interface User {
  username: string;
  rol: string;
}

@Component({
  selector: 'app-navbar-private',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
],
  templateUrl: './navbar-private.component.html',
  styleUrls: ['./navbar-private.component.css']
})
export class NavbarPrivateComponent implements OnInit {
  usuario = signal<{ username: string; rol: string } | null>(null);
  dropdownOpen = signal(false);

  constructor(private router: Router) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('user_info');
    if (userData) {
      this.usuario.set(JSON.parse(userData));
    }
  }

  cerrarSesion() {
    localStorage.clear();
    this.router.navigate(['/']);
  }

  toggleDropdown() {
    this.dropdownOpen.set(!this.dropdownOpen());
  }

  getRoleColor(role: string): string {
    switch (role.toLowerCase()) {
      case 'VET':
        return 'bg-blue-100 text-blue-800';
      case 'asistente':
        return 'bg-green-100 text-green-800';
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
