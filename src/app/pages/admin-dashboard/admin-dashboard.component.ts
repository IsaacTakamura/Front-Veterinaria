import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

// Importa los componentes que necesitas
import { AdminSidebarComponent } from '../../components/shared/admin-sidebar/admin-sidebar.component';
import { UserManagementComponent } from '../../components/admin/user-management/user-management.component';
import { CatalogManagementComponent } from '../../components/admin/catalog-management/catalog-management.component';
import { VeterinaryTeamComponent } from '../../components/admin/veterinary-team/veterinary-team.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    AdminSidebarComponent,
    UserManagementComponent,
    CatalogManagementComponent,
    VeterinaryTeamComponent,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
  // Estado local para la sección activa (por defecto mostrar registrar usuario)
  activeSection = signal('registrar-usuario');

  // Método para cambiar de sección
  onSectionChange(section: string) {
    this.activeSection.set(section);
  }

  // Método para mapear las secciones del sidebar a los tabs de los componentes
  getActiveTabForComponent(section: string): string {
    const mapping: { [key: string]: string } = {
      'registrar-usuario': 'crear-usuario',
      'personal-activo': 'lista-usuarios',
      'personal-veterinario': 'tabla-veterinarios',
      'especies-razas': 'especies-razas',
      'servicios-veterinarios': 'servicios',
    };
    return mapping[section] || section;
  }
}
