import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SessionService } from './session.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  // Obtener token tanto de localStorage como de SessionService
  const tokenLS = localStorage.getItem('auth_token');
  const sessionService = inject(SessionService);
  const tokenSession = sessionService.token;
  
  // Usar el token más confiable (SessionService tiene prioridad)
  const token = tokenSession || tokenLS;

  const isPublic = req.url.includes('/authentication/login') || req.url.includes('/authentication/register');

  // Debug logging
  console.log('🔧 TokenInterceptor - URL:', req.url);
  console.log('🔧 TokenInterceptor - Es público:', isPublic);
  console.log('🔧 TokenInterceptor - Token LS:', tokenLS ? 'Presente' : 'Ausente');
  console.log('🔧 TokenInterceptor - Token Session:', tokenSession ? 'Presente' : 'Ausente');
  console.log('🔧 TokenInterceptor - Token final:', token ? 'Presente' : 'Ausente');

  if (!isPublic && token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('🔧 TokenInterceptor - Enviando con token');
    return next(authReq);
  }

  if (!isPublic && !token) {
    console.warn('⚠️ TokenInterceptor - Petición a endpoint privado SIN TOKEN');
  }

  return next(req);
};
