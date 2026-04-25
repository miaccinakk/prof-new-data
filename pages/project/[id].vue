<script setup>
const route = useRoute();

const { data: project } = await useAsyncData("project", () =>
  $fetch("/api/projectitem/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: route.params.id,
  }),
);

const item = computed(() => project.value?.[0]);
const breadcrumbLinks = ref([]);

const allImages = computed(() => [
  ...(item.value?.img || []).map((img) => img.url),
  ...(item.value?.galery || []).map((img) => img.url),
]);

watchEffect(() => {
  if (project.value && project.value.length > 0) {
    const item = project.value[0];
    breadcrumbLinks.value = [
      { label: "Главная", to: "/" },
      { label: "Раздел", to: `/catalog/${item.category}` },
      { label: item.title, to: `/project/${item.kirilica}` },
    ];
  }
});

useSeoMeta({
  title: () => item.value?.seo_title,
  description: () => item.value?.seo_description,

  ogType: "article",
  ogTitle: () => item.value?.seo_title,
  ogDescription: () => item.value?.seo_description,
  ogImage: () => item.value?.img?.[0]?.url,
  ogImageWidth: "1200",
  ogImageHeight: "630",
  ogImageAlt: () => item.value?.title,
  ogUrl: () => `https://profiterm.by/project/${route.params.id}`,
  ogSiteName: "Профитерм - Инженерные системы",
  ogLocale: "ru_RU",

  twitterCard: "summary_large_image",
  twitterTitle: () => item.value?.seo_title,
  twitterDescription: () => item.value?.seo_description,
  twitterImage: () => item.value?.img?.[0]?.url,

  author: "Профитерм",

  "geo.region": "BY",
  "geo.placename": "Беларусь",
});

useHead({
  meta: [{ name: "content-language", content: "ru" }],

  link: [
    {
      rel: "canonical",
      href: () => `https://profiterm.by/project/${route.params.id}`,
    },
    {
      rel: "alternate",
      hreflang: "ru",
      href: () => `https://profiterm.by/project/${route.params.id}`,
    },
  ],
  script: [
    {
      type: "application/ld+json",
      children: () =>
        JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: item.value?.title,
          description: item.value?.seo_description || item.value?.preview,
          image: allImages.value,
          brand: {
            "@type": "Brand",
            name: "Профитерм",
          },
          offers: {
            "@type": "Offer",
            availability: "https://schema.org/InStock",
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
          author: {
            "@type": "Organization",
            name: "Профитерм",
          },
          publisher: {
            "@type": "Organization",
            name: "Профитерм",
            logo: {
              "@type": "ImageObject",
              url: "https://profiterm.by/profiterm.webp",
            },
          },
          datePublished: item.value?.createdAt,
          dateModified: item.value?.updatedAt,
        }),
    },
    {
      type: "application/ld+json",
      children: () =>
        JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ImageGallery",
          name: `Галерея проекта: ${item.value?.title}`,
          description: item.value?.preview,
          image: allImages.value.map((url, index) => ({
            "@type": "ImageObject",
            url,
            name: `${item.value?.title} - фото ${index + 1}`,
            description: `Фотография проекта ${item.value?.title}`,
          })),
        }),
    },
    {
      type: "application/ld+json",
      children: () =>
        JSON.stringify({
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
              name: item.value?.title,
              item: `https://profiterm.by/project/${route.params.id}`,
            },
          ],
        }),
    },
    {
      type: "application/ld+json",
      children: () =>
        JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "@id": "https://profiterm.by/#organization",
          name: "Профитерм",
          description:
            "Инженерные системы: отопление, водоснабжение, канализация в Беларуси",
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

const visiblePlyr = ref(false);

onMounted(() => {
  setTimeout(() => {
    visiblePlyr.value = true;
  }, 1000);
});
</script>

<template>
  <main class="bd-docs-main" itemscope itemtype="https://schema.org/Service">
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
              <h2 class="project-block-city" itemprop="location">
                Реализация проекта в {{ item.preview }}
              </h2>

              <!-- Галерея изображений -->
              <div class="columns is-multiline">
                <div class="column is-6">
                  <div class="project-galeery">
                    <NuxtImg
                      v-for="imgurl in item.img"
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
              </div>
            </div>

            <!-- Видео проекта -->
            <aside
              v-if="item.video"
              class="project-video"
              aria-label="Видео проекта"
            >
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
          <section aria-label="Отзыв">
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
