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
  ],
  plugins: ['~/plugins/toast.ts'],
  ssr: false,
  devtools: {
    enabled: false,

    timeline: {
      enabled: false,
    },
  },

  app: {
    // TODO: Unstable AF
    pageTransition: { name: 'fade-short-slide', mode: 'out-in' },

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
