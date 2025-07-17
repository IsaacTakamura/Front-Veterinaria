import { Component, OnInit } from '@angular/core';
import { signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Paciente } from 'src/app/components/shared/interfaces/paciente.model';
import { MascotaService } from 'src/app/core/services/mascota.service';

@Component({
  selector: 'app-listapacientes-page',
  standalone: true,
  imports: [CommonModule, FormsModule], // Importa FormsModule aquí
  templateUrl: './listapacientes-page.component.html',
  styleUrls: ['./listapacientes-page.component.css']
})
export class ListapacientesPageComponent implements OnInit {
  // Usando signal para pacientes y tratamientos
  pacientes = signal<Paciente[]>([]);
  tratamientos = signal<any[]>([]); // Aquí puedes agregar el tipo adecuado para tratamientos
  busqueda: string = ''; // Campo de búsqueda
  selected: 'pacientes' | 'consulta' | 'seguimiento' = 'pacientes'; // Para controlar la vista seleccionada
  pacienteSeleccionado: Paciente | null = null; // Paciente actualmente seleccionado
  subvista: 'info' | 'alergias' | 'nueva' = 'info'; // Subvista dentro de la consulta

  constructor(private mascotaService: MascotaService) {}

  ngOnInit(): void {
    // Obtener la lista de pacientes cuando el componente se inicia
    this.obtenerPacientes();
  }

  obtenerPacientes() {
    this.mascotaService.listarPacientes().subscribe({
      next: (data) => {
        this.pacientes.set(data); // Guardamos los pacientes
        console.log('✅ Pacientes obtenidos:', data);
      },
      error: (err) => {
        console.error('❌ Error al obtener pacientes:', err);
      }
    });
  }

  seleccionarPaciente(p: Paciente | null) {
    this.pacienteSeleccionado = p; // Se puede asignar null o un paciente
    this.subvista = 'info'; // Mostrar la vista de información del paciente seleccionado
  }

  cambiarVista(v: 'pacientes' | 'consulta' | 'seguimiento') {
    this.selected = v; // Cambiar vista principal
    this.pacienteSeleccionado = null; // Limpiar la selección de paciente
    this.subvista = 'info'; // Restablecer la subvista a 'info'
  }

  cambiarSubvista(v: 'info' | 'alergias' | 'nueva') {
    this.subvista = v; // Cambiar la subvista dentro de la consulta
  }

  // Filtrado de pacientes basado en la búsqueda
  get pacientesFiltrados(): Paciente[] {
    const q = this.busqueda.trim().toLowerCase();
    return this.pacientes().filter(p =>
      p.nombre.toLowerCase().includes(q) ||
      p.raza.toLowerCase().includes(q) ||
      p.propietario.toLowerCase().includes(q)
    );
  }

  // Obtener emoji de estado
  getEmojiForStatus(status: string): string {
    switch (status) {
      case 'Activo': return '🟢';
      case 'Próximo a vencer': return '⚠️';
      case 'Completado': return '✅';
      case 'Vencido': return '⛔';
      default: return '❓';
    }
  }

  // Obtener clase de estado
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
