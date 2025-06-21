import { HttpInterceptorFn } from '@angular/common/http';

/**
 * HTTP interceptor that adds authentication tokens to outgoing requests.
 *
 * This interceptor examines each request and determines whether to add an
 * authentication token based on the destination URL. Requests to public
 * endpoints (login and register) will not have a token attached, while all
 * other requests will include the token in the Authorization header if available.
 *
 * @param req The outgoing HTTP request
 * @param next The next handler in the interceptor chain
 * @returns An observable of the HTTP event stream
 */
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
