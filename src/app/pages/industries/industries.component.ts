import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { TranslateService } from '../../core/i18n/translate.service';
import { ConsultModalService } from '../../core/consult-modal.service';
import { SeoService } from '../../core/seo.service';
import { IconComponent } from '../../shared/icon/icon.component';

interface IndustryItem {
  title: string;
  desc: string;
  points: string[];
}

@Component({
  selector: 'app-industries',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  templateUrl: './industries.component.html',
  styleUrl: './industries.component.scss',
})
export class IndustriesComponent {
  readonly i18n = inject(TranslateService);
  readonly consult = inject(ConsultModalService);
  private seo = inject(SeoService);

  constructor() {
    effect(() =>
      this.seo.set(this.i18n.t('meta.titles.industries'), this.i18n.t('industriesPage.subtitle')),
    );
  }

  get industries(): IndustryItem[] {
    return this.i18n.list<IndustryItem>('industriesItems');
  }
}
