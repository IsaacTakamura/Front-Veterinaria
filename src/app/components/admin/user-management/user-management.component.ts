import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from '../../../core/services/user.service';
import { PerfilService } from '../../../core/services/perfil.service';
import { VeterinarioService, CrearVeterinarioRequest } from '../../../core/services/veterinario.service';
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
  private veterinarioService = inject(VeterinarioService);

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
    usuarioId: 0,
    dni: '' // Agregar DNI
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
  mostrarModalError: boolean = false;
  mensajeModal: string = '';
  fechaActual: string = new Date().toLocaleDateString('es-ES');

  // ========== VARIABLES PARA EDICIÓN AVANZADA ==========
  mostrarFormularioRol: boolean = false;
  mostrarFormularioPerfil: boolean = false;
  
  // Variable para editar perfil
  perfilEnEdicion: PerfilPersonal = {
    perfilId: 0,
    nombres: '',
    apellidos: '',
    telefonoEmergencia: '',
    direccion: '',
    alergias: '',
    usuarioId: 0,
    dni: '' // Incluir DNI
  };

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

  // ========== MÉTODOS DE VALIDACIÓN ==========
  
  /**
   * Genera el username automáticamente basado en nombre, apellido y rol
   * Nueva política: 1 letra del nombre + primer apellido + sufijo del rol
   * Ejemplo: Juan Carlos Chavez Perez + Veterinario = "jchavez-vet"
   */
  generarUsername(): void {
    if (this.newPerfil.nombres && this.newPerfil.apellidos && this.newUser.rol) {
      // Limpiar y normalizar textos
      const nombres = this.newPerfil.nombres.trim().toLowerCase();
      const apellidos = this.newPerfil.apellidos.trim().toLowerCase();
      
      // Tomar la 1ra letra del nombre
      const primeraLetra = nombres.substring(0, 1);
      
      // Tomar el primer apellido solamente
      const primerApellido = apellidos.split(' ')[0];
      
      // Determinar sufijo según el rol
      let sufijo = '';
      switch (this.newUser.rol) {
        case 'ADMIN':
          sufijo = 'adm';
          break;
        case 'VET':
          sufijo = 'vet';
          break;
        case 'ASISTENTE':
          sufijo = 'asist';
          break;
        default:
          sufijo = 'user';
      }
      
      // Generar username
      this.newUser.username = `${primeraLetra}${primerApellido}-${sufijo}`;
      
      console.log(`🎯 Username generado: ${this.newUser.username} (${primeraLetra} + ${primerApellido} + -${sufijo})`);
      console.log(`📝 Detalles: Nombre="${nombres}" → "${primeraLetra}" | Apellido="${apellidos}" → "${primerApellido}" | Rol="${this.newUser.rol}" → "${sufijo}"`);
    }
  }

  /**
   * Obtiene una vista previa del username que se generaría
   */
  getPreviewUsername(): string {
    if (this.newPerfil.nombres && this.newPerfil.apellidos && this.newUser.rol) {
      const nombres = this.newPerfil.nombres.trim().toLowerCase();
      const apellidos = this.newPerfil.apellidos.trim().toLowerCase();
      const primeraLetra = nombres.substring(0, 1);
      const primerApellido = apellidos.split(' ')[0];
      
      let sufijo = '';
      switch (this.newUser.rol) {
        case 'ADMIN':
          sufijo = 'adm';
          break;
        case 'VET':
          sufijo = 'vet';
          break;
        case 'ASISTENTE':
          sufijo = 'asist';
          break;
        default:
          sufijo = 'user';
      }
      
      return `${primeraLetra}${primerApellido}-${sufijo}`;
    }
    return '';
  }

  /**
   * Valida que un texto solo contenga letras y espacios, máximo 40 caracteres
   */
  isValidText(text: string): boolean {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,40}$/;
    return regex.test(text);
  }

  /**
   * Valida que el teléfono tenga exactamente 9 dígitos
   */
  isValidPhone(phone: string): boolean {
    const regex = /^[0-9]{9}$/;
    return regex.test(phone);
  }

  /**
   * Valida que la contraseña tenga al menos 8 caracteres
   */
  isValidPassword(password: string): boolean {
    return password.length >= 8;
  }

  /**
   * Valida que el DNI tenga exactamente 8 dígitos (solo para veterinarios)
   */
  isValidDni(dni: string): boolean {
    const regex = /^[0-9]{8}$/;
    return regex.test(dni);
  }

  /**
   * Verifica si el DNI ya existe en el sistema
   */
  isDniDuplicado(dni: string): boolean {
    if (!dni || dni.trim() === '') return false;
    
    return this.usuarios.some(user => 
      user.perfil?.dni === dni.trim()
    );
  }

  /**
   * Verifica si ya existe un usuario con el mismo nombre completo
   */
  isNombreCompletoDuplicado(): boolean {
    if (!this.newPerfil.nombres || !this.newPerfil.apellidos) return false;
    
    const nombreCompleto = `${this.newPerfil.nombres.trim().toLowerCase()} ${this.newPerfil.apellidos.trim().toLowerCase()}`;
    
    return this.usuarios.some(user => {
      if (!user.perfil?.nombres || !user.perfil?.apellidos) return false;
      const nombreExistente = `${user.perfil.nombres.trim().toLowerCase()} ${user.perfil.apellidos.trim().toLowerCase()}`;
      return nombreExistente === nombreCompleto;
    });
  }

  /**
   * Valida que el formulario completo sea válido
   */
  isFormValid(): boolean {
    // Validaciones básicas
    const basicValid = this.newUser.username && 
                      this.newUser.password && 
                      this.newUser.rol &&
                      this.newPerfil.nombres && 
                      this.newPerfil.apellidos &&
                      this.newPerfil.telefonoEmergencia &&
                      this.newPerfil.direccion;

    // Validaciones de formato
    const formatValid = this.isValidText(this.newPerfil.nombres) &&
                       this.isValidText(this.newPerfil.apellidos) &&
                       this.isValidPhone(this.newPerfil.telefonoEmergencia || '') &&
                       this.isValidPassword(this.newUser.password);

    // Validación específica para veterinarios
    const vetValid = this.newUser.rol !== 'VET' || 
                    (this.newPerfil.dni && this.isValidDni(this.newPerfil.dni || ''));

    // Validaciones de duplicados
    const noDuplicados = !this.isNombreCompletoDuplicado() &&
                        (this.newUser.rol !== 'VET' || !this.isDniDuplicado(this.newPerfil.dni || ''));

    return !!(basicValid && formatValid && vetValid && noDuplicados);
  }

  /**
   * Verifica si un veterinario necesita registrar su DNI o ya lo tiene
   */
  veterinarioNecesitaDni(usuario: UserWithProfile): boolean {
    return usuario.rol === 'VET' && (!usuario.perfil?.dni || usuario.perfil.dni === '');
  }

  /**
   * Obtiene el mensaje apropiado para el campo DNI según el estado del veterinario
   */
  getMensajeDniVeterinario(usuario: UserWithProfile): string {
    if (usuario.rol !== 'VET') {
      return '';
    }
    
    if (this.veterinarioNecesitaDni(usuario)) {
      return 'Como veterinario, debe registrar su DNI para completar su perfil profesional';
    }
    
    return 'DNI registrado como veterinario';
  }

  /**
   * Valida que el formulario de edición de perfil sea válido
   */
  isPerfilEdicionValid(): boolean {
    // Validaciones básicas
    const basicValid = this.perfilEnEdicion.nombres && 
                      this.perfilEnEdicion.apellidos;

    // Validaciones de formato
    const formatValid = this.isValidText(this.perfilEnEdicion.nombres) &&
                       this.isValidText(this.perfilEnEdicion.apellidos);

    // Validación específica para veterinarios - DNI obligatorio
    const vetValid = this.usuarioEnEdicion?.rol !== 'VET' || 
                    (this.perfilEnEdicion.dni && this.isValidDni(this.perfilEnEdicion.dni || ''));

    return !!(basicValid && formatValid && vetValid);
  }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  /**
   * Carga usuarios y sus perfiles asociados
   * Este método coordina dos APIs:
   * 1. API de autenticación para obtener usuarios (username, rol, estado, etc.)
   * 2. API de administración para obtener perfiles personales
   */
  cargarUsuarios(): void {
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
      this.mostrarError('❌ Ese nombre de usuario ya existe.');
      return;
    }

    // Verificar si ya existe un usuario con el mismo nombre completo
    if (this.isNombreCompletoDuplicado()) {
      console.log('❌ VALIDACIÓN FALLÓ: Ya existe un usuario con ese nombre completo');
      this.mostrarError('❌ Ya existe un usuario registrado con ese nombre y apellido.');
      return;
    }

    // Verificar si el DNI ya existe (solo para veterinarios)
    if (this.newUser.rol === 'VET' && this.isDniDuplicado(this.newPerfil.dni || '')) {
      console.log('❌ VALIDACIÓN FALLÓ: DNI ya existe');
      this.mostrarError('❌ Ya existe un veterinario registrado con ese DNI.');
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
              
              // PASO 3: Si es veterinario, crear también en la API de veterinarios
              if (this.newUser.rol === 'VET') {
                console.log('🚀 PASO 3: Creando veterinario en API específica...');
                
                const veterinarioData: CrearVeterinarioRequest = {
                  dni: this.newPerfil.dni || '',
                  nombre: this.newPerfil.nombres,
                  apellido: this.newPerfil.apellidos
                };
                
                this.veterinarioService.crearVeterinario(veterinarioData).subscribe({
                  next: (vetResponse) => {
                    console.log('✅ PASO 3 COMPLETADO: Veterinario creado en API específica', vetResponse);
                    console.log('🎉 PROCESO COMPLETO: Usuario, perfil y veterinario creados exitosamente');
                    this.mostrarExito('✅ Usuario veterinario creado exitosamente con DNI registrado');
                    this.cargarUsuarios();
                    this.resetearFormulario();
                  },
                  error: (vetError) => {
                    console.error('❌ PASO 3 FALLÓ: Error al crear veterinario en API específica', vetError);
                    console.log('⚠️ Usuario y perfil creados, pero hubo un problema al registrar como veterinario');
                    this.mostrarExito('✅ Usuario creado exitosamente (pendiente registro completo de veterinario)');
                    this.cargarUsuarios();
                    this.resetearFormulario();
                  }
                });
              } else {
                console.log('🎉 PROCESO COMPLETO: Usuario y perfil creados exitosamente');
                this.mostrarExito('✅ Usuario creado exitosamente');
                this.cargarUsuarios();
                this.resetearFormulario();
              }
            },
            error: (perfilError) => {
              console.error('❌ PASO 2 FALLÓ: Error al crear perfil en API de administración', perfilError);
              console.error('Detalles del error:', perfilError.error || perfilError.message);
              
              this.mostrarError('⚠️ Usuario creado pero hubo un problema al crear el perfil. Contacte al administrador.');
              this.cargarUsuarios(); // Recargar la lista aunque falle el perfil
              this.resetearFormulario();
            }
          });
        } else {
          console.error('❌ No se recibió usuarioId en la respuesta:', userResponse);
          this.mostrarError('❌ Error: No se pudo obtener el ID del usuario creado.');
        }
      },
      error: (userError) => {
        console.error('❌ PASO 1 FALLÓ: Error al crear usuario en API de autenticación', userError);
        console.error('Detalles del error:', userError.error || userError.message);
        
        if (userError.status === 409) {
          this.mostrarError('❌ El nombre de usuario ya existe. Elija otro nombre.');
        } else if (userError.status === 400) {
          this.mostrarError('❌ Datos inválidos. Verifique todos los campos.');
        } else {
          this.mostrarError('❌ Error al crear usuario. Verifique su conexión e intente nuevamente.');
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
      usuarioId: 0,
      dni: '' // Resetear también el DNI
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
  } as any;
  
  // Almacenar el rol original para validación
  (this.usuarioEnEdicion as any).rolOriginal = user.rol;
  
  // Resetear vistas del modal
  this.mostrarFormularioRol = false;
  this.mostrarFormularioPerfil = false;
  
  // Inicializar perfil en edición
  if (user.perfil) {
    this.perfilEnEdicion = { ...user.perfil };
  } else {
    this.perfilEnEdicion = {
      perfilId: 0,
      nombres: '',
      apellidos: '',
      telefonoEmergencia: '',
      direccion: '',
      alergias: '',
      usuarioId: user.usuarioId || 0,
      dni: '' // Inicializar DNI vacío para nuevos perfiles
    };
  }
  
  // Si es veterinario, obtener su DNI desde la API de veterinarios
  if (user.rol === 'VET') {
    this.obtenerDniVeterinario(user);
  }
  
  console.log('📝 Iniciando edición de usuario:', this.usuarioEnEdicion);
  console.log('📝 Perfil en edición:', this.perfilEnEdicion);
}

