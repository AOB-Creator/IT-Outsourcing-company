import { Routes } from '@angular/router';
import { langGuard } from './core/i18n/lang.guard';
import { langResolver } from './core/i18n/lang.resolver';
import { DEFAULT_LANG } from './core/i18n/translate.service';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: DEFAULT_LANG },
  {
    path: ':lang',
    canActivate: [langGuard],
    resolve: { lang: langResolver },
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'services',
        loadComponent: () =>
          import('./pages/services/services.component').then((m) => m.ServicesComponent),
      },
      {
        path: 'industries',
        loadComponent: () =>
          import('./pages/industries/industries.component').then((m) => m.IndustriesComponent),
      },
      {
        path: 'portfolio',
        loadComponent: () =>
          import('./pages/portfolio/portfolio.component').then((m) => m.PortfolioComponent),
      },
      {
        path: 'about',
        loadComponent: () => import('./pages/about/about.component').then((m) => m.AboutComponent),
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./pages/contact/contact.component').then((m) => m.ContactComponent),
      },
      { path: '**', redirectTo: '' },
    ],
  },
  { path: '**', redirectTo: DEFAULT_LANG },
];
