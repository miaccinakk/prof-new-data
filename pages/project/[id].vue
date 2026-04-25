<script setup>
const route = useRoute();
const router = useRouter();
const visiblePlyr = ref(false);
const breadcrumbLinks = ref([]);
const seoTitle = ref("");
const seoTImg = ref("");
const seoDescription = ref("");
const error = ref(null);

const project = await $fetch("/api/projectitem/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
  body: route.params.id,
});

seoTitle.value = project[0]?.seo_title;
seoDescription.value = project[0]?.seo_description;
seoTImg.value = project[0].img[0].url;
watchEffect(() => {
  if (project && project.length > 0) {
    const item = project[0];
    breadcrumbLinks.value = [
      { label: "Главная", to: "/" },
      { label: "Раздел", to: `/catalog/${item.category}` },
      { label: item.title, to: `/project/${item.kirilica}` },
    ];
  }
});

onMounted(async () => {
  setTimeout(() => {
    visiblePlyr.value = true;
  }, 1000); // Устанавливайте нужную вам задержку (в миллисекундах)
});

// Полная SEO оптимизация
useSeoMeta({
  // Основные мета-теги
  title: seoTitle.value,
  description: seoDescription.value,
  
  // Open Graph для социальных сетей
  ogType: "article",
  ogTitle: seoTitle.value,
  ogDescription: seoDescription.value,
  ogImage: seoTImg.value,
  ogImageWidth: "1200",
  ogImageHeight: "630",
  ogImageAlt: project[0]?.title,
  ogUrl: `https://profiterm.by/project/${route.params.id}`,
  ogSiteName: "Профитерм - Инженерные системы",
  ogLocale: "ru_RU",
  
  // Twitter Cards
  twitterCard: "summary_large_image",
  twitterTitle: seoTitle.value,
  twitterDescription: seoDescription.value,
  twitterImage: seoTImg.value,
  
  // Дополнительные мета-теги для SEO
  author: "Профитерм",
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  
  // Геолокация для локального SEO
  "geo.region": "BY",
  "geo.placename": "Беларусь",
});

// Собираем все изображения для галереи
const allImages = [
  ...(project[0]?.img || []).map((img: { url: string }) => img.url),
  ...(project[0]?.galery || []).map((img: { url: string }) => img.url),
];

// Расширенные структурированные данные для SEO
useHead({
  // Дополнительные мета-теги
  meta: [
    // Указываем язык контента
    { name: "content-language", content: "ru" },
    // Ключевые слова для страницы
    { 
      name: "keywords", 
      content: `${project[0]?.title}, инженерные системы, отопление, водоснабжение, канализация, Профитерм, Беларусь, ${project[0]?.preview}` 
    },
  ],
  link: [
    {
      rel: "canonical",
      href: `https://profiterm.by/project/${route.params.id}`,
    },
    // Альтернативные языковые версии (если есть)
    {
      rel: "alternate",
      hreflang: "ru",
      href: `https://profiterm.by/project/${route.params.id}`,
    },
  ],
  script: [
    // Schema.org - Проект как Product/Service
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        name: project[0]?.title,
        description: project[0]?.seo_description || project[0]?.preview,
        image: allImages,
        brand: {
          "@type": "Brand",
          name: "Профитерм",
        },
        offers: {
          "@type": "Offer",
          availability: "https://schema.org/InStock",
          priceCurrency: "BYN",
          seller: {
            "@type": "Organization",
            name: "Профитерм",
          },
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "5",
          reviewCount: "1",
        },
      }),
    },
    // Schema.org - Article для контента
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: project[0]?.title,
        description: project[0]?.seo_description || project[0]?.preview,
        image: allImages,
        datePublished: new Date().toISOString(),
        dateModified: new Date().toISOString(),
        author: {
          "@type": "Organization",
          name: "Профитерм",
          url: "https://profiterm.by",
          logo: "https://profiterm.by/profiterm.webp",
        },
        publisher: {
          "@type": "Organization",
          name: "Профитерм",
          logo: {
            "@type": "ImageObject",
            url: "https://profiterm.by/profiterm.webp",
            width: 200,
            height: 60,
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `https://profiterm.by/project/${route.params.id}`,
        },
        articleSection: "Проекты",
        inLanguage: "ru-RU",
      }),
    },
    // Schema.org - ImageGallery для изображений
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ImageGallery",
        name: `Галерея проекта: ${project[0]?.title}`,
        description: project[0]?.preview,
        image: allImages.map((url: string, index: number) => ({
          "@type": "ImageObject",
          url: url,
          name: `${project[0]?.title} - фото ${index + 1}`,
          description: `Фотография проекта ${project[0]?.title}`,
        })),
      }),
    },
    // Schema.org - BreadcrumbList для навигации
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Главная",
            item: "https://profiterm.by/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Каталог проектов",
            item: "https://profiterm.by/catalog",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: project[0]?.title,
            item: `https://profiterm.by/project/${route.params.id}`,
          },
        ],
      }),
    },
    // Schema.org - LocalBusiness для локального SEO
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "@id": "https://profiterm.by/#organization",
        name: "Профитерм",
        description: "Инженерные системы: отопление, водоснабжение, канализация в Беларуси",
        url: "https://profiterm.by",
        logo: "https://profiterm.by/profiterm.webp",
        image: "https://profiterm.by/profiterm.webp",
        telephone: "+375 (29) 123-45-67",
        address: {
          "@type": "PostalAddress",
          addressCountry: "BY",
          addressLocality: "Минск",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: "53.9",
          longitude: "27.5667",
        },
        areaServed: {
          "@type": "Country",
          name: "Беларусь",
        },
        priceRange: "$$",
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "18:00",
        },
      }),
    },
  ],
});
</script>