/**
 * Guarda los cambios del rol del usuario en edición
 * Envía los datos actualizados al backend y actualiza la lista local
 */
guardarEdicionRol(): void {
  if (!this.usuarioEnEdicion) return;

  // Verificar si está intentando cambiar al mismo rol actual
  if (!this.puedeCompartirRol(this.usuarioEnEdicion, this.usuarioEnEdicion.rol)) {
    const mensaje = this.getMensajeValidacionRol(this.usuarioEnEdicion.rol);
    this.mostrarConsejo(mensaje);
    return;
  }

  const payload = {
    usuarioId: this.usuarioEnEdicion.usuarioId!,
    username: this.usuarioEnEdicion.username,
    rol: this.usuarioEnEdicion.rol,
    estado: this.usuarioEnEdicion.estado!,
    password: this.usuarioEnEdicion.password ?? '',
    fechaRegistro: this.usuarioEnEdicion.fechaRegistro || new Date().toISOString()
  };

  console.log('📤 Guardando cambios de rol de usuario:', payload);

  this.userService.actualizarUsuario(payload).subscribe({
    next: (response) => {
      console.log('✅ Rol de usuario actualizado exitosamente:', response);
      
      // Verificar si cambió a veterinario y no tiene DNI
      const cambioAVeterinario = payload.rol === 'VET' && 
                                (!this.usuarioEnEdicion?.perfil?.dni || this.usuarioEnEdicion.perfil.dni === '');
      
      if (cambioAVeterinario) {
        console.log('⚠️ Usuario cambió a veterinario pero no tiene DNI registrado');
        this.mostrarConsejo('✅ Rol actualizado correctamente. 💡 Consejo: Deberás añadir tu DNI en los próximos días para completar tu perfil profesional y evitar problemas al iniciar sesión.');
      } else {
        this.mostrarExito('✅ Rol actualizado correctamente');
      }
      
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
      
      this.cancelarEdicion();
      console.log('✅ Rol de usuario actualizado correctamente.');
    },
    error: err => {
      console.error('❌ Error al actualizar rol de usuario:', err);
      console.error('Detalles del error:', err.error || err.message);
      console.error('❌ Error al actualizar el rol del usuario. Verifique los datos e intente nuevamente.');
    }
  });
}

