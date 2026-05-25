// vite.config.js

import { defineConfig } from 'vite';

import { resolve } from 'path';


// ======================================================
// VITE CONFIG
// ======================================================

export default defineConfig({

  server: {

    port: 3000,

    open:
      '/src/pages/public/login.html'
  },

  build: {

    outDir: 'dist',

    emptyOutDir: true,

    rollupOptions: {

      input: {

        // PUBLIC

        login: resolve(
          __dirname,
          'src/pages/public/login.html'
        ),

        register: resolve(
          __dirname,
          'src/pages/public/register.html'
        ),

        forgotPassword: resolve(
          __dirname,
          'src/pages/public/forgot-password.html'
        ),

        resetPassword: resolve(
          __dirname,
          'src/pages/public/reset-password.html'
        ),

        privacy: resolve(
          __dirname,
          'src/pages/public/privacy.html'
        ),

        cookies: resolve(
          __dirname,
          'src/pages/public/cookies.html'
        ),

        legalNotice: resolve(
          __dirname,
          'src/pages/public/legal-notice.html'
        ),

        terms: resolve(
          __dirname,
          'src/pages/public/terms.html'
        ),

        notFound: resolve(
          __dirname,
          'src/pages/public/404.html'
        ),

        // APP

        dashboard: resolve(
          __dirname,
          'src/pages/app/dashboard.html'
        ),

        sessions: resolve(
          __dirname,
          'src/pages/app/sessions.html'
        ),

        resources: resolve(
          __dirname,
          'src/pages/app/resources.html'
        ),

        faq: resolve(
          __dirname,
          'src/pages/app/faq.html'
        ),

        contact: resolve(
          __dirname,
          'src/pages/app/contact.html'
        ),

        profile: resolve(
          __dirname,
          'src/pages/app/profile.html'
        ),

        // ADMIN

        adminDashboard: resolve(
          __dirname,
          'src/pages/admin/dashboard.html'
        ),

        adminUsers: resolve(
          __dirname,
          'src/pages/admin/users.html'
        ),

        adminSessions: resolve(
          __dirname,
          'src/pages/admin/sessions.html'
        ),

        adminAnnouncements: resolve(
          __dirname,
          'src/pages/admin/announcements.html'
        )
      }
    }
  },

  resolve: {

    alias: {

      '@': resolve(
        __dirname,
        './src'
      )
    }
  }
});