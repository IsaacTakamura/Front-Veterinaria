import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TipoServicio } from '../../shared/interfaces/tipo-servicio.model';
import { TipoServicioService } from '../../../core/services/tipo-servicio.service';
import { Especie } from '../../shared/interfaces/especie.model';
import { Raza } from '../../shared/interfaces/Raza.model';
import { CatalogoService } from '../../../core/services/catalogo.service';
import { SessionService } from '../../../core/services/session.service';

@Component({
  selector: 'app-catalog-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './catalog-management.component.html',
  styleUrls: ['./catalog-management.component.css']
})
export class CatalogManagementComponent implements OnInit {
  @Input() activeTab: string = 'servicios';

  // Loading state
  isLoading = false;
  mostrarTablasDetalladas = false;

  // Servicios
  tiposServicios: TipoServicio[] = [];
  modalVisible = false;
  nuevoTipoServicio: TipoServicio = { nombre: '' };

  // Especies y razas
  especies: Especie[] = [];
  razas: Raza[] = [];
  modalEspecieVisible = false;
  modalRazaVisible = false;

  nuevaEspecie: Partial<Especie> = { nombre: '' };
  nuevaRaza: Partial<Raza> = { nombre: '', especieId: 0 };

  constructor(
    private tipoServicioService: TipoServicioService,
    private catalogoService: CatalogoService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    
    // 🔍 Verificar autenticación
    this.verificarAutenticacion();
    
    // Cargar servicios (estos suelen funcionar)
    this.obtenerTiposServicios();
    
    // Intentar cargar especies y razas, pero no bloquear la interfaz si fallan
    this.obtenerDatosEspeciesYRazas();
  }

  // 🔍 Método para verificar token y autenticación
  verificarAutenticacion(): void {
    // Usar SessionService como fuente principal de verdad
    const token = this.sessionService.token;
    const user = this.sessionService.user;
    const isLoggedIn = this.sessionService.isLoggedIn();
    
    console.log('🔐 Debug de Autenticación (SessionService):');
    console.log('¿Está logueado?:', isLoggedIn ? '✅ SÍ' : '❌ NO');
    console.log('Token presente:', token ? '✅ SÍ' : '❌ NO');
    console.log('Usuario completo:', user);
    console.log('Username:', user?.username || 'No definido');
    console.log('Rol:', user?.rol || 'No definido');
    
    // También verificar localStorage por compatibilidad
    const tokenLS = localStorage.getItem('auth_token');
    const userInfoLS = localStorage.getItem('user_info');
    const userRolLS = localStorage.getItem('user_rol');
    
    console.log('🔍 Debug localStorage:');
    console.log('auth_token:', tokenLS ? '✅ Presente' : '❌ Ausente');
    console.log('user_info:', userInfoLS || 'No definido');
    console.log('user_rol (legacy):', userRolLS || 'No definido');
    
    if (!isLoggedIn || !token) {
      console.error('❌ NO HAY SESIÓN VÁLIDA - Usuario no autenticado');
      alert('⚠️ Sesión expirada. Por favor, inicia sesión nuevamente.');
      return;
    }
    
    if (!user?.rol || user.rol === 'undefined' || user.rol === 'null') {
      console.warn('⚠️ ROL NO DEFINIDO - Esto puede causar errores 403/500 en endpoints de admin');
      console.warn('💡 Posibles causas: 1) Backend no envía rol en login, 2) Usuario no tiene rol asignado');
      
      // Mostrar advertencia al usuario
      console.warn('⚠️ ADVERTENCIA: Tu usuario no tiene un rol definido. Esto puede causar errores en algunas funciones.');
    } else {
      console.log(`✅ Sesión válida. Rol identificado: "${user.rol}"`);
      
      // Verificar si tiene permisos de admin
      if (user.rol !== 'ADMIN') {
        console.warn(`⚠️ Usuario con rol "${user.rol}" accediendo a funciones de admin. Esto puede causar errores 403.`);
      }
    }
  }

