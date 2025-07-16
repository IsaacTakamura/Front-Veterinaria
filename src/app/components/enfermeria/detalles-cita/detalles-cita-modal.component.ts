// detalles-cita-modal.component.ts
import { Component, Input, Output, EventEmitter, signal, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MascotaService } from '../../../core/services/mascota.service';
import { ClienteService } from '../../../core/services/cliente.service';
import { Mascota } from '../../shared/interfaces/mascota.model';
import { Cliente } from '../../shared/interfaces/cliente.model';
import { Raza } from '../../shared/interfaces/Raza.model';

@Component({
  selector: 'app-detalles-cita-modal',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './detalles-cita-modal.component.html',
  styleUrls: ['./detalles-cita-modal.component.css'],
})
export class DetallesCitaModalComponent implements OnInit {
  // Señales para el estado del componente
  isOpen = signal(false);
  cita = signal<any>(null);

  // Señales para datos completos
  mascotaCompleta = signal<Mascota | null>(null);
  clienteCompleto = signal<Cliente | null>(null);
  razaMascota = signal<Raza | null>(null);
  cargando = signal(false);

  constructor(
    private mascotaService: MascotaService,
    private clienteService: ClienteService
  ) {}

  ngOnInit(): void {}

  // Actualizadores de inputs mediante setters
  @Input() set isOpenValue(value: boolean) {
    this.isOpen.set(value);
    if (value && this.cita()) {
      this.cargarDatosCompletos();
    }
  }

  @Input() set citaData(value: any) {
    this.cita.set(value);
    if (this.isOpen() && value) {
      this.cargarDatosCompletos();
    }
  }

  // Evento de salida para cerrar el modal
  @Output() onClose = new EventEmitter<void>();

    // Método para cargar datos completos de mascota y cliente
  private cargarDatosCompletos(): void {
    if (!this.cita()) return;

    // Limpiar datos anteriores
    this.mascotaCompleta.set(null);
    this.clienteCompleto.set(null);
    this.razaMascota.set(null);
    this.cargando.set(true);

    let requestsCompleted = 0;
    const totalRequests = 2; // mascota + cliente

    const checkCompletion = () => {
      requestsCompleted++;
      if (requestsCompleted >= totalRequests) {
        this.cargando.set(false);
      }
    };

    // Cargar datos completos de la mascota
    if (this.cita().mascotaId) {
      this.mascotaService.listarMascotaPorId(this.cita().mascotaId).subscribe({
        next: (response) => {
          this.mascotaCompleta.set(response.data);
          // Cargar información de la raza
          this.mascotaService.listarRazas().subscribe({
            next: (razasResp) => {
              const raza = razasResp.data.find((r: Raza) => r.razaId === response.data.razaId);
              this.razaMascota.set(raza || null);
            },
            error: (error) => {
              console.error('Error al cargar razas:', error);
            }
          });
          checkCompletion();
        },
        error: (error) => {
          console.error('Error al cargar mascota:', error);
          checkCompletion();
        }
      });
    } else {
      checkCompletion();
    }

    // Cargar datos completos del cliente
    if (this.cita().clienteId) {
      this.clienteService.listarClientePorId(this.cita().clienteId).subscribe({
        next: (response) => {
          this.clienteCompleto.set(response.data);
          checkCompletion();
        },
        error: (error) => {
          console.error('Error al cargar cliente:', error);
          checkCompletion();
        }
      });
    } else {
      checkCompletion();
    }
  }

  // Función para obtener el color de la badge según el estado
  getBadgeColor(estado: string): string {
    switch (estado) {
      case "pendiente":
        return "bg-yellow-500 hover:bg-yellow-600 text-white";
      case "en-triaje":
        return "bg-blue-500 hover:bg-blue-600 text-white";
      case "con-veterinario":
        return "bg-purple-500 hover:bg-purple-600 text-white";
      case "completada":
        return "bg-green-500 hover:bg-green-600 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  }

  // Función para obtener el texto del estado
  getEstadoTexto(estado: string): string {
    switch (estado) {
      case "pendiente":
        return "Pendiente";
      case "en-triaje":
        return "En Triaje";
      case "con-veterinario":
        return "Con Veterinario";
      case "completada":
        return "Completada";
      default:
        return estado;
    }
  }

  // Cerrar modal al hacer clic en el fondo
  closeModal(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('bg-black')) {
      this.cerrarModal();
    }
  }

  // Método para cerrar el modal y limpiar datos
  cerrarModal(): void {
    this.mascotaCompleta.set(null);
    this.clienteCompleto.set(null);
    this.razaMascota.set(null);
    this.cargando.set(false);
    this.onClose.emit();
  }
}
