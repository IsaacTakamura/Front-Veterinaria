import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AdminSidebarComponent } from '../../components/shared/admin-sidebar/admin-sidebar.component';
import { NavbarPrivateComponent } from '../../components/shared/navbar-private/navbar-private.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AdminSidebarComponent, NavbarPrivateComponent],
  template: `
    <app-navbar-private />
    <div class="layout-container">
      <app-admin-sidebar
        [activeSection]="activeSection"
        (sectionChange)="setActiveSection($event)"
      />
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .layout-container {
      display: flex;
      min-height: 100vh;
    }
    .main-content {
      flex: 1;
      margin-left: 220px; /* ancho del admin-sidebar */
      padding: 20px;
      background: #f8fafc;
      padding-top: 64px; /* altura del navbar fijo */
    }
    app-admin-sidebar {
      position: fixed;
      top: 64px;
      left: 0;
      height: calc(100vh - 64px);
      z-index: 10;
    }
  `]
})
export class AdminLayoutComponent {
  activeSection = 'lista-usuarios';

  setActiveSection(section: string) {
    this.activeSection = section;
  }
}
