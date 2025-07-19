import { Component, Input, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VeterinarioService } from '../../../core/services/veterinario.service';

interface Veterinario {
  veterinarioId: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  especialidad: string;
  estado: string;
  dni?: string; // Agregar dni como opcional
}

@Component({
  selector: 'app-veterinary-team',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './veterinary-team.component.html',
  styleUrls: ['./veterinary-team.component.css']
})
export class VeterinaryTeamComponent implements OnInit {
  @Input() activeTab: string = 'tabla-veterinarios';

  // Propiedades para búsqueda y filtros
  terminoBusqueda = '';
  cargandoVeterinarios = signal(false);
  
  // Propiedades para paginación
  paginaActual = 1;
  elementosPorPagina = 8;
  
  // Propiedades para modales
  modalExitoVisible = false;
  modalErrorVisible = false;
  mensajeModal = '';

  // Lista de veterinarios (inicializada vacía, se carga desde la API)
  veterinarios: Veterinario[] = [];

  // Estado de modales
  modalDetallesVisible = false;
  veterinarioSeleccionado: Veterinario | null = null;

  constructor(private veterinarioService: VeterinarioService) {}

  ngOnInit(): void {
    this.cargarVeterinarios();
  }

  // Método para cargar veterinarios desde la API
  cargarVeterinarios(): void {
    console.log('🔄 Cargando veterinarios desde la API...');
    this.cargandoVeterinarios.set(true);
    
    this.veterinarioService.listarVeterinarios().subscribe({
      next: (response: any) => {
        console.log('✅ Respuesta de la API:', response);
        
        if (response.codigo === 200 && response.data) {
          // Si response.data es un array, lo usamos directamente
          // Si es un objeto único, lo convertimos en array
          this.veterinarios = Array.isArray(response.data) ? response.data : [response.data];
          console.log(`✅ ${this.veterinarios.length} veterinarios cargados exitosamente`);
          this.mostrarExito(`${this.veterinarios.length} veterinarios cargados exitosamente`);
        } else {
          console.warn('⚠️ Respuesta inesperada de la API:', response);
          this.veterinarios = [];
          this.mostrarError('No se encontraron veterinarios');
        }
      },
      error: (error) => {
        console.error('❌ Error al cargar veterinarios:', error);
        this.veterinarios = [];
        this.mostrarError('Error al cargar veterinarios desde el servidor');
      },
      complete: () => {
        this.cargandoVeterinarios.set(false);
      }
    });
  }

  // Computed para veterinarios filtrados
  get veterinariosFiltrados(): Veterinario[] {
    if (!this.terminoBusqueda.trim()) {
      return this.veterinarios;
    }
    
    const termino = this.terminoBusqueda.toLowerCase();
    return this.veterinarios.filter(vet => 
      vet.nombre.toLowerCase().includes(termino) ||
      vet.apellido.toLowerCase().includes(termino) ||
      vet.email.toLowerCase().includes(termino) ||
      vet.especialidad.toLowerCase().includes(termino)
    );
  }

  // Computed para veterinarios paginados
  get veterinariosPaginados(): Veterinario[] {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    return this.veterinariosFiltrados.slice(inicio, fin);
  }

  // Getters para paginación
  get totalPaginas(): number {
    return Math.ceil(this.veterinariosFiltrados.length / this.elementosPorPagina);
  }

  get primerElemento(): number {
    if (this.veterinariosFiltrados.length === 0) return 0;
    return ((this.paginaActual - 1) * this.elementosPorPagina) + 1;
  }

  get ultimoElemento(): number {
    const ultimo = this.paginaActual * this.elementosPorPagina;
    return Math.min(ultimo, this.veterinariosFiltrados.length);
  }

  // Métodos de paginación
  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
    }
  }

  paginaSiguiente(): void {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
    }
  }

  // Método para aplicar filtros (también resetea la paginación)
  aplicarFiltros(): void {
    this.paginaActual = 1; // Resetear a la primera página cuando se filtra
  }

  // Método para exportar veterinarios
  exportarVeterinarios(): void {
    const data = this.veterinariosFiltrados.map(vet => ({
      ID: vet.veterinarioId,
      Nombre: vet.nombre,
      Apellido: vet.apellido,
      Email: vet.email,
      Teléfono: vet.telefono,
      Especialidad: vet.especialidad,
      Estado: vet.estado,
      DNI: vet.dni || 'No especificado'
    }));

    const csv = this.convertToCSV(data);
    this.downloadCSV(csv, 'veterinarios.csv');
    this.mostrarExito('Datos exportados correctamente');
  }

  // Método auxiliar para convertir a CSV
  private convertToCSV(data: any[]): string {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => row[header]).join(','))
    ].join('\n');
    
    return csvContent;
  }

  // Método auxiliar para descargar CSV
  private downloadCSV(csv: string, filename: string): void {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  // Métodos para mostrar modales
  mostrarExito(mensaje: string): void {
    this.mensajeModal = mensaje;
    this.modalExitoVisible = true;
    setTimeout(() => {
      this.modalExitoVisible = false;
    }, 3000);
  }

  mostrarError(mensaje: string): void {
    this.mensajeModal = mensaje;
    this.modalErrorVisible = true;
    setTimeout(() => {
      this.modalErrorVisible = false;
    }, 3000);
  }

  // Métodos para mostrar detalles
  verDetallesVeterinario(veterinario: Veterinario): void {
    this.veterinarioSeleccionado = veterinario;
    this.modalDetallesVisible = true;
  }

  cerrarModalDetalles(): void {
    this.modalDetallesVisible = false;
    this.veterinarioSeleccionado = null;
  }

  // Método para asignar veterinario
  asignarVeterinario(veterinario: Veterinario): void {
    console.log('Asignando veterinario:', veterinario);
    alert(`Veterinario ${veterinario.nombre} ${veterinario.apellido} asignado`);
  }

  // Método para eliminar veterinario
  eliminarVeterinario(veterinario: Veterinario): void {
    if (confirm(`¿Está seguro de eliminar al veterinario ${veterinario.nombre} ${veterinario.apellido}?`)) {
      this.veterinarios = this.veterinarios.filter(v => v.veterinarioId !== veterinario.veterinarioId);
      alert('Veterinario eliminado correctamente');
    }
  }
}
