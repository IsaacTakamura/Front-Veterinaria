import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AdminSidebarComponent } from '../../components/shared/admin-sidebar/admin-sidebar.component';
import { SidebarStateService } from './sidebar-state.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AdminSidebarComponent],
  template: `
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
      margin-top: 70px; /* Espacio suficiente para no ser tapado por el navbar */
      padding: 16px;
      background: #f8fafc;
    }
    app-admin-sidebar {
      position: fixed;
      top: 70px; /* Comenzar después del navbar de 70px + espacio extra */
      left: 0;
      height: calc(100vh - 110px); /* Altura total menos el espacio superior */
      z-index: 20; /* Menor que el navbar (50) pero mayor que el contenido */
    }
  `],
  providers: [SidebarStateService]
})
export class AdminLayoutComponent {
  constructor(public sidebarState: SidebarStateService) {}

  get activeSection() {
    return this.sidebarState.activeSection();
  }
  setActiveSection(section: string) {
    this.sidebarState.activeSection.set(section);
  }
}
