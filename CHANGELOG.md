# Changelog

All notable changes to this project will be documented in this file.
Format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

---

## [0.1.0] - 2026-03-28

### Added
- Initial project setup with SvelteKit 5, TypeScript, Tailwind v4, shadcn-svelte
- Better Auth with email/password and passkey support
- Paraglide i18n - English (default) and German (/de/ prefix), fully reactive
- Drizzle ORM with environment-aware DB client (postgres.js locally, Neon in production)
- Database schema: artwork and exhibition tables with localized jsonb fields
- Route groups: (public) artist site, (auth) login/register, (app) studio admin
- Studio sidebar with collapsible icon mode, breadcrumbs, language switcher
- Passkey management page (add, list, delete)
- User management page (admin)
- Settings and privacy pages
- Service layer for all database queries
- Dark theme as default
