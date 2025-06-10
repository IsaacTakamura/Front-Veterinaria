import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CitasHoyComponent } from '../../components/enfermeria/citas-hoy/citas-hoy.component';
import { CitasProgramadasComponent } from '../../components/enfermeria/citas-programadas/citas-programadas.component';

@Component({
  selector: 'app-enfermera-page',
  standalone: true,
  imports: [
    CommonModule,
    CitasHoyComponent,
    CitasProgramadasComponent,
  ],
  templateUrl: './enfermera-page.component.html',
  styleUrls: ['./enfermera-page.component.css'],
})
export class EnfermeraPageComponent {
  activeTab = signal<'hoy' | 'programadas'>('hoy');

}