/**
 * Guarda los cambios de información personal del usuario
 * Utiliza la API PUT /api/v1/admin/editarPerfil/{perfilUsuarioId}
 */
guardarEdicionPerfil(): void {
  if (!this.usuarioEnEdicion || !this.perfilEnEdicion.nombres || !this.perfilEnEdicion.apellidos) {
    console.error('❌ Datos incompletos para guardar perfil');
    this.mostrarError('Por favor, completa los campos obligatorios (Nombres y Apellidos)');
    return;
  }

  // Validaciones adicionales completadas

  const perfilData = {
    perfilId: this.perfilEnEdicion.perfilId,
    nombres: this.perfilEnEdicion.nombres,
    apellidos: this.perfilEnEdicion.apellidos,
    telefonoEmergencia: this.perfilEnEdicion.telefonoEmergencia || '',
    direccion: this.perfilEnEdicion.direccion || '',
    alergias: this.perfilEnEdicion.alergias || '',
    usuarioId: this.usuarioEnEdicion.usuarioId || 0,
    dni: this.perfilEnEdicion.dni || '' // Incluir DNI
  };

  console.log('📤 Guardando información personal del usuario:', perfilData);

  this.perfilService.editarPerfil(perfilData).subscribe({
    next: (response) => {
      console.log('✅ Información personal actualizada exitosamente:', response);
      
      // Información personal actualizada correctamente
      this.mostrarExito('✅ Información personal actualizada correctamente');
      
      // Actualizar el perfil en la lista local
      const idx = this.usuarios.findIndex(u => u.usuarioId === this.usuarioEnEdicion!.usuarioId);
      if (idx !== -1) {
        this.usuarios[idx].perfil = response.data || perfilData;
        console.log('✅ Perfil actualizado en la lista local:', this.usuarios[idx]);
      }
      
      // Refrescar lista de usuarios para asegurar sincronización
      this.cargarUsuarios();
      
      this.cancelarEdicion();
      console.log('✅ Información personal actualizada correctamente.');
    },
    error: (err) => {
      console.error('❌ Error al actualizar información personal:', err);
      this.mostrarError('❌ Error al actualizar la información personal. Verifique los datos e intente nuevamente.');
    }
  });
}

