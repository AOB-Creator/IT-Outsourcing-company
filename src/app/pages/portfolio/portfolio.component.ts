import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { TranslateService } from '../../core/i18n/translate.service';
import { ConsultModalService } from '../../core/consult-modal.service';
import { SeoService } from '../../core/seo.service';

interface ProjectText {
  id: string;
  category: string;
  name: string;
  description: string;
  tags: string[];
}

interface Project extends ProjectText {
  url: string;
  image: string;
}

/** Live projects: links and screenshots (texts come from i18n `projectsItems` by id). */
const PROJECT_LINKS: Record<string, string> = {
  'adn-space': 'https://adn-space.vercel.app',
  'tender-ai': 'https://tender-ai-bice-zeta.vercel.app',
  'budget-controller': 'https://budget-controller-web.vercel.app',
  'navexa-wms': 'https://warehouse-management-system-delta-seven.vercel.app',
  lexform: 'https://lex-form.vercel.app',
  'escape-booking': 'https://escape-booking-omega.vercel.app',
};

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
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss',
})
export class PortfolioComponent {
  readonly i18n = inject(TranslateService);
  readonly consult = inject(ConsultModalService);
  private seo = inject(SeoService);

  constructor() {
    effect(() =>
      this.seo.set(this.i18n.t('meta.titles.portfolio'), this.i18n.t('meta.descriptions.portfolio')),
    );
  }

  get projects(): Project[] {
    return this.i18n
      .list<ProjectText>('projectsItems')
      .filter((p) => PROJECT_LINKS[p.id])
      .map((p) => ({ ...p, url: PROJECT_LINKS[p.id], image: `assets/portfolio/${p.id}.webp` }));
  }

  get items(): PortfolioItem[] {
    return this.i18n.list<PortfolioItem>('portfolioItems');
  }
}
