import { Component } from '@angular/core';
import { MascotaService } from '../../../core/services/mascota.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-buscador-mascota',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './buscador-mascota.component.html',
})
export class BuscadorMascotaComponent {
  nombreMascota = '';
  mascota: any = null;
  cliente: any = null;

  constructor(private mascotaService: MascotaService) {}

  buscar() {
    if (!this.nombreMascota.trim()) return;

    this.mascotaService.buscarMascotaPorNombre(this.nombreMascota).subscribe({
      next: (res) => {
        this.mascota = res.data;
        this.mascotaService.obtenerClientePorId(res.data.clienteId).subscribe({
          next: (resCliente) => {
            this.cliente = resCliente.data[0];
          },
        });
      },
      error: () => {
        alert('Mascota no encontrada');
        this.mascota = null;
        this.cliente = null;
      },
    });
  }

  cerrarModal() {
    this.mascota = null;
    this.cliente = null;
  }
}
