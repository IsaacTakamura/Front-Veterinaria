import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-agendar',
  standalone: true,
  imports: [CommonModule, FormsModule], // 👈 IMPORTANTE AQUÍ
  templateUrl: './agendar-page.component.html',
  styleUrls: ['./agendar-page.component.css']
})
export class AgendarPageComponent {
  title = "Sistema de Atención Veterinaria";

  // Campos del formulario
  nombreMascota: string = '';
  fechaCita: string = new Date().toISOString().substring(0, 10); // Fecha actual
  motivo: string = '';
  doctor: string = '';

  agendarCita() {
    console.log("Cita agendada:");
    console.log("Mascota:", this.nombreMascota);
    console.log("Fecha:", this.fechaCita);
    console.log("Motivo:", this.motivo);
    console.log("Doctor:", this.doctor);
  }
}
