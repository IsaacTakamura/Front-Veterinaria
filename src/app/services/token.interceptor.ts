import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('auth_token');

  // No incluir token para login o registro
  const isPublic = req.url.includes('/authentication/login') || req.url.includes('/authentication/register');

  if (!isPublic && token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  return next(req); // Sin token para rutas públicas
};
