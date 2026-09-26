import { ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { provideRouter, withInMemoryScrolling, withRouterConfig } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { routes } from './app.routes';
import { DEFAULT_LANG, Lang, SUPPORTED_LANGS, TranslateService } from './core/i18n/translate.service';
import { SeoService } from './core/seo.service';

// The header and footer render outside the routed page, so the language must be
// loaded before the first render, not only in the route resolver.
function initLanguage(): Promise<void> {
  inject(SeoService);
  const segment = inject(PlatformLocation).pathname.split('/')[1] as Lang;
  return inject(TranslateService).use(SUPPORTED_LANGS.includes(segment) ? segment : DEFAULT_LANG);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withFetch()),
    provideRouter(
      routes,
      withRouterConfig({ paramsInheritanceStrategy: 'always' }),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
    ),
    provideClientHydration(withEventReplay()),
    provideAppInitializer(initLanguage),
  ],
};
