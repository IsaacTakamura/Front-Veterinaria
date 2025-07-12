import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from '../../../core/services/user.service';
import { PerfilService } from '../../../core/services/perfil.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { User, PerfilPersonal, UserWithProfile } from '../../../core/models/user.model';

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
  private perfilService = inject(PerfilService);

  usuarios: UserWithProfile[] = [];
  perfiles: PerfilPersonal[] = [];
  searchTerm: string = '';
  page: number = 1;
  itemsPerPage: number = 10;
  usernameDisponible: boolean | null = null;
  usuarioEnEdicion: UserWithProfile | null = null;
  showPassword: boolean = false;

  // Modelo del nuevo usuario (separado en usuario base y perfil)
  newUser: User & { password: string } = {
    username: '',
    password: '',
    rol: 'ASISTENTE' // Valor por defecto válido
  };

  newPerfil: PerfilPersonal = {
    nombres: '',
    apellidos: '',
    telefonoEmergencia: '',
    direccion: '',
    alergias: '',
    usuarioId: 0
  };

  roles = [
    { id: 'ADMIN', label: 'Administrador', desc: 'Acceso completo al sistema' },
    { id: 'VET', label: 'Veterinario', desc: 'Puede gestionar pacientes y consultas' },
    { id: 'ASISTENTE', label: 'Asistente', desc: 'Acceso limitado a citas y triaje' }
  ];

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  /**
   * Carga usuarios y sus perfiles asociados
   * Este método coordina dos APIs:
   * 1. API de autenticación para obtener usuarios (username, rol, estado, etc.)
   * 2. API de administración para obtener perfiles (nombres, apellidos, contacto, etc.)
   */
  cargarUsuarios(): void {
    console.log('🔄 Cargando usuarios y perfiles...');
    
    // PASO 1: Cargar usuarios base desde API de autenticación
    this.userService.obtenerUsuarios().subscribe({
      next: (usuariosResponse) => {
        console.log('✅ Usuarios obtenidos de API de autenticación:', usuariosResponse);
        
        const usuarios = usuariosResponse.data || [];
        
        if (usuarios.length === 0) {
          console.log('ℹ️ No hay usuarios registrados');
          this.usuarios = [];
          return;
        }
        
        // PASO 2: Cargar perfiles desde API de administración
        this.perfilService.listarPerfiles().subscribe({
          next: (perfilesResponse) => {
            console.log('✅ Perfiles obtenidos de API de administración:', perfilesResponse);
            
            const perfiles = perfilesResponse.data || [];
            
            // PASO 3: Combinar usuarios con sus perfiles
            this.usuarios = usuarios.map(usuario => {
              const perfil = perfiles.find((p: any) => p.usuarioId === usuario.usuarioId);
              
              const usuarioConPerfil = {
                ...usuario,
                perfil: perfil || null
              };
              
              // Log detallado para debugging
              if (perfil) {
                console.log(`✅ Usuario ${usuario.username} (ID: ${usuario.usuarioId}) vinculado con perfil:`, perfil);
              } else {
                console.log(`⚠️ Usuario ${usuario.username} (ID: ${usuario.usuarioId}) sin perfil asociado`);
              }
              
              return usuarioConPerfil;
            });
            
            console.log('🎉 CARGA COMPLETA: Usuarios con perfiles combinados:', this.usuarios);
            console.log(`📊 Total: ${this.usuarios.length} usuarios, ${perfiles.length} perfiles`);
          },
          error: (perfilesError) => {
            console.error('❌ Error al cargar perfiles desde API de administración:', perfilesError);
            console.error('Detalles del error:', perfilesError.error || perfilesError.message);
            
            // Si falla cargar perfiles, al menos mostrar usuarios base
            this.usuarios = usuarios.map(usuario => ({
              ...usuario,
              perfil: null
            }));
            
            console.log('⚠️ Usuarios cargados sin perfiles debido al error:', this.usuarios);
          }
        });
      },
      error: (usuariosError) => {
        console.error('❌ Error al cargar usuarios desde API de autenticación:', usuariosError);
        console.error('Detalles del error:', usuariosError.error || usuariosError.message);
        
        this.usuarios = [];
      }
    });
  }




  /**
   * Crea usuario y su perfil por separado según las APIs disponibles
   * Este método maneja el flujo completo de creación en dos pasos:
   * 1. Crear usuario en API de autenticación
   * 2. Crear perfil en API de administración con el usuarioId generado
   */
  handleCreateUser(event: Event): void {
    event.preventDefault();
    
    console.log('🔍 DEBUGGING - Valores del formulario:');
    console.log('Username:', this.newUser.username);
    console.log('Password length:', this.newUser.password?.length || 0);
    console.log('Rol seleccionado:', this.newUser.rol);
    console.log('Nombres:', this.newPerfil.nombres);
    console.log('Apellidos:', this.newPerfil.apellidos);
    
    // Validaciones básicas del usuario con logging detallado
    if (!this.newUser.username?.trim()) {
      console.log('❌ VALIDACIÓN FALLÓ: Username vacío');
      this.mostrarMensajeExito('❌ El campo "Nombre de Usuario" es obligatorio.');
      return;
    }
    
    if (!this.newUser.password?.trim()) {
      console.log('❌ VALIDACIÓN FALLÓ: Password vacío');
      this.mostrarMensajeExito('❌ El campo "Contraseña" es obligatorio.');
      return;
    }
    
    if (!this.newUser.rol?.trim()) {
      console.log('❌ VALIDACIÓN FALLÓ: Rol vacío o no seleccionado');
      this.mostrarMensajeExito('❌ Debe seleccionar un rol para el usuario.');
      return;
    }

    // Validación adicional para asegurar que el rol sea válido
    const rolesValidos = ['ADMIN', 'VET', 'ASISTENTE'];
    if (!rolesValidos.includes(this.newUser.rol)) {
      console.log('❌ VALIDACIÓN FALLÓ: Rol inválido:', this.newUser.rol);
      this.mostrarMensajeExito('❌ El rol seleccionado no es válido.');
      return;
    }

    // Validaciones básicas del perfil
    if (!this.newPerfil.nombres?.trim()) {
      console.log('❌ VALIDACIÓN FALLÓ: Nombres vacío');
      this.mostrarMensajeExito('❌ El campo "Nombres" es obligatorio.');
      return;
    }
    
    if (!this.newPerfil.apellidos?.trim()) {
      console.log('❌ VALIDACIÓN FALLÓ: Apellidos vacío');
      this.mostrarMensajeExito('❌ El campo "Apellidos" es obligatorio.');
      return;
    }

    // Verificar si el username ya existe
    const usernameExists = this.usuarios.some(u => u.username.toLowerCase() === this.newUser.username.toLowerCase());
    if (usernameExists) {
      console.log('❌ VALIDACIÓN FALLÓ: Username ya existe');
      this.mostrarMensajeExito('❌ Ese nombre de usuario ya existe.');
      return;
    }

    console.log('✅ TODAS LAS VALIDACIONES PASARON - Procediendo a crear usuario...');

    console.log('🚀 PASO 1: Creando usuario en API de autenticación...');
    console.log('🔧 Usuario a crear (rol corregido):', this.newUser);
    
    // ✅ Validación adicional: confirmar que el rol es el correcto
    if (this.newUser.rol === 'VET') {
      console.log('✅ CONFIRMADO: Rol VET será enviado al backend (correcto)');
    }

    // PASO 1: Crear el usuario en la API de autenticación
    this.userService.registrarUsuario(this.newUser).subscribe({
      next: (userResponse) => {
        console.log('✅ PASO 1 COMPLETADO: Usuario creado en API de autenticación', userResponse);
        
        // Verificar que se obtuvo el usuarioId
        if (userResponse?.data?.usuarioId || userResponse?.usuarioId) {
          const usuarioId = userResponse.data?.usuarioId || userResponse.usuarioId;
          
          console.log('🚀 PASO 2: Creando perfil en API de administración...');
          console.log('Perfil a crear:', { ...this.newPerfil, usuarioId });
          
          // PASO 2: Crear el perfil asociado en la API de administración
          this.newPerfil.usuarioId = usuarioId;
          this.perfilService.crearPerfil(this.newPerfil).subscribe({
            next: (perfilResponse) => {
              console.log('✅ PASO 2 COMPLETADO: Perfil creado en API de administración', perfilResponse);
              console.log('🎉 PROCESO COMPLETO: Usuario y perfil creados exitosamente');
              
              this.mostrarMensajeExito('✅ Usuario y perfil creados exitosamente');
              this.cargarUsuarios(); // Recargar la lista completa
              this.resetearFormulario();
            },
            error: (perfilError) => {
              console.error('❌ PASO 2 FALLÓ: Error al crear perfil en API de administración', perfilError);
              console.error('Detalles del error:', perfilError.error || perfilError.message);
              
              this.mostrarMensajeExito('⚠️ Usuario creado exitosamente, pero hubo un problema al crear el perfil. Contacte al administrador.');
              this.cargarUsuarios(); // Recargar la lista aunque falle el perfil
              this.resetearFormulario();
            }
          });
        } else {
          console.error('❌ No se recibió usuarioId en la respuesta:', userResponse);
          this.mostrarMensajeExito('❌ Error: No se pudo obtener el ID del usuario creado.');
        }
      },
      error: (userError) => {
        console.error('❌ PASO 1 FALLÓ: Error al crear usuario en API de autenticación', userError);
        console.error('Detalles del error:', userError.error || userError.message);
        
        if (userError.status === 409) {
          this.mostrarMensajeExito('❌ El nombre de usuario ya existe. Elija otro nombre.');
        } else if (userError.status === 400) {
          this.mostrarMensajeExito('❌ Datos inválidos. Verifique todos los campos.');
        } else {
          this.mostrarMensajeExito('❌ Error al crear usuario. Verifique su conexión e intente nuevamente.');
        }
      }
    });
  }

  /**
   * Resetea los formularios después de crear un usuario
   */
  resetearFormulario(): void {
    this.newUser = {
      username: '',
      password: '',
      rol: 'ASISTENTE' // Valor por defecto después de crear usuario
    };

    this.newPerfil = {
      nombres: '',
      apellidos: '',
      telefonoEmergencia: '',
      direccion: '',
      alergias: '',
      usuarioId: 0
    };

    this.page = 1;
    
    console.log('🔄 Formulario reseteado con valores por defecto');
  }

  getRolDescripcion(rol?: string): string {
    if (rol) {
      switch (rol) {
        case 'ADMIN': return 'Gestión completa del sistema';
        case 'VET': return 'Profesional médico veterinario';
        case 'ASISTENTE': return 'Apoyo administrativo';
        default: return '';
      }
    }
    // Versión original para el formulario
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
          user.estado = 'INACTIVO';
        }
      },
      error: err => {
        console.error('Error al cambiar estado del usuario.', err);
      }
    });
  }


 get usuariosFiltrados(): UserWithProfile[] {
  if (!this.searchTerm?.trim()) return this.usuarios;
  const term = this.searchTerm.toLowerCase();
  return this.usuarios.filter(u =>
    u.username.toLowerCase().includes(term) ||
    u.rol.toLowerCase().includes(term) ||
    u.estado?.toLowerCase().includes(term) ||
    u.perfil?.nombres?.toLowerCase().includes(term) ||
    u.perfil?.apellidos?.toLowerCase().includes(term) ||
    u.perfil?.direccion?.toLowerCase().includes(term) ||
    u.perfil?.telefonoEmergencia?.includes(term)
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
iniciarEdicion(user: UserWithProfile): void {
  // Crear una copia profunda del usuario para evitar mutaciones no deseadas
  this.usuarioEnEdicion = {
    ...user,
    perfil: user.perfil ? { ...user.perfil } : undefined // Copia profunda del perfil también
  };
  
  console.log('📝 Iniciando edición de usuario:', this.usuarioEnEdicion);
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
    fechaRegistro: this.usuarioEnEdicion.fechaRegistro || new Date().toISOString()
  };

  console.log('📤 Guardando cambios de usuario:', payload);

  this.userService.actualizarUsuario(payload).subscribe({
    next: (response) => {
      console.log('✅ Usuario actualizado exitosamente:', response);
      
      // Actualizar solo los campos necesarios manteniendo el perfil y otros datos
      const idx = this.usuarios.findIndex(u => u.usuarioId === payload.usuarioId);
      if (idx !== -1) {
        this.usuarios[idx] = {
          ...this.usuarios[idx], // Mantener todos los datos existentes (incluido perfil)
          username: payload.username,
          rol: payload.rol,
          estado: payload.estado,
          fechaRegistro: payload.fechaRegistro.split('T')[0]
        };
        console.log('✅ Usuario actualizado en la lista local:', this.usuarios[idx]);
      }
      
      // Refrescar datos del usuario para asegurar sincronización
      this.actualizarUsuarioEspecifico(payload.usuarioId);
      
      this.usuarioEnEdicion = null;
      this.mostrarMensajeExito('✅ Usuario actualizado correctamente.');
    },
    error: err => {
      console.error('❌ Error al actualizar usuario:', err);
      console.error('Detalles del error:', err.error || err.message);
      this.mostrarMensajeExito('❌ Error al actualizar el usuario. Verifique los datos e intente nuevamente.');
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
cambiarEstadoToggle(user: UserWithProfile): void {
  if (!user.usuarioId) {
    console.error('❌ Usuario sin ID válido:', user);
    this.mostrarMensajeExito('❌ Error: Usuario sin ID válido');
    return;
  }

  const nuevoEstado = user.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
  const accion = nuevoEstado === 'ACTIVO' ? 'activar' : 'desactivar';
  
  console.log(`🔄 Cambiando estado de usuario ${user.usuarioId} de ${user.estado} a ${nuevoEstado}`);

  if (nuevoEstado === 'INACTIVO') {
    // 🔴 Desactivar usando la API específica
    this.userService.desactivarUsuario(user.usuarioId).subscribe({
      next: (response) => {
        console.log('✅ Usuario desactivado exitosamente:', response);
        user.estado = 'INACTIVO';
        this.mostrarMensajeExito('✅ Usuario desactivado correctamente');
      },
      error: err => {
        console.error('❌ Error al desactivar usuario:', err);
        console.error('Detalles del error:', err.error || err.message);
        this.mostrarMensajeExito('❌ No se pudo desactivar el usuario. Intente nuevamente.');
      }
    });
  } else {
    // 🟢 Activar usando la API general de actualización
    const payload = {
      usuarioId: user.usuarioId,
      username: user.username,
      rol: user.rol,
      estado: 'ACTIVO',
      password: user.password ?? '',
      fechaRegistro: user.fechaRegistro || new Date().toISOString()
    };

    console.log('📤 Enviando payload para activar usuario:', payload);

    this.userService.actualizarUsuario(payload).subscribe({
      next: (response) => {
        console.log('✅ Usuario activado exitosamente:', response);
        user.estado = 'ACTIVO';
        this.mostrarMensajeExito('✅ Usuario activado correctamente');
      },
      error: err => {
        console.error('❌ Error al activar usuario:', err);
        console.error('Detalles del error:', err.error || err.message);
        this.mostrarMensajeExito('❌ No se pudo activar el usuario. Intente nuevamente.');
      }
    });
  }
}  /**
   * Convierte el rol del usuario a un formato legible
   */
  getRolLegible(rol: string): string {
    switch (rol) {
      case 'ADMIN': return 'Administrador';
      case 'VET': return 'Veterinario';
      case 'ASISTENTE': return 'Asistente';
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
  }, 3000);
}


// ========== MÉTODOS DE PAGINACIÓN ==========
  
  /**
   * Obtiene el número total de páginas para los usuarios filtrados
   */
  get totalPages(): number {
    return Math.ceil(this.usuariosFiltrados.length / this.itemsPerPage);
  }

  /**
   * Obtiene el número del primer elemento mostrado en la página actual
   */
  get firstItemNumber(): number {
    if (this.usuariosFiltrados.length === 0) return 0;
    return ((this.page - 1) * this.itemsPerPage) + 1;
  }

  /**
   * Obtiene el número del último elemento mostrado en la página actual
   */
  get lastItemNumber(): number {
    const lastItem = this.page * this.itemsPerPage;
    return Math.min(lastItem, this.usuariosFiltrados.length);
  }

  /**
   * Resetea la página a 1 cuando se hace una búsqueda
   */
  onSearchChange(): void {
    this.page = 1;
  }

  /**
   * Cambia el número de elementos por página
   */
  changeItemsPerPage(newItemsPerPage: number): void {
    this.itemsPerPage = newItemsPerPage;
    this.page = 1; // Resetear a la primera página
  }


// ========== MÉTODOS DE VALIDACIÓN ==========
  
  /**
   * Valida si un email tiene formato correcto
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Valida si una cédula tiene formato correcto (Ecuador)
   */
  isValidCedula(cedula: string): boolean {
    return cedula.length === 10 && /^\d+$/.test(cedula);
  }

  // ========== MÉTODOS DE DEBUGGING ==========
  
  /**
   * Método para probar la conectividad con ambas APIs
   * Útil para debugging durante desarrollo
   */
  probarAPIs(): void {
    console.log('🔍 Probando conectividad con APIs...');
    
    // Probar API de usuarios
    this.userService.obtenerUsuarios().subscribe({
      next: (response) => {
        console.log('✅ API de usuarios funciona:', response);
      },
      error: (error) => {
        console.error('❌ API de usuarios falló:', error);
      }
    });
    
    // Probar API de perfiles  
    this.perfilService.listarPerfiles().subscribe({
      next: (response) => {
        console.log('✅ API de perfiles funciona:', response);
      },
      error: (error) => {
        console.error('❌ API de perfiles falló:', error);
      }
    });
  }

  cambiarEstadoUsuario(usuarioId: number, estadoActual: string): void {
    const nuevoEstado = estadoActual === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
    const accion = nuevoEstado === 'ACTIVO' ? 'activar' : 'desactivar';
    
    if (confirm(`¿Está seguro de que desea ${accion} este usuario?`)) {
      console.log(`🔄 Cambiando estado de usuario ${usuarioId} a ${nuevoEstado}`);
      // Aquí iría la lógica para cambiar el estado
      // Ejemplo: this.userService.cambiarEstado(usuarioId, nuevoEstado).subscribe(...)
      
      this.mostrarMensajeExito(`🔄 Usuario ${accion === 'activar' ? 'activado' : 'desactivado'} exitosamente`);
    }
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return 'N/A';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
  }

  formatearHora(fecha: string): string {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  tiempoTranscurrido(fecha: string): string {
    if (!fecha) return 'N/A';
    const ahora = new Date();
    const fechaRegistro = new Date(fecha);
    const diffMs = ahora.getTime() - fechaRegistro.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `${diffDays} días`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} semanas`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} meses`;
    return `${Math.floor(diffDays / 365)} años`;
  }

  /**
   * Actualiza los datos de un usuario específico recargando desde las APIs
   * Útil después de cambios críticos para mantener sincronización
   */
  actualizarUsuarioEspecifico(usuarioId: number): void {
    console.log(`🔄 Actualizando datos del usuario ${usuarioId}...`);
    
    // Buscar el usuario en la API de autenticación
    this.userService.obtenerUsuarios().subscribe({
      next: (usuariosResponse) => {
        const usuarios = usuariosResponse.data || [];
        const usuarioActualizado = usuarios.find((u: any) => u.usuarioId === usuarioId);
        
        if (usuarioActualizado) {
          // Buscar el perfil asociado
          this.perfilService.listarPerfiles().subscribe({
            next: (perfilesResponse) => {
              const perfiles = perfilesResponse.data || [];
              const perfil = perfiles.find((p: any) => p.usuarioId === usuarioId);
              
              // Actualizar en la lista local
              const idx = this.usuarios.findIndex(u => u.usuarioId === usuarioId);
              if (idx !== -1) {
                this.usuarios[idx] = {
                  ...usuarioActualizado,
                  perfil: perfil || undefined
                };
                console.log(`✅ Usuario ${usuarioId} actualizado en lista local:`, this.usuarios[idx]);
              }
            },
            error: (error) => {
              console.error('❌ Error al actualizar perfil del usuario:', error);
            }
          });
        }
      },
      error: (error) => {
        console.error('❌ Error al actualizar datos del usuario:', error);
      }
    });
  }

  /**
   * Método temporal para debugging del formulario
   * Imprime todos los valores actuales para identificar problemas
   */
  debugFormulario(): void {
    console.log('🔍 === DEBUG COMPLETO DEL FORMULARIO ===');
    console.log('=== DATOS DEL USUARIO ===');
    console.log('newUser object:', this.newUser);
    console.log('username:', `"${this.newUser.username}"`);
    console.log('password:', `"${this.newUser.password}"`);
    console.log('rol:', `"${this.newUser.rol}"`);
    console.log('username length:', this.newUser.username?.length || 0);
    console.log('password length:', this.newUser.password?.length || 0);
    console.log('rol length:', this.newUser.rol?.length || 0);
    
    console.log('=== DATOS DEL PERFIL ===');
    console.log('newPerfil object:', this.newPerfil);
    console.log('nombres:', `"${this.newPerfil.nombres}"`);
    console.log('apellidos:', `"${this.newPerfil.apellidos}"`);
    console.log('telefonoEmergencia:', `"${this.newPerfil.telefonoEmergencia}"`);
    console.log('direccion:', `"${this.newPerfil.direccion}"`);
    console.log('alergias:', `"${this.newPerfil.alergias}"`);
    
    console.log('=== VALIDACIONES ===');
    console.log('username válido:', !!this.newUser.username?.trim());
    console.log('password válido:', !!this.newUser.password?.trim());
    console.log('rol válido:', !!this.newUser.rol?.trim());
    console.log('nombres válido:', !!this.newPerfil.nombres?.trim());
    console.log('apellidos válido:', !!this.newPerfil.apellidos?.trim());
    console.log('=====================================');
    
    // Mostrar también un modal con la información
    const info = `
    Usuario: "${this.newUser.username}" (${this.newUser.username?.length || 0} chars)
    Password: ${this.newUser.password?.length || 0} caracteres
    Rol: "${this.newUser.rol}" (${this.newUser.rol?.length || 0} chars)
    Nombres: "${this.newPerfil.nombres}" (${this.newPerfil.nombres?.length || 0} chars)
    Apellidos: "${this.newPerfil.apellidos}" (${this.newPerfil.apellidos?.length || 0} chars)
    `;
    
    this.mostrarMensajeExito(`🔍 DEBUG INFO: ${info}`);
  }

  /**
   * Método para limpiar y normalizar el rol seleccionado
   * Elimina espacios en blanco y asegura que el valor sea válido
   */
  normalizarRol(): void {
    if (this.newUser.rol) {
      const rolLimpio = this.newUser.rol.trim().toUpperCase();
      const rolesValidos: ('ADMIN' | 'VET' | 'ASISTENTE')[] = ['ADMIN', 'VET', 'ASISTENTE'];
      
      if (rolesValidos.includes(rolLimpio as any)) {
        this.newUser.rol = rolLimpio as 'ADMIN' | 'VET' | 'ASISTENTE';
        console.log('🔧 Rol normalizado:', this.newUser.rol);
      } else {
        console.log('❌ Rol inválido detectado:', rolLimpio);
        this.newUser.rol = 'ASISTENTE'; // Valor por defecto si es inválido
      }
    }
  }

  /**
   * Método llamado cuando cambia el select del rol
   * Normaliza el valor y hace debug
   */
  onRolChange(): void {
    console.log('🔄 Rol cambiado a:', this.newUser.rol);
    this.normalizarRol();
    console.log('✅ Rol después de normalizar:', this.newUser.rol);
  }
}
