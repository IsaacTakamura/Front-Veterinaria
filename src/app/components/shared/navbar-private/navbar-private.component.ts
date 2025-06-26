import { Component, Input, OnInit, Signal, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';

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
    NgIf,
],
  templateUrl: './navbar-private.component.html',
  styleUrls: ['./navbar-private.component.css']
})
export class NavbarPrivateComponent implements OnInit {
  @Input() user!: User;
  notifications = signal(3);
  usuario = signal<{ username: string, rol: string } | null>(null);

  constructor(private router: Router) {}

  ngOnInit() {
    const userData = localStorage.getItem('user_info');
    if (userData) this.usuario.set(JSON.parse(userData));
  }

  logout() {
    console.log('Cerrando sesión...');
    this.cerrarSesion();
  }

  cerrarSesion() {
    localStorage.clear();
    this.router.navigate(['/']);
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
