import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; // ✅ Necesario si el componente es standalone
import { UserService } from '../../../core/services/user.service'; // ✅ Asegúrate de que la ruta es correcta
import { NgxPaginationModule } from 'ngx-pagination';
import { User } from '../../../core/models/user.model'; // ✅ Interface actualizada para incluir ID y estado

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
     NgxPaginationModule // ← aquí
  ],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  @Input() activeTab!: string;

  private userService = inject(UserService);
// ✅ Inyectamos el servicio de usuarios
  // ✅ Usamos una propiedad privada para el servicio
  usuarios: User[] = [];
  searchTerm: string = '';
  page: number = 1;
  usernameDisponible: boolean | null = null;
  usuarioEnEdicion: User | null = null;


  // Modelo del nuevo usuario que se va a crear
  newUser: User & { password: string } = {
    username: '',
    password: '',
    rol: 'ASISTENTE'
  };

  showPassword = false;

  roles = [
    { id: 'ADMIN', label: 'Administrador', desc: 'Acceso completo al sistema' },
    { id: 'VET', label: 'Veterinario', desc: 'Puede gestionar pacientes y consultas' },
    { id: 'ASISTENTE', label: 'Asistente', desc: 'Acceso limitado a citas y triaje' }
  ];

  // Método para inicializar el componente y cargar usuarios
  // ✅ Usamos el servicio para obtener la lista de usuarios
  // ✅ Mapeamos los datos para incluir el estado y la fecha de registro
  // ✅ Usamos el operador `subscribe` para manejar la respuesta
  // ✅ Agregamos manejo de errores para mostrar un mensaje en caso de fallo
