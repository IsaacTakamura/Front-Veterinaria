import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './listapacientes-page.component.html',
  styleUrls: ['./listapacientes-page.component.css']
})
export class ListapacientesPageComponent {
  selected = 'pacientes';

  cambiarVista(vista: string) {
    this.selected = vista;
  }
}

// ¡ESTE ES TU PUNTO DE ENTRADA, AQUÍ SE ARRANCA!
bootstrapApplication(ListapacientesPageComponent)
  .catch(err => console.error(err));
