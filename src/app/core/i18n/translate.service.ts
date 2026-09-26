import { Injectable, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type Lang = 'uz' | 'ru' | 'en';

export const SUPPORTED_LANGS: Lang[] = ['uz', 'ru', 'en'];
export const DEFAULT_LANG: Lang = 'uz';

// Bundled per language (not fetched over HTTP) so prerendered HTML and the
// first client render already contain the translated text.
const LOCALES: Record<Lang, () => Promise<{ default: Record<string, unknown> }>> = {
  uz: () => import('./locales/uz.json'),
  ru: () => import('./locales/ru.json'),
  en: () => import('./locales/en.json'),
};

@Injectable({ providedIn: 'root' })
export class TranslateService {
  private document = inject(DOCUMENT);

  readonly lang = signal<Lang>(DEFAULT_LANG);
  readonly data = signal<Record<string, unknown>>({});

  private cache = new Map<Lang, Record<string, unknown>>();

  async use(lang: Lang): Promise<void> {
    if (!SUPPORTED_LANGS.includes(lang)) {
      lang = DEFAULT_LANG;
    }
    if (!this.cache.has(lang)) {
      this.cache.set(lang, (await LOCALES[lang]()).default);
    }
    this.data.set(this.cache.get(lang)!);
    this.lang.set(lang);
    this.document.documentElement.lang = lang;
    try {
      localStorage.setItem('lang', lang);
    } catch {
      /* storage unavailable */
    }
  }

  /** Resolve a dot-path string, e.g. "home.hero.title" */
  t(path: string): string {
    const value = this.resolve(path);
    return typeof value === 'string' ? value : path;
  }

  /** Resolve a dot-path array, e.g. "servicesItems" */
  list<T = unknown>(path: string): T[] {
    const value = this.resolve(path);
    return Array.isArray(value) ? (value as T[]) : [];
  }

  private resolve(path: string): unknown {
    return path
      .split('.')
      .reduce<unknown>((acc, key) => {
        if (acc && typeof acc === 'object' && key in (acc as object)) {
          return (acc as Record<string, unknown>)[key];
        }
        return undefined;
      }, this.data());
  }
}
