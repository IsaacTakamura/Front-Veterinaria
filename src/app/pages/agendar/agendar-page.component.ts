import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-agendar-page',
  standalone: true,
  templateUrl: './agendar-page.component.html',
  styleUrls: ['./agendar-page.component.css'],
  imports: [CommonModule, FormsModule]
})
export class AgendarPageComponent {
  // Datos del propietario
  nombreCliente = '';
  telefono = '';
  correo = '';

  // Datos de la mascota
  nombreMascota = '';
  especie = '';
  raza = '';
  edadMascota: number | null = null;

  // Detalles de la cita
  fecha = '';
  tipoServicio = '';
  horario = '';
  veterinario = '';
  motivoConsulta = '';

  agendarCita() {
    console.log('📋 Datos de la cita agendada:');
    console.log({
      nombreCliente: this.nombreCliente,
      telefono: this.telefono,
      correo: this.correo,
      nombreMascota: this.nombreMascota,
      especie: this.especie,
      raza: this.raza,
      edadMascota: this.edadMascota,
      fecha: this.fecha,
      tipoServicio: this.tipoServicio,
      horario: this.horario,
      veterinario: this.veterinario,
      motivoConsulta: this.motivoConsulta,
    });
    alert('✅ Cita agendada correctamente');
  }
}
