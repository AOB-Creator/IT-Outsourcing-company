import { RenderMode, ServerRoute } from '@angular/ssr';
import { SUPPORTED_LANGS } from './core/i18n/translate.service';

const langParams = async () => SUPPORTED_LANGS.map((lang) => ({ lang }));
const PAGES = ['', '/services', '/industries', '/portfolio', '/about', '/contact'];

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  ...PAGES.map(
    (page): ServerRoute => ({
      path: `:lang${page}`,
      renderMode: RenderMode.Prerender,
      getPrerenderParams: langParams,
    }),
  ),
  { path: '**', renderMode: RenderMode.Client },
];
