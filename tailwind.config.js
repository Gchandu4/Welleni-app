/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // High-contrast accessible theme palette with automatic light/dark switching
        primary: {
          DEFAULT: 'var(--app-primary)',
          container: 'var(--app-primary-container)',
          'on-container': 'var(--app-on-primary-container)',
          'fixed-dim': 'var(--app-primary-fixed-dim)',
          on: 'var(--app-on-primary)',
        },
        secondary: {
          DEFAULT: 'var(--app-secondary)',
          container: 'var(--app-secondary-container)',
          'on-container': 'var(--app-on-secondary-container)',
        },
        surface: {
          DEFAULT: 'var(--app-surface)',
          dim: 'var(--app-surface-dim)',
          bright: 'var(--app-surface-bright)',
          variant: 'var(--app-surface-variant)',
          container: {
            DEFAULT: 'var(--app-surface-container)',
            lowest: 'var(--app-surface-container-lowest)',
            low: 'var(--app-surface-container-low)',
            high: 'var(--app-surface-container-high)',
            highest: 'var(--app-surface-container-highest)',
          },
        },
        'on-surface': {
          DEFAULT: 'var(--app-on-surface)',
          variant: 'var(--app-on-surface-variant)',
        },
        outline: {
          DEFAULT: 'var(--app-outline)',
          variant: 'var(--app-outline-variant)',
        },
        teal: {
          deep: 'var(--app-teal-deep)',
          mist: 'var(--app-teal-mist)',
        },
        sand: {
          soft: 'var(--app-sand-soft)',
        },
        status: {
          success: 'var(--app-status-success)',
        },
        error: {
          DEFAULT: 'var(--app-error)',
          container: 'var(--app-error-container)',
          'on-container': 'var(--app-on-error-container)',
        },
      },
    },
  },
};
