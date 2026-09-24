import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Lang, TranslateService } from './translate.service';

export const langResolver: ResolveFn<Lang> = async (route) => {
  const translate = inject(TranslateService);
  const lang = route.paramMap.get('lang') as Lang;
  await translate.use(lang);
  return translate.lang();
};
