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
    inlineSSRStyles: true, // Инлайним критические CSS в HTML
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
    // Element Plus - один объединённый файл вместо отдельных чанков
    "element-plus/dist/index.css",
    "@/assets/main.scss",
    "@/node_modules/bulma/css/bulma.css",
    // Plyr CSS загружается динамически в ModalVideo.vue
  ],
  elementPlus: {
    importStyle: false, // Отключаем автоматический импорт стилей - загрузим вручную
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
    // Отключаем автоматический импорт стилей - загружаем асинхронно
    bundled: true,
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
          Montserrat: [400, 500, 600, 700], // Только используемые веса
          Caveat: [400, 700], // Только используемые веса
        },
        display: "optional", // Не меняем шрифт после загрузки - предотвращает CLS
        preconnect: true,
        preload: true,
        download: true,
        inject: true,
        subsets: ["latin", "cyrillic"], // Только нужные подмножества
      },
    ],
    [
      "yandex-metrika-module-nuxt3",
      {
        id: "74350936",
        webvisor: true,
        defer: true, // Отложенная загрузка
        clickmap: false, // Отключаем карту кликов (уменьшает нагрузку)
        trackLinks: true,
        accurateTrackBounce: true,
      },
    ],
  ],
  gtm: {
    id: "GTM-MBLWTCQ",
    defer: true, // Отложенная загрузка GTM
    compatibility: false, // Отключаем совместимость со старыми браузерами
    loadScript: true,
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
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Более гранулярное разбиение чанков
            if (id.includes("node_modules")) {
              if (id.includes("element-plus")) {
                return "vendor-element";
              }
              if (id.includes("swiper")) {
                return "vendor-swiper";
              }
              if (
                id.includes("vue") ||
                id.includes("pinia") ||
                id.includes("@vue")
              ) {
                return "vendor-vue";
              }
              if (id.includes("plyr")) {
                return "vendor-plyr";
              }
              // Остальные зависимости в общий vendor
              return "vendor";
            }
          },
        },
      },
      // Увеличиваем лимит для предупреждений о размере чанков
      chunkSizeWarningLimit: 500,
      // Объединяем CSS в один файл для уменьшения количества запросов
      cssCodeSplit: false,
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
