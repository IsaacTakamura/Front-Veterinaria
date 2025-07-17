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
import { EmojiService } from '../../../core/services/emoji.service';

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
  
  // Variables para paginación fija (5 elementos por página)
  especiesPagina = 1;
  serviciosPagina = 1;
  itemsPerPageEspecies = 5; // Estándar fijo: 5 elementos por página
  itemsPerPageServicios = 5; // Estándar fijo: 5 elementos por página
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
    private http: HttpClient,
    private emojiService: EmojiService
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
    this.obtenerTiposServicios();
    this.obtenerDatosEspeciesYRazas();
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
    if (confirm('¿Estás seguro de que deseas eliminar este tipo de servicio? Esta acción no se puede deshacer.')) {
      // TODO: Implementar llamada a la API cuando esté disponible
      // this.tipoServicioService.eliminarTipoServicio(tipoServicioId).subscribe({
      //   next: () => {
      //     this.obtenerTiposServicios();
      //     this.mostrarNotificacionExito('Tipo de servicio eliminado correctamente');
      //   },
      //   error: (err) => {
      //     console.error('Error al eliminar tipo de servicio', err);
      //     this.mostrarNotificacionError('Error al eliminar el tipo de servicio', err);
      //   }
      // });
      
      // Simulación temporal: eliminar de la lista local y mostrar notificación
      const servicioEliminado = this.tiposServicios.find(s => s.tipoServicioId === tipoServicioId);
      this.tiposServicios = this.tiposServicios.filter(s => s.tipoServicioId !== tipoServicioId);
      
      // Eliminar también la descripción local
      this.descripcionesLocales.delete(tipoServicioId);
      this.guardarDescripcionesLocales();
      
      const nombreServicio = servicioEliminado?.nombre || 'Servicio';
      this.mostrarNotificacionExito(`Tipo de servicio "${nombreServicio}" eliminado correctamente`);
      
      console.log(`✅ Tipo de servicio eliminado localmente: ID ${tipoServicioId}`);
    }
  }

  // Eliminar especie y sus razas vinculadas
  eliminarEspecie(especieId: number): void {
    const especieAEliminar = this.especies.find(e => e.especieId === especieId);
    const razasVinculadas = this.getRazasPorEspecie(especieId);
    
    let mensajeConfirmacion = `¿Estás seguro de que deseas eliminar la especie "${especieAEliminar?.nombre}"?`;
    if (razasVinculadas.length > 0) {
      mensajeConfirmacion += `\n\nEsto también eliminará ${razasVinculadas.length} raza(s) vinculada(s): ${razasVinculadas.map(r => r.nombre).join(', ')}`;
    }
    mensajeConfirmacion += '\n\nEsta acción no se puede deshacer.';
    
    if (confirm(mensajeConfirmacion)) {
      // TODO: Implementar llamada a la API cuando esté disponible
      // this.catalogoService.eliminarEspecie(especieId).subscribe({
      //   next: () => {
      //     this.obtenerDatosEspeciesYRazas();
      //     this.mostrarNotificacionExito(`Especie "${especieAEliminar?.nombre}" eliminada correctamente`);
      //   },
      //   error: (err) => {
      //     console.error('Error al eliminar especie', err);
      //     this.mostrarNotificacionError('Error al eliminar la especie', err);
      //   }
      // });
      
      // Simulación temporal: eliminar de las listas locales
      this.especies = this.especies.filter(e => e.especieId !== especieId);
      this.razas = this.razas.filter(r => r.especieId !== especieId);
      
      // Eliminar emoji asociado si existe
      this.emojiService.obtenerTodosLosEmojisAsignados().delete(especieId);
      
      const nombreEspecie = especieAEliminar?.nombre || 'Especie';
      const cantidadRazas = razasVinculadas.length;
      
      let mensajeExito = `Especie "${nombreEspecie}" eliminada correctamente`;
      if (cantidadRazas > 0) {
        mensajeExito += ` junto con ${cantidadRazas} raza(s) vinculada(s)`;
      }
      
      this.mostrarNotificacionExito(mensajeExito);
      console.log(`✅ Especie eliminada localmente: ID ${especieId}, Razas eliminadas: ${cantidadRazas}`);
    }
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

  // Método para obtener emoji según la especie
  obtenerEmojiEspecie(especieId: number | undefined, nombreEspecie?: string): string {
    return this.emojiService.obtenerEmojiDeEspecie(especieId, nombreEspecie);
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
        
        // El emoji se asigna automáticamente según el nombre de la especie
        const emojiAsignado = this.emojiService.obtenerEmojiPorDefectoSegunNombre(nombreEspecie);
        this.emojiService.asignarEmojiAEspecie(nuevaEspecieCreada.especieId!, emojiAsignado);
        
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
    this.asignacionRaza = {
      especieId: especie.especieId,
      razaId: 0,
      especieNombre: especie.nombre
    };
    this.modalAsignarRazaVisible = true;
  }

  cerrarModalAsignarRaza() {
    this.modalAsignarRazaVisible = false;
    this.asignacionRaza = {
      especieId: 0,
      razaId: 0,
      especieNombre: ''
    };
  }

  getRazasNoAsignadas() {
    const razasAsignadas = this.getRazasPorEspecie(this.asignacionRaza.especieId);
    const idsAsignados = razasAsignadas.map(r => r.razaId);
    // Mostrar todas las razas que no están asignadas a esta especie específica
    return this.razas.filter(raza => 
      !idsAsignados.includes(raza.razaId) && 
      raza.especieId !== this.asignacionRaza.especieId
    );
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

  // Método para asignar una raza a una especie
  asignarRazaAEspecie(raza: any): void {
    // Simulamos la asignación localmente
    const razaIndex = this.razas.findIndex(r => r.razaId === raza.razaId);
    if (razaIndex !== -1) {
      this.razas[razaIndex].especieId = this.asignacionRaza.especieId;
    }
    
    this.mostrarNotificacionExito(
      `Raza "${raza.nombre}" asignada a "${this.asignacionRaza.especieNombre}" exitosamente`
    );
  }

  // Método para remover una raza de una especie
  removerRazaDeEspecie(raza: any): void {
    // Simulamos la remoción localmente
    const razaIndex = this.razas.findIndex(r => r.razaId === raza.razaId);
    if (razaIndex !== -1) {
      // Reasignar la raza a una especie diferente o simular la remoción
      const otraEspecie = this.especies.find(e => e.especieId !== this.asignacionRaza.especieId);
      if (otraEspecie && otraEspecie.especieId) {
        this.razas[razaIndex].especieId = otraEspecie.especieId;
      }
    }
    
    this.mostrarNotificacionExito(
      `Raza "${raza.nombre}" removida de "${this.asignacionRaza.especieNombre}" exitosamente`
    );
    
    // Recargar los datos para reflejar los cambios
    this.cargarRazas();
  }

  // Método para tracking en ngFor para mejor performance
  trackByRazaId(index: number, raza: any): number {
    return raza.razaId;
  }

}