/**
 * Método legacy - mantener compatibilidad
 * Redirige a guardarEdicionRol para retrocompatibilidad
 */
guardarEdicion(): void {
  this.guardarEdicionRol();
}



  /**
   * Cancela la edición del usuario actual
   * Resetea todas las variables de edición
   */
  cancelarEdicion(): void {
    this.usuarioEnEdicion = null;
    this.mostrarFormularioRol = false;
    this.mostrarFormularioPerfil = false;
    this.perfilEnEdicion = {
      perfilId: 0,
      nombres: '',
      apellidos: '',
      telefonoEmergencia: '',
      direccion: '',
      alergias: '',
      usuarioId: 0
    };
  }

  /**
   * Vuelve al menú principal de edición
   */
  volverAlMenu(): void {
    this.mostrarFormularioRol = false;
    this.mostrarFormularioPerfil = false;
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
   * Exportar tabla completa a Excel con formato simple y columna DNI para veterinarios
   */
  exportarTablaCompleta(): void {
    try {
      // Detectar si hay veterinarios en la lista para incluir columna DNI
      const hayVeterinarios = this.usuariosFiltrados.some(user => user.rol === 'VET');
      
      // Crear headers dinámicamente
      const headers = [
        'ID',
        'USUARIO',
        'NOMBRES',
        'APELLIDOS',
        'ROL',
        'TELEFONO',
        'DIRECCION',
        'ESTADO',
        'FECHA_REGISTRO'
      ];
      
      // Agregar columna DNI solo si hay veterinarios
      if (hayVeterinarios) {
        headers.splice(5, 0, 'DNI'); // Insertar DNI después del ROL
      }
      
      // Crear filas de datos
      const rows = this.usuariosFiltrados.map(user => {
        const row = [
          user.usuarioId,
          user.username,
          user.perfil?.nombres || 'No registrado',
          user.perfil?.apellidos || 'No registrado',
          this.getRolLegible(user.rol),
          user.perfil?.telefonoEmergencia || 'No registrado',
          user.perfil?.direccion || 'No registrado',
          user.estado,
          this.formatDate(user.fechaRegistro || '')
        ];
        
        // Insertar DNI solo si hay veterinarios
        if (hayVeterinarios) {
          const dni = user.rol === 'VET' ? (user.perfil?.dni || 'No registrado') : 'N/A';
          row.splice(5, 0, dni); // Insertar DNI en la posición correcta
        }
        
        return row;
      });
      
      // Crear contenido CSV
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => 
          typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell
        ).join(','))
      ].join('\n');
      
      // Agregar BOM para caracteres especiales
      const bom = '\uFEFF';
      const blob = new Blob([bom + csvContent], { 
        type: 'text/csv;charset=utf-8;' 
      });

      // Descargar archivo
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `Usuarios-Sistema-Veterinaria-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log('✅ Exportación completa realizada exitosamente');
    } catch (error) {
      console.error('❌ Error al exportar tabla completa:', error);
    }
  }

  abrirModalInformacionCompleta(user: UserWithProfile): void {
    this.usuarioSeleccionado = user;
    this.modalInfoVisible = true;
    
    // Si es veterinario, obtener su DNI desde la API de veterinarios
    if (user.rol === 'VET') {
      this.obtenerDniVeterinario(user);
    }
  }

  /**
   * Obtiene el DNI del veterinario comparando nombre y apellido
   * @param user Usuario veterinario
   */
  private obtenerDniVeterinario(user: UserWithProfile): void {
    if (!user.perfil?.nombres || !user.perfil?.apellidos) {
      console.log('⚠️ Usuario veterinario sin nombres o apellidos completos:', user);
      return;
    }

    console.log(`🔍 Buscando DNI para veterinario: ${user.perfil.nombres} ${user.perfil.apellidos}`);
    
    this.veterinarioService.listarVeterinarios().subscribe({
      next: (response) => {
        console.log('✅ Respuesta de veterinarios:', response);
        
        if (response && response.data) {
          const veterinarios = Array.isArray(response.data) ? response.data : [response.data];
          
          // Buscar coincidencia exacta por nombre Y apellido
          const veterinarioEncontrado = veterinarios.find(vet => {
            const nombreCoincide = vet.nombre?.toLowerCase().trim() === user.perfil!.nombres?.toLowerCase().trim();
            const apellidoCoincide = vet.apellido?.toLowerCase().trim() === user.perfil!.apellidos?.toLowerCase().trim();
            
            return nombreCoincide && apellidoCoincide;
          });

          if (veterinarioEncontrado && veterinarioEncontrado.dni) {
            console.log('✅ DNI encontrado para veterinario:', veterinarioEncontrado.dni);
            
            // Actualizar el DNI en el perfil del usuario
            if (user.perfil) {
              user.perfil.dni = veterinarioEncontrado.dni;
            }
            
            // Si este usuario está siendo editado, también actualizar perfilEnEdicion
            if (this.usuarioEnEdicion && this.usuarioEnEdicion.usuarioId === user.usuarioId) {
              this.perfilEnEdicion.dni = veterinarioEncontrado.dni;
            }
            
            // Si es el usuario seleccionado para ver detalles, actualizar también
            if (this.usuarioSeleccionado && this.usuarioSeleccionado.usuarioId === user.usuarioId) {
              if (this.usuarioSeleccionado.perfil) {
                this.usuarioSeleccionado.perfil.dni = veterinarioEncontrado.dni;
              }
            }
            
            console.log('📝 DNI actualizado en interfaz para veterinario:', user.perfil?.nombres);
          } else {
            console.log('❌ No se encontró DNI para el veterinario:', user.perfil?.nombres, user.perfil?.apellidos);
          }
        }
      },
      error: (error) => {
        console.error('❌ Error al obtener DNI del veterinario:', error);
      }
    });
  }

  cerrarModalInformacionCompleta(): void {
    this.modalInfoVisible = false;
    this.usuarioSeleccionado = null;
  }

  /**
   * Métodos para modales de notificación
   */
  mostrarExito(mensaje: string): void {
    this.mensajeModal = mensaje;
    this.mostrarModalExito = true;
    
    // Auto-cerrar después de 3 segundos
    setTimeout(() => {
      this.mostrarModalExito = false;
    }, 3000);
  }

  mostrarError(mensaje: string): void {
    this.mensajeModal = mensaje;
    this.mostrarModalError = true;
    
    // Auto-cerrar después de 5 segundos
    setTimeout(() => {
      this.mostrarModalError = false;
    }, 5000);
  }

  mostrarConsejo(mensaje: string): void {
    this.mensajeModal = mensaje;
    this.mostrarModalExito = true; // Usar el modal de éxito para consejos amigables
    
    // Auto-cerrar después de 10 segundos para consejos
    setTimeout(() => {
      this.mostrarModalExito = false;
    }, 10000);
  }

  cerrarModalExito(): void {
    this.mostrarModalExito = false;
  }

  cerrarModalError(): void {
    this.mostrarModalError = false;
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
      const datosUsuario: { [key: string]: any } = {
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

      // Agregar DNI solo si es veterinario
      if (user.rol === 'VET') {
        datosUsuario['DNI'] = user.perfil?.dni || 'No registrado';
      }

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

  // ========== MÉTODOS DE EXPORTACIÓN POR TIPO ==========
  
  /**
   * Exporta solo los usuarios administradores
   */
  exportarAdministradores(): void {
    const administradores = this.usuariosFiltrados.filter(user => user.rol === 'ADMIN');
    this.exportarPorTipo(administradores, 'Administradores');
  }

  /**
   * Exporta solo los usuarios veterinarios con columna DNI
   */
  exportarVeterinarios(): void {
    const veterinarios = this.usuariosFiltrados.filter((user: UserWithProfile) => user.rol === 'VET');
    this.exportarPorTipo(veterinarios, 'Veterinarios', true);
  }

  /**
   * Exporta solo los usuarios asistentes
   */
  exportarAsistentes(): void {
    const asistentes = this.usuariosFiltrados.filter(user => user.rol === 'ASISTENTE');
    this.exportarPorTipo(asistentes, 'Asistentes');
  }

  /**
   * Método genérico para exportar usuarios por tipo
   */
  private exportarPorTipo(usuarios: UserWithProfile[], tipoUsuario: string, incluirDNI: boolean = false): void {
    try {
      if (usuarios.length === 0) {
        this.mostrarError(`No hay ${tipoUsuario.toLowerCase()} para exportar.`);
        return;
      }

      // Crear headers dinámicamente
      const headers = [
        'ID',
        'USUARIO',
        'NOMBRES',
        'APELLIDOS',
        'TELEFONO',
        'DIRECCION',
        'ESTADO',
        'FECHA_REGISTRO'
      ];
      
      // Agregar columna DNI si se requiere
      if (incluirDNI) {
        headers.splice(4, 0, 'DNI'); // Insertar DNI después de apellidos
      }
      
      // Crear filas de datos
      const rows = usuarios.map(user => {
        const row = [
          user.usuarioId,
          user.username,
          user.perfil?.nombres || 'No registrado',
          user.perfil?.apellidos || 'No registrado',
          user.perfil?.telefonoEmergencia || 'No registrado',
          user.perfil?.direccion || 'No registrado',
          user.estado,
          this.formatDate(user.fechaRegistro || '')
        ];
        
        // Insertar DNI si se requiere
        if (incluirDNI) {
          const dni = user.perfil?.dni || 'No registrado';
          row.splice(4, 0, dni); // Insertar DNI en la posición correcta
        }
        
        return row;
      });
      
      // Crear contenido CSV
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => 
          typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell
        ).join(','))
      ].join('\n');
      
      // Agregar BOM para caracteres especiales
      const bom = '\uFEFF';
      const blob = new Blob([bom + csvContent], { 
        type: 'text/csv;charset=utf-8;' 
      });

      // Descargar archivo
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${tipoUsuario}-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      this.mostrarExito(`✅ Lista de ${tipoUsuario.toLowerCase()} exportada exitosamente (${usuarios.length} registros)`);
    } catch (error) {
      console.error(`❌ Error al exportar ${tipoUsuario.toLowerCase()}:`, error);
      this.mostrarError(`❌ Error al exportar lista de ${tipoUsuario.toLowerCase()}`);
    }
  }

  /**
   * Verifica si se puede cambiar al rol seleccionado (no puede ser el mismo rol actual)
   */
  puedeCompartirRol(usuario: any, nuevoRol: string): boolean {
    if (!usuario || !usuario.rolOriginal) return true;
    return usuario.rolOriginal !== nuevoRol;
  }

  /**
   * Obtiene el mensaje de validación para el cambio de rol
   */
  getMensajeValidacionRol(rol: string): string {
    if (!this.usuarioEnEdicion) return '';
    
    const rolLegible = this.getRolLegible(rol);
    const nombreUsuario = this.usuarioEnEdicion.perfil?.nombres || this.usuarioEnEdicion.username || 'Este usuario';
    return `${nombreUsuario} ya tiene el rol de ${rolLegible}. No se puede cambiar al mismo rol que ya posee.`;
  }

}