import { defineNuxtConfig } from 'nuxt/config'
import ViteComponents from 'unplugin-vue-components/vite'
import IconsResolver from 'unplugin-icons/resolver'

export default defineNuxtConfig({
  app: {
    head: {
      title: 'A Better Nuxt 3 Starter',
      link: [{ rel: 'icon', type: 'image/*', href: '/favicon.svg' }]
    }
  },
  runtimeConfig: {
    public: {
      'twitchClientId': process.env.TWITCH_CLIENT_ID,
      'twitchRedirectUri': process.env.TWITCH_REDIRECT_URI,
    }
  },
  modules: [
    'nuxt-windicss',
    '@pinia/nuxt',
    'unplugin-icons/nuxt',
    '@vueuse/nuxt',
    [
      '@intlify/nuxt3',
      {
        localeDir: 'locales',
        vueI18n: {
          locale: 'en'
        }
      }
    ]
  ],
  pinia: {
    autoImports: [
      'useTwitchStore',
    ],
  },
  vite: {
    plugins: [
      ViteComponents({
        resolvers: [
          IconsResolver({
            componentPrefix: ''
          })
        ],
        dts: true
      })
    ]
  }
})
