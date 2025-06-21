import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';
import localeEs from '@angular/common/locales/es';
import { tokenInterceptor } from './app/core/services/token.interceptor';
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

  registerLocaleData(localeEs, 'es-ES');

// Asegúrate de que el interceptor esté correctamente configurado
appConfig.providers.push(
  provideHttpClient(
    withInterceptors([tokenInterceptor])
  )
);
