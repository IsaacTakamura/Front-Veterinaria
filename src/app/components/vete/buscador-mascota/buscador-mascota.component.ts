import { Component } from '@angular/core';
import { MascotaService } from '../../../core/services/mascota.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClienteService } from 'src/app/core/services/cliente.service';

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

  constructor(
    private mascotaService: MascotaService,
    private clienteService: ClienteService
  ) {}

  buscar() {
    if (!this.nombreMascota.trim()) return;

    this.mascotaService.buscarPorNombre(this.nombreMascota).subscribe({
      next: (res: any) => {
        this.mascota = res.data;
        this.clienteService.listarClientePorId(res.data.clienteId).subscribe({
          next: (resCliente: any) => {
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
