import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { IconShieldComponent } from '../../icons/icon-shield.component';
import { IconChevronDownComponent } from '../../icons/icon-chevron-down.component';
import { IconChevronRightComponent } from '../../icons/icon-chevron-right.component';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule,
    IconShieldComponent,
    IconChevronDownComponent,
    IconChevronRightComponent,
  ],
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.css']
})
export class AdminSidebarComponent {
  @Input() activeSection!: string;
  @Output() sectionChange = new EventEmitter<string>();

  expandedMenus: string[] = ['personal', 'veterinarios', 'clinica'];

  toggleMenu(menuId: string) {
    if (this.expandedMenus.includes(menuId)) {
      this.expandedMenus = this.expandedMenus.filter(id => id !== menuId);
    } else {
      this.expandedMenus = [...this.expandedMenus, menuId];
    }
  }

  menuItems = [
    {
      id: "personal",
      title: "Gestión de Personal",
      icon: "users",
      items: [
        { id: "registrar-usuario", title: "Registrar Usuario", icon: "userplus" },
        { id: "personal-activo", title: "Personal Activo", icon: "users" },
      ],
    },
    {
      id: "veterinarios",
      title: "Gestión de Veterinarios",
      icon: "shield",
      items: [
        { id: "personal-veterinario", title: "Personal Veterinario", icon: "shield" },
      ],
    },
    {
      id: "clinica",
      title: "Configuración de Clínica",
      icon: "database",
      items: [
        { id: "especies-razas", title: "Especies y Razas", icon: "database" },
        { id: "servicios-veterinarios", title: "Servicios Veterinarios", icon: "settings" },
      ],
    },
  ];

  // SVG Icon generator (lucide style, minimal set)
  icon(name: string, size = 20, classes = ''): string {
    const icons: Record<string, string> = {
      users: `<svg width="${size}" height="${size}" class="${classes}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-3-3.87"/><path d="M7 21v-2a4 4 0 0 1 3-3.87"/><circle cx="9" cy="7" r="4"/><path d="M17 11a4 4 0 0 1 4-4h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-1a4 4 0 0 1-4-4z"/></svg>`,
      userplus: `<svg width="${size}" height="${size}" class="${classes}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-3-3.87"/><path d="M7 21v-2a4 4 0 0 1 3-3.87"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>`,
      shield: `<svg width="${size}" height="${size}" class="${classes}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
      database: `<svg width="${size}" height="${size}" class="${classes}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/></svg>`,
      settings: `<svg width="${size}" height="${size}" class="${classes}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 8.6 15a1.65 1.65 0 0 0-1.82-.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0 .33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 15 8.6c.22 0 .43.03.64.08a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82z"/></svg>`,
      barchart: `<svg width="${size}" height="${size}" class="${classes}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>`,
      calendar: `<svg width="${size}" height="${size}" class="${classes}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
      clock: `<svg width="${size}" height="${size}" class="${classes}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
      filetext: `<svg width="${size}" height="${size}" class="${classes}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M4 4v16c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V8l-6-6H6a2 2 0 0 0-2 2z"/><polyline points="14 3 14 8 19 8"/></svg>`,
      package: `<svg width="${size}" height="${size}" class="${classes}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M16 3v4"/><path d="M8 3v4"/></svg>`,
      truck: `<svg width="${size}" height="${size}" class="${classes}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
      chevrondown: `<svg width="${size}" height="${size}" class="${classes}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>`,
      chevronright: `<svg width="${size}" height="${size}" class="${classes}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>`,
    };
    return icons[name] || '';
  }
}
