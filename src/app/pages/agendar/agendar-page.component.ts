import { Component, ChangeDetectorRef } from '@angular/core';
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
  apellidoCliente = '';
  direccion = '';
  telefono = '';
  email = '';
  ciudad = '';

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

  // Mascota nueva o registrada
  mascotasRegistradas: string[] = ['Luna', 'Max', 'Firulais', 'Michi'];
  mascotaSeleccionada: string = '';
  usarMascotaRegistrada: boolean = false;

  constructor(private cdr: ChangeDetectorRef) {}

  toggleSwitch() {
    this.usarMascotaRegistrada = !this.usarMascotaRegistrada;

    // Reiniciar campos si se cambia la opción
    if (this.usarMascotaRegistrada) {
      this.nombreMascota = '';
      this.especie = '';
      this.raza = '';
      this.edadMascota = null;
    } else {
      this.mascotaSeleccionada = '';
    }

    // Forzar la detección de cambios por seguridad
    this.cdr.detectChanges();
  }

  agendarCita() {
    console.log('📋 Datos de la cita agendada:');
    console.log({
      nombreCliente: this.nombreCliente,
      apellidoCliente: this.apellidoCliente,
      direccion: this.direccion,
      telefono: this.telefono,
      correo: this.email,
      ciudad: this.ciudad,
      mascota: this.usarMascotaRegistrada ? this.mascotaSeleccionada : this.nombreMascota,
      especie: this.usarMascotaRegistrada ? '🐾 registrada' : this.especie,
      raza: this.usarMascotaRegistrada ? '🐾 registrada' : this.raza,
      edadMascota: this.usarMascotaRegistrada ? '🐾 registrada' : this.edadMascota,
      fecha: this.fecha,
      tipoServicio: this.tipoServicio,
      horario: this.horario,
      veterinario: this.veterinario,
      motivoConsulta: this.motivoConsulta,
    });
    alert('✅ Cita agendada correctamente');
  }
}
