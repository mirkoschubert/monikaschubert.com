import { paraglideVitePlugin } from '@inlang/paraglide-js'
import devtoolsJson from 'vite-plugin-devtools-json'
import { sveltekit } from '@sveltejs/kit/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit(),
    devtoolsJson(),
    paraglideVitePlugin({
      project: './project.inlang',
      outdir: './src/lib/paraglide',
      strategy: ['url', 'localStorage', 'preferredLanguage', 'baseLocale'],
      urlPatterns: [
        {
          pattern: '/',
          localized: [
            ['en', '/'],
            ['de', '/de']
          ]
        },
        {
          pattern: '/gallery',
          localized: [
            ['en', '/gallery'],
            ['de', '/de/gallery']
          ]
        },
        {
          pattern: '/gallery/:slug',
          localized: [
            ['en', '/gallery/:slug'],
            ['de', '/de/gallery/:slug']
          ]
        },
        {
          pattern: '/about',
          localized: [
            ['en', '/about'],
            ['de', '/de/ueber-mich']
          ]
        },
        {
          pattern: '/contact',
          localized: [
            ['en', '/contact'],
            ['de', '/de/kontakt']
          ]
        },
        {
          pattern: '/exhibitions',
          localized: [
            ['en', '/exhibitions'],
            ['de', '/de/ausstellungen']
          ]
        },
        {
          pattern: '/imprint',
          localized: [
            ['en', '/imprint'],
            ['de', '/de/impressum']
          ]
        },
        {
          pattern: '/privacy',
          localized: [
            ['en', '/privacy'],
            ['de', '/de/datenschutz']
          ]
        }
      ]
    })
  ]
})
