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
import { Veterinario } from '../../components/shared/interfaces/Veterinario.model';

//components
import { ClienteSelectorComponent } from '../../components/agendar/cliente-selector/cliente-selector.component';
import { MascotaSelectorComponent } from '../../components/agendar/mascota-selector/mascota-selector.component';

// RxJS
import { map, Observable, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-agendar-cita',
  templateUrl: './agendar-page.component.html',
  styleUrls: ['./agendar-page.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ClienteSelectorComponent, MascotaSelectorComponent]
})
export class AgendarPageComponent implements OnInit {
  isLoading = signal(false);
  nuevoCliente = signal(true);
  nuevaMascota = signal(true);

  clienteEncontrado = signal<Cliente | null>(null);
  mascotaEncontrada = signal<Mascota | null>(null);

  // Signals para avisos
  mostrarAviso = signal(false);
  tipoAviso = signal<'exito' | 'error'>('exito');
  mensajeAviso = signal('');

  clienteForm: FormGroup;
  mascotaForm: FormGroup;
  citaForm: FormGroup;

  razas$: Observable<Raza[]>;
  tiposServicio$: Observable<{ tipoServicioId: number; nombre: string }[]> = of([]);
  veterinarios: Veterinario[] = [];

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
      veterinarioId: [null, Validators.required],
      estadoCita: ['PENDIENTE', Validators.required]
    });
  }

  ngOnInit(): void {
    this.veterinarioService.listarVeterinariosAsistente().subscribe(res => {
      // Asegurar que res.data sea siempre un array
      this.veterinarios = Array.isArray(res.data) ? res.data : [res.data];
    });

  }

  onClienteSeleccionado(cliente: Cliente) {
    this.clienteEncontrado.set(cliente);
    this.nuevoCliente.set(false);
  }

  onMascotaSeleccionada(mascota: Mascota) {
    this.mascotaEncontrada.set(mascota);
    this.nuevaMascota.set(false);
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

  // Métodos para avisos
  mostrarExito(mensaje: string) {
    this.mensajeAviso.set(mensaje);
    this.tipoAviso.set('exito');
    this.mostrarAviso.set(true);

    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
      this.mostrarAviso.set(false);
    }, 5000);
  }

  mostrarError(mensaje: string) {
    this.mensajeAviso.set(mensaje);
    this.tipoAviso.set('error');
    this.mostrarAviso.set(true);

    // Auto-ocultar después de 8 segundos
    setTimeout(() => {
      this.mostrarAviso.set(false);
    }, 8000);
  }

  cerrarAviso() {
    this.mostrarAviso.set(false);
  }

  // Método para limpiar formularios
  limpiarFormularios() {
    // Resetear formularios
    this.clienteForm.reset();
    this.mascotaForm.reset();
    this.citaForm.reset();

    // Resetear estados
    this.nuevoCliente.set(true);
    this.nuevaMascota.set(true);
    this.clienteEncontrado.set(null);
    this.mascotaEncontrada.set(null);

    // Establecer valores por defecto
    this.mascotaForm.patchValue({
      estado: 'VIVO'
    });
  }

  agendar() {
    // Validaciones más específicas
    if (!this.nuevoCliente() && !this.clienteEncontrado()) {
      this.mostrarError('Por favor, seleccione un cliente existente o active "Nuevo Cliente"');
      return;
    }

    if (!this.nuevaMascota() && !this.mascotaEncontrada()) {
      this.mostrarError('Por favor, seleccione una mascota existente o active "Nueva Mascota"');
      return;
    }

    // Validar formularios requeridos
    if (this.nuevoCliente() && !this.clienteForm.valid) {
      this.mostrarError('Por favor, complete todos los campos requeridos del cliente');
      return;
    }

    if (this.nuevaMascota() && !this.mascotaForm.valid) {
      this.mostrarError('Por favor, complete todos los campos requeridos de la mascota');
      return;
    }

    if (!this.citaForm.valid) {
      this.mostrarError('Por favor, complete todos los campos requeridos de la cita');
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
              // No enviar citaId para que el backend lo genere automáticamente
              fechaRegistro: new Date().toISOString(),
              tipoServicioId: this.citaForm.value.tipoServicioId,
              mascotaId: mascotaRes.data.mascotaId ?? 0,
              clienteId,
              veterinarioId: this.citaForm.value.veterinarioId, // 🧠 tomado del form
              motivo: this.citaForm.value.motivo,
              estadoCita: this.citaForm.value.estadoCita || 'PENDIENTE', // 🧠 tomado del form
            };

            console.log('Datos de la cita a enviar:', citaPayload);
            return this.citaService.agendar(citaPayload);
          })
        );
      })
    ).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.mostrarExito('Cita registrada con éxito');
        this.limpiarFormularios();
      },
      error: err => {
        this.isLoading.set(false);
        console.error('Error completo:', err);

        // Mostrar mensaje más específico
        if (err.status === 500) {
          this.mostrarError('Error interno del servidor. Verifique que todos los datos sean correctos.');
        } else if (err.status === 404) {
          this.mostrarError('Endpoint no encontrado. Contacte al administrador.');
        } else {
          this.mostrarError(`Error al agendar cita: ${err.message || 'Error desconocido'}`);
        }
      }
    });
  }
}
