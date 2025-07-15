import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router
} from '@angular/router';
import { SessionService } from '../services/session.service';

export const authGuard: CanActivateFn = (route, state) => {
  const session = inject(SessionService);
  const router = inject(Router);

  const token = session.token;
  const user = session.user;

  console.log('🔒 Evaluando guard: token?', !!token, 'rol?', user?.rol);

  if (!token || !user) {
    console.warn('🔐 Acceso denegado. Redirigiendo a login');
    router.navigate(['/login']);
    return false;
  }

  const expectedRoles = route.data?.['roles'] as string[];
  if (expectedRoles && !expectedRoles.includes(user.rol)) {
    console.warn('🔐 Rol no autorizado. Redirigiendo a login');
    router.navigate(['/login']);
    return false;
  }

  return true;
};
