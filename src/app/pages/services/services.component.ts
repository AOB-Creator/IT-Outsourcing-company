import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject } from '@angular/core';
import { TranslateService } from '../../core/i18n/translate.service';
import { ConsultModalService } from '../../core/consult-modal.service';
import { SeoService } from '../../core/seo.service';
import { SITE_URL } from '../../core/site';
import { IconComponent, IconName } from '../../shared/icon/icon.component';

interface ServiceItem {
  id: string;
  icon: IconName;
  title: string;
  problem: string;
  solution: string;
  tech: string[];
  duration: string;
}

@Component({
  selector: 'app-services',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
})
export class ServicesComponent {
  readonly i18n = inject(TranslateService);
  readonly consult = inject(ConsultModalService);
  private seo = inject(SeoService);

  constructor() {
    effect(() => {
      this.seo.set(this.i18n.t('meta.titles.services'), this.i18n.t('meta.descriptions.services'));
      const lang = this.i18n.lang();
      this.seo.jsonLd('services', {
        '@context': 'https://schema.org',
        '@graph': this.services.map((s) => ({
          '@type': 'Service',
          '@id': `${SITE_URL}/${lang}/services#${s.id}`,
          name: s.title,
          description: s.solution,
          serviceType: s.title,
          inLanguage: lang,
          areaServed: { '@type': 'Country', name: 'Uzbekistan' },
          provider: { '@id': `${SITE_URL}/#org` },
        })),
      });
    });
    inject(DestroyRef).onDestroy(() => this.seo.jsonLd('services', null));
  }

  get services(): ServiceItem[] {
    return this.i18n.list<ServiceItem>('servicesItems');
  }
}
