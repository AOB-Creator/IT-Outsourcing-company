import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateService } from '../../core/i18n/translate.service';
import { SeoService } from '../../core/seo.service';
import { IconComponent, IconName } from '../../shared/icon/icon.component';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { ConsultModalService } from '../../core/consult-modal.service';
import { CONTACT } from '../../core/contact-info';

interface ServiceItem {
  id: string;
  icon: IconName;
  title: string;
  problem: string;
  solution: string;
  tech: string[];
  duration: string;
}

interface WhyItem {
  icon: IconName;
  title: string;
  desc: string;
}

interface ProcessStep {
  num: string;
  title: string;
  desc: string;
}

interface Stat {
  value: string;
  label: string;
}

interface PortfolioItem {
  industry: string;
  problem: string;
  solution: string;
  result: string;
  tags: string[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconComponent, RevealDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  readonly i18n = inject(TranslateService);
  readonly consult = inject(ConsultModalService);
  readonly info = CONTACT;
  private seo = inject(SeoService);

  constructor() {
    effect(() => this.seo.set(this.i18n.t('meta.titles.home'), this.i18n.t('meta.tagline')));
  }

  get services(): ServiceItem[] {
    return this.i18n.list<ServiceItem>('servicesItems');
  }

  get whyItems(): WhyItem[] {
    return this.i18n.list<WhyItem>('home.why.items');
  }

  get processSteps(): ProcessStep[] {
    return this.i18n.list<ProcessStep>('home.process.steps');
  }

  get stats(): Stat[] {
    return this.i18n.list<Stat>('home.trust.stats');
  }

  get cases(): PortfolioItem[] {
    return this.i18n.list<PortfolioItem>('portfolioItems');
  }

  navPath(path: string): string[] {
    return path ? ['/', this.i18n.lang(), path] : ['/', this.i18n.lang()];
  }
}