<template>
  <main class="bd-docs-main" itemscope itemtype="https://schema.org/Article">
    <div class="container">
      <article class="content">
        <div v-if="error" role="alert">{{ error.message }}</div>
        <div v-else v-for="item in project" :key="item._id">
          <ClientOnly>
            <nav aria-label="Навигация по сайту">
              <Breadcrumb :links="breadcrumbLinks" />
            </nav>
          </ClientOnly>
          
          <header class="project-header">
            <div class="columns">
              <div class="column is-8">
                <h1 class="h1-project" itemprop="headline">{{ item.title }}</h1>
              </div>
            </div>
          </header>

          <section class="project-block" aria-label="Информация о проекте">
            <div class="project-item">
              <p class="project-block-city" itemprop="description">{{ item.preview }}</p>
              
              <!-- Галерея изображений -->
              <figure class="columns is-multiline" role="group" aria-label="Галерея фотографий проекта">
                <div class="column is-6">
                  <div class="project-galeery">
                    <NuxtImg
                      v-for="(imgurl, imgIdx) in item.img"
                      :key="imgurl.url"
                      :src="imgurl.url"
                      :alt="`${item.title} - главное фото проекта инженерных систем ${item.preview}`"
                      :title="`${item.title} - инженерные системы Профитерм`"
                      class="view-box"
                      sizes="sm:400px md:400px lg:600px"
                      data-fancybox="galery"
                      loading="eager"
                      fetchpriority="high"
                      itemprop="image"
                    />
                  </div>
                </div>
                <div class="column is-6">
                  <div class="columns is-multiline mobail-colums-gal">
                    <div
                      v-for="(imgurl, idx) in item.galery"
                      :key="imgurl.url"
                      class="project-galeery-mini"
                    >
                      <NuxtImg
                        :src="imgurl.url"
                        class="view-box"
                        data-fancybox="galery"
                        :alt="`${item.title} - фото ${idx + 1}: ${item.preview}`"
                        :title="`Проект ${item.title} - изображение ${idx + 1}`"
                        sizes="sm:300px md:300px lg:400px"
                        :loading="idx < 4 ? 'eager' : 'lazy'"
                        itemprop="image"
                      />
                    </div>
                  </div>
                </div>
              </figure>
            </div>
            
            <!-- Видео проекта -->
            <aside v-if="item.video" class="project-video" aria-label="Видео проекта">
              <ProjectVideo
                :VideoObject="item.video"
                :visiblePlyr="visiblePlyr"
              />
            </aside>
          </section>
          
          <!-- Описание проекта -->
          <section class="columns" aria-label="Подробное описание проекта">
            <div class="column is-12">
              <div 
                class="project-block-desc" 
                v-html="item.description"
                itemprop="articleBody"
              ></div>
            </div>
          </section>
          
          <!-- Отзывы -->
          <section aria-label="Отзывы о проекте">
            <ProjectReviews :params="route.params.id" />
          </section>
        </div>
      </article>
    </div>
  </main>
</template>
<style scoped lang="scss">
@use "@/assets/scss/mixins" as *;
.project-block {
  &-city {
    margin: 0 0 $spacing-xl;
    @include float-full;
    font-weight: 600;
    font-size: 17px;
  }

  &-info {
    @include float-full;
    padding: 0 0px 0 0px;
  }

  &-desc {
    @include float-full;
    margin: 0px 0 70px;
    font-size: 16px;
  }
}

.project-item {
  @include float-full;
}

.project-galeery {
  height: 420px;
  @include float-full;

  &-mini {
    height: 222px;
    width: 50%;
    float: left;
    padding: 0.75rem;
    img {
      border-radius: 12px;
      @include img-cover;
    }
  }

  img {
    @include img-cover;
    border-radius: $border-radius-lg;
    cursor: pointer;
  }
}

.project-video {
  @include float-full;
  margin: 80px 0 70px;
  height: 550px;
  border-radius: $border-radius-xxl;
  overflow: hidden;

  :deep(.plyr--video) {
    height: 100%;
  }
}

.h1-project {
  margin: $spacing-xl 0 0 0;
}

.mobail-colums-gal {
  max-height: 444px;
  overflow: hidden;
  padding: 0 4px;
}

// Mobile Styles
@media (max-width: 1023px) {
  .h1-project {
    margin: $spacing-sm 0 0 0;
    font-size: 25px;
  }
  :deep(.item-rew > h2) {
    font-size: 1.35em;
    margin: 20px 0 30px;
  }
  .project-block-desc {
    margin: 0px 0 50px;
    font-size: 15px;
  }

  .project-video {
    margin: $spacing-xxl 0 $spacing-xxl;
    max-height: 360px;
    min-height: 200px;
    height: auto;
  }

  .project-galeery {
    height: 240px;
    margin: 0 0 7px;

    &-mini {
      height: 150px;
      padding: 0.35rem;
    }
  }

  .project-block-city {
    margin: 0 0 $spacing-md;
    font-size: 15px;
  }

  .mobail-colums-gal {
    margin-left: -0.35rem;
    margin-right: -0.35rem;
    overflow: hidden;
    padding: 0 4px;
  }
}
</style>
