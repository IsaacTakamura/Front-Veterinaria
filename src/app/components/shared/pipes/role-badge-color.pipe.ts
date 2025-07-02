import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roleBadgeColor',
  standalone: true
})
export class RoleBadgeColorPipe implements PipeTransform {
  transform(role: string | null | undefined): string {
    if (!role) return 'bg-gray-100 text-gray-800';

    switch (role.toUpperCase()) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800';
      case 'VET':
        return 'bg-blue-100 text-blue-800';
      case 'ASISTENTE':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
