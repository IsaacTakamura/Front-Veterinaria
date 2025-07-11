// citas-hoy.component.ts
import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablaCitasComponent } from '../tabla/tabla-citas.component';
import { TriajeModalComponent } from '../triaje/triaje-modal.component';
import { HistorialModalComponent } from '../historial/historial-modal.component';
import { DetallesCitaModalComponent } from '../detalles-cita/detalles-cita-modal.component';
// Datos de ejemplo para las citas de hoy (CitaTabla[])
import { CitaTabla } from '../../shared/interfaces/cita-tabla.model';
import { CitaService } from '../../../core/services/cita.service';
import { MascotaService } from '../../../core/services/mascota.service';
import { ClienteService } from '../../../core/services/cliente.service';
import { Mascota } from '../../shared/interfaces/mascota.model';
import { Cliente } from '../../shared/interfaces/cliente.model';
import { Raza } from '../../shared/interfaces/Raza.model';
import { forkJoin } from 'rxjs';



@Component({
  selector: 'app-citas-hoy',
  standalone: true,
  imports: [
    CommonModule,
    TablaCitasComponent,
    TriajeModalComponent,
    HistorialModalComponent,
    DetallesCitaModalComponent
  ],
  templateUrl: './citas-hoy.component.html',
  styleUrls: ['./citas-hoy.component.css'],
})
export class CitasHoyComponent implements OnInit {
  // Señales para el estado
  searchTerm = signal('');
  citaSeleccionada = signal<any>(null);
  modalTriajeAbierto = signal(false);
  modalHistorialAbierto = signal(false);
  modalDetallesAbierto = signal(false);

  // Datos de citas de hoy
  citasDeHoy = signal<CitaTabla[]>([]);

  constructor(
    private citaService: CitaService,
    private mascotaService: MascotaService,
    private clienteService: ClienteService
  ) {}

  ngOnInit(): void {
    this.citaService.obtenerCitasDeHoy().subscribe((citas: any[]) => {
      if (!citas || citas.length === 0) {
        this.citasDeHoy.set([]);
        return;
      }
      // Para cada cita, obtenemos los datos enriquecidos
      const mascotaRequests = citas.map(c => this.mascotaService.listarMascotaPorId(c.mascotaId));
      const clienteRequests = citas.map(c => this.clienteService.listarClientePorId(c.clienteId));
      // Obtenemos todas las razas una sola vez
      this.mascotaService.listarRazas().subscribe(razasResp => {
        const razas: Raza[] = razasResp.data;
        forkJoin([...mascotaRequests, ...clienteRequests]).subscribe(respuestas => {
          const mascotas = respuestas.slice(0, citas.length).map((r: any) => r.data as Mascota);
          const clientes = respuestas.slice(citas.length).map((r: any) => r.data as Cliente);
          const enriquecidas = citas.map((cita, i) => {
            const mascota = mascotas[i];
            const cliente = clientes[i];
            const raza = razas.find(r => r.razaId === mascota.razaId);
            return {
              ...cita,
              paciente: mascota?.nombre || '',
              especie: raza ? (raza.especieId === 1 ? 'Perro' : 'Gato') : '',
              raza: raza?.nombre || '',
              propietario: cliente?.nombre + (cliente?.apellido ? ' ' + cliente.apellido : ''),
            };
          });
          this.citasDeHoy.set(enriquecidas);
        });
      });
    });
  }

  // Computed properties
  citasFiltradas = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.citasDeHoy();
    return this.citasDeHoy().filter((cita: CitaTabla) =>
      cita.paciente.toLowerCase().includes(term) ||
      cita.propietario.toLowerCase().includes(term)
    );
  });

  pendientes = computed(() =>
    this.citasDeHoy().filter((cita: CitaTabla) => cita.estadoCita === 'PENDIENTE').length
  );

  enTriaje = computed(() =>
    this.citasDeHoy().filter((cita: CitaTabla) => cita.estadoCita === 'TRIAJE').length
  );

  conVeterinario = computed(() =>
    this.citasDeHoy().filter((cita: CitaTabla) => cita.estadoCita === 'CONVETERINARIO').length
  );

  completadas = computed(() =>
    this.citasDeHoy().filter((cita: CitaTabla) => cita.estadoCita === 'COMPLETADA').length
  );

  // Métodos para abrir modales
  abrirModalTriaje(cita: any): void {
    this.citaSeleccionada.set(cita);
    this.modalTriajeAbierto.set(true);
  }

  abrirModalHistorial(cita: any): void {
    this.citaSeleccionada.set(cita);
    this.modalHistorialAbierto.set(true);
  }

  abrirModalDetalles(cita: any): void {
    this.citaSeleccionada.set(cita);
    this.modalDetallesAbierto.set(true);
  }
}
