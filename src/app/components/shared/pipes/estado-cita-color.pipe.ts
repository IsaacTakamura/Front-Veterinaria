import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'estadoCitaColor', standalone: true })
export class EstadoCitaColorPipe implements PipeTransform {
  transform(estado: string): string {
    // Normaliza a minúsculas y reemplaza guiones bajos por guiones
    const normalizado = estado?.toLowerCase().replace(/_/g, '-');
    switch (normalizado) {
      case 'pendiente':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'en-triaje':
      case 'triaje':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'con-veterinario':
      case 'conveterinario':
        return 'bg-purple-500 hover:bg-purple-600';
      case 'completada':
        return 'bg-green-500 hover:bg-green-600';
      default:
        return '';
    }
  }
}
