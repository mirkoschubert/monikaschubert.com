# Changelog

All notable changes to this project will be documented in this file.
Format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

---

## [0.2.0] - 2026-03-28

### Added

- Role-based permissions system with DB-driven capability matrix (role/role_permission tables)
- Roles admin page with Switch matrix to toggle capabilities per role and resource
- Session management page: list active sessions grouped by user, revoke single or all sessions
- User management extended: create, edit (name/email), ban/unban, set password, delete
- Password generator and visibility toggle on all password fields
- Admin plugin integration (Better Auth) with first-user auto-admin via database hook
- Capability guards on all admin actions (create, update, delete, ban, set-role, set-password, revoke)
- Settings page now fully editable for all authenticated users (name and email)
- Vercel deployment pipeline: production deploys triggered by version tags only
- Release script (scripts/release.sh) with CHANGELOG validation and GitHub release creation

### Fixed

- Language switcher now updates all translations instantly without page reload
- Admin creating a new user no longer logs out the current session
- Session revoke now correctly uses session token instead of session ID
- Expired sessions filtered from active sessions list
- Unauthenticated access to studio routes redirects to /login instead of returning 403

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
