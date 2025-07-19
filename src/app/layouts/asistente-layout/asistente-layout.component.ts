import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AsistenteSidebarComponent } from '../../components/shared/asistente-sidebar/asistente-sidebar.component';
import { Router, NavigationEnd } from '@angular/router';
import { SidebarStateService } from './sidebar-state.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-asistente-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AsistenteSidebarComponent],
  template: `
    <div class="layout-container">
      <app-asistente-sidebar
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
      margin-left: 80px;
      padding: 20px;
      background: #f8fafc;
      padding-top: 64px; /* Altura del navbar fijo */
    }
    app-asistente-sidebar {
      position: fixed;
      top: 64px;
      left: 0;
      height: calc(100vh - 64px);
      z-index: 10;
    }
  `],
})
export class AsistenteLayoutComponent {
  constructor(public sidebarState: SidebarStateService, private router: Router) {
    // Sincronizar el estado activo con la ruta al iniciar
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const url = event.urlAfterRedirects;
      if (url.startsWith('/enfermera')) {
        this.sidebarState.activeSection.set('hoy');
      } else if (url.startsWith('/agendar')) {
        this.sidebarState.activeSection.set('agendar');
      }
    });
  }

  get activeSection() {
    return this.sidebarState.activeSection();
  }
  setActiveSection(section: string) {
    this.sidebarState.activeSection.set(section);
  }
}
