import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateService } from '../../core/i18n/translate.service';
import { SeoService } from '../../core/seo.service';

interface PortfolioItem {
  industry: string;
  problem: string;
  solution: string;
  result: string;
  tags: string[];
}

@Component({
  selector: 'app-portfolio',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss',
})
export class PortfolioComponent {
  readonly i18n = inject(TranslateService);
  private seo = inject(SeoService);

  constructor() {
    effect(() =>
      this.seo.set(this.i18n.t('meta.titles.portfolio'), this.i18n.t('portfolioPage.subtitle')),
    );
  }

  get items(): PortfolioItem[] {
    return this.i18n.list<PortfolioItem>('portfolioItems');
  }

  navPath(path: string): string[] {
    return path ? ['/', this.i18n.lang(), path] : ['/', this.i18n.lang()];
  }
}
