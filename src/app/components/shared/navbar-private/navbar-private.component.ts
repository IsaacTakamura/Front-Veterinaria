import { Component, Input, Signal, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIf, NgClass } from '@angular/common';
import { AvatarComponent } from '../../ui/avatar.component';
import { ButtonComponent } from '../../ui/button.component';
import { BadgeComponent } from '../../ui/badge.component';
import { DropdownMenuComponent } from '../../ui/dropdown-menu.component';

interface User {
  name: string;
  role: string;
  email: string;
  avatar: string;
}

@Component({
  selector: 'app-navbar-private',
  standalone: true,
  imports: [
    CommonModule,
    AvatarComponent,
    ButtonComponent,
    BadgeComponent,
    DropdownMenuComponent,
    NgIf,
    NgClass,
  ],
  templateUrl: './navbar-private.component.html',
  styleUrls: ['./navbar-private.component.css']
})
export class NavbarPrivateComponent {
  @Input() user!: User;
  notifications = signal(3); // Estado reactivo con señales

  logout() {
    console.log('Cerrando sesión...');
    // Aquí pondrías tu navegación o cierre de sesión real
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  }

  getRoleColor(role: string): string {
    switch (role.toLowerCase()) {
      case 'veterinario':
        return 'bg-blue-100 text-blue-800';
      case 'asistente':
        return 'bg-green-100 text-green-800';
      case 'recepcionista':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
