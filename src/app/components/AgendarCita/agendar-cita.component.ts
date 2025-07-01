// agendar-cita.component.ts
import { Component, computed, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClienteService } from '../../core/services/cliente.service';
import { MascotaService } from '../../core/services/mascota.service';
import { CitaService } from '../../core/services/cita.service';
import { CommonModule } from '@angular/common';
import { switchMap, Observable, of, map } from 'rxjs';
import { Cliente } from '../shared/interfaces/cliente.model';
import { Mascota } from '../shared/interfaces/mascota.model';
import { Cita } from '../shared/interfaces/cita.model';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-agendar-cita',
  templateUrl: './agendar-cita.component.html',
  styleUrls: ['./agendar-cita.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class AgendarCitaComponent {
  isLoading = signal(false);
  nuevoCliente = signal(true);
  nuevaMascota = signal(true);

  clienteEncontrado = signal<Cliente | null>(null);
  mascotaEncontrada = signal<Mascota | null>(null);

  clienteForm: FormGroup;
  mascotaForm: FormGroup;
  citaForm: FormGroup;

 razas$: Observable<{ razaId: number; nombre: string }[]>;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private mascotaService: MascotaService,
    private citaService: CitaService
  ) {
    this.razas$ = this.mascotaService.listarRazas().pipe(
      map(razas => razas.map((nombre, index) => ({
        razaId: index + 1,
        nombre
      })))
    );

    this.clienteForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: [''],
      direccion: [''],
      telefono: [''],
      email: [''],
      ciudad: ['']
    });

    this.mascotaForm = this.fb.group({
      nombre: ['', Validators.required],
      edad: [null, [Validators.required, Validators.min(0)]],
      estado: ['VIVO', Validators.required],
      razaId: [null, Validators.required], // ✅
      clienteId: ['']
    });

    this.citaForm = this.fb.group({
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      motivo: ['', Validators.required]
    });
  }

  buscarClientePorNombre(nombre: string) {
    this.clienteService.buscarPorNombre(nombre).subscribe(res => {
      this.clienteEncontrado.set(res.data?.[0] || null);
    });
  }

  buscarMascotaPorNombre(nombre: string) {
    this.mascotaService.buscarPorNombre(nombre).subscribe(res => {
      this.mascotaEncontrada.set(res.data || null);
    });
  }

  agendar() {
    if (!this.nuevoCliente() && !this.clienteEncontrado()) {
      alert('Seleccione un cliente existente');
      return;
    }

    if (!this.nuevaMascota() && !this.mascotaEncontrada()) {
      alert('Seleccione una mascota existente');
      return;
    }

    this.isLoading.set(true);

    const crearCliente$ = this.nuevoCliente()
      ? this.clienteService.crear(this.clienteForm.value)
      : of({ data: this.clienteEncontrado()! });

    crearCliente$.pipe(
      switchMap(clienteRes => {
        const clienteId = clienteRes.data.clienteId;
        const mascotaData: Mascota = { ...this.mascotaForm.value, clienteId } as Mascota;

        const crearMascota$ = this.nuevaMascota()
          ? this.mascotaService.crear(mascotaData)
          : of({ data: this.mascotaEncontrada()! });

        return crearMascota$.pipe(
          switchMap(mascotaRes => {
            return this.citaService.agendar({
              mascotaId: mascotaRes.data.mascotaId,
              ...this.citaForm.value
            });
          })
        );
      })
    ).subscribe({
      next: () => {
        this.isLoading.set(false);
        alert('Cita registrada con éxito');
      },
      error: err => {
        this.isLoading.set(false);
        alert('Error al agendar cita');
        console.error(err);
      }
    });
  }
}
