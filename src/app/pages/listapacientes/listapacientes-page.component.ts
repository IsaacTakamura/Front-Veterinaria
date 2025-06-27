import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-listapacientes-page',
  templateUrl: './listapacientes-page.component.html',
  styleUrls: ['./listapacientes-page.component.css'],
  imports: [CommonModule]
})
export class ListapacientesPageComponent {
  selectedSection = 'pacientes';

  changeSection(section: string) {
    this.selectedSection = section;
  }
}
