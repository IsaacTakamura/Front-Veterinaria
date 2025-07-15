import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-asistente-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="h-full w-56 bg-white border-r shadow-sm flex flex-col py-6 px-4">
      <div class="mb-8 flex items-center gap-2">
        <span class="text-xl font-bold text-blue-600">Asistente</span>
      </div>
      <nav class="flex flex-col gap-2">
        <a routerLink="/enfermera" routerLinkActive="bg-blue-100 text-blue-700" class="sidebar-link">
          <span class="material-icons align-middle mr-2">medical_services</span>
          Enfermera
        </a>
        <a routerLink="/agendar" routerLinkActive="bg-blue-100 text-blue-700" class="sidebar-link">
          <span class="material-icons align-middle mr-2">event_available</span>
          Agendar
        </a>
      </nav>
    </aside>
  `,
  styles: [`
    .sidebar-link {
      display: flex;
      align-items: center;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      font-weight: 500;
      color: #374151;
      transition: background 0.2s, color 0.2s;
      text-decoration: none;
    }
    .sidebar-link:hover {
      background: #f1f5f9;
      color: #2563eb;
    }
    .router-link-active {
      background: #e0e7ff;
      color: #2563eb;
    }
  `]
})
export class AsistenteSidebarComponent {}
