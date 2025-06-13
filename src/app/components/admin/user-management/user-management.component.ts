import { Component, Input, signal } from '@angular/core';
import { CommonModule, NgComponentOutlet } from '@angular/common';
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
  imports: [CommonModule, FormsModule, NgComponentOutlet],
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

  newUser = signal<NewUser>({ username: '', password: '', rol: 'ASISTENTE' });
  showPassword = signal(false);

  handleCreateUser(event: Event) {
    event.preventDefault();
    const current = this.newUser();
    const next: User = {
      id: this.users().length + 1,
      username: current.username,
      rol: current.rol,
      activo: true,
      fechaCreacion: new Date().toISOString().split('T')[0]
    };
    this._users.set([...this.users(), next]);
    this.newUser.set({ username: '', password: '', rol: 'ASISTENTE' });
  }

  toggleUserStatus(id: number) {
    const updated = this.users().map(u =>
      u.id === id ? { ...u, activo: !u.activo } : u
    );
    this._users.set(updated);
  }
  setUsername(username: string) {
    this.newUser.set({ ...this.newUser(), username });
  }

  setPassword(password: string) {
    this.newUser.set({ ...this.newUser(), password });
  }

  setRol(rol: 'ASISTENTE' | 'VET' | 'ADMIN') {
    this.newUser.set({ ...this.newUser(), rol });
  }

}
