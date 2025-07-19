import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Importa los componentes que necesitas
import { UserManagementComponent } from '../../components/admin/user-management/user-management.component';
import { CatalogManagementComponent } from '../../components/admin/catalog-management/catalog-management.component';
import { VeterinaryTeamComponent } from '../../components/admin/veterinary-team/veterinary-team.component';
import { SidebarStateService } from '../../layouts/admin-layout/sidebar-state.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    UserManagementComponent,
    CatalogManagementComponent,
    VeterinaryTeamComponent,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  constructor(public sidebarState: SidebarStateService) {}

  ngOnInit() {
    // Establecer sección por defecto si no hay ninguna activa
    if (!this.sidebarState.activeSection()) {
      this.sidebarState.activeSection.set('registrar-usuario');
    }
  }

  // Usar el estado del sidebar del layout
  get activeSection() {
    return this.sidebarState.activeSection();
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
