import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
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
  @Input() activeTab: string = 'especies-razas'; // Cambiado para coincidir con dashboard

  // Loading state
  isLoading = false;
  mostrarTablasDetalladas = false;
  
  // Variables para paginación
  especiesPagina = 1;
  serviciosPagina = 1;
  itemsPerPageEspecies = 5; // Estándar fijo: 5 elementos por página
  itemsPerPageServicios = 10; // 10 elementos por página para servicios según solicitud
  Math = Math; // Exposición de Math para usar en el HTML

  // Servicios
  tiposServicios: TipoServicio[] = [];
  modalVisible = false;
  nuevoTipoServicio: TipoServicio = { nombre: '' };
  
  // Almacenamiento local de descripciones (solo frontend)
  private readonly DESCRIPCIONES_KEY = 'vet_servicios_descripciones';
  private descripcionesLocales: Map<number, string> = new Map();

  // Especies y razas
  especies: Especie[] = [];
  razas: Raza[] = [];
  modalEspecieVisible = false;
  modalRazaVisible = false;
  modalAsignarRazaVisible = false; // Nuevo modal para asignar raza existente

  // Modal de confirmación personalizado
  modalConfirmacionVisible = false;
  confirmacionData: {
    titulo: string;
    mensaje: string;
    detalles?: string;
    tipoAccion: 'eliminar-especie' | 'eliminar-raza' | 'eliminar-servicio' | 'otro';
    icono: string;
    colorBoton: string;
    onConfirm: () => void;
    datosElemento?: any;
  } = {
    titulo: '',
    mensaje: '',
    tipoAccion: 'otro',
    icono: '⚠️',
    colorBoton: 'bg-red-600 hover:bg-red-700',
    onConfirm: () => {}
  };

  nuevaEspecie: Partial<Especie> = { nombre: '' };
  nuevaRaza: Partial<Raza> = { nombre: '', especieId: 0 };
  asignacionRaza: {
    especieId: number;
    razaId: number;
    especieNombre: string;
  } = { especieId: 0, razaId: 0, especieNombre: '' }; // Para asignar raza existente
  
  constructor(
    private tipoServicioService: TipoServicioService,
    private catalogoService: CatalogoService,
    private sessionService: SessionService,
    private http: HttpClient
  ) { }

  // ========== MÉTODOS DE DESCRIPCIONES LOCALES ==========
  private cargarDescripcionesLocales(): void {
    try {
      const data = localStorage.getItem(this.DESCRIPCIONES_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        Object.keys(parsed).forEach(key => {
          this.descripcionesLocales.set(Number(key), parsed[key]);
        });
      }
    } catch (error) {
      console.error('Error al cargar descripciones locales:', error);
      this.descripcionesLocales = new Map();
    }
  }

  private guardarDescripcionesLocales(): void {
    try {
      const dataObj: Record<number, string> = {};
      this.descripcionesLocales.forEach((value, key) => {
        dataObj[key] = value;
      });
      localStorage.setItem(this.DESCRIPCIONES_KEY, JSON.stringify(dataObj));
    } catch (error) {
      console.error('Error al guardar descripciones locales:', error);
    }
  }

  private asignarDescripcionLocal(tipoServicioId: number, descripcion: string): void {
    if (descripcion && descripcion.trim()) {
      this.descripcionesLocales.set(tipoServicioId, descripcion.trim());
      this.guardarDescripcionesLocales();
    }
  }

  obtenerDescripcionLocal(tipoServicioId: number | undefined): string {
    if (!tipoServicioId) return '';
    return this.descripcionesLocales.get(tipoServicioId) || '';
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.cargarDescripcionesLocales();
    this.verificarAutenticacion();
    this.cargarTodosLosDatos();
  }

  // Método para cargar todos los datos del catálogo
  cargarTodosLosDatos(): void {
    console.log('📋 Cargando todos los datos del catálogo...');
    this.isLoading = true;
    
    // Cargar servicios
    this.obtenerTiposServicios();
    
    // Cargar especies y razas
    this.obtenerDatosEspeciesYRazas();
  }

  // Método para refrescar todos los datos
  refrescarDatos(): void {
    console.log('🔄 Refrescando todos los datos del catálogo...');
    this.cargarTodosLosDatos();
    this.mostrarNotificacionExito('Datos actualizados correctamente');
  }

  // Verificación de autenticación simplificada
  verificarAutenticacion(): void {
    const isLoggedIn = this.sessionService.isLoggedIn();
    const user = this.sessionService.user;
    
    if (!isLoggedIn) {
      alert('⚠️ Sesión expirada. Por favor, inicia sesión nuevamente.');
      return;
    }
    
    if (!user?.rol || user.rol !== 'ADMIN') {
      console.warn('Usuario sin permisos de administrador');
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
    // Guardar la descripción local antes de enviar a la API
    const descripcionLocal = this.nuevoTipoServicio.descripcion;
    
    // Crear objeto solo con el nombre para enviar a la API
    const tipoServicioParaAPI = { nombre: this.nuevoTipoServicio.nombre };
    
    this.tipoServicioService.crearTipoServicio(tipoServicioParaAPI).subscribe({
      next: (response: any) => {
        // Obtener el ID del nuevo servicio creado
        const nuevoServicio = response.data || response;
        const tipoServicioId = nuevoServicio.tipoServicioId;
        
        // Guardar la descripción localmente si existe
        if (descripcionLocal && tipoServicioId) {
          this.asignarDescripcionLocal(tipoServicioId, descripcionLocal);
        }
        
        this.obtenerTiposServicios();
        this.cerrarModal();
        this.mostrarNotificacionExito('Tipo de servicio registrado correctamente');
      },
      error: (err) => {
        console.error('Error al registrar servicio', err);
        this.mostrarNotificacionError('Error al registrar el servicio', err);
      }
    });
  }

  // Eliminar tipo de servicio
  eliminarTipoServicio(tipoServicioId: number): void {
    const servicioAEliminar = this.tiposServicios.find(s => s.tipoServicioId === tipoServicioId);
    
    if (!servicioAEliminar) {
      this.mostrarNotificacionError('Servicio no encontrado', { error: { message: 'No se pudo encontrar el servicio a eliminar' } });
      return;
    }

    // Mostrar modal de confirmación personalizado
    this.mostrarConfirmacion({
      titulo: '🗑️ Eliminar Tipo de Servicio',
      mensaje: `¿Estás seguro de que deseas eliminar el servicio "${servicioAEliminar.nombre}"?`,
      detalles: 'Esta acción no se puede deshacer y el servicio será eliminado permanentemente.',
      tipoAccion: 'eliminar-servicio',
      icono: '🗑️',
      colorBoton: 'bg-red-600 hover:bg-red-700',
      datosElemento: { servicio: servicioAEliminar },
      onConfirm: () => this.ejecutarEliminacionServicio(tipoServicioId, servicioAEliminar)
    });
  }

  // Método separado para ejecutar la eliminación real del servicio
  private ejecutarEliminacionServicio(tipoServicioId: number, servicioAEliminar: any): void {
    const nombreServicio = servicioAEliminar?.nombre || 'Servicio';
    
    console.log(`🔄 Eliminando tipo de servicio: ID ${tipoServicioId} - "${nombreServicio}"`);
    this.isLoading = true;
    
    this.tipoServicioService.eliminarTipoServicio(tipoServicioId).subscribe({
      next: (response) => {
        console.log('✅ Tipo de servicio eliminado exitosamente:', response);
        
        // Eliminar de la lista local
        this.tiposServicios = this.tiposServicios.filter(s => s.tipoServicioId !== tipoServicioId);
        
        // Eliminar también la descripción local
        this.descripcionesLocales.delete(tipoServicioId);
        this.guardarDescripcionesLocales();
        
        this.isLoading = false;
        this.mostrarNotificacionExito(`✅ Tipo de servicio "${nombreServicio}" eliminado correctamente`);
      },
      error: (err) => {
        console.error('❌ Error al eliminar tipo de servicio:', err);
        this.isLoading = false;
        
        // Verificar si el error es por que el servicio ya no existe
        if (err.status === 404) {
          // Si es 404, significa que ya fue eliminado, actualizar la lista
          this.tiposServicios = this.tiposServicios.filter(s => s.tipoServicioId !== tipoServicioId);
          this.descripcionesLocales.delete(tipoServicioId);
          this.guardarDescripcionesLocales();
          this.mostrarNotificacionExito(`✅ Tipo de servicio "${nombreServicio}" eliminado correctamente`);
        } else {
          // Para otros errores, mostrar mensaje de error
          let mensajeError = 'Error al eliminar el tipo de servicio';
          if (err.status === 400) {
            mensajeError = 'No se puede eliminar este servicio porque está siendo utilizado';
          } else if (err.status === 403) {
            mensajeError = 'No tienes permisos para eliminar servicios';
          } else if (err.status === 500) {
            mensajeError = 'Error interno del servidor';
          }
          
          this.mostrarNotificacionError(mensajeError, err);
        }
      }
    });
  }

  // Eliminar especie y sus razas vinculadas
  eliminarEspecie(especieId: number): void {
    const especieAEliminar = this.especies.find(e => e.especieId === especieId);
    const razasVinculadas = this.getRazasPorEspecie(especieId);
    
    if (!especieAEliminar) {
      this.mostrarNotificacionError('Especie no encontrada', { error: { message: 'No se pudo encontrar la especie a eliminar' } });
      return;
    }

    // Construir mensaje de confirmación
    let detalles = '';
    if (razasVinculadas.length > 0) {
      detalles = `Esto también eliminará ${razasVinculadas.length} raza(s) vinculada(s):\n${razasVinculadas.map(r => `• ${r.nombre}`).join('\n')}`;
    }

    // Mostrar modal de confirmación personalizado
    this.mostrarConfirmacion({
      titulo: '🗑️ Eliminar Especie',
      mensaje: `¿Estás seguro de que deseas eliminar la especie "${especieAEliminar.nombre}"?`,
      detalles: detalles,
      tipoAccion: 'eliminar-especie',
      colorBoton: 'bg-red-600 hover:bg-red-700',
      datosElemento: { especie: especieAEliminar, razas: razasVinculadas },
      onConfirm: () => this.ejecutarEliminacionEspecie(especieId, especieAEliminar, razasVinculadas)
    });
  }

  // Método separado para ejecutar la eliminación real
  private ejecutarEliminacionEspecie(especieId: number, especieAEliminar: any, razasVinculadas: any[]): void {
    console.log('🔄 Ejecutando eliminación de especie:', { especieId, razasVinculadas });
    
    // Mostrar loading
    this.isLoading = true;
    
    this.catalogoService.eliminarEspecieConRazas(especieId, razasVinculadas).subscribe({
      next: () => {
        console.log('✅ Eliminación exitosa, actualizando tabla...');
        this.isLoading = false;
        this.obtenerDatosEspeciesYRazas();
        
        const nombreEspecie = especieAEliminar?.nombre || 'Especie';
        const cantidadRazas = razasVinculadas.length;
        
        let mensajeExito = `✅ Especie "${nombreEspecie}" eliminada correctamente`;
        if (cantidadRazas > 0) {
          mensajeExito += ` junto con ${cantidadRazas} raza(s) asociada(s)`;
        }
        
        this.mostrarNotificacionExito(mensajeExito);
      },
      error: (err) => {
        console.error('Error al eliminar especie con razas', err);
        this.isLoading = false;
        
        // SIEMPRE intentar actualizar la tabla después de un "error", porque puede ser un falso negativo
        setTimeout(() => {
          console.log('🔄 Actualizando tabla después del error para verificar si la eliminación fue exitosa...');
          this.obtenerDatosEspeciesYRazas();
        }, 1000);
        
        // Si el método con razas falla, intentar el método directo
        if (err.status === 500) {
          console.log('🔄 Método con razas falló, intentando eliminación directa...');
          
          this.catalogoService.eliminarEspecie(especieId).subscribe({
            next: () => {
              console.log('✅ Eliminación directa exitosa, actualizando tabla...');
              this.obtenerDatosEspeciesYRazas();
              const nombreEspecie = especieAEliminar?.nombre || 'Especie';
              this.mostrarNotificacionExito(`✅ Especie "${nombreEspecie}" eliminada correctamente`);
            },
            error: (err2) => {
              console.error('Error en eliminación directa también', err2);
              
              // Incluso si el segundo método falla, actualizar la tabla
              setTimeout(() => {
                console.log('🔄 Actualizando tabla después del segundo error...');
                this.obtenerDatosEspeciesYRazas();
              }, 1000);
              
              // Solo mostrar error si realmente no se pudo eliminar
              this.verificarSiEspecieEliminada(especieId, especieAEliminar?.nombre).then(eliminada => {
                if (!eliminada) {
                  this.mostrarNotificacionError('❌ Error al eliminar la especie', err2);
                }
              });
            }
          });
        } else {
          // Para otros errores, verificar si realmente no se eliminó
          this.verificarSiEspecieEliminada(especieId, especieAEliminar?.nombre).then(eliminada => {
            if (!eliminada) {
              this.mostrarNotificacionError('❌ Error al eliminar la especie', err);
            }
          });
        }
      }
    });
  }

  // Método auxiliar para verificar si una especie fue realmente eliminada
  private async verificarSiEspecieEliminada(especieId: number, nombreEspecie?: string): Promise<boolean> {
    return new Promise((resolve) => {
      // Esperar un momento y luego verificar si la especie ya no existe
      setTimeout(() => {
        this.catalogoService.listarEspecies().subscribe({
          next: (especies) => {
            const especieExiste = especies.some(e => e.especieId === especieId);
            if (!especieExiste) {
              console.log('✅ Verificación: La especie fue eliminada correctamente');
              this.mostrarNotificacionExito(`Especie "${nombreEspecie || 'Especie'}" eliminada correctamente`);
              resolve(true);
            } else {
              console.log('❌ Verificación: La especie aún existe');
              resolve(false);
            }
          },
          error: () => {
            console.log('❌ Error al verificar si la especie fue eliminada');
            resolve(false);
          }
        });
      }, 2000);
    });
  }

  // Método para mostrar tablas detalladas y reiniciar paginación
  mostrarTablas(): void {
    this.mostrarTablasDetalladas = true;
    this.especiesPagina = 1;
    this.serviciosPagina = 1;
  }

  // ========== ESPECIES Y RAZAS ==========
  obtenerDatosEspeciesYRazas(): void {
    console.log('📋 Iniciando carga de especies y razas...');
    this.isLoading = true;
    
    // Cargar especies
    this.catalogoService.listarEspecies().subscribe({
      next: (response: any) => {
        // Verificamos si la respuesta tiene la estructura esperada
        if (response && response.data && Array.isArray(response.data)) {
          this.especies = response.data;
        } else if (Array.isArray(response)) {
          this.especies = response;
        } else {
          this.especies = [];
          console.warn('⚠️ La respuesta de especies no tiene el formato esperado:', response);
        }
        
        console.log(`✅ Especies cargadas: ${this.especies.length} registros`);
        if (this.especies.length === 0) {
          console.log('📝 No hay especies en la base de datos. Mostrando tabla vacía.');
        }
        
        // Aseguramos que las tablas se muestren si hay datos
        if (this.especies.length > 0) {
          this.mostrarTablasDetalladas = true;
        }
        
        // Independientemente de si la carga de especies fue exitosa, intentamos cargar las razas
        this.cargarRazas();
      },
      error: (err) => {
        console.error('❌ Error al cargar especies:', err);
        this.especies = [];
        this.isLoading = false;
        
        // A pesar del error, intentamos cargar las razas
        this.cargarRazas();
      }
    });
  }
  
  cargarRazas(): void {
    // Cargar razas
    this.catalogoService.listarRazas().subscribe({
      next: (response: any) => {
        // Verificamos si la respuesta tiene la estructura esperada
        if (response && response.data && Array.isArray(response.data)) {
          this.razas = response.data;
        } else if (Array.isArray(response)) {
          this.razas = response;
        } else {
          this.razas = [];
          console.warn('⚠️ La respuesta de razas no tiene el formato esperado:', response);
        }
        
        console.log(`✅ Razas cargadas: ${this.razas.length} registros`);
        if (this.razas.length === 0) {
          console.log('📝 No hay razas en la base de datos. Mostrando tabla vacía.');
        }
        
        // Aseguramos que las tablas se muestren si hay datos
        if (this.razas.length > 0) {
          this.mostrarTablasDetalladas = true;
        }
        
        this.isLoading = false;
      },
      error: (err) => {
        // Si el error es 500 y el mensaje contiene "No se encontraron razas", 
        // lo tratamos como un caso válido de "no hay datos" en lugar de un error
        if (err.status === 500 && 
            err.error && 
            typeof err.error.message === 'string' && 
            err.error.message.includes('No se encontraron razas')) {
          console.log('📝 No hay razas registradas en la base de datos');
          this.razas = [];
        } else {
          console.error('❌ Error al cargar razas:', err);
          this.razas = [];
        }
        
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

  // Método para obtener emoji según la especie (versión simplificada)
  obtenerEmojiEspecie(especieId: number | undefined, nombreEspecie?: string): string {
    // Emojis por defecto simples según el nombre
    const emojisBasicos: { [key: string]: string } = {
      'perro': '🐕',
      'gato': '🐱',
      'ave': '🐦',
      'pez': '🐟',
      'reptil': '🦎',
      'roedor': '🐹',
      'conejo': '🐰',
      'default': '🐾'
    };
    
    if (nombreEspecie) {
      const nombre = nombreEspecie.toLowerCase();
      for (const [clave, emoji] of Object.entries(emojisBasicos)) {
        if (nombre.includes(clave)) {
          return emoji;
        }
      }
    }
    
    return emojisBasicos['default'];
  }

  registrarEspecie(): void {
    if (!this.nuevaEspecie.nombre?.trim()) {
      this.mostrarNotificacionError('El nombre de la especie es obligatorio', { error: { message: 'Campo requerido' } });
      return;
    }

    console.log('📝 Registrando especie:', this.nuevaEspecie);
    
    // Desactivar el botón mientras se procesa
    const nombreEspecie = this.nuevaEspecie.nombre.trim();
    this.isLoading = true;
    
    this.catalogoService.crearEspecie({ nombre: nombreEspecie }).subscribe({
      next: (response: any) => {
        console.log('✅ Especie creada:', response);
        
        // Agregar la nueva especie a la lista local inmediatamente
        let nuevaEspecieCreada: Especie;
        
        if (response && response.data) {
          // Si la respuesta tiene estructura con data
          nuevaEspecieCreada = response.data;
        } else if (response && response.especieId) {
          // Si la respuesta es directamente el objeto
          nuevaEspecieCreada = response;
        } else {
          // Si no podemos extraer el objeto, recargamos todos los datos
          this.obtenerDatosEspeciesYRazas();
          this.cerrarModalEspecie();
          this.mostrarNotificacionExito(`Especie "${nombreEspecie}" registrada correctamente`);
          return;
        }
        
        // Agregamos la nueva especie a la lista local
        this.especies.push(nuevaEspecieCreada);
        
        // Mostrar las tablas detalladas si es la primera especie
        if (this.especies.length === 1) {
          this.mostrarTablasDetalladas = true;
        }
        
        this.cerrarModalEspecie();
        this.isLoading = false;
        this.mostrarNotificacionExito(`Especie "${nombreEspecie}" registrada correctamente`);
      },
      error: (err) => {
        console.error('❌ Error al registrar especie:', err);
        this.mostrarNotificacionError('Error al registrar la especie', err);
        this.isLoading = false;
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
        next: (response: any) => {
          // Verificamos si la respuesta tiene la estructura esperada
          if (response && response.data && Array.isArray(response.data)) {
            this.especies = response.data;
          } else if (Array.isArray(response)) {
            this.especies = response;
          } else {
            this.especies = [];
          }
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
      this.mostrarNotificacionError('El nombre de la raza es obligatorio', { error: { message: 'Campo requerido' } });
      return;
    }
    
    if (!this.nuevaRaza.especieId) {
      this.mostrarNotificacionError('Debes seleccionar una especie', { error: { message: 'Si no hay especies disponibles, crea una primero.' } });
      return;
    }

    // Verificar si la raza ya existe para esta especie
    const razaExistente = this.razas.find(r => 
      r.especieId === this.nuevaRaza.especieId && 
      r.nombre.toLowerCase() === this.nuevaRaza.nombre?.trim().toLowerCase()
    );
    
    if (razaExistente) {
      this.mostrarNotificacionError('Esta raza ya está registrada para la especie seleccionada', { error: { message: 'Raza duplicada' } });
      return;
    }

    console.log('📝 Registrando raza:', this.nuevaRaza);
    
    // Desactivar el botón mientras se procesa y guardar valores para usar después
    const nombreRaza = this.nuevaRaza.nombre.trim();
    const idEspecie = this.nuevaRaza.especieId;
    const especieNombre = this.especies.find(e => e.especieId === idEspecie)?.nombre || 'especie desconocida';
    
    this.isLoading = true;
    
    this.catalogoService.crearRaza({
      nombre: nombreRaza,
      especieId: idEspecie
    }).subscribe({
      next: (response: any) => {
        console.log('✅ Raza creada:', response);
        
        // Agregar la nueva raza a la lista local inmediatamente
        let nuevaRazaCreada: Raza;
        
        if (response && response.data) {
          // Si la respuesta tiene estructura con data
          nuevaRazaCreada = response.data;
        } else if (response && response.razaId) {
          // Si la respuesta es directamente el objeto
          nuevaRazaCreada = response;
        } else {
          // Si no podemos extraer el objeto, recargamos todos los datos
          this.obtenerDatosEspeciesYRazas();
          this.cerrarModalRaza();
          this.mostrarNotificacionExito(`Raza "${nombreRaza}" registrada correctamente para ${especieNombre}`);
          return;
        }
        
        // Agregamos la nueva raza a la lista local
        this.razas.push(nuevaRazaCreada);
        
        // Mostrar las tablas detalladas si es la primera raza
        if (this.razas.length === 1) {
          this.mostrarTablasDetalladas = true;
        }
        
        this.cerrarModalRaza();
        this.isLoading = false;
        this.mostrarNotificacionExito(`Raza "${nombreRaza}" registrada correctamente para ${especieNombre}`);
      },
      error: (err) => {
        console.error('❌ Error al registrar raza:', err);
        this.mostrarNotificacionError('Error al registrar la raza', err);
        this.isLoading = false;
      }
    });
  }

  // Métodos para modal de asignar raza
  abrirModalAsignarRaza(especie: any) {
    console.log('🔄 Abriendo modal de gestión de razas para especie:', especie);
    this.asignacionRaza = {
      especieId: especie.especieId,
      razaId: 0,
      especieNombre: especie.nombre
    };
    this.modalAsignarRazaVisible = true;
  }

  cerrarModalAsignarRaza() {
    console.log('🔄 Cerrando modal de asignar raza...');
    
    // Opcional: Aquí podrías enviar los cambios al backend si tuvieras una API para ello
    // Por ahora, los cambios se mantienen solo en el frontend
    
    this.modalAsignarRazaVisible = false;
    this.asignacionRaza = {
      especieId: 0,
      razaId: 0,
      especieNombre: ''
    };
    
    console.log('✅ Modal cerrado, cambios de asignación mantenidos localmente');
  }

  getRazasNoAsignadas() {
    // REGLA: Una raza ya asignada a una especie NO puede ser reasignada a otra especie
    // Solo mostrar razas que NO tienen especieId válido (razas huérfanas) o que están marcadas como temporales
    const razasDisponibles = this.razas.filter(raza => {
      // Excluir razas que ya tienen una especieId válida (ya están asignadas a una especie real)
      const tieneEspecieValida = raza.especieId && 
                                 raza.especieId !== 999999 && // ID temporal para "sin asignar"
                                 raza.especieId !== this.asignacionRaza.especieId;
      
      // Solo incluir si NO tiene especie válida (está disponible)
      return !tieneEspecieValida;
    });
    
    console.log('🔍 Razas disponibles para asignar:', {
      total: this.razas.length,
      disponibles: razasDisponibles.length,
      especieActual: this.asignacionRaza.especieId,
      razasDisponibles: razasDisponibles.map(r => ({ id: r.razaId, nombre: r.nombre, especieId: r.especieId }))
    });
    
    return razasDisponibles;
  }

  // Obtener razas ya asignadas a la especie actual
  getRazasAsignadasAEspecieActual() {
    const razasAsignadas = this.razas.filter(raza => 
      raza.especieId === this.asignacionRaza.especieId
    );
    
    console.log('🔍 Razas asignadas a especie actual:', {
      especieId: this.asignacionRaza.especieId,
      especieNombre: this.asignacionRaza.especieNombre,
      razasAsignadas: razasAsignadas.map(r => ({ id: r.razaId, nombre: r.nombre }))
    });
    
    return razasAsignadas;
  }

  // Obtener razas libres (sin asignar a ninguna especie)
  getRazasLibres() {
    const razasLibres = this.razas.filter(raza => 
      !raza.especieId || raza.especieId === 999999 // ID temporal para "sin asignar"
    );
    
    console.log('🔍 Razas libres (disponibles):', {
      total: this.razas.length,
      libres: razasLibres.length,
      razasLibres: razasLibres.map(r => ({ id: r.razaId, nombre: r.nombre }))
    });
    
    return razasLibres;
  }

  // Liberar una raza de la especie actual (quitarle la asignación)
  liberarRazaDeEspecie(raza: any): void {
    console.log('🔄 Liberando raza de especie:', raza);
    
    if (!raza || !raza.razaId) {
      console.error('❌ Raza inválida para liberar:', raza);
      this.mostrarNotificacionError('Error al liberar raza', { error: { message: 'Datos de raza inválidos' } });
      return;
    }

    // Buscar la raza en el array local y quitar su asignación
    const razaIndex = this.razas.findIndex(r => r.razaId === raza.razaId);
    if (razaIndex !== -1) {
      // Marcar como no asignada (usar ID temporal)
      this.razas[razaIndex].especieId = 999999; // ID temporal para "sin asignar"
      console.log(`✅ Raza "${raza.nombre}" liberada de "${this.asignacionRaza.especieNombre}"`);
      
      this.mostrarNotificacionExito(`✅ Raza "${raza.nombre}" liberada exitosamente. Ahora está disponible para otras especies.`);
    } else {
      console.error('❌ No se encontró la raza en el array local:', raza.razaId);
      this.mostrarNotificacionError('Error al liberar raza', { error: { message: 'Raza no encontrada en la lista local' } });
    }
  }

  // Liberar una raza directamente desde la tabla principal
  liberarRazaDeEspecieDirecto(raza: any, especieId: number): void {
    console.log('🔄 Liberando raza directamente desde tabla:', { raza, especieId });
    
    if (!raza || !raza.razaId) {
      console.error('❌ Raza inválida para liberar:', raza);
      this.mostrarNotificacionError('Error al liberar raza', { error: { message: 'Datos de raza inválidos' } });
      return;
    }

    // Buscar la raza en el array local y quitar su asignación
    const razaIndex = this.razas.findIndex(r => r.razaId === raza.razaId);
    if (razaIndex !== -1) {
      // Marcar como no asignada (usar ID temporal)
      this.razas[razaIndex].especieId = 999999; // ID temporal para "sin asignar"
      
      const nombreEspecie = this.especies.find(e => e.especieId === especieId)?.nombre || 'la especie';
      console.log(`✅ Raza "${raza.nombre}" liberada de "${nombreEspecie}"`);
      
      this.mostrarNotificacionExito(`✅ Raza "${raza.nombre}" liberada de ${nombreEspecie}. Ahora está disponible en "Razas Disponibles".`);
    } else {
      console.error('❌ No se encontró la raza en el array local:', raza.razaId);
      this.mostrarNotificacionError('Error al liberar raza', { error: { message: 'Raza no encontrada en la lista local' } });
    }
  }

  seleccionarRazaParaAsignar(raza: any) {
    // Simulamos la asignación localmente
    raza.especieId = this.asignacionRaza.especieId;
    
    this.mostrarNotificacionExito(
      `Raza "${raza.nombre}" asignada a "${this.asignacionRaza.especieNombre}" exitosamente`
    );
    
    // Refrescar la vista
    this.cargarRazas();
  }

  // ========== MÉTODOS DE PAGINACIÓN FIJA ==========
  
  /**
   * Ir a la página anterior para servicios
   */
  anteriorPaginaServicios(): void {
    if (this.serviciosPagina > 1) {
      this.serviciosPagina--;
    }
  }

  /**
   * Ir a la página siguiente para servicios
   */
  siguientePaginaServicios(): void {
    if (this.serviciosPagina < this.totalPagesServicios) {
      this.serviciosPagina++;
    }
  }

  /**
   * Ir a la página anterior para especies
   */
  anteriorPaginaEspecies(): void {
    if (this.especiesPagina > 1) {
      this.especiesPagina--;
    }
  }

  /**
   * Ir a la página siguiente para especies
   */
  siguientePaginaEspecies(): void {
    if (this.especiesPagina < this.totalPagesEspecies) {
      this.especiesPagina++;
    }
  }

  /**
   * Obtiene el número total de páginas para servicios
   */
  get totalPagesServicios(): number {
    return Math.ceil(this.tiposServicios.length / this.itemsPerPageServicios);
  }

  /**
   * Obtiene el número total de páginas para especies
   */
  get totalPagesEspecies(): number {
    return Math.ceil(this.especies.length / this.itemsPerPageEspecies);
  }

  /**
   * Obtiene el número del primer elemento mostrado en la página actual de servicios
   */
  get firstItemNumberServicios(): number {
    if (this.tiposServicios.length === 0) return 0;
    return ((this.serviciosPagina - 1) * this.itemsPerPageServicios) + 1;
  }

  /**
   * Obtiene el número del último elemento mostrado en la página actual de servicios
   */
  get lastItemNumberServicios(): number {
    const lastItem = this.serviciosPagina * this.itemsPerPageServicios;
    return Math.min(lastItem, this.tiposServicios.length);
  }

  /**
   * Obtiene el número del primer elemento mostrado en la página actual de especies
   */
  get firstItemNumberEspecies(): number {
    if (this.especies.length === 0) return 0;
    return ((this.especiesPagina - 1) * this.itemsPerPageEspecies) + 1;
  }

  /**
   * Obtiene el número del último elemento mostrado en la página actual de especies
   */
  get lastItemNumberEspecies(): number {
    const lastItem = this.especiesPagina * this.itemsPerPageEspecies;
    return Math.min(lastItem, this.especies.length);
  }

  /**
   * Obtiene los servicios paginados para la página actual
   */
  get serviciosPaginados(): TipoServicio[] {
    const startIndex = (this.serviciosPagina - 1) * this.itemsPerPageServicios;
    const endIndex = startIndex + this.itemsPerPageServicios;
    return this.tiposServicios.slice(startIndex, endIndex);
  }

  /**
   * Obtiene las especies paginadas para la página actual
   */
  get especiesPaginadas(): Especie[] {
    const startIndex = (this.especiesPagina - 1) * this.itemsPerPageEspecies;
    const endIndex = startIndex + this.itemsPerPageEspecies;
    return this.especies.slice(startIndex, endIndex);
  }

  // ========== NUEVO ESTÁNDAR DE PAGINACIÓN PARA TODO EL SISTEMA ========== 
  //
  // 🎯 CONFIGURACIÓN ESTÁNDAR APLICADA:
  // ✅ 5 elementos por página (fijo)
  // ✅ Navegación solo con "Anterior" y "Siguiente"  
  // ✅ Sin dropdown de selección de elementos por página
  // ✅ Colores y diseño consistente con Tailwind CSS
  //
  // 📋 ELEMENTOS IMPLEMENTADOS:
  // - Información: "Mostrando X-Y de Z elementos" 
  // - Controles: Botones "Anterior" y "Siguiente" deshabilitados cuando corresponde
  // - Indicador: "Página X de Y" (solo cuando hay múltiples páginas)
  // - Colores: bg-gray-50, text-gray-700, border-gray-300, hover:bg-gray-50
  // 
  // 🔧 COMPONENTES YA ACTUALIZADOS:
  // ✅ catalog-management.component (servicios y especies)
  // ✅ user-management.component (usuarios)
  //
  // 📌 PRÓXIMOS COMPONENTES A ACTUALIZAR:
  // - appointment-supervision (citas)
  // - inventory-management (inventario) 
  // - reports (reportes)
  // - Y cualquier otra tabla que muestre listados
  //
  // 🎨 ESTRUCTURA HTML ESTÁNDAR:
  // <div class="bg-gray-50 px-4 py-3 flex flex-col lg:flex-row justify-between items-center gap-4 border-t border-gray-200">
  //   <div class="text-sm text-gray-700"><!-- Información --></div>
  //   <div class="flex items-center space-x-2"><!-- Controles --></div>
  // </div>
  //
  // ========== FIN DEL ESTÁNDAR DE PAGINACIÓN ==========

  // 🧪 Método de prueba para verificar APIs de creación
  probarAPIsCreacion(): void {
    console.log('🧪 === PRUEBA DE APIs DE CREACIÓN (ADMIN DESDE localhost:4200/admin) ===');
    console.log(`📍 URL actual: ${window.location.href}`);
    console.log(`🌐 Origin: ${window.location.origin}`);
    console.log(`📂 Pathname: ${window.location.pathname}`);
    
    // Verificar autenticación primero
    const token = localStorage.getItem('auth_token');
    const user = this.sessionService.user;
    
    console.log('🔐 Estado de autenticación:');
    console.log('  - Token presente:', token ? '✅ SÍ' : '❌ NO');
    console.log('  - Usuario:', user?.username || 'NO DEFINIDO');
    console.log('  - Rol:', user?.rol || 'NO DEFINIDO');
    
    if (!token || !user?.rol) {
      this.mostrarNotificacionError('Error de autenticación', { error: { message: 'Token o rol no definido' } });
      return;
    }
    
    // Probar creación de especie de prueba
    const timestamp = Date.now();
    const especiePrueba = { nombre: `TEST_Especie_${timestamp}` };
    
    console.log('🧪 Probando creación de especie:', especiePrueba);
    this.mostrarNotificacionExito('Iniciando prueba de APIs...');
    
    this.catalogoService.crearEspecie(especiePrueba).subscribe({
      next: (response) => {
        console.log('✅ API creación especie FUNCIONA:', response);
        this.mostrarNotificacionExito('✅ API de especies funciona correctamente');
        
        // Si funciona, probar creación de raza
        const razaPrueba = { 
          nombre: `TEST_Raza_${timestamp}`, 
          especieId: response.data?.especieId || response.especieId || 1 
        };
        
        console.log('🧪 Probando creación de raza:', razaPrueba);
        this.catalogoService.crearRaza(razaPrueba).subscribe({
          next: (responseRaza) => {
            console.log('✅ API creación raza FUNCIONA:', responseRaza);
            this.mostrarNotificacionExito('🎉 Ambas APIs funcionan correctamente!');
            
            // Recargar datos para ver los nuevos registros
            setTimeout(() => this.obtenerDatosEspeciesYRazas(), 1000);
          },
          error: (errRaza) => {
            console.error('❌ API creación raza FALLA:', errRaza);
            this.mostrarNotificacionError('API de razas falló', errRaza);
          }
        });
      },
      error: (errEspecie) => {
        console.error('❌ API creación especie FALLA:', errEspecie);
        this.mostrarNotificacionError('API de especies falló', errEspecie);
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
    const especie = { nombre: nombre };
    this.catalogoService.crearEspecie(especie).subscribe({
      next: (response: any) => {
        this.obtenerDatosEspeciesYRazas();
        this.mostrarNotificacionExito(`Especie "${nombre}" agregada exitosamente`);
      },
      error: (err) => {
        console.error('Error al crear especie:', err);
        this.mostrarNotificacionError(`Error al crear la especie "${nombre}"`, err);
      }
    });
  }

  crearRazaRapida(nombre: string, especieId: number | undefined): void {
    if (!especieId) {
      this.mostrarNotificacionError('Error al crear raza', { error: { message: 'ID de especie no válido' } });
      return;
    }
    
    const raza = { nombre: nombre, especieId: especieId };
    this.catalogoService.crearRaza(raza).subscribe({
      next: (response: any) => {
        this.obtenerDatosEspeciesYRazas();
        this.mostrarNotificacionExito(`Raza "${nombre}" agregada exitosamente`);
      },
      error: (err) => {
        console.error('Error al crear raza:', err);
        this.mostrarNotificacionError(`Error al crear la raza "${nombre}"`, err);
      }
    });
  }

  // 🎉 Método para mostrar notificaciones de éxito
  mostrarNotificacionExito(mensaje: string): void {
    // Log para debug
    console.log(`🎉 ÉXITO: ${mensaje}`);
    
    // Crear elemento de notificación temporal
    const notification = document.createElement('div');
    notification.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white px-8 py-4 rounded-lg shadow-xl z-50 transition-all duration-300 max-w-md text-center';
    notification.innerHTML = `
      <div class="flex items-center justify-center">
        <div class="flex-shrink-0">
          <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <div>
          <p class="text-sm font-medium">¡Operación exitosa!</p>
          <p class="mt-1 text-sm opacity-90">${mensaje}</p>
        </div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Añadir efecto de entrada
    setTimeout(() => {
      notification.classList.add('scale-105');
    }, 10);
    
    // Remover después de 3 segundos
    setTimeout(() => {
      notification.classList.add('opacity-0', 'scale-95');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // ❌ Método para mostrar notificaciones de error
  mostrarNotificacionError(mensaje: string, error: any): void {
    console.error(`❌ ERROR: ${mensaje}`, error);
    
    let detalleError = 'Error desconocido';
    if (error.status === 401) {
      detalleError = 'No estás autenticado';
    } else if (error.status === 403) {
      detalleError = 'No tienes permisos';
    } else if (error.status === 500) {
      detalleError = 'Error del servidor';
    } else if (error.error?.message) {
      detalleError = error.error.message;
    }
    
    // Crear elemento de notificación temporal
    const notification = document.createElement('div');
    notification.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white px-8 py-4 rounded-lg shadow-xl z-50 transition-all duration-300 max-w-md text-center';
    notification.innerHTML = `
      <div class="flex items-center justify-center">
        <div class="flex-shrink-0">
          <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        <div>
          <p class="text-sm font-medium">Error</p>
          <p class="mt-1 text-sm opacity-90">${mensaje}</p>
          <p class="mt-1 text-xs opacity-75">${detalleError}</p>
        </div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Añadir efecto de entrada
    setTimeout(() => {
      notification.classList.add('scale-105');
    }, 10);
    
    // Remover después de 4 segundos
    setTimeout(() => {
      notification.classList.add('opacity-0', 'scale-95');
      setTimeout(() => notification.remove(), 300);
    }, 4000);
  }

  // Método para abrir modal de raza (puede recibir especie o especieId)
  abrirModalRazaParaEspecie(especieOrId: Especie | number | undefined): void {
    let especieId: number | undefined;
    
    if (typeof especieOrId === 'object' && especieOrId) {
      // Es un objeto Especie
      especieId = especieOrId.especieId;
    } else if (typeof especieOrId === 'number') {
      // Es un ID numérico
      especieId = especieOrId;
    }
    
    if (!especieId) {
      this.mostrarNotificacionError('Error al abrir modal', { error: { message: 'ID de especie no válido' } });
      return;
    }
    
    this.modalRazaVisible = true;
    this.nuevaRaza = { nombre: '', especieId: especieId };
    
    console.log('🔵 Modal de raza abierto para especie:', especieId);
  }

  // Método auxiliar para obtener especie por ID
  getEspeciePorId(especieId: number | undefined): Especie | undefined {
    if (!especieId) return undefined;
    return this.especies.find(especie => especie.especieId === especieId);
  }

  getRazasPorEspecie(id: number | undefined): Raza[] {
    if (!id) return [];
    const razasFiltradas = this.razas.filter(r => r.especieId === id);
    console.log(`🔍 Razas encontradas para especie ${id}:`, razasFiltradas);
    return razasFiltradas;
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

  // Método para asignar una raza a una especie (solo en la asignación, no en la base de datos)
  asignarRazaAEspecie(raza: any): void {
    console.log('🔄 Asignando raza a especie (solo asignación):', { raza, asignacion: this.asignacionRaza });
    
    // Validar que tenemos la información necesaria
    if (!raza || !raza.razaId) {
      console.error('❌ Raza inválida para asignar:', raza);
      this.mostrarNotificacionError('Error al asignar raza', { error: { message: 'Datos de raza inválidos' } });
      return;
    }

    // VALIDAR REGLA: No se puede reasignar una raza que ya está asignada a otra especie
    if (raza.especieId && raza.especieId !== 999999 && raza.especieId !== this.asignacionRaza.especieId) {
      const especieOriginal = this.especies.find(e => e.especieId === raza.especieId);
      this.mostrarNotificacionError(
        `❌ La raza "${raza.nombre}" ya está asignada a "${especieOriginal?.nombre || 'otra especie'}"`, 
        { error: { message: 'No se puede reasignar una raza ya asignada' } }
      );
      return;
    }
    
    // Buscar la raza en el array local y cambiar su especieId
    const razaIndex = this.razas.findIndex(r => r.razaId === raza.razaId);
    if (razaIndex !== -1) {
      // Cambiar la asignación a la especie seleccionada
      this.razas[razaIndex].especieId = this.asignacionRaza.especieId;
      console.log(`✅ Raza "${raza.nombre}" asignada a especie ${this.asignacionRaza.especieId}`);
      
      this.mostrarNotificacionExito(`✅ Raza "${raza.nombre}" asignada a "${this.asignacionRaza.especieNombre}" exitosamente`);
    } else {
      console.error('❌ No se encontró la raza en el array local:', raza.razaId);
      this.mostrarNotificacionError('Error al asignar raza', { error: { message: 'Raza no encontrada en la lista local' } });
    }
    
    // NO recargar todos los datos, solo actualizar la vista local
    // this.cargarRazas(); // ❌ Esto causa que se pierdan los cambios locales
  }

  // Método para remover una raza de una especie (solo en la asignación, no de la base de datos)
  removerRazaDeEspecie(raza: any): void {
    console.log('🔄 Removiendo raza de especie (solo asignación):', { raza, asignacion: this.asignacionRaza });
    
    // Validar que tenemos la información necesaria
    if (!raza || !raza.razaId) {
      console.error('❌ Raza inválida para remover:', raza);
      this.mostrarNotificacionError('Error al remover raza', { error: { message: 'Datos de raza inválidos' } });
      return;
    }
    
    // Buscar la raza en el array local y cambiar su especieId
    const razaIndex = this.razas.findIndex(r => r.razaId === raza.razaId);
    if (razaIndex !== -1) {
      // En lugar de eliminar, cambiamos la especie asignada a una diferente
      // Para simular que la raza ya no está asignada a esta especie
      const otraEspecie = this.especies.find(e => e.especieId !== this.asignacionRaza.especieId);
      
      if (otraEspecie && otraEspecie.especieId) {
        // Cambiar la asignación a otra especie (simulación)
        this.razas[razaIndex].especieId = otraEspecie.especieId;
        console.log(`✅ Raza "${raza.nombre}" reasignada temporalmente a especie ${otraEspecie.especieId}`);
      } else {
        // Si no hay otra especie, crear una temporal
        this.razas[razaIndex].especieId = 999999; // ID temporal para "sin asignar"
        console.log(`✅ Raza "${raza.nombre}" marcada como sin asignar`);
      }
      
      this.mostrarNotificacionExito(`Raza "${raza.nombre}" removida de "${this.asignacionRaza.especieNombre}" exitosamente`);
    } else {
      console.error('❌ No se encontró la raza en el array local:', raza.razaId);
      this.mostrarNotificacionError('Error al remover raza', { error: { message: 'Raza no encontrada en la lista local' } });
    }
    
    // NO recargar todos los datos, solo actualizar la vista local
    // this.cargarRazas(); // ❌ Esto causa que se pierdan los cambios locales
  }

  // Eliminar raza individual
  eliminarRaza(razaId: number): void {
    const razaAEliminar = this.razas.find(r => r.razaId === razaId);
    const especieNombre = this.getEspecieNombre(razaAEliminar?.especieId || 0);
    
    if (!razaAEliminar) {
      this.mostrarNotificacionError('Raza no encontrada', { error: { message: 'No se pudo encontrar la raza a eliminar' } });
      return;
    }

    // Mostrar modal de confirmación personalizado
    this.mostrarConfirmacion({
      titulo: '🗑️ Eliminar Raza',
      mensaje: `¿Estás seguro de que deseas eliminar la raza "${razaAEliminar.nombre}"?`,
      detalles: `Esta raza pertenece a la especie "${especieNombre}"`,
      tipoAccion: 'eliminar-raza',
      colorBoton: 'bg-red-600 hover:bg-red-700',
      datosElemento: { raza: razaAEliminar, especieNombre },
      onConfirm: () => this.ejecutarEliminacionRaza(razaId, razaAEliminar)
    });
  }

  // Método separado para ejecutar la eliminación real de raza
  private ejecutarEliminacionRaza(razaId: number, razaAEliminar: any): void {
    console.log('🔄 Ejecutando eliminación de raza:', { razaId, raza: razaAEliminar });
    
    // Mostrar loading
    this.isLoading = true;
    
    this.catalogoService.eliminarRaza(razaId).subscribe({
      next: () => {
        console.log('✅ Raza eliminada exitosamente, actualizando tabla...');
        this.isLoading = false;
        this.obtenerDatosEspeciesYRazas();
        this.mostrarNotificacionExito(`✅ Raza "${razaAEliminar?.nombre}" eliminada correctamente`);
      },
      error: (err) => {
        console.error('Error al eliminar raza:', err);
        this.isLoading = false;
        
        // SIEMPRE actualizar la tabla después de un "error", porque puede ser un falso negativo
        setTimeout(() => {
          console.log('🔄 Actualizando tabla después del error para verificar si la eliminación fue exitosa...');
          this.obtenerDatosEspeciesYRazas();
        }, 1000);
        
        // Verificar si realmente no se eliminó
        this.verificarSiRazaEliminada(razaId, razaAEliminar?.nombre).then(eliminada => {
          if (!eliminada) {
            this.mostrarNotificacionError('❌ Error al eliminar la raza', err);
          }
        });
      }
    });
  }

  // Método auxiliar para verificar si una raza fue realmente eliminada
  private async verificarSiRazaEliminada(razaId: number, nombreRaza?: string): Promise<boolean> {
    return new Promise((resolve) => {
      // Esperar un momento y luego verificar si la raza ya no existe
      setTimeout(() => {
        this.catalogoService.listarRazas().subscribe({
          next: (razas) => {
            const razaExiste = razas.some(r => r.razaId === razaId);
            if (!razaExiste) {
              console.log('✅ Verificación: La raza fue eliminada correctamente');
              this.mostrarNotificacionExito(`Raza "${nombreRaza || 'Raza'}" eliminada correctamente`);
              resolve(true);
            } else {
              console.log('❌ Verificación: La raza aún existe');
              resolve(false);
            }
          },
          error: () => {
            console.log('❌ Error al verificar si la raza fue eliminada');
            resolve(false);
          }
        });
      }, 2000);
    });
  }

  // Método para tracking en ngFor para mejor performance
  trackByRazaId(index: number, raza: any): number {
    return raza.razaId;
  }

  // ========== MODAL DE CONFIRMACIÓN PERSONALIZADO ==========
  
  mostrarConfirmacion(config: {
    titulo: string;
    mensaje: string;
    detalles?: string;
    tipoAccion: 'eliminar-especie' | 'eliminar-raza' | 'eliminar-servicio' | 'otro';
    icono?: string;
    colorBoton?: string;
    onConfirm: () => void;
    datosElemento?: any;
  }): void {
    this.confirmacionData = {
      titulo: config.titulo,
      mensaje: config.mensaje,
      detalles: config.detalles,
      tipoAccion: config.tipoAccion,
      icono: config.icono || (config.tipoAccion.includes('eliminar') ? '🗑️' : '⚠️'),
      colorBoton: config.colorBoton || 'bg-red-600 hover:bg-red-700',
      onConfirm: config.onConfirm,
      datosElemento: config.datosElemento
    };
    this.modalConfirmacionVisible = true;
  }

  cerrarModalConfirmacion(): void {
    this.modalConfirmacionVisible = false;
  }

  confirmarAccion(): void {
    if (this.confirmacionData.onConfirm) {
      this.confirmacionData.onConfirm();
    }
    this.cerrarModalConfirmacion();
  }

}