ngOnInit(): void {
  this.userService.obtenerUsuarios().subscribe({
    next: (res) => {
      const usuariosRaw = res.data;
      this.usuarios = usuariosRaw.map((u: any) => ({
        usuarioId: u.usuarioId,
        username: u.username,
        rol: u.rol,
        estado: u.estado,
        activo: u.estado === 'ACTIVO',
        fechaCreacion: u.fechaRegistro ? u.fechaRegistro.split('T')[0] : '',
        password: u.password // ✅ importante para conservarla
      }));
    },
    error: (err) => {
      console.error('Error al obtener usuarios:', err);
    }
  });
}




  /**
   * Envía los datos del nuevo usuario al backend, incluyendo estado y fecha
   */
  handleCreateUser(event: Event): void {
    if (!this.newUser.username.trim() || !this.newUser.password.trim() || !this.newUser.rol) {
      alert('Todos los campos son obligatorios.');
      return;
    }

    const usernameExists = this.usuarios.some(u => u.username.toLowerCase() === this.newUser.username.toLowerCase());

    if (usernameExists) {
      alert('Ese nombre de usuario ya existe.');
      return;
    }

    event.preventDefault();

    const payload = {
      ...this.newUser,
      estado: 'ACTIVO', // 🔧 enviar estado explícitamente
      fechaCreacion: new Date().toISOString() // 🔧 formato ISO para backend
    };

    this.userService.registrarUsuario(payload).subscribe({
      next: (res: any) => {
        this.mostrarMensajeExito(`✅ Usuario "${res.username}" creado correctamente.`);

        // Agregar el nuevo usuario a la lista local
        this.usuarios.push({
          usuarioId: res.usuarioId,
          username: res.username,
          rol: res.rol,
          estado: res.estado,
          activo: res.estado === 'ACTIVO',
          fechaCreacion: res.fechaRegistro?.split('T')[0] || new Date().toISOString().split('T')[0]
        });

        this.page = 1; // Reiniciar paginación al crear un nuevo usuario


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

  getRolDescripcion(): string {
    const actual = this.roles.find(r => r.id === this.newUser.rol);
    return actual ? actual.desc : '';
  }

  /**
   * Cambia el estado del usuario vía backend, usando el ID (no username)
   */
  toggleUserStatus(usuarioId: number): void {
    this.userService.desactivarUsuario(usuarioId).subscribe({
      next: () => {
        const user = this.usuarios.find(u => u.usuarioId === usuarioId);
        if (user) {
          user.activo = false;
          user.estado = 'INACTIVO';
        }
      },
      error: err => {
        console.error('Error al cambiar estado del usuario.', err);
      }
    });
  }


 get usuariosFiltrados(): User[] {
  if (!this.searchTerm?.trim()) return this.usuarios;
  const term = this.searchTerm.toLowerCase();
  return this.usuarios.filter(u =>
    u.username.toLowerCase().includes(term) ||
    u.rol.toLowerCase().includes(term) ||
    u.estado?.toLowerCase().includes(term)
  );
}


validarUsernameEnVivo(): void {
  const nombre = this.newUser.username.trim();
  if (!nombre) {
    this.usernameDisponible = null;
    return;
  }

  this.userService.obtenerUsuarioPorUsername(nombre).subscribe({
    next: () => {
      this.usernameDisponible = false;
    },
    error: (err) => {
      if (err.status === 404) {
        this.usernameDisponible = true;
      } else {
        console.error('Error al validar username:', err);
        this.usernameDisponible = null;
      }
    }
  });
}
/**
 * Inicia la edición de un usuario
 * Crea una copia del usuario para editar sin modificar la lista original
 * @param user Usuario a editar
 */
iniciarEdicion(user: User): void {
  this.usuarioEnEdicion = { ...user };
}

/**
 * Guarda los cambios del usuario en edición
 * Envía los datos actualizados al backend y actualiza la lista local
 * Resetea el objeto de usuario en edición a null
 */
guardarEdicion(): void {
  if (!this.usuarioEnEdicion) return;

  const payload = {
    usuarioId: this.usuarioEnEdicion.usuarioId!,
    username: this.usuarioEnEdicion.username,
    rol: this.usuarioEnEdicion.rol,
    estado: this.usuarioEnEdicion.estado!,
    password: this.usuarioEnEdicion.password ?? '',
    fechaRegistro: this.usuarioEnEdicion.fechaCreacion + 'T00:00:00' // importante mantener esta fecha
  };

  this.userService.actualizarUsuario(payload).subscribe({
    next: () => {
      const idx = this.usuarios.findIndex(u => u.usuarioId === payload.usuarioId);
      if (idx !== -1) {
        this.usuarios[idx] = {
          ...this.usuarios[idx],
          ...payload,
          activo: payload.estado === 'ACTIVO',
          fechaCreacion: payload.fechaRegistro.split('T')[0]
        };
      }
      this.usuarioEnEdicion = null;
      this.mostrarMensajeExito('✅ Usuario actualizado correctamente.');

    },
    error: err => {
      console.error('Error al actualizar usuario', err);
      alert('❌ Fallo al actualizar el usuario');
    }
  });
}



  /**
   * Cancela la edición del usuario actual
   * Resetea el objeto de usuario en edición a null
   */
  cancelarEdicion(): void {
    this.usuarioEnEdicion = null;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

// Método para actualizar el estado de un usuario
cambiarEstadoToggle(user: User): void {
  if (!user.usuarioId) return;

  const nuevoEstado = user.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';

  if (nuevoEstado === 'INACTIVO') {
    // 🔴 Desactivar usando la API específica
    this.userService.desactivarUsuario(user.usuarioId).subscribe({
      next: () => {
        user.estado = 'INACTIVO';
        user.activo = false;
      },
      error: err => {
        console.error('Error al desactivar usuario', err);
        alert('❌ No se pudo desactivar al usuario');
      }
    });
  } else {
    // 🟢 Activar usando la API general de actualización (enviando todos los campos necesarios)
    const payload = {
      usuarioId: user.usuarioId!,
      username: user.username,
      rol: user.rol,
      estado: 'ACTIVO',
      password: user.password ?? '',
      fechaRegistro: user.fechaCreacion + 'T00:00:00' // 🕒 reconstruimos fecha ISO válida
    };

    this.userService.actualizarUsuario(payload).subscribe({
      next: () => {
        user.estado = 'ACTIVO';
        user.activo = true;
      },
      error: err => {
        console.error('Error al activar usuario', err);
        alert('❌ No se pudo activar al usuario');
      }
    });
  }
}



// Método para obtener una descripción legible del rol
getRolLegible(rol: string): string {
  switch (rol) {
    case 'ADMIN': return '👑 Administrador';
    case 'VET': return '🐾 Veterinario';
    case 'ASISTENTE': return '📋 Asistente';
    default: return rol;
  }
}
// Variable para controlar la visibilidad de los roles y permisos
// ✅ Usamos una variable booleana para mostrar/ocultar la sección de roles
mostrarRoles: boolean = false;


// Variables para el modal de éxito
// ✅ Usamos una variable booleana para controlar la visibilidad del modal
// ✅ Usamos una variable para el mensaje del modal
mostrarModalExito: boolean = false;
mensajeModal: string = '';

// Método para mostrar el modal de éxito con un mensaje
// ✅ Usamos un método que recibe un mensaje y lo muestra en el modal
mostrarMensajeExito(mensaje: string): void {
  this.mensajeModal = mensaje;
  this.mostrarModalExito = true;

  // Cerrar automáticamente después de 3 segundos
  setTimeout(() => {
    this.mostrarModalExito = false;
  }, 500);
}


}
