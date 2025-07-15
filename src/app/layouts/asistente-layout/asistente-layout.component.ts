import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AsistenteSidebarComponent } from '../../components/shared/asistente-sidebar/asistente-sidebar.component';

@Component({
  selector: 'app-asistente-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AsistenteSidebarComponent],
  template: `
    <div class="flex h-screen bg-gray-50">
      <app-asistente-sidebar />
      <main class="flex-1 overflow-y-auto p-6">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AsistenteLayoutComponent {}
