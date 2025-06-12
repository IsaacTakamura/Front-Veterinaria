import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

  registerLocaleData(localeEs, 'es-ES');
