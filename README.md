# TrustCode Partners — Corporate Website

A tri-lingual corporate website for an IT outsourcing company, built with Angular 19 and featuring a custom lightweight i18n system, responsive design, and contact form functionality.

## Stack

- **Framework**: Angular 19 (standalone components, signals-based reactivity)
- **Build Tool**: Angular CLI
- **Styling**: SCSS with CSS custom properties and responsive grid system
- **i18n**: Custom signal-based translation service
- **Forms**: Angular Reactive Forms with honeypot spam protection
- **Testing**: Karma/Jasmine with headless Chrome
- **Languages**: Uzbek (UZ), Russian (RU), English (EN)

## Features

- **Tri-lingual support** with route-based language selection (`/:lang/` prefix)
- **Translation system** with localStorage caching and hierarchical dot-path keys
- **Responsive design** using 12-column grid and mobile-first approach
- **Design system** with Space Grotesk and Inter fonts, custom color palette
- **Custom SVG icons** (17 icon variants without external dependencies)
- **Contact form** with validation and honeypot spam protection
- **Lazy-loaded routes** for optimal performance
- **Dark/light mode support** via CSS custom properties

## Pages

- **Home**: Hero section, trust stats, services overview, process flow, case studies, testimonials
- **Services**: Detailed view of 6 services (IT Staff Augmentation, Custom Development, QA & Testing, DevOps, Migration Services, Cloud Solutions)
- **Industries**: Industry-specific solutions (Finance, Healthcare, E-commerce, Manufacturing, Logistics)
- **Portfolio**: 3 case studies with problem/solution/result highlights
- **About**: Company history, principles, team roles, certifications
- **Contact**: Contact form with validation, honeypot protection, and success/error feedback

## Translation Files

Translation files are located in `src/app/core/i18n/locales/` (bundled per language, so prerendered pages contain the translated text):
- `uz.json` - Uzbek translations
- `ru.json` - Russian translations
- `en.json` - English translations

Each file contains hierarchical keys for:
- Navigation and page titles (`nav.*`, `home.*`, `services.*`, etc.)
- Form labels and validation messages
- Service descriptions with problem/solution/tech/duration
- Industry benefits and features
- Team role descriptions

## SEO and prerendering

`ng build` prerenders all 18 pages (`/uz`, `/ru`, `/en` × 6 pages) to static HTML in
`dist/it-outsourcing-site/browser` (`outputMode: "static"`, routes in `src/app/app.routes.server.ts`),
so search engines and link previews see the full page text. Each page gets its own title,
description, canonical URL, `hreflang` alternates and Open Graph/Twitter tags (`src/app/core/seo.service.ts`).

- Site origin: `src/app/core/site.ts` (`SITE_URL`)
- `public/sitemap.xml`, `public/robots.txt`: regenerate with `node scripts/generate-seo-assets.mjs`
- Link-preview images: `public/og/og-{uz,ru,en}.png` (1200×630); favicons in `public/`
- `vercel.json`: `/` → `/uz` redirect, unknown paths fall back to the client app (`index.csr.html`)

## Contact form → Telegram

Submissions are sent by the Vercel function `api/contact.mjs` to a Telegram chat.
Set these environment variables in Vercel (Project → Settings → Environment Variables), then redeploy:

- `TELEGRAM_BOT_TOKEN` — token from @BotFather
- `TELEGRAM_CHAT_ID` — ID of the group or user that receives requests

`ng serve` has no `/api`, so the form shows an error locally; test it on a Vercel deployment or with `vercel dev`.

## Development

### Setup

```bash
npm install
```

### Development Server

```bash
ng serve
# or
npm start
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Build

```bash
ng build
```

Build artifacts are stored in the `dist/it-outsourcing-site/browser/` directory.

### Deploy

For SPA routing to work correctly during deployment, ensure your server is configured to serve `index.html` for all routes that don't match existing files.

## Testing

### Run Unit Tests

```bash
ng test
```

Tests run in headless Chrome with the `--no-sandbox` flag enabled for Linux container environments.

### Run Unit Tests with Coverage

```bash
ng test --code-coverage
```

## Design System

### Colors

Primary palette defined in `src/styles.scss`:
- **Navy** (#0B1F3A) - Primary dark background
- **Midnight** (#0A1628) - Secondary dark shade
- **Teal** (#00C2A8) - Primary accent
- **Indigo** (#4F46E5) - Secondary accent
- **Slate grays** - Text and border colors

### Typography

- **Headings (h1-h3)**: Space Grotesk at weights 500-700
- **Body text**: Inter at weights 400-600
- **Line height scale**: 1.4–1.8 for comfortable reading

### Spacing

4px base unit spacing scale (`--space-1` through `--space-24`) used throughout.

## Services Configuration

All services and their details (problem statements, solutions, technologies, duration) are managed through the translation system and can be updated in the i18n JSON files.

## Contact Form

The contact form includes:
- **Fields**: Name, Company, Industry (dropdown), Employees (dropdown), Email/Phone, Message
- **Validation**: Required fields, email format validation, character limits
- **Spam Protection**: Honeypot field (hidden `website` field) to detect bots
- **Integration Point**: `ContactService.submit()` for backend submission

**Note**: The `ContactService` integration point is ready but requires backend endpoint configuration.

## Known Limitations

- **Testimonials section**: Currently a placeholder; requires testimonial data and gallery component implementation
- **Email submission**: Contact form has validation and honeypot protection; backend endpoint integration pending

## File Structure

```
.
├── src/
│   ├── app/
│   │   ├── layout/          # Header and footer components
│   │   ├── pages/           # Page components (home, services, contact, etc.)
│   │   ├── core/            # Services (i18n, contact, SEO)
│   │   ├── shared/          # Shared components (icon)
│   │   ├── app.routes.ts    # Route configuration
│   │   └── app.config.ts    # App providers
│   ├── styles.scss          # Global styles and design system
│   └── main.ts              # Application entry point
├── public/assets/i18n/      # Translation files (uz.json, ru.json, en.json)
├── angular.json             # Angular CLI configuration
├── karma.conf.js            # Test runner configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies
```

## License

Proprietary — TrustCode Partners
