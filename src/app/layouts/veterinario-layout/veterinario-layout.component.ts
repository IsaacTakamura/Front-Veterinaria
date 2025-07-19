import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { VeteSidebarComponent } from '../../components/shared/vete-sidebar/vete-sidebar.component';
import { Router, NavigationEnd } from '@angular/router';
import { SidebarStateService } from './sidebar-state.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-veterinario-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, VeteSidebarComponent],
  template: `
    <div class="layout-container">
      <app-vete-sidebar
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
      padding-top: 64px;
    }
    app-vete-sidebar {
      position: fixed;
      top: 64px;
      left: 0;
      height: calc(100vh - 64px);
      z-index: 10;
    }
  `],
})
export class VeterinarioLayoutComponent {
  constructor(public sidebarState: SidebarStateService, private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const url = event.urlAfterRedirects;
      if (url.startsWith('/veterinario')) {
        this.sidebarState.activeSection.set('dashboard');
      } else if (url.startsWith('/listapacientes')) {
        this.sidebarState.activeSection.set('pacientes');
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
