import { Component, OnInit, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VeterinarioService, CrearVeterinarioRequest } from '../../../core/services/veterinario.service';
import { Veterinario } from '../../shared/interfaces/Veterinario.model';

interface VeterinarioExtendido extends Veterinario {
  editandoDni?: boolean;
  dniTemporal?: string;
}

@Component({
  selector: 'app-veterinary-team',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './veterinary-team.component.html',
  styleUrl: './veterinary-team.component.css'
})
export class VeterinaryTeamComponent implements OnInit {
  @Input() activeTab: string = 'tabla-veterinarios';

  // State management
  veterinarios: VeterinarioExtendido[] = [];
  veterinariosFiltrados: VeterinarioExtendido[] = [];
  cargandoVeterinarios = signal(false);
  
  // Búsqueda y filtros
  terminoBusqueda = '';
  
  // Modales y estados
  modalExitoVisible = false;
  modalErrorVisible = false;
  modalDetallesVisible = false;
  mensajeModal = '';
  
  // Veterinario seleccionado para detalles
  veterinarioSeleccionado: VeterinarioExtendido | null = null;

  constructor(private veterinarioService: VeterinarioService) {}

  ngOnInit(): void {
    this.cargarVeterinarios();
  }

  // Computed values
  get totalElementos(): number {
    return this.veterinarios.length;
  }

  cargarVeterinarios(): void {
    this.cargandoVeterinarios.set(true);
    
    this.veterinarioService.listarVeterinarios().subscribe({
      next: (response) => {
        if (response.codigo === 200) {
          this.veterinarios = Array.isArray(response.data) ? response.data : [response.data];
          this.aplicarFiltros();
          this.mostrarExito('Veterinarios cargados correctamente');
        } else {
          this.mostrarError('Error al cargar veterinarios: ' + response.message);
        }
      },
      error: (error) => {
        console.error('Error al cargar veterinarios:', error);
        this.mostrarError('Error de conexión al cargar veterinarios');
      },
      complete: () => {
        this.cargandoVeterinarios.set(false);
      }
    });
  }

  aplicarFiltros(): void {
    if (!this.terminoBusqueda.trim()) {
      this.veterinariosFiltrados = [...this.veterinarios];
    } else {
      const termino = this.terminoBusqueda.toLowerCase().trim();
      this.veterinariosFiltrados = this.veterinarios.filter(veterinario =>
        veterinario.nombre.toLowerCase().includes(termino) ||
        veterinario.apellido.toLowerCase().includes(termino) ||
        (veterinario.dni && veterinario.dni.toLowerCase().includes(termino))
      );
    }
  }

  // Modal de detalles
  verDetallesVeterinario(veterinario: VeterinarioExtendido): void {
    this.veterinarioSeleccionado = veterinario;
    this.modalDetallesVisible = true;
  }

  cerrarModalDetalles(): void {
    this.modalDetallesVisible = false;
    this.veterinarioSeleccionado = null;
  }

  // Edición de DNI
  iniciarEdicionDni(veterinario: VeterinarioExtendido): void {
    veterinario.editandoDni = true;
    veterinario.dniTemporal = veterinario.dni || '';
  }

  cancelarEdicionDni(veterinario: VeterinarioExtendido): void {
    veterinario.editandoDni = false;
    veterinario.dniTemporal = '';
  }

  guardarDni(veterinario: VeterinarioExtendido): void {
    if (!veterinario.dniTemporal || !this.isValidDni(veterinario.dniTemporal)) {
      this.mostrarError('Por favor, ingrese un DNI válido (8 dígitos)');
      return;
    }

    this.veterinarioService.editardni(veterinario.veterinarioId!, veterinario.dniTemporal).subscribe({
      next: (response: any) => {
        if (response.codigo === 200) {
          veterinario.dni = veterinario.dniTemporal!;
          veterinario.editandoDni = false;
          veterinario.dniTemporal = '';
          this.mostrarExito('DNI actualizado correctamente');
        } else {
          this.mostrarError('Error al actualizar DNI: ' + response.message);
        }
      },
      error: (error: any) => {
        console.error('Error al actualizar DNI:', error);
        this.mostrarError('Error de conexión al actualizar DNI');
      }
    });
  }

  // Exportar datos
  exportarVeterinarios(): void {
    if (this.veterinarios.length === 0) {
      this.mostrarError('No hay datos para exportar');
      return;
    }

    try {
      const csv = this.generarCSV(this.veterinarios);
      this.descargarCSV(csv, 'veterinarios.csv');
      this.mostrarExito('Datos exportados correctamente');
    } catch (error) {
      console.error('Error al exportar:', error);
      this.mostrarError('Error al exportar los datos');
    }
  }

  private generarCSV(datos: VeterinarioExtendido[]): string {
    const headers = ['ID', 'Nombre', 'Apellido', 'DNI'];
    const filas = datos.map(vet => [
      vet.veterinarioId || '',
      vet.nombre || '',
      vet.apellido || '',
      vet.dni || 'No registrado'
    ]);

    const csvContent = [
      headers.join(','),
      ...filas.map(fila => fila.map(campo => `"${campo}"`).join(','))
    ].join('\n');

    return csvContent;
  }

  private descargarCSV(contenido: string, nombreArchivo: string): void {
    const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', nombreArchivo);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  // Validaciones
  isValidDni(dni: string): boolean {
    return /^\d{8}$/.test(dni);
  }

  // Modales de notificación
  mostrarExito(mensaje: string): void {
    this.mensajeModal = mensaje;
    this.modalExitoVisible = true;
  }

  mostrarError(mensaje: string): void {
    this.mensajeModal = mensaje;
    this.modalErrorVisible = true;
  }

  cerrarModalExito(): void {
    this.modalExitoVisible = false;
    this.mensajeModal = '';
  }

  cerrarModalError(): void {
    this.modalErrorVisible = false;
    this.mensajeModal = '';
  }
}
