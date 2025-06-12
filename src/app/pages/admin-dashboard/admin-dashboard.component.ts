import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Importa tus componentes standalone
import { AdminSidebarComponent } from '../../components/shared/admin-sidebar/admin-sidebar.component';
import { UserManagementComponent } from '../../components/admin/user-management/user-management.component';
import { CatalogManagementComponent } from '../../components/admin/catalog-management/catalog-management.component';
import { AppointmentSupervisionComponent } from '../../components/admin/appointment-supervision/appointment-supervision.component';
import { ReportsAnalyticsComponent } from '../../components/admin/reports/reports-analytics.component';
import { InventoryManagementComponent } from '../../components/admin/inventory-management/inventory-management.component';
import { MaintenanceSecurityComponent } from '../../components/admin/maintenance-security/maintenance-security.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    AdminSidebarComponent,
    UserManagementComponent,
    CatalogManagementComponent,
    AppointmentSupervisionComponent,
    ReportsAnalyticsComponent,
    InventoryManagementComponent,
    MaintenanceSecurityComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
  activeSection = 'lista-usuarios';

  setActiveSection(section: string) {
    this.activeSection = section;
  }

  // Renderiza el componente correspondiente
  renderContent() {
    // Gestión de Usuarios
    if (['crear-usuario', 'lista-usuarios', 'roles-permisos'].includes(this.activeSection)) {
      return UserManagementComponent;
    }
    // Catálogo Maestro
    if (['especies-razas', 'vacunas', 'servicios', 'tarifas'].includes(this.activeSection)) {
      return CatalogManagementComponent;
    }
    // Supervisión de Agenda
    if (['todas-citas', 'reprogramar', 'franjas-horarias'].includes(this.activeSection)) {
      return AppointmentSupervisionComponent;
    }
    // Reportes y Analítica
    if (['atencion-diaria', 'reprogramaciones', 'facturacion', 'uso-insumos'].includes(this.activeSection)) {
      return ReportsAnalyticsComponent;
    }
    // Inventario y Proveedores
    if (['stock-medicamentos', 'proveedores', 'ordenes-compra'].includes(this.activeSection)) {
      return InventoryManagementComponent;
    }
    // Mantenimiento y Seguridad
    if (['respaldos', 'logs-sistema', 'configuracion'].includes(this.activeSection)) {
      return MaintenanceSecurityComponent;
    }
    // Fallback
    return UserManagementComponent;
  }
}
