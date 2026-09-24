import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { DEFAULT_LANG, Lang, SUPPORTED_LANGS } from './translate.service';

export const langGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const lang = route.paramMap.get('lang') as Lang;
  if (SUPPORTED_LANGS.includes(lang)) {
    return true;
  }
  return router.parseUrl(`/${DEFAULT_LANG}`);
};
