import { LOCALE_ID, importProvidersFrom } from '@angular/core';
import { ApplicationConfig } from '@angular/core';
import { ActivatedRouteSnapshot, provideRouter, withComponentInputBinding } from '@angular/router';
import '@angular/common/locales/global/bs-Latn';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { httpInterceptorProviders } from './interceptors';
import { HttpClientModule } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideAnimationsAsync(),
    {provide: LOCALE_ID, useValue: 'bs-Latn'},
    importProvidersFrom(HttpClientModule),
    httpInterceptorProviders
  ]
};
