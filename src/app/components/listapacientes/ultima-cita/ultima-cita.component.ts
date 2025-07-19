import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CitaService } from '../../../core/services/cita.service';
import { MascotaService } from '../../../core/services/mascota.service';
import { ClienteService } from '../../../core/services/cliente.service';
import { VeterinarioService } from '../../../core/services/veterinario.service';
import { TipoServicioService } from '../../../core/services/tipo-servicio.service';
import { Cita } from '../../shared/interfaces/cita.model';
import { Mascota } from '../../shared/interfaces/mascota.model';
import { Cliente } from '../../shared/interfaces/cliente.model';
import { Veterinario } from '../../shared/interfaces/Veterinario.model';
import { TipoServicio } from '../../shared/interfaces/tipo-servicio.model';
import { PacienteCitaHoy } from '../../../pages/listapacientes/listapacientes-page.component';
import { forkJoin } from 'rxjs';

interface CitaCompleta extends Cita {
  mascotaNombre?: string;
  clienteNombre?: string;
  veterinarioNombre?: string;
  tipoServicioNombre?: string;
}

@Component({
  selector: 'app-ultima-cita',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ultima-cita.component.html',
  styleUrls: ['./ultima-cita.component.css']
})
export class UltimaCitaComponent implements OnInit {
  @Input() paciente: PacienteCitaHoy | null = null;

  ultimaCita = signal<CitaCompleta | null>(null);
  cargando = signal(false);
  error = signal<string | null>(null);

  constructor(
    private citaService: CitaService,
    private mascotaService: MascotaService,
    private clienteService: ClienteService,
    private veterinarioService: VeterinarioService,
    private tipoServicioService: TipoServicioService
  ) {}

  ngOnInit(): void {
    if (this.paciente) {
      this.cargarUltimaCita();
    }
  }

  ngOnChanges(): void {
    if (this.paciente) {
      this.cargarUltimaCita();
    }
  }

  cargarUltimaCita(): void {
    if (!this.paciente?.mascotaId) {
      this.error.set('No se pudo identificar la mascota');
      return;
    }

    this.cargando.set(true);
    this.error.set(null);

    // Obtener las citas del veterinario para esta mascota
    this.citaService.listarCitasVeterinario(this.paciente.clienteId).subscribe({
      next: (citas: Cita[]) => {
        console.log('Citas recibidas:', citas);

        // Validar que citas sea un array
        if (!Array.isArray(citas)) {
          console.error('La respuesta no es un array:', citas);
          this.error.set('Formato de respuesta inválido');
          this.cargando.set(false);
          return;
        }

        // Filtrar citas de esta mascota y ordenar por fecha
        const citasMascota = citas
          .filter(cita => cita && cita.mascotaId === this.paciente?.mascotaId)
          .sort((a, b) => new Date(b.fechaRegistro).getTime() - new Date(a.fechaRegistro).getTime());

        console.log('Citas filtradas para mascota:', citasMascota);

        if (citasMascota.length > 0) {
          const ultimaCita = citasMascota[0];
          this.cargarDatosCompletos(ultimaCita);
        } else {
          this.ultimaCita.set(null);
          this.error.set('No se encontraron citas para esta mascota');
          this.cargando.set(false);
        }
      },
      error: (err) => {
        console.error('Error al cargar la última cita:', err);
        this.error.set('Error al cargar la información de la cita');
        this.cargando.set(false);
      }
    });
  }

  cargarDatosCompletos(cita: Cita): void {
    const citaCompleta: CitaCompleta = { ...cita };
    const requests = [];

    // Cargar datos de mascota
    if (cita.mascotaId) {
      requests.push(
        this.mascotaService.listarMascotaPorIdVeterinario(cita.mascotaId).subscribe({
          next: (response) => {
            if (response.data) {
              citaCompleta.mascotaNombre = response.data.nombre;
            }
          },
          error: (err) => console.error('Error al cargar mascota:', err)
        })
      );
    }

    // Cargar datos de cliente
    if (cita.clienteId) {
      requests.push(
        this.clienteService.listarClientePorIdVeterinario(cita.clienteId).subscribe({
          next: (response) => {
            if (response.data) {
              citaCompleta.clienteNombre = `${response.data.nombre} ${response.data.apellido}`;
            }
          },
          error: (err) => console.error('Error al cargar cliente:', err)
        })
      );
    }

    // Cargar datos de veterinario
    if (cita.veterinarioId) {
      requests.push(
        this.veterinarioService.listarVeterinarios().subscribe({
          next: (response) => {
            if (response.data && Array.isArray(response.data)) {
              const veterinario = response.data.find(v => v.veterinarioId === cita.veterinarioId);
              if (veterinario) {
                citaCompleta.veterinarioNombre = `${veterinario.nombre} ${veterinario.apellido}`;
              }
            }
          },
          error: (err) => console.error('Error al cargar veterinario:', err)
        })
      );
    }

    // Cargar datos de tipo de servicio
    if (cita.tipoServicioId) {
      requests.push(
        this.tipoServicioService.listarTiposServicios().subscribe({
          next: (tiposServicio) => {
            const tipoServicio = tiposServicio.find(t => t.tipoServicioId === cita.tipoServicioId);
            if (tipoServicio) {
              citaCompleta.tipoServicioNombre = tipoServicio.nombre;
            }
          },
          error: (err) => console.error('Error al cargar tipo de servicio:', err)
        })
      );
    }

    // Esperar a que todos los requests se completen
    if (requests.length > 0) {
      forkJoin(requests).subscribe({
        next: () => {
          this.ultimaCita.set(citaCompleta);
          this.cargando.set(false);
        },
        error: (err) => {
          console.error('Error al cargar datos completos:', err);
          this.ultimaCita.set(citaCompleta);
          this.cargando.set(false);
        }
      });
    } else {
      this.ultimaCita.set(citaCompleta);
      this.cargando.set(false);
    }
  }

  getEstadoCitaClass(estado: string): string {
    switch (estado?.toUpperCase()) {
      case 'PENDIENTE':
        return 'estado-pendiente';
      case 'TRIAJE':
        return 'estado-triaje';
      case 'CONVETERINARIO':
        return 'estado-veterinario';
      case 'COMPLETADA':
        return 'estado-completada';
      default:
        return 'estado-default';
    }
  }

  getEstadoCitaEmoji(estado: string): string {
    switch (estado?.toUpperCase()) {
      case 'PENDIENTE':
        return '⏳';
      case 'TRIAJE':
        return '🌡️';
      case 'CONVETERINARIO':
        return '👨‍⚕️';
      case 'COMPLETADA':
        return '✅';
      default:
        return '❓';
    }
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return 'N/A';
    try {
      const fechaObj = new Date(fecha);
      return fechaObj.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return fecha;
    }
  }
}
