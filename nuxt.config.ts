// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Отключаем prefetch ссылок - предотвращает двойную загрузку payload
  router: {
    options: {
      prefetchLinks: false,
    },
  },
  // Сжатие payload для уменьшения размера
  experimental: {
    renderJsonPayloads: true,
  },
  app: {
    head: {
      htmlAttrs: {
        lang: "ru",
      },
      title:
        "Проектирование, монтаж систем отопления, водоснабжения, канализации",
      titleTemplate: "%s",
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      meta: [
        { property: "og:site_name", content: "Профитерм" },
        {
          hid: "viewport",
          name: "viewport",
          content: "width=device-width, initial-scale=1, maximum-scale=1",
        },
        // Phone Number Detection
        {
          hid: "format-detection",
          name: "format-detection",
          content: "telephone=no",
        },
        { hid: "color-scheme", name: "color-scheme", content: "light only" },
      ],
      link: [
        { rel: "canonical", href: "https://profiterm.by/" },
        { rel: "icon", type: "image/x-icon", href: "/favicon.png" },
        // Preconnect for external domains - improves loading performance
        {
          rel: "preconnect",
          href: "https://disk.profiterm.by",
          crossorigin: "anonymous",
        },
        { rel: "dns-prefetch", href: "https://disk.profiterm.by" },
        {
          rel: "preconnect",
          href: "https://mc.yandex.ru",
          crossorigin: "anonymous",
        },
        {
          rel: "preconnect",
          href: "https://www.googletagmanager.com",
          crossorigin: "anonymous",
        },
      ],
    },
  },

  runtimeConfig: {
    bdurl: process.env.DATABASE_URL,
    dbName: process.env.DBNAME,
    user: process.env.DBUSERNAME,
    pass: process.env.DBPASSWORD,
    authSource: process.env.DBAUTHSOURCE,
    authSecret: process.env.AUTH_SECRET,
    mongodbUri: process.env.DATABASE_URL,
    MAILHOST: process.env.MAILHOST,
    MAILPORT: process.env.MAILPORT,
    MAILUSER: process.env.MAILUSER,
    MAILPASSWORD: process.env.MAILPASSWORD,
    CONTACTMAIL: process.env.CONTACTMAIL,
    FILES_PATH: process.env.FILES_PATH,
    public: {
      filesPath: process.env.FILES_PATH_URL,
    },
  },
  css: [
    "@/assets/main.scss",
    "@/node_modules/bulma/css/bulma.css",
    "@/node_modules/plyr/dist/plyr.css",
    // "element-plus/dist/index.css",
  ],
  elementPlus: {
    importStyle: "css",
  },
  modules: [
    "nuxt-server-utils",
    "@sidebase/nuxt-auth",
    "nuxt-swiper",
    "@element-plus/nuxt",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@nuxt-modules/cache",
    "nuxt-icons",
    // "formidable",
    "@nuxtjs/seo",
    "nuxt-icon",
    "@zadigetvoltaire/nuxt-gtm",
    "@nuxt/image",
    [
      "@nuxtjs/google-fonts",
      {
        families: {
          Montserrat: [100, 300, 400, 500, 600, 700, 800],
          Caveat: [100, 300, 400, 500, 600, 700, 800],
        },
        download: true,
        inject: true,
      },
    ],
    [
      "yandex-metrika-module-nuxt3",
      {
        id: "74350936",
        webvisor: true,
      },
    ],
  ],
  gtm: {
    id: "GTM-MBLWTCQ",
  },
  site: {
    url: "https://profiterm.by",
  },
  sitemap: {
    sitemaps: {
      pages: {
        sources: ["/api/sitemap/pages-urls"],
      },
      catalog: {
        sources: ["/api/sitemap/catalog-urls"],
      },
      project: {
        sources: ["/api/sitemap/project-urls"],
      },
    },
  },
  nitro: {
    plugins: ["~/server/index.ts"],
    devProxy: {
      "/images": {
        target: "https://disk.profiterm.by/images/",
        changeOrigin: true,
      },
    },
    prerender: {
      failOnError: false,
    },
    // externals: {
    //   external: ["formidable"],
    // },
  },
  // Cache headers for static assets - using routeRules for proper caching
  routeRules: {
    // Long cache for static images with immutable flag
    "/assets/images/**": {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    },
    // Cache for IPX optimized images
    "/_ipx/**": {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    },
    // Cache for public folder assets
    "/_nuxt/**": {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    },
    // Cache for favicon and static public files
    "/favicon.png": {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    },
    "/profiterm.webp": {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    },
    // ISR for public pages - cache for 1 hour, revalidate in background
    "/": { isr: 3600 },
    "/about": { isr: 3600 },
    "/contacts": { isr: 3600 },
    "/installment": { isr: 3600 },
    "/calculator": { isr: 3600 },
    "/articles": { isr: 3600 },
    "/article/**": { isr: 3600 },
    "/catalog": { isr: 3600 },
    "/catalog/**": { isr: 3600 },
    "/project/**": { isr: 3600 },
  },
  auth: {
    baseURL: process.env.AUTH_ORIGIN,
    provider: {
      type: "authjs",
    },
  },
  image: {
    // Используем IPX для оптимизации изображений на лету
    provider: "ipx",
    // Разрешаем внешние домены для оптимизации
    domains: ["disk.profiterm.by"],
    // Настройки качества и форматов
    quality: 80,
    format: ["webp", "avif"],
    // Предустановленные размеры для оптимизации
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
    // Алиас для удобства
    alias: {
      disk: "https://disk.profiterm.by/images",
    },
  },
  // devtools: { enabled: true },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "@/assets/scss/_variables.scss" as *;
            @use "@/assets/scss/_mixins.scss" as *;
          `,
        },
      },
    },
    build: {
      // Оптимизация размера бандлов
      rollupOptions: {
        output: {
          manualChunks: {
            // Выделяем тяжёлые библиотеки в отдельные чанки
            'vendor-vue': ['vue', 'vue-router', 'pinia'],
            'vendor-swiper': ['swiper'],
            'vendor-element': ['element-plus'],
          },
        },
      },
      // Увеличиваем лимит для предупреждений о размере чанков
      chunkSizeWarningLimit: 500,
    },
  },
});
