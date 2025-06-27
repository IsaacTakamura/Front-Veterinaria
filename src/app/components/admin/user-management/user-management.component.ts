import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; // ✅ Necesario si el componente es standalone
import { UserService } from '../../../core/services/user.service'; // ✅ Asegúrate de que la ruta es correcta
 // ✅ sin .ts al final

// ✅ Interface para usuarios recibidos o creados
interface User {
  username: string;
  rol: 'VET' | 'ASISTENTE' | 'ADMIN';
  activo?: boolean;
  fechaCreacion?: string;
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule // ✅ Habilita el uso de HttpClient en este componente standalone
  ],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  @Input() activeTab!: string;

  private userService = inject(UserService);

  usuarios: User[] = [];

  // Modelo del nuevo usuario que se va a crear
  newUser: User & { password: string } = {
    username: '',
    password: '',
    rol: 'ASISTENTE'
  };

  showPassword = false;

  // Lista de roles con descripción
  roles = [
    { id: 'ADMIN', label: 'Administrador', desc: 'Acceso completo al sistema' },
    { id: 'VET', label: 'Veterinario', desc: 'Puede gestionar pacientes y consultas' },
    { id: 'ASISTENTE', label: 'Asistente', desc: 'Acceso limitado a citas y triaje' }
  ];


    // 🔜 Aquí podrías implementar la carga de usuarios con una llamada al backend
    // this.userService.getUsuarios().subscribe(users => this.usuarios = users);
    ngOnInit(): void {
      // Cargar lista de usuarios si el endpoint está disponible
      /*
      this.userService.obtenerUsuarios().subscribe({
        next: usuarios => this.usuarios = usuarios,
        error: err => console.error('Error al obtener usuarios:', err)
      });
      */
    }




  /**
   * Envía los datos del nuevo usuario al backend
   */
  handleCreateUser(event: Event): void {
    event.preventDefault();

    this.userService.registrarUsuario(this.newUser).subscribe({
      next: (res: any) => {
        alert('Usuario creado con éxito');
        this.usuarios.push({
          username: res.username,
          rol: res.rol,
          activo: true,
          fechaCreacion: new Date().toISOString().split('T')[0]
        });

        // Limpiar formulario
        this.newUser = {
          username: '',
          password: '',
          rol: 'ASISTENTE'
        };
      },
      error: (err: any) => {
        console.error(err);
        alert(err.error?.mensaje || 'Error al crear el usuario');
      }
    });
  }

  /**
   * Devuelve la descripción del rol actual seleccionado
   */
  getRolDescripcion(): string {
    const actual = this.roles.find(r => r.id === this.newUser.rol);
    return actual ? actual.desc : '';
  }

 // Método para cambiar estado activo/inactivo de un usuario desde backend (futuro)
/*
toggleUserStatus(username: string): void {
  this.userService.cambiarEstado(username).subscribe({
    next: () => {
      const user = this.usuarios.find(u => u.username === username);
      if (user) user.activo = !user.activo;
    },
    error: err => {
      console.error(err);
      alert('No se pudo cambiar el estado del usuario.');
    }
  });
}
*/


}
