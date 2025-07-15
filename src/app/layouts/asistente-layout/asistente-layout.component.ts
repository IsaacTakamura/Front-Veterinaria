import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AsistenteSidebarComponent } from '../../components/shared/asistente-sidebar/asistente-sidebar.component';

@Component({
  selector: 'app-asistente-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AsistenteSidebarComponent],
  template: `
    <div class="layout-container">
      <app-asistente-sidebar />
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
  `]
})
export class AsistenteLayoutComponent {}
