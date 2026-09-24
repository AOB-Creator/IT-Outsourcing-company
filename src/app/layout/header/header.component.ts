import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { Lang, SUPPORTED_LANGS, TranslateService } from '../../core/i18n/translate.service';
import { IconComponent } from '../../shared/icon/icon.component';

interface NavItem {
  path: string;
  labelKey: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, IconComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private router = inject(Router);
  readonly i18n = inject(TranslateService);

  readonly langs = SUPPORTED_LANGS;
  readonly menuOpen = signal(false);
  readonly scrolled = signal(false);

  readonly navItems: NavItem[] = [
    { path: '', labelKey: 'nav.home' },
    { path: 'services', labelKey: 'nav.services' },
    { path: 'industries', labelKey: 'nav.industries' },
    { path: 'portfolio', labelKey: 'nav.portfolio' },
    { path: 'about', labelKey: 'nav.about' },
    { path: 'contact', labelKey: 'nav.contact' },
  ];

  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => this.menuOpen.set(false));
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 8);
  }

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  homePath(): string[] {
    return ['/', this.i18n.lang()];
  }

  navPath(path: string): string[] {
    return path ? ['/', this.i18n.lang(), path] : ['/', this.i18n.lang()];
  }

  switchLang(lang: Lang): void {
    const tree = this.router.parseUrl(this.router.url);
    const segments = tree.root.children['primary']?.segments ?? [];
    const rest = segments.slice(1).map((s) => s.path);
    this.router.navigate(['/', lang, ...rest]);
  }
}
