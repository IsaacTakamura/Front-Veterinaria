import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CitaService } from 'src/app/core/services/cita.service';
import { MascotaService } from 'src/app/core/services/mascota.service';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { forkJoin } from 'rxjs';
import { Cita } from '../../shared/interfaces/cita.model';
import { Mascota } from '../../shared/interfaces/mascota.model';
import { Cliente } from '../../shared/interfaces/cliente.model';

interface Appointment {
  id: number;
  time: string;
  pet: string;
  owner: string;
  type: string;
  status: 'completed' | 'in-progress' | 'pending';
}

interface Patient {
  id: number;
  name: string;
  species: string;
  breed: string;
  lastVisit: string;
}

@Component({
  selector: 'app-veterinarian-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
  ],
  templateUrl: './veterinarian-dashboard.component.html',
  styleUrls: ['./veterinarian-dashboard.component.css']
})
export class VeterinarianDashboardComponent implements OnInit {
  todayDate = new Date();

  citaService = inject(CitaService);
  mascotaService = inject(MascotaService);
  clienteService = inject(ClienteService);

  stats = {
    todayAppointments: 0,
    pendingConsultations: 0,
    completedToday: 0,
    emergencies: 0,
  };

  todayAppointments: Appointment[] = [];

  // Cambiar de datos estáticos a datos reales
  recentPatients: Patient[] = [];

  searchTerm = signal('');

  filteredPatients = computed(() => {
    const filtered = this.recentPatients.filter(p =>
      p.name.toLowerCase().includes(this.searchTerm().toLowerCase())
    );
    console.log('FilteredPatients computed:', {
      searchTerm: this.searchTerm(),
      totalPatients: this.recentPatients.length,
      filteredCount: filtered.length,
      filtered: filtered
    });
    return filtered;
  });

  ngOnInit(): void {
    const veterinarioId = 1; // Reemplaza esto por la obtención dinámica del ID si lo tienes
    this.citaService.listarCitasHoyVeterinario().subscribe((citas: Cita[]) => {
      console.log('Citas recibidas en el dashboard:', citas);
      this.stats.todayAppointments = citas.length;
      this.stats.pendingConsultations = citas.filter(c => c.estadoCita === 'PENDIENTE').length;
      this.stats.completedToday = citas.filter(c => c.estadoCita === 'COMPLETADA').length;
      this.stats.emergencies = citas.filter(c => c.motivo?.toLowerCase() === 'emergencia').length;

      // Obtener todas las mascotas del veterinario para obtener los nombres
      this.mascotaService.listarMascotas().subscribe((mascotasResponse: any) => {
        const mascotas = mascotasResponse.data;
        console.log('Mascotas del veterinario:', mascotas);

        // Obtener los pacientes del veterinario (que incluye nombres de mascotas y propietarios)
        this.mascotaService.listarPacientesPorVeterinario(veterinarioId).subscribe((pacientesResponse: any) => {
          const pacientes = pacientesResponse.data;
          console.log('Pacientes del veterinario:', pacientes);

          // Procesar las citas combinando datos de mascotas y pacientes
          this.todayAppointments = citas.map(cita => {
            // Buscar la mascota por ID para obtener el nombre
            const mascota = mascotas.find((m: any) => m.mascotaId === cita.mascotaId);
            const nombreMascota = mascota?.nombre || 'Mascota';

            console.log(`Cita ${cita.citaId}: Buscando mascota con ID ${cita.mascotaId}, nombre encontrado: "${nombreMascota}"`);

            // Buscar el paciente por nombre de mascota para obtener el propietario
            const paciente = pacientes.find((p: any) => {
              const match = p.nombreMascota && p.nombreMascota.toLowerCase() === nombreMascota.toLowerCase();
              console.log(`Comparando: "${p.nombreMascota}" (paciente) vs "${nombreMascota}" (mascota) = ${match}`);
              return match;
            });

            console.log(`Cita ${cita.citaId}: Paciente encontrado:`, paciente);

            // Determinar el nombre del propietario
            let nombrePropietario = 'Cliente';
            if (paciente?.nombrePropietario) {
              nombrePropietario = paciente.nombrePropietario;
            } else {
              // Si no encontramos el paciente, mostrar información útil
              console.log(`⚠️ Mascota "${nombreMascota}" no encontrada en la lista de pacientes del veterinario ${veterinarioId}`);
              nombrePropietario = `Cliente (ID: ${cita.clienteId})`;
            }

            return {
              id: cita.citaId ?? 0,
              time: cita.fechaRegistro.substring(11, 16),
              pet: nombreMascota,
              owner: nombrePropietario,
              type: cita.motivo,
              status: cita.estadoCita.toLowerCase() as any
            };
          });

          console.log('Citas procesadas con datos completos:', this.todayAppointments);

          // Procesar los pacientes recientes usando los datos reales
          console.log('Procesando pacientes recientes...');
          console.log('Datos de pacientes recibidos:', pacientes);
          console.log('Tipo de datos:', typeof pacientes);
          console.log('Es array:', Array.isArray(pacientes));
          console.log('Longitud:', pacientes?.length);

          if (pacientes && Array.isArray(pacientes) && pacientes.length > 0) {
            this.recentPatients = pacientes.map((paciente: any, index: number) => {
              console.log(`Procesando paciente ${index}:`, paciente);
              return {
                id: index + 1, // ID temporal ya que el endpoint no devuelve mascotaId
                name: paciente.nombreMascota || 'Mascota',
                species: paciente.especie || 'Desconocida',
                breed: paciente.raza || 'Desconocida',
                lastVisit: paciente.ultimaVisita ? this.formatearFecha(paciente.ultimaVisita) : 'Sin visitas previas'
              };
            });
            console.log('recentPatients asignado:', this.recentPatients);
          } else {
            console.warn('No se encontraron pacientes o los datos están vacíos');
            // Fallback temporal con datos de ejemplo
            this.recentPatients = [
              { id: 1, name: 'Max', species: 'Perro', breed: 'Golden Retriever', lastVisit: '15 jul 2024' },
              { id: 2, name: 'Luna', species: 'Gato', breed: 'Siamés', lastVisit: '14 jul 2024' },
              { id: 3, name: 'Rocky', species: 'Perro', breed: 'Bulldog', lastVisit: '13 jul 2024' }
            ];
            console.log('Usando datos de ejemplo como fallback');
          }

          console.log('Pacientes recientes procesados:', this.recentPatients);
          console.log('Número de pacientes en la lista:', this.recentPatients.length);
        });
      });
    });
  }

  // Método para formatear fechas
  private formatearFecha(fecha: string): string {
    try {
      const fechaObj = new Date(fecha);
      return fechaObj.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return fecha; // Devolver la fecha original si hay error
    }
  }

  // Método para filtrar pacientes (reemplaza el computed signal)
  getFilteredPatients(): Patient[] {
    const searchTerm = this.searchTerm().toLowerCase();
    if (!searchTerm) {
      return this.recentPatients;
    }
    return this.recentPatients.filter(p =>
      p.name.toLowerCase().includes(searchTerm) ||
      p.species.toLowerCase().includes(searchTerm) ||
      p.breed.toLowerCase().includes(searchTerm)
    );
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'completed': return 'Completada';
      case 'in-progress': return 'En Proceso';
      case 'pending': return 'Pendiente';
      default: return status;
    }
  }
  // Property to control modal visibility
  showBuscadorMascota = true;

  openBuscadorMascota() {
    this.showBuscadorMascota = true;
  }

  closeBuscadorMascota() {
    this.showBuscadorMascota = false;
  }
}
