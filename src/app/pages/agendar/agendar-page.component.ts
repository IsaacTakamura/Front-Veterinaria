import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgendarCitaComponent } from '../../components/AgendarCita/agendar-cita.component';

@Component({
  selector: 'app-agendar-page',
  standalone: true,
  imports: [CommonModule, AgendarCitaComponent],
  templateUrl: './agendar-page.component.html',
  styleUrls: ['./agendar-page.component.css']
})
export class AgendarPageComponent {}
