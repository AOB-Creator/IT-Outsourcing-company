import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateService } from '../../core/i18n/translate.service';
import { SeoService } from '../../core/seo.service';
import { IconComponent } from '../../shared/icon/icon.component';

interface TeamRole {
  role: string;
  count: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {
  readonly i18n = inject(TranslateService);
  private seo = inject(SeoService);

  constructor() {
    effect(() => this.seo.set(this.i18n.t('meta.titles.about'), this.i18n.t('about.subtitle')));
  }

  get experience(): string[] {
    return this.i18n.list<string>('about.experience');
  }

  get principles(): string[] {
    return this.i18n.list<string>('about.principles');
  }

  get certs(): string[] {
    return this.i18n.list<string>('about.certs');
  }

  get team(): TeamRole[] {
    return this.i18n.list<TeamRole>('teamRoles');
  }

  navPath(path: string): string[] {
    return path ? ['/', this.i18n.lang(), path] : ['/', this.i18n.lang()];
  }
}
