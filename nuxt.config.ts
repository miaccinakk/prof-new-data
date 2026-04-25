// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Отключаем prefetch ссылок - предотвращает двойную загрузку payload
  router: {
    options: {
      prefetchLinks: false,
    },
  },
  // Оптимизация производительности
  experimental: {
    renderJsonPayloads: true,
    treeshakeClientOnly: true, // Tree-shake ClientOnly компоненты
    // Инлайним критические CSS в HTML
    inlineSSRStyles: (id?: string) => {
      if (!id) return true;
      // Не инлайним тяжелые библиотеки - они загрузятся асинхронно
      if (
        id.includes("element-plus") ||
        id.includes("swiper") ||
        id.includes("plyr") ||
        id.includes("bulma")
      ) {
        return false;
      }
      return true;
    },
    // Отложенная гидрация для улучшения TBT
    componentIslands: true,
  },
  // Оптимизация features
  features: {
    inlineStyles: true, // Инлайн критические стили
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
      meta: [
        { name: "robots", content: "index, follow" },
        { property: "og:site_name", content: "Профитерм" },
        { property: "og:type", content: "website" },
        { property: "og:locale", content: "ru_RU" },
        { name: "twitter:site", content: "@profiterm" },
        {
          hid: "viewport",
          name: "viewport",
          content: "width=device-width, initial-scale=1",
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
        // Preconnect to Google Fonts for faster font loading
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "anonymous",
        },
        {
          rel: "preconnect",
          href: "https://fonts.googleapis.com",
        },
        // Preload critical fonts to avoid render-blocking
        {
          rel: "preload",
          href: "https://fonts.gstatic.com/s/montserrat/v29/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Hw5aXo.woff2",
          as: "font",
          type: "font/woff2",
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
    // Основные стили - критичные для первого рендера
    "@/assets/main.scss",
    // Bulma загружается асинхронно через плагин для уменьшения блокирующего CSS
  ],
  elementPlus: {
    importStyle: false, // Отключаем автоматический импорт CSS - загружаем асинхронно
    // Включаем только используемые компоненты
    components: [
      "ElBreadcrumb",
      "ElBreadcrumbItem",
      "ElButton",
      "ElCheckbox",
      "ElCollapse",
      "ElCollapseItem",
      "ElColorPicker",
      "ElDialog",
      "ElDrawer",
      "ElOption",
      "ElPageHeader",
      "ElPagination",
      "ElSelect",
      "ElTabs",
      "ElTabPane",
      "ElUpload",
      "ElInput",
      "ElForm",
      "ElFormItem",
      "ElMessage",
      "ElNotification",
    ],
  },
  // Настройки Swiper - импортируем только нужные модули
  swiper: {
    modules: ["autoplay", "navigation", "pagination", "effect-creative"],
    styleLang: "css",
    // Отключаем bundled стили - загружаем асинхронно через плагин
    bundled: false,
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
    "@zadigetvoltaire/nuxt-gtm",
    // "formidable",
    "@nuxtjs/seo",
    "nuxt-icon",
    "@zadigetvoltaire/nuxt-gtm",
    "@nuxt/image",
    [
      "@nuxtjs/google-fonts",
      {
        families: {
          Montserrat: [400, 500, 600, 700], // Только используемые веса
          Caveat: [400, 700], // Только используемые веса
        },
        display: "swap", // Не меняем шрифт после загрузки - предотвращает CLS
        preconnect: true,
        preload: true,
        download: true,
        inject: true,
        // subsets: ["latin", "cyrillic"], // Только нужные подмножества
      },
    ],
    [
      "yandex-metrika-module-nuxt3",
      {
        id: "74350936",
        webvisor: false, // Отключаем webvisor - значительно уменьшает нагрузку
        defer: true, // Отложенная загрузка
        clickmap: false, // Отключаем карту кликов
        trackLinks: true,
        accurateTrackBounce: true,
        noscript: false, // Не добавляем noscript версию
      },
    ],
  ],
  gtm: {
    id: "GTM-MBLWTCQ",
    enabled: true,
    debug: false,
    loadScript: true,
    defer: true, // Отложенная загрузка GTM
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
    // prerender: {
    //   failOnError: false,
    // },
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
      // Объединяем CSS в меньшее количество файлов
      devSourcemap: false,
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
      target: "esnext", // Современный JS для меньшего размера
      modulePreload: {
        polyfill: false, // Не добавляем полифил для modulepreload
      },
      rollupOptions: {
        output: {
          // Объединяем все CSS Element Plus в один файл
          assetFileNames: (assetInfo) => {
            // Группируем CSS файлы Element Plus
            if (assetInfo.name && assetInfo.name.endsWith('.css')) {
              if (assetInfo.name.includes('el-') || assetInfo.name.includes('element')) {
                return 'assets/element-plus.[hash].css';
              }
            }
            return 'assets/[name].[hash][extname]';
          },
          manualChunks(id) {
            // Более гранулярное разбиение чанков для лучшего кэширования
            if (id.includes("node_modules")) {
              // Element Plus - все в один чанк (включая CSS)
              if (id.includes("element-plus")) {
                return "vendor-element";
              }
              // Swiper - отдельный чанк
              if (id.includes("swiper")) {
                return "vendor-swiper";
              }
              // Vue runtime - критический
              if (id.includes("vue") || id.includes("@vue")) {
                return "vendor-vue";
              }
              // Pinia - state management
              if (id.includes("pinia")) {
                return "vendor-pinia";
              }
              // Plyr - видеоплеер
              if (id.includes("plyr")) {
                return "vendor-plyr";
              }
              // VueUse - утилиты
              if (id.includes("@vueuse")) {
                return "vendor-vueuse";
              }
              // Остальные мелкие зависимости
              return "vendor-misc";
            }
          },
        },
      },
      // Увеличиваем лимит для предупреждений о размере чанков
      chunkSizeWarningLimit: 500,
      // Объединяем CSS в один файл для уменьшения количества запросов
      cssCodeSplit: false,
      // Минификация CSS через lightningcss (быстрее и меньше)
      cssMinify: "lightningcss",
      // Минификация JS
      minify: "esbuild",
    },
    // Оптимизация зависимостей
    optimizeDeps: {
      include: ["vue", "vue-router", "pinia"],
      exclude: ["@element-plus/icons-vue"], // Исключаем неиспользуемые иконки
    },
    // Удаляем неиспользуемые локали Element Plus
    resolve: {
      alias: {
        "element-plus/dist/locale": "element-plus/dist/locale/ru.mjs",
      },
    },
  },
});
