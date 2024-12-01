// import terser from '@rollup/plugin-terser'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@oku-ui/motion-nuxt',
    '@nuxt/eslint',
    '@nuxt/image',
  ],
  plugins: ['~/plugins/toast.ts'],
  ssr: (process.env.SSR === 'true'),
  devtools: {
    enabled: false,
    timeline: {
      enabled: false,
    },
  },
  app: {
    // TODO: Unstable AF
    pageTransition: false,
    layoutTransition: false,
    head: {
      meta: [
        {
          name: 'viewport',
          content:
            'width=device-width, initial-scale=1.0, interactive-widget=resizes-content',
        },
      ],
      link: [
        {
          rel: 'icon',
          href: '/shadfin_app_concept.svg',
        },
      ],
    },
  },
  css: ['~/assets/css/transitions.css'],
  vue: {
    propsDestructure: true,

    compilerOptions: {},
  },
  colorMode: {
    classSuffix: '',
  },

  runtimeConfig: {
    internalServerUrl: undefined,
    public: {
      serverUrl: undefined,
      ssr: process.env.SSR,
    },
  },
  // alias: {
  //   "@/": "./"
  // },
  experimental: {
    renderJsonPayloads: false,
    scanPageMeta: true,
  },
  compatibilityDate: '2024-04-03',
  nitro: {
    compressPublicAssets: true,
    preset: 'bun',
  },
  vite: {
    // Force optimize deps on these routes to prevent super laggy first time navigation in dev server.
    // This eagerly scans all routes and components and optimizes their dependencies first, rather than later.
    // If you want a faster start-up comment out the "optimizeDeps"
    build: {
      sourcemap: true,
      rollupOptions: {
        treeshake: true,
        // plugins: [terser({
        //   compress: {
        //     defaults: false,
        //     drop_console: true,
        //   },
        //   mangle: {
        //     eval: true,
        //     module: true,
        //     toplevel: true,
        //     safari10: true,
        //     properties: false,
        //   },
        //   output: {
        //     comments: false,
        //   },
        // })],
      },
    },
    optimizeDeps: {
      entries: ['./components/**', './pages/**'],
    },
  },
  eslint: {
    config: {
      stylistic: true,
    },
    checker: true,
  },
  piniaPersistedstate: {
    storage: 'cookies',
    cookieOptions: {
      sameSite: 'lax',
      secure: false,
      httpOnly: false,
    },
    debug: false,
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui',
  },
})
