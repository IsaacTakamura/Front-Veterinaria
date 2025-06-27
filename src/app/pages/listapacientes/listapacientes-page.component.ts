import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `<div>
    <!-- TODO: Add your template HTML here -->
    <h1>Lista de Pacientes</h1>
    <button (click)="changeSection('pacientes')">Pacientes</button>
    <button (click)="changeSection('otros')">Otros</button>
    <div *ngIf="selectedSection === 'pacientes'">
      <!-- Pacientes section content -->
      <p>Sección de pacientes seleccionada.</p>
    </div>
    <div *ngIf="selectedSection === 'otros'">
      <!-- Otros section content -->
      <p>Otra sección seleccionada.</p>
    </div>
  </div>`,
  styleUrls: ['./listapacientes-page.component.css']
})
export class ListaPacientesPageComponent {
  selectedSection = 'pacientes';

  changeSection(section: string) {
    this.selectedSection = section;
  }
}
