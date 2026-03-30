// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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
        { rel: "canonical", href: "https://profiterm.by" }, // Без завершающего слэша
        { rel: "icon", type: "image/x-icon", href: "/favicon.png" },
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
    "@/assets/main.css",
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
    "@nuxt/image-edge",
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
    externals: {
      external: ["formidable"],
    },
  },
  auth: {
    baseURL: process.env.AUTH_ORIGIN,
    provider: {
      type: "authjs",
    },
  },
  image: {
    aliyun: {
      baseURL: "https://disk.profiterm.by/images/",
    },
  },
  // devtools: { enabled: true },
});
