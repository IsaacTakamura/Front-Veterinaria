import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { Cliente } from 'src/app/components/shared/interfaces/cliente.model';

@Component({
  selector: 'app-listapacientes-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [ClienteService],
  templateUrl: './listapacientes-page.component.html',
  styleUrls: ['./listapacientes-page.component.css']
})
export class ListapacientesPageComponent implements OnInit {
  selected = 'pacientes';
  busqueda = '';
  pacienteSeleccionado: Cliente | null = null;
  subvista: string = 'info';

  pacientes = signal<Cliente[]>([]);
  loading = signal<boolean>(false);

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.loading.set(true);
    this.clienteService.obtenerClientes().subscribe({
      next: (data: Cliente[]) => {
        this.pacientes.set(data);
        this.loading.set(false);
      },
      error: (err: unknown) => {
        if (err instanceof Error) {
          console.error('Error al cargar pacientes:', err.message);
        } else {
          console.error('Error desconocido al cargar pacientes', err);
        }
        this.loading.set(false);
      }
    });
  }

  cambiarVista(vista: string): void {
    this.selected = vista;
    if (vista !== 'consulta') {
      this.pacienteSeleccionado = null;
      this.subvista = 'info';
    }
  }

  seleccionarPaciente(paciente: Cliente): void {
    this.pacienteSeleccionado = paciente;
    this.subvista = 'info';
  }

  cambiarSubvista(vista: string): void {
    this.subvista = vista;
  }

  getIconClass(status: string): string {
    switch (status) {
      case 'Activo': return 'fa-pills';
      case 'Próximo a vencer': return 'fa-triangle-exclamation';
      case 'Completado': return 'fa-check-circle';
      default: return 'fa-clock';
    }
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
      default: return 'inactivo';
    }
  }

  seleccionarPacientePorNombre(nombre: string): void {
    const paciente = this.pacientes().find(p => p.nombre.toLowerCase() === nombre.toLowerCase());
    if (paciente) {
      this.seleccionarPaciente(paciente);
    }
  }

  get pacientesFiltrados(): Cliente[] {
    const query = this.busqueda.trim().toLowerCase();
    return this.pacientes().filter(p =>
      p.nombre.toLowerCase().includes(query) ||
      p.email?.toLowerCase().includes(query)
    );
  }
}
