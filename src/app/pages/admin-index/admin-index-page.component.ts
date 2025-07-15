import { AdminDashboardComponent } from '../admin-dashboard/admin-dashboard.component';
import { Component, Input } from '@angular/core';
import { CommonModule} from '@angular/common';

@Component({
  selector: 'app-admin-index-page',
  standalone: true,
  imports: [CommonModule, AdminDashboardComponent],
  template: `<app-admin-dashboard [activeSection]="activeSection"></app-admin-dashboard>`,
})
export class AdminIndexPageComponent {
  @Input() activeSection: string = 'lista-usuarios';
  // Este componente actúa como un contenedor para el AdminDashboardComponent
  // Puedes agregar lógica adicional aquí si es necesario en el futuro
}
