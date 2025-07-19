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
