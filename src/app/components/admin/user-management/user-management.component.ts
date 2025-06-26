import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface User {
  id: number;
  username: string;
  rol: 'VET' | 'ASISTENTE' | 'ADMIN';
  activo: boolean;
  fechaCreacion: string;
}

interface NewUser {
  username: string;
  password: string;
  rol: 'VET' | 'ASISTENTE' | 'ADMIN';
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent {
  @Input() activeTab!: string;

  private _users = signal<User[]>([
    { id: 1, username: 'dr.martinez', rol: 'VET', activo: true, fechaCreacion: '2024-01-15' },
    { id: 2, username: 'asistente.ana', rol: 'ASISTENTE', activo: true, fechaCreacion: '2024-01-20' },
    { id: 3, username: 'recep.carlos', rol: 'ASISTENTE', activo: false, fechaCreacion: '2024-02-01' }
  ]);
  users = this._users;

  newUser = signal<NewUser>({
    username: '',
    password: '',
    rol: 'ASISTENTE'
  });

  showPassword = signal(false);

  roles = [
    { id: 'ADMIN', label: 'Administrador', desc: 'Acceso completo al sistema' },
    { id: 'VET', label: 'Veterinario', desc: 'Puede gestionar pacientes y consultas' },
    { id: 'ASISTENTE', label: 'Asistente', desc: 'Acceso limitado a citas y triaje' }
  ];

  handleCreateUser(event: Event) {
    event.preventDefault();

    const current = this.newUser();
    const nuevo: User = {
      id: this.users().length + 1,
      username: current.username,
      rol: current.rol,
      activo: true,
      fechaCreacion: new Date().toISOString().split('T')[0]
    };

    this._users.set([...this.users(), nuevo]);

    this.newUser.set({
      username: '',
      password: '',
      rol: 'ASISTENTE'
    });
  }

  toggleUserStatus(id: number) {
    const actualizados = this.users().map(user =>
      user.id === id ? { ...user, activo: !user.activo } : user
    );
    this._users.set(actualizados);
  }

  getRolDescripcion(): string {
    const actualRol = this.roles.find(r => r.id === this.newUser().rol);
    return actualRol ? actualRol.desc : '';
  }
}
