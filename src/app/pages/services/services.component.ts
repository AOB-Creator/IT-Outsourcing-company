import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { TranslateService } from '../../core/i18n/translate.service';
import { ConsultModalService } from '../../core/consult-modal.service';
import { SeoService } from '../../core/seo.service';
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
    effect(() => this.seo.set(this.i18n.t('meta.titles.services'), this.i18n.t('servicesPage.subtitle')));
  }

  get services(): ServiceItem[] {
    return this.i18n.list<ServiceItem>('servicesItems');
  }
}