  // ========== SERVICIOS ==========
  obtenerTiposServicios(): void {
    this.tipoServicioService.listarTiposServicios().subscribe({
      next: (res: any) => {
        this.tiposServicios = res.data ?? [];
      },
      error: (err) => {
        console.error('Error al cargar tipos de servicios', err);
        alert('No se pudieron cargar los servicios.');
      }
    });
  }

  abrirModal(): void {
    this.modalVisible = true;
    this.nuevoTipoServicio = { nombre: '' };
  }

  cerrarModal(): void {
    this.modalVisible = false;
  }

  registrarTipoServicio(): void {
    this.tipoServicioService.crearTipoServicio(this.nuevoTipoServicio).subscribe({
      next: () => {
        this.obtenerTiposServicios();
        this.cerrarModal();
        alert('✅ Servicio registrado correctamente');
      },
      error: (err) => {
        console.error('Error al registrar servicio', err);
        alert('❌ Error al registrar el servicio.');
      }
    });
  }

  // ========== ESPECIES Y RAZAS ==========
  obtenerDatosEspeciesYRazas(): void {
    console.log('📋 Iniciando carga de especies y razas...');
    
    // Cargar especies
    this.catalogoService.listarEspecies().subscribe({
      next: (especies: Especie[]) => {
        this.especies = especies;
        console.log(`✅ Especies cargadas: ${this.especies.length} registros`);
        if (this.especies.length === 0) {
          console.log('📝 No hay especies en la base de datos. Mostrando tabla vacía.');
        }
      },
      error: (err) => {
        console.error('❌ Error inesperado al cargar especies (no debería llegar aquí):', err);
        this.especies = [];
      }
    });

    // Cargar razas
    this.catalogoService.listarRazas().subscribe({
      next: (razas: Raza[]) => {
        this.razas = razas;
        console.log(`✅ Razas cargadas: ${this.razas.length} registros`);
        if (this.razas.length === 0) {
          console.log('📝 No hay razas en la base de datos. Mostrando tabla vacía.');
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Error inesperado al cargar razas (no debería llegar aquí):', err);
        this.razas = [];
        this.isLoading = false;
      }
    });
  }

  abrirModalEspecie(): void {
    this.modalEspecieVisible = true;
    this.nuevaEspecie = { nombre: '' };
  }

  cerrarModalEspecie(): void {
    this.modalEspecieVisible = false;
  }

  registrarEspecie(): void {
    if (!this.nuevaEspecie.nombre?.trim()) {
      alert('❌ El nombre de la especie es obligatorio');
      return;
    }

    console.log('📝 Registrando especie:', this.nuevaEspecie);
    this.catalogoService.crearEspecie(this.nuevaEspecie).subscribe({
      next: (response: any) => {
        console.log('✅ Especie creada:', response);
        this.obtenerDatosEspeciesYRazas();
        this.cerrarModalEspecie();
        alert(`✅ Especie "${this.nuevaEspecie.nombre}" registrada correctamente`);
      },
      error: (err) => {
        console.error('❌ Error al registrar especie:', err);
        const mensaje = err.error?.message || 'Error desconocido';
        alert(`❌ Error al registrar la especie: ${mensaje}`);
      }
    });
  }

  abrirModalRaza(): void {
    this.modalRazaVisible = true;
    this.nuevaRaza = { nombre: '', especieId: undefined };
    
    // Si no hay especies cargadas, intentar cargarlas
    if (this.especies.length === 0) {
      console.log('🔄 Cargando especies para el modal de raza...');
      this.catalogoService.listarEspecies().subscribe({
        next: (especies: Especie[]) => {
          this.especies = especies;
          console.log(`✅ Especies cargadas para modal: ${this.especies.length} registros`);
        },
        error: (err) => {
          console.error('❌ Error al cargar especies para modal:', err);
          // No mostramos alert aquí, el usuario puede crear especies primero
        }
      });
    }
  }

  cerrarModalRaza(): void {
    this.modalRazaVisible = false;
  }

  registrarRaza(): void {
    if (!this.nuevaRaza.nombre?.trim()) {
      alert('❌ El nombre de la raza es obligatorio');
      return;
    }
    
    if (!this.nuevaRaza.especieId) {
      alert('❌ Debes seleccionar una especie. Si no hay especies disponibles, crea una primero.');
      return;
    }

    console.log('📝 Registrando raza:', this.nuevaRaza);
    this.catalogoService.crearRaza(this.nuevaRaza).subscribe({
      next: (response: any) => {
        console.log('✅ Raza creada:', response);
        this.obtenerDatosEspeciesYRazas();
        this.cerrarModalRaza();
        const especieNombre = this.especies.find(e => e.especieId === this.nuevaRaza.especieId)?.nombre || 'especie desconocida';
        alert(`✅ Raza "${this.nuevaRaza.nombre}" registrada correctamente para ${especieNombre}`);
      },
      error: (err) => {
        console.error('❌ Error al registrar raza:', err);
        const mensaje = err.error?.message || 'Error desconocido';
        alert(`❌ Error al registrar la raza: ${mensaje}`);
      }
    });
  }

  // 🧪 Método de prueba para verificar APIs de creación
  probarAPIsCreacion(): void {
    console.log('🧪 === PRUEBA DE APIs DE CREACIÓN ===');
    
    // Probar creación de especie de prueba
    const especiePrueba = { nombre: 'TEST_Especie_' + Date.now() };
    console.log('🧪 Probando creación de especie:', especiePrueba);
    
    this.catalogoService.crearEspecie(especiePrueba).subscribe({
      next: (response) => {
        console.log('✅ API creación especie FUNCIONA:', response);
        
        // Si funciona, probar creación de raza
        const razaPrueba = { 
          nombre: 'TEST_Raza_' + Date.now(), 
          especieId: response.especieId || 1 
        };
        
        console.log('🧪 Probando creación de raza:', razaPrueba);
        this.catalogoService.crearRaza(razaPrueba).subscribe({
          next: (responseRaza) => {
            console.log('✅ API creación raza FUNCIONA:', responseRaza);
            console.log('🎉 AMBAS APIs de creación están funcionando correctamente!');
            
            // Recargar datos para ver los nuevos registros
            this.obtenerDatosEspeciesYRazas();
          },
          error: (errRaza) => {
            console.error('❌ API creación raza FALLA:', errRaza);
          }
        });
      },
      error: (errEspecie) => {
        console.error('❌ API creación especie FALLA:', errEspecie);
      }
    });
  }

  // 🔍 Método específico para debug de autenticación y token
  debugAutenticacionCompleta(): void {
    console.log('🔍 === DEBUG COMPLETO DE AUTENTICACIÓN ===');
    
    // 1. Verificar SessionService
    const sessionToken = this.sessionService.token;
    const sessionUser = this.sessionService.user;
    const isLoggedIn = this.sessionService.isLoggedIn();
    
    console.log('📊 SessionService:');
    console.log('  - ¿Está logueado?:', isLoggedIn ? '✅ SÍ' : '❌ NO');
    console.log('  - Token presente:', sessionToken ? '✅ SÍ' : '❌ NO');
    console.log('  - Usuario:', sessionUser);
    console.log('  - Rol:', sessionUser?.rol || 'NO DEFINIDO');
    
    // 2. Verificar localStorage
    const lsToken = localStorage.getItem('auth_token');
    const lsUserInfo = localStorage.getItem('user_info');
    
    console.log('💾 LocalStorage:');
    console.log('  - auth_token:', lsToken ? `✅ SÍ (${lsToken.substring(0, 20)}...)` : '❌ NO');
    console.log('  - user_info:', lsUserInfo || 'NO DEFINIDO');
    
    // 3. Comparar tokens
    if (sessionToken && lsToken) {
      const sameToken = sessionToken === lsToken;
      console.log('🔗 Tokens coinciden:', sameToken ? '✅ SÍ' : '❌ NO');
      if (!sameToken) {
        console.warn('⚠️ PROBLEMA: Los tokens del SessionService y localStorage no coinciden');
      }
    }
    
    // 4. Verificar formato del token
    if (lsToken) {
      try {
        const parts = lsToken.split('.');
        if (parts.length === 3) {
          console.log('🔐 Formato JWT:', '✅ VÁLIDO (3 partes)');
          
          // Decodificar payload (sin verificar firma)
          const payload = JSON.parse(atob(parts[1]));
          console.log('📋 Payload del token:', payload);
          
          const now = Math.floor(Date.now() / 1000);
          if (payload.exp) {
            const isExpired = payload.exp < now;
            console.log('⏰ Token expirado:', isExpired ? '❌ SÍ' : '✅ NO');
            if (isExpired) {
              console.error('❌ TOKEN EXPIRADO - Esto causará errores de autenticación');
            }
          }
        } else {
          console.log('🔐 Formato JWT:', '❌ INVÁLIDO (no tiene 3 partes)');
        }
      } catch (e) {
        console.error('❌ Error al decodificar token:', e);
      }
    }
    
    // 5. Probar endpoint que funciona (tipos servicios)
    console.log('🧪 Probando endpoint que funciona (tipos servicios)...');
    this.tipoServicioService.listarTiposServicios().subscribe({
      next: (res) => {
        console.log('✅ Tipos servicios funciona correctamente');
      },
      error: (err) => {
        console.error('❌ Tipos servicios también falla:', err);
      }
    });
    
    // 6. Probar endpoint problemático (especies)
    console.log('🧪 Probando endpoint problemático (especies)...');
    this.catalogoService.listarEspecies().subscribe({
      next: (res) => {
        console.log('✅ Especies funciona correctamente');
      },
      error: (err) => {
        console.error('❌ Especies falla:', err);
      }
    });
  }

  // 🧪 Método específico para probar creación de especie paso a paso
  probarCreacionEspeciePasoAPaso(): void {
    console.log('🧪 === PRUEBA PASO A PASO CREACIÓN ESPECIE ===');
    
    // 1. Verificar token
    const token = localStorage.getItem('auth_token');
    if (!token) {
      console.error('❌ NO HAY TOKEN - Debes estar logueado');
      alert('❌ No estás logueado. Por favor, inicia sesión primero.');
      return;
    }
    
    console.log('✅ Token presente:', token.substring(0, 30) + '...');
    
    // 2. Verificar usuario y rol
    const user = this.sessionService.user;
    if (!user || !user.rol || user.rol !== 'ADMIN') {
      console.error('❌ USUARIO SIN ROL ADMIN - Rol actual:', user?.rol || 'NO DEFINIDO');
      alert('❌ Tu usuario no tiene permisos de administrador.');
      return;
    }
    
    console.log('✅ Usuario ADMIN confirmado:', user.username);
    
    // 3. Preparar datos
    const especiePrueba = {
      nombre: 'TEST_DEBUG_' + Date.now()
    };
    
    console.log('📝 Creando especie de prueba:', especiePrueba);
    
    // 4. Hacer la petición
    this.catalogoService.crearEspecie(especiePrueba).subscribe({
      next: (response) => {
        console.log('🎉 ¡ÉXITO! Especie creada:', response);
        alert(`🎉 ¡Especie "${especiePrueba.nombre}" creada exitosamente!`);
        
        // Recargar datos
        this.obtenerDatosEspeciesYRazas();
      },
      error: (error) => {
        console.error('❌ ERROR al crear especie:', error);
        
        if (error.status === 401) {
          alert('❌ Error 401: No estás autenticado. El token puede haber expirado.');
        } else if (error.status === 403) {
          alert('❌ Error 403: No tienes permisos para esta acción.');
        } else if (error.status === 500) {
          alert('❌ Error 500: Error interno del servidor.');
        } else {
          alert(`❌ Error ${error.status}: ${error.error?.mensaje || error.message || 'Error desconocido'}`);
        }
      }
    });
  }

  // ========== MÉTODOS DE CREACIÓN RÁPIDA ==========
  crearEspecieRapida(nombre: string): void {
    console.log(`🚀 Creación rápida de especie: ${nombre}`);
    
    const especie = { nombre: nombre };
    this.catalogoService.crearEspecie(especie).subscribe({
      next: (response: any) => {
        console.log('✅ Especie creada rápidamente:', response);
        this.obtenerDatosEspeciesYRazas();
        // Mostrar mensaje de éxito sin alert intrusivo
        console.log(`🎉 Especie "${nombre}" creada exitosamente`);
      },
      error: (err) => {
        console.error('❌ Error al crear especie rápida:', err);
        alert(`❌ Error al crear la especie "${nombre}": ${err.error?.message || 'Error desconocido'}`);
      }
    });
  }

  crearRazaRapida(nombre: string, especieId: number): void {
    console.log(`🚀 Creación rápida de raza: ${nombre} para especie ${especieId}`);
    
    const raza = { nombre: nombre, especieId: especieId };
    this.catalogoService.crearRaza(raza).subscribe({
      next: (response: any) => {
        console.log('✅ Raza creada rápidamente:', response);
        this.obtenerDatosEspeciesYRazas();
        // Mostrar mensaje de éxito sin alert intrusivo
        console.log(`🎉 Raza "${nombre}" creada exitosamente`);
      },
      error: (err) => {
        console.error('❌ Error al crear raza rápida:', err);
        alert(`❌ Error al crear la raza "${nombre}": ${err.error?.message || 'Error desconocido'}`);
      }
    });
  }

  abrirModalRazaParaEspecie(especieId: number): void {
    this.modalRazaVisible = true;
    this.nuevaRaza = { nombre: '', especieId: especieId };
    console.log(`📝 Abriendo modal de raza para especie ID: ${especieId}`);
  }

  getRazasPorEspecie(id: number): Raza[] {
    return this.razas.filter(r => r.especieId === id);
  }

  getEspecieNombre(especieId: number): string {
    const especie = this.especies.find(e => e.especieId === especieId);
    return especie ? especie.nombre : 'Especie no encontrada';
  }

  // 🔧 Método de emergencia para resetear la sesión
  resetearSesion(): void {
    console.log('🔧 === RESETEO DE SESIÓN ===');
    
    // 1. Verificar qué hay en localStorage
    const token = localStorage.getItem('auth_token');
    const userInfo = localStorage.getItem('user_info');
    
    console.log('💾 Estado localStorage:');
    console.log('  - Token:', token ? 'Presente' : 'Ausente');
    console.log('  - User Info:', userInfo || 'Ausente');
    
    if (token && userInfo) {
      try {
        const user = JSON.parse(userInfo);
        console.log('👤 Usuario en localStorage:', user);
        
        // Forzar re-login en SessionService
        this.sessionService.login(token, user);
        console.log('✅ Sesión restablecida en SessionService');
        
        // Verificar que se aplicó correctamente
        const sessionToken = this.sessionService.token;
        const sessionUser = this.sessionService.user;
        
        console.log('🔍 Verificación post-reseteo:');
        console.log('  - Token en SessionService:', sessionToken ? 'Presente' : 'Ausente');
        console.log('  - Usuario en SessionService:', sessionUser);
        
        alert('✅ Sesión restablecida. Ahora puedes probar crear una especie.');
        
      } catch (e) {
        console.error('❌ Error al parsear user_info:', e);
        alert('❌ Datos de usuario corruptos. Por favor, inicia sesión nuevamente.');
      }
    } else {
      console.error('❌ No hay datos de sesión en localStorage');
      alert('❌ No hay sesión guardada. Por favor, inicia sesión.');
    }
  }
}
