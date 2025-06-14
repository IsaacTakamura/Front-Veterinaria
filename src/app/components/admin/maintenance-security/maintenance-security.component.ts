import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-maintenance-security',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './maintenance-security.component.html',
  styleUrls: ['./maintenance-security.component.css']
})
export class MaintenanceSecurityComponent {
  @Input() activeTab!: string;

  logs = [
    { text: '[2024-01-15 10:30:15] INFO: Usuario admin inició sesión', color: 'text-green-600' },
    { text: '[2024-01-15 10:32:22] INFO: Nuevo usuario creado: dr.martinez', color: 'text-blue-600' },
    { text: '[2024-01-15 10:35:10] WARN: Intento de acceso fallido para usuario: test', color: 'text-yellow-600' },
    { text: '[2024-01-15 10:40:05] INFO: Respaldo automático completado', color: 'text-green-600' },
    { text: '[2024-01-15 10:45:30] ERROR: Fallo en conexión a base de datos (recuperado)', color: 'text-red-600' }
  ];
}
