import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from '../../../core/services/user.service';
import { PerfilService } from '../../../core/services/perfil.service';
import { User, PerfilPersonal, UserWithProfile } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  @Input() activeTab!: string;

  private userService = inject(UserService);
  private perfilService = inject(PerfilService);

  usuarios: UserWithProfile[] = [];
  usuariosFiltrados: UserWithProfile[] = [];
  perfiles: PerfilPersonal[] = [];
  searchTerm: string = '';
  page: number = 1;
  itemsPerPage: number = 5; // Estándar fijo: 5 elementos por página
  usernameDisponible: boolean | null = null;
  usuarioEnEdicion: UserWithProfile | null = null;
  showPassword: boolean = false;
  
  /**
   * Modal para mostrar información completa del usuario
   */
  modalInfoVisible: boolean = false;
  usuarioSeleccionado: UserWithProfile | null = null;

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

  // ========== VARIABLES DE PAGINACIÓN Y BÚSQUEDA ==========
  mostrarRoles: boolean = false;
  
  // ========== VARIABLES PARA MODAL ==========
  mostrarModalExito: boolean = false;
  mensajeModal: string = '';
  fechaActual: string = new Date().toLocaleDateString('es-ES');

  // ========== GETTERS PARA PAGINACIÓN ==========
  get usuariosPaginados(): UserWithProfile[] {
    const startIndex = (this.page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.usuariosFiltrados.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.usuariosFiltrados.length / this.itemsPerPage);
  }

  get firstItemNumber(): number {
    return (this.page - 1) * this.itemsPerPage + 1;
  }

  get lastItemNumber(): number {
    const endIndex = this.page * this.itemsPerPage;
    return Math.min(endIndex, this.usuariosFiltrados.length);
  }

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
          this.usuariosFiltrados = [];
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
            this.usuariosFiltrados = [...this.usuarios]; // Inicializar filtrados
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
            this.usuariosFiltrados = [...this.usuarios]; // Inicializar filtrados
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
      console.log('❌ El campo "Nombre de Usuario" es obligatorio.');
      return;
    }
    
    if (!this.newUser.password?.trim()) {
      console.log('❌ VALIDACIÓN FALLÓ: Password vacío');
      console.log('❌ El campo "Contraseña" es obligatorio.');
      return;
    }
    
    if (!this.newUser.rol?.trim()) {
      console.log('❌ VALIDACIÓN FALLÓ: Rol vacío o no seleccionado');
      console.log('❌ Debe seleccionar un rol para el usuario.');
      return;
    }

    // Validación adicional para asegurar que el rol sea válido
    const rolesValidos = ['ADMIN', 'VET', 'ASISTENTE'];
    if (!rolesValidos.includes(this.newUser.rol)) {
      console.log('❌ VALIDACIÓN FALLÓ: Rol inválido:', this.newUser.rol);
      console.log('❌ El rol seleccionado no es válido.');
      return;
    }

    // Validaciones básicas del perfil
    if (!this.newPerfil.nombres?.trim()) {
      console.log('❌ VALIDACIÓN FALLÓ: Nombres vacío');
      console.log('❌ El campo "Nombres" es obligatorio.');
      return;
    }
    
    if (!this.newPerfil.apellidos?.trim()) {
      console.log('❌ VALIDACIÓN FALLÓ: Apellidos vacío');
      console.log('❌ El campo "Apellidos" es obligatorio.');
      return;
    }

    // Verificar si el username ya existe
    const usernameExists = this.usuarios.some(u => u.username.toLowerCase() === this.newUser.username.toLowerCase());
    if (usernameExists) {
      console.log('❌ VALIDACIÓN FALLÓ: Username ya existe');
      console.log('❌ Ese nombre de usuario ya existe.');
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
              
              console.log('✅ Usuario y perfil creados exitosamente');
              this.cargarUsuarios(); // Recargar la lista completa
              this.resetearFormulario();
            },
            error: (perfilError) => {
              console.error('❌ PASO 2 FALLÓ: Error al crear perfil en API de administración', perfilError);
              console.error('Detalles del error:', perfilError.error || perfilError.message);
              
              console.log('⚠️ Usuario creado exitosamente, pero hubo un problema al crear el perfil. Contacte al administrador.');
              this.cargarUsuarios(); // Recargar la lista aunque falle el perfil
              this.resetearFormulario();
            }
          });
        } else {
          console.error('❌ No se recibió usuarioId en la respuesta:', userResponse);
          console.log('❌ Error: No se pudo obtener el ID del usuario creado.');
        }
      },
      error: (userError) => {
        console.error('❌ PASO 1 FALLÓ: Error al crear usuario en API de autenticación', userError);
        console.error('Detalles del error:', userError.error || userError.message);
        
        if (userError.status === 409) {
          console.log('❌ El nombre de usuario ya existe. Elija otro nombre.');
        } else if (userError.status === 400) {
          console.log('❌ Datos inválidos. Verifique todos los campos.');
        } else {
          console.log('❌ Error al crear usuario. Verifique su conexión e intente nuevamente.');
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
      
      // Refrescar lista de usuarios para asegurar sincronización
      this.cargarUsuarios();
      
      this.usuarioEnEdicion = null;
      console.log('✅ Usuario actualizado correctamente.');
    },
    error: err => {
      console.error('❌ Error al actualizar usuario:', err);
      console.error('Detalles del error:', err.error || err.message);
      console.error('❌ Error al actualizar el usuario. Verifique los datos e intente nuevamente.');
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
    console.log('❌ Error: Usuario sin ID válido');
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
        console.log('✅ Usuario desactivado correctamente');
      },
      error: err => {
        console.error('❌ Error al desactivar usuario:', err);
        console.error('Detalles del error:', err.error || err.message);
        console.log('❌ No se pudo desactivar el usuario. Intente nuevamente.');
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
        console.log('✅ Usuario activado correctamente');
      },
      error: err => {
        console.error('❌ Error al activar usuario:', err);
        console.error('Detalles del error:', err.error || err.message);
        console.log('❌ No se pudo activar el usuario. Intente nuevamente.');
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

  /**
   * Obtiene descripción detallada del rol para tooltips
   */
  getRolDescripcion(rol: string): string {
    const descripciones: { [key: string]: string } = {
      'ADMIN': 'Gestión completa del sistema',
      'VET': 'Profesional médico veterinario',
      'ASISTENTE': 'Apoyo administrativo'
    };
    return descripciones[rol] || 'Rol no definido';
  }

  /**
   * Formatea fecha de manera más legible
   */
  formatDate(fecha: string | Date): string {
    if (!fecha) return 'No disponible';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  /**
   * Obtiene tiempo transcurrido desde el registro
   */
  getTimeAgo(fecha: string | Date): string {
    if (!fecha) return '';
    const now = new Date();
    const past = new Date(fecha);
    const diffInMs = now.getTime() - past.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays < 1) return 'Hoy';
    if (diffInDays < 30) return `Hace ${diffInDays} días`;
    if (diffInDays < 365) return `Hace ${Math.floor(diffInDays / 30)} meses`;
    return `Hace ${Math.floor(diffInDays / 365)} años`;
  }

  /**
   * Exportar tabla completa a Excel con formato profesional
   */
  exportarTablaCompleta(): void {
    try {
      // Preparar datos para Excel con headers profesionales
      const datosExcel = this.usuariosFiltrados.map(user => ({
        'ID': user.usuarioId,
        'Usuario': user.username,
        'Nombres': user.perfil?.nombres || 'No registrado',
        'Apellidos': user.perfil?.apellidos || 'No registrado', 
        'Rol': this.getRolLegible(user.rol),
        'Teléfono Emergencia': user.perfil?.telefonoEmergencia || 'No registrado',
        'Dirección': user.perfil?.direccion || 'No registrado',
        'Estado': user.estado,
        'Fecha Registro': this.formatDate(user.fechaRegistro || ''),
        'Tiempo Transcurrido': this.getTimeAgo(user.fechaRegistro || '')
      }));

      // Crear contenido CSV con formato UTF-8
      const headers = Object.keys(datosExcel[0]).join(',');
      const filas = datosExcel.map(fila => 
        Object.values(fila).map(valor => 
          typeof valor === 'string' && valor.includes(',') 
            ? `"${valor}"` 
            : valor
        ).join(',')
      );

      const contenidoCSV = [headers, ...filas].join('\n');
      
      // Crear blob con UTF-8 BOM para soporte de acentos
      const bom = '\uFEFF';
      const blob = new Blob([bom + contenidoCSV], { 
        type: 'text/csv;charset=utf-8;' 
      });

      // Descargar archivo
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `usuarios-sistema-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log('✅ Exportación de tabla completa realizada exitosamente');
    } catch (error) {
      console.error('❌ Error al exportar tabla completa:', error);
    }
  }

  abrirModalInformacionCompleta(user: UserWithProfile): void {
    this.usuarioSeleccionado = user;
    this.modalInfoVisible = true;
  }

  cerrarModalInformacionCompleta(): void {
    this.modalInfoVisible = false;
    this.usuarioSeleccionado = null;
  }

  // ========== MÉTODOS DE PAGINACIÓN ==========
  anteriorPagina(): void {
    if (this.page > 1) {
      this.page--;
    }
  }

  siguientePagina(): void {
    if (this.page < this.totalPages) {
      this.page++;
    }
  }

  // ========== MÉTODOS DE BÚSQUEDA Y EVENTOS ==========
  onSearchChange(): void {
    this.page = 1; // Resetear a la primera página al buscar
    this.filtrarUsuarios();
  }

  onRolChange(): void {
    // Actualizar descripción del rol cuando cambie
    console.log('Rol seleccionado:', this.newUser.rol);
  }

  // ========== MÉTODO DE EXPORTACIÓN INDIVIDUAL ==========
  exportarUsuarioIndividual(user: UserWithProfile): void {
    try {
      const datosUsuario = {
        'ID': user.usuarioId,
        'Usuario': user.username,
        'Nombres': user.perfil?.nombres || 'No registrado',
        'Apellidos': user.perfil?.apellidos || 'No registrado', 
        'Rol': this.getRolLegible(user.rol),
        'Teléfono Emergencia': user.perfil?.telefonoEmergencia || 'No registrado',
        'Dirección': user.perfil?.direccion || 'No registrado',
        'Estado': user.estado,
        'Fecha Registro': this.formatDate(user.fechaRegistro || ''),
        'Tiempo Transcurrido': this.getTimeAgo(user.fechaRegistro || '')
      };

      const headers = Object.keys(datosUsuario).join(',');
      const valores = Object.values(datosUsuario).map(valor => 
        typeof valor === 'string' && valor.includes(',') 
          ? `"${valor}"` 
          : valor
      ).join(',');

      const contenidoCSV = [headers, valores].join('\n');
      
      const bom = '\uFEFF';
      const blob = new Blob([bom + contenidoCSV], { 
        type: 'text/csv;charset=utf-8;' 
      });

      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `usuario-${user.username}-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log('✅ Exportación individual realizada exitosamente');
    } catch (error) {
      console.error('❌ Error al exportar usuario individual:', error);
    }
  }

  // ========== MÉTODO DE FILTRADO ==========
  filtrarUsuarios(): void {
    if (!this.searchTerm.trim()) {
      this.usuariosFiltrados = [...this.usuarios];
    } else {
      const termino = this.searchTerm.toLowerCase();
      this.usuariosFiltrados = this.usuarios.filter(user => 
        user.username.toLowerCase().includes(termino) ||
        user.rol.toLowerCase().includes(termino) ||
        user.estado?.toLowerCase().includes(termino) ||
        user.perfil?.nombres?.toLowerCase().includes(termino) ||
        user.perfil?.apellidos?.toLowerCase().includes(termino)
      );
    }
  }
}
