// shared/pipes/fecha.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

@Pipe({ name: 'fechaBonita' })
export class FechaBonitaPipe implements PipeTransform {
  transform(value: string): string {
    return format(new Date(value), "PPPp");
  }
}
