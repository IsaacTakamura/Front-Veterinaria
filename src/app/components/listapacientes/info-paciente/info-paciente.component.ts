import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cliente } from '../../shared/interfaces/cliente.model';

export interface PacienteInfo {
  nombreMascota: string;
  edad: number;
  raza: string;
  especie: string;
  propietario: string;
}

@Component({
  selector: 'app-info-paciente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info-paciente.component.html',
  styleUrls: ['./info-paciente.component.css']
})
export class InfoPacienteComponent {
  @Input() paciente: PacienteInfo | null = null;
  @Input() propietario: Cliente | null = null;
}
