import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tratamiento } from 'src/app/components/shared/interfaces/tratamiento.model';
import { Paciente } from 'src/app/components/shared/interfaces/paciente.model';
import { MascotaService } from 'src/app/core/services/mascota.service';

@Component({
  selector: 'app-listapacientes-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './listapacientes-page.component.html',
  styleUrls: ['./listapacientes-page.component.css']
})
export class ListapacientesPageComponent implements OnInit {
  pacientes = signal<Paciente[]>([]);
  tratamientos = signal<Tratamiento[]>([]);
  busqueda: string = '';
  selected: 'pacientes' | 'consulta' | 'seguimiento' = 'pacientes';
  pacienteSeleccionado: Paciente | null = null;
  subvista: 'info' | 'alergias' | 'nueva' = 'info';

  constructor(private mascotaService: MascotaService) {}

  ngOnInit(): void {
    this.mascotaService.listarPacientes().subscribe({
      next: (data) => {
        console.log('✅ Pacientes obtenidos:', data);
        this.pacientes.set(data);
      },
      error: (err) => {
        console.error('❌ Error al obtener pacientes', err);
      }
    });
  }

  cambiarVista(v: 'pacientes' | 'consulta' | 'seguimiento') {
    this.selected = v;
    this.pacienteSeleccionado = null;
    this.subvista = 'info';
  }

  cambiarSubvista(v: 'info' | 'alergias' | 'nueva') {
    this.subvista = v;
  }

  seleccionarPaciente(p: Paciente) {
    this.pacienteSeleccionado = p;
    this.subvista = 'info';
  }

  get pacientesFiltrados(): Paciente[] {
    const q = this.busqueda.trim().toLowerCase();
    return this.pacientes().filter(p =>
      p.nombre.toLowerCase().includes(q) ||
      p.raza.toLowerCase().includes(q) ||
      p.propietario.toLowerCase().includes(q)
    );
  }

  getEmojiForStatus(status: string): string {
    switch (status) {
      case 'Activo': return '🟢';
      case 'Próximo a vencer': return '⚠️';
      case 'Completado': return '✅';
      case 'Vencido': return '⛔';
      default: return '❓';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Activo': return 'activo';
      case 'Próximo a vencer': return 'proximo';
      case 'Completado': return 'completado';
      case 'Vencido': return 'vencido';
      default: return 'desconocido';
    }
  }
}
