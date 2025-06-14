import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconPencilComponent } from "../../icons/icon-pencil.component";

@Component({
  selector: 'app-catalog-management',
  standalone: true,
  imports: [CommonModule, IconPencilComponent],
  templateUrl: './catalog-management.component.html',
  styleUrls: ['./catalog-management.component.css']
})
export class CatalogManagementComponent {
  @Input() activeTab!: string;

  especies = [
    { id: 1, nombre: "Perro", razas: ["Labrador", "Golden Retriever", "Bulldog", "Poodle"] },
    { id: 2, nombre: "Gato", razas: ["Siamés", "Persa", "Angora", "Común Europeo"] },
  ];

  vacunas = [
    { id: 1, nombre: "Antirrábica", especie: "Perro", frecuencia: "12 meses" },
    { id: 2, nombre: "Parvovirus", especie: "Perro", frecuencia: "12 meses" },
    { id: 3, nombre: "Triple Felina", especie: "Gato", frecuencia: "12 meses" },
  ];

  servicios = [
    { id: 1, nombre: "Consulta General", precio: 50, duracion: "30 min" },
    { id: 2, nombre: "Vacunación", precio: 35, duracion: "15 min" },
    { id: 3, nombre: "Cirugía Menor", precio: 200, duracion: "60 min" },
    { id: 4, nombre: "Baño y Corte", precio: 40, duracion: "45 min" },
  ];
}
