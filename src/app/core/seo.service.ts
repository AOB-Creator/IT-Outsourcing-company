import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { Lang, SUPPORTED_LANGS } from './i18n/translate.service';
import { SITE_NAME, SITE_URL } from './site';

const OG_LOCALE: Record<Lang, string> = { uz: 'uz_UZ', ru: 'ru_RU', en: 'en_US' };

@Injectable({ providedIn: 'root' })
export class SeoService {
  private title = inject(Title);
  private meta = inject(Meta);
  private document = inject(DOCUMENT);
  private router = inject(Router);

  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.setUrls(e.urlAfterRedirects));
  }

  set(title: string, description?: string): void {
    this.title.setTitle(title);
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    if (description) {
      this.meta.updateTag({ name: 'description', content: description });
      this.meta.updateTag({ property: 'og:description', content: description });
      this.meta.updateTag({ name: 'twitter:description', content: description });
    }
  }

  private setUrls(url: string): void {
    const path = url.split(/[?#]/)[0];
    const [, first = '', ...rest] = path.split('/');
    if (!SUPPORTED_LANGS.includes(first as Lang)) return;
    const lang = first as Lang;
    const page = rest.filter(Boolean).map((s) => `/${s}`).join('');
    const href = (l: Lang) => `${SITE_URL}/${l}${page}`;
    const image = `${SITE_URL}/og/og-${lang}.png`;

    this.link('canonical', href(lang));
    for (const l of SUPPORTED_LANGS) this.link('alternate', href(l), l);
    this.link('alternate', href('uz'), 'x-default');

    const tags: Record<string, string> = {
      'og:type': 'website',
      'og:site_name': SITE_NAME,
      'og:url': href(lang),
      'og:image': image,
      'og:image:width': '1200',
      'og:image:height': '630',
      'og:locale': OG_LOCALE[lang],
    };
    for (const [property, content] of Object.entries(tags)) this.meta.updateTag({ property, content });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:image', content: image });
  }

  private link(rel: 'canonical' | 'alternate', href: string, hreflang?: string): void {
    const head = this.document.head;
    const selector = hreflang ? `link[rel="alternate"][hreflang="${hreflang}"]` : `link[rel="${rel}"]`;
    let el = head.querySelector<HTMLLinkElement>(selector);
    if (!el) {
      el = this.document.createElement('link');
      el.setAttribute('rel', rel);
      if (hreflang) el.setAttribute('hreflang', hreflang);
      head.appendChild(el);
    }
    el.setAttribute('href', href);
  }
}
