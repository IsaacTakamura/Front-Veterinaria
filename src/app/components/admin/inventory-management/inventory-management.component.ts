import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inventory-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inventory-management.component.html',
  styleUrls: ['./inventory-management.component.css']
})
export class InventoryManagementComponent {
  @Input() activeTab!: string;

  medicamentos = [
    { id: 1, nombre: "Amoxicilina", stock: 25, minimo: 10, proveedor: "FarmaVet", estado: "normal" },
    { id: 2, nombre: "Antirrábica", stock: 5, minimo: 15, proveedor: "VacuPet", estado: "bajo" },
    { id: 3, nombre: "Desparasitante", stock: 0, minimo: 20, proveedor: "MediPet", estado: "agotado" },
  ];

  proveedores = [
    { id: 1, nombre: "FarmaVet SAC", contacto: "ventas@farmavet.com", telefono: "01-234-5678" },
    { id: 2, nombre: "VacuPet Perú", contacto: "pedidos@vacupet.pe", telefono: "01-345-6789" },
    { id: 3, nombre: "MediPet Supply", contacto: "info@medipet.com", telefono: "01-456-7890" },
  ];

  getEstadoBadgeClass(estado: string): string {
    if (estado === 'normal') return 'bg-green-100 text-green-800';
    if (estado === 'bajo') return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  }

  getEstadoLabel(estado: string): string {
    if (estado === 'normal') return 'Normal';
    if (estado === 'bajo') return 'Stock Bajo';
    return 'Agotado';
  }
}
