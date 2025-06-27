import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { SessionService } from '../../../core/services/session.service';
import { RoleBadgeColorPipe } from '../pipes/role-badge-color.pipe'; // Adjust the import path as necessary

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
    RoleBadgeColorPipe
  ],
  templateUrl: './navbar-private.component.html',
  styleUrls: ['./navbar-private.component.css']
})
export class NavbarPrivateComponent implements OnInit {
  dropdownOpen = signal(false);

  constructor(
    private router: Router,
    private session: SessionService
  ) { }

  get usuario() {
    return this.session.user;
  }

  ngOnInit(): void {
    // User data now handled by SessionService
  }

  cerrarSesion() {
    this.session.logout();
    this.router.navigate(['/']);
  }

  toggleDropdown() {
    this.dropdownOpen.set(!this.dropdownOpen());
  }

  getRoleColor(role: string): string {
    switch (role.toUpperCase()) {
      case 'VET':
        return 'bg-blue-100 text-blue-800';
      case 'ASISTENTE':
        return 'bg-green-100 text-green-800';
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
