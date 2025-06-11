import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-index-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './index-page.component.html',
  styleUrls: ['./index-page.component.css']
})

export class IndexPageComponent {
  servicios = [
    {
      titulo: 'Consulta General',
      descripcion: 'Triaje completo con medición de signos vitales.',
      icono: '🩺',
      puntos: ['Examen físico completo', 'Anamnesis detallada', 'Historial digital', 'Plan personalizado']
    },
    {
      titulo: 'Vacunación',
      descripcion: 'Programa de vacunación con carnet digital.',
      icono: '💉',
      puntos: ['Carnet digital', 'Alertas', 'Control automático', 'Stickers']
    },
    {
      titulo: 'Cirugías',
      descripcion: 'Procedimientos con asistencia profesional.',
      icono: '🔪',
      puntos: ['Instrumentos esterilizados', 'Seguimiento post-operatorio', 'Cuidados personalizados']
    },
    {
      titulo: 'Servicio a Domicilio',
      descripcion: 'Veterinario en casa con delivery.',
      icono: '🚐',
      puntos: ['Consultas a domicilio', 'Delivery', 'Baño y corte', 'Emergencias móviles']
    },
    {
      titulo: 'Emergencias 24/7',
      descripcion: 'Urgencias las 24 horas del día.',
      icono: '⏱️',
      puntos: ['Veterinario de turno', 'Atención inmediata', 'Casos graves', 'Registro en app']
    },
    {
      titulo: 'Estética Canina',
      descripcion: 'Baño, corte y cuidado de uñas.',
      icono: '🛁',
      puntos: ['Corte según raza', 'Productos especiales', 'Baño especializado']
    }
  ];

  // 👇 AÑADE ESTO DEBAJO de 'servicios'
  proceso = [
    {
      titulo: 'Recepción',
      descripcion: 'Registro del paciente y agendamiento con pago parcial.',
      icono: '📝'
    },
    {
      titulo: 'Triaje',
      descripcion: 'Signos vitales: temperatura, pulsaciones, respiración.',
      icono: '🌡️'
    },
    {
      titulo: 'Consulta',
      descripcion: 'Evaluación y anamnesis por el veterinario.',
      icono: '👨‍⚕️'
    },
    {
      titulo: 'Seguimiento',
      descripcion: 'Historial digital y recordatorios automáticos.',
      icono: '📋'
    }
  ];
}
