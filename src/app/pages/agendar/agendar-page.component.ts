import { Component, computed, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

// Services
import { ClienteService } from '../../core/services/cliente.service';
import { CitaService } from '../../core/services/cita.service';
import { MascotaService } from '../../core/services/mascota.service';
import { VeterinarioService } from '../../core/services/veterinario.service';

// Models
import { Cita } from '../../components/shared/interfaces/cita.model';
import { Cliente } from '../../components/shared/interfaces/cliente.model';
import { Mascota } from '../../components/shared/interfaces/mascota.model';
import { Raza } from '../../components/shared/interfaces/Raza.model';

// RxJS
import { map, Observable, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-agendar-cita',
  templateUrl: './agendar-page.component.html',
  styleUrls: ['./agendar-page.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class AgendarPageComponent implements OnInit {
  isLoading = signal(false);
  nuevoCliente = signal(true);
  nuevaMascota = signal(true);

  clienteEncontrado = signal<Cliente | null>(null);
  mascotaEncontrada = signal<Mascota | null>(null);

  clienteForm: FormGroup;
  mascotaForm: FormGroup;
  citaForm: FormGroup;

  razas$: Observable<Raza[]>;
  tiposServicio$: Observable<{ tipoServicioId: number; nombre: string }[]> = of([]);
  veterinarios: any[] = [];

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private mascotaService: MascotaService,
    private citaService: CitaService,
    private veterinarioService: VeterinarioService
  ) {
    this.razas$ = this.mascotaService.listarRazas().pipe(map(res => res.data));
    this.tiposServicio$ = this.citaService.listarTiposServicio().pipe(map(res => res.data));

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
      razaId: [null, Validators.required],
      clienteId: ['']
    });

    this.citaForm = this.fb.group({
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      motivo: ['', Validators.required],
      tipoServicioId: [null, Validators.required],
      veterinarioId: [null, Validators.required] // 🎯 agregado al formulario
    });
  }

  ngOnInit(): void {
    this.veterinarioService.listarVeterinarios().subscribe(data => {
      this.veterinarios = data;
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

  usarClienteExistente() {
    this.nuevoCliente.set(false);
  }

  usarMascotaExistente() {
    this.nuevaMascota.set(false);
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
        const clienteId = clienteRes.data.clienteId ?? 0;
        const mascotaData: Mascota = {
          ...this.mascotaForm.value,
          clienteId
        } as Mascota;

        const crearMascota$ = this.nuevaMascota()
          ? this.mascotaService.crear(mascotaData)
          : of({ data: this.mascotaEncontrada()! });

        return crearMascota$.pipe(
          switchMap(mascotaRes => {
            const citaPayload: Cita = {
              fechaRegistro: new Date().toISOString(),
              tipoServicioId: this.citaForm.value.tipoServicioId,
              mascotaId: mascotaRes.data.mascotaId ?? 0,
              clienteId,
              veterinarioId: this.citaForm.value.veterinarioId, // 🧠 tomado del form
              motivo: this.citaForm.value.motivo
            };
            return this.citaService.agendar(citaPayload);
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
