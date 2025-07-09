import { Pipe, PipeTransform } from '@angular/core';
import { format } from 'date-fns';

@Pipe({ name: 'fechaLegible' })
export class FechaLegiblePipe implements PipeTransform {
  transform(value: string): string {
    return format(new Date(value), 'dd/MM/yyyy HH:mm');
  }
}
