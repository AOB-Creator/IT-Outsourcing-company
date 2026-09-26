import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateService } from '../../core/i18n/translate.service';
import { IconComponent } from '../../shared/icon/icon.component';
import { CONTACT } from '../../core/contact-info';

interface NavItem {
  path: string;
  labelKey: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  readonly info = CONTACT;
  readonly i18n = inject(TranslateService);
  readonly year = new Date().getFullYear();

  readonly navItems: NavItem[] = [
    { path: '', labelKey: 'nav.home' },
    { path: 'services', labelKey: 'nav.services' },
    { path: 'industries', labelKey: 'nav.industries' },
    { path: 'portfolio', labelKey: 'nav.portfolio' },
    { path: 'about', labelKey: 'nav.about' },
    { path: 'contact', labelKey: 'nav.contact' },
  ];

  navPath(path: string): string[] {
    return path ? ['/', this.i18n.lang(), path] : ['/', this.i18n.lang()];
  }
}
