# TrustCode Partners — Corporate Website

Angular app for an IT outsourcing company specializing in banking/fintech
software (credit & microfinance systems, BNPL/installment platforms, fintech
backend, KYC/compliance, outstaffing, CRM/ERP), built from the project TZ
(technical specification).

## Stack

- Angular 19 (standalone components, signals, lazy-loaded routes)
- SCSS design system matching the TZ palette/typography (Space Grotesk + Inter)
- Custom lightweight i18n (UZ / RU / EN) with `/:lang/` URL prefixes and JSON
  translation files in `public/assets/i18n/`
- Reactive contact form with client-side validation and a honeypot field

## Pages

Home · Services (with anchors per service) · Industries · Portfolio/Cases ·
About · Contact — navigation, footer and all page copy are fully translated.

## Development

```bash
npm install
ng serve
```

Open `http://localhost:4200/` — it redirects to `/uz`. Switch languages with
the UZ / RU / EN toggle in the header.

## Build

```bash
ng build
```

Output goes to `dist/it-outsourcing-site/browser`. Serve it with any static
file server that has SPA fallback enabled (unknown paths → `index.html`),
e.g. `npx serve -s dist/it-outsourcing-site/browser`.

## Tests

```bash
ng test
```

## Notes

- The contact form's `ContactService` (`src/app/core/contact.service.ts`) is
  the integration point for a backend endpoint that relays submissions to
  Telegram/email — bot tokens must stay server-side, so this is intentionally
  not wired to a real API yet.
- Client testimonials and CRM integration are left as empty/next-phase
  sections per the TZ, since only real, verifiable content should populate
  them.
