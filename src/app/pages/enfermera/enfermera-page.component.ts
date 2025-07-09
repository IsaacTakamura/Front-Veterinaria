import { Component, signal, computed, effect } from '@angular/core';
import { CitaService } from '../../core/services/cita.service';
import { Cita } from '../../components/shared/interfaces/cita.model';
import { Mascota } from '../../components/shared/interfaces/mascota.model';
import { Cliente } from '../../components/shared/interfaces/cliente.model';
import { TriajeService } from '../../core/services/triaje.service';
import { HistorialClinicoService } from '../../core/services/historial-clinico.service';
import { CitasHoyComponent } from '../../components/enfermeria/citas-hoy/citas-hoy.component';
import { CitasProgramadasComponent } from '../../components/enfermeria/citas-programadas/citas-programadas.component';

@Component({
  selector: 'app-enfermera',
  templateUrl: './enfermera-page.component.html',
  styleUrls: ['./enfermera-page.component.css'],
  imports: [CitasHoyComponent, CitasProgramadasComponent]
})
export class EnfermeraPageComponent {
  citasDeHoy: Cita[] = [];
  citasProgramadas = signal<Cita[]>([]);
  citaSeleccionada = signal<Cita | null>(null);
  historialClinico = signal<any[]>([]);

  activeTab = signal<'hoy' | 'programadas'>('hoy');

  constructor(
    private citaService: CitaService,
    private triajeService: TriajeService,
    private historialService: HistorialClinicoService
  ) {
    this.cargarCitas();
  }

  cargarCitas() {
    this.citaService.obtenerCitasDeHoy().subscribe((data: Cita[]) => this.citasDeHoy = data);
    this.citaService.listarCitasProgramadas().subscribe((data: Cita[]) => this.citasProgramadas.set(data));
  }

  seleccionarCita(cita: Cita) {
    // Verificamos que citaId no sea undefined antes de llamar al servicio
    if (cita.citaId !== undefined) {
      this.citaService.obtenerDetalleCita(cita.citaId).subscribe(data => {
        this.citaSeleccionada.set(data);
        // Usamos data.mascotaId porque el modelo Cita no tiene un objeto mascota, solo el id
        this.historialService
          .listarHistorialPorMascota(data.mascotaId)
          .subscribe(historial => this.historialClinico.set(historial));
      });
    }
  }

  registrarTriaje(triaje: any) {
    this.triajeService.registrarTriaje(triaje).subscribe(() => {
      // refrescar historial clínico si es necesario
    });
  }
}



