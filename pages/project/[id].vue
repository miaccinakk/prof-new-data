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

useSeoMeta({
  title: seoTitle.value,
  ogTitle: seoTitle.value,
  description: seoDescription.value,
  ogDescription: seoDescription.value,
  ogImage: seoTImg.value,
  twitterCard: "summary_large_image",
});

// Add canonical URL and JSON-LD structured data
useHead({
  link: [
    {
      rel: "canonical",
      href: `https://profiterm.by/project/${route.params.id}`,
    },
  ],
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: project[0]?.title,
        description: project[0]?.seo_description || project[0]?.preview,
        image: project[0]?.img?.[0]?.url,
        author: {
          "@type": "Organization",
          name: "Профитерм",
          url: "https://profiterm.by",
        },
        publisher: {
          "@type": "Organization",
          name: "Профитерм",
          logo: {
            "@type": "ImageObject",
            url: "https://profiterm.by/profiterm.webp",
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `https://profiterm.by/project/${route.params.id}`,
        },
      }),
    },
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
            name: "Каталог",
            item: `https://profiterm.by/catalog/${project[0]?.category}`,
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
  ],
});
</script>

<template>
  <div class="bd-docs-main">
    <div class="container">
      <div class="content">
        <div v-if="error">{{ error.message }}</div>
        <div v-else v-for="item in project" :key="item._id">
          <ClientOnly>
            <Breadcrumb :links="breadcrumbLinks" />
          </ClientOnly>
          <div class="columns">
            <div class="column is-8">
              <h1 class="h1-project">{{ item.title }}</h1>
            </div>
          </div>

          <div class="project-block">
            <div class="project-item">
              <div class="project-block-city">{{ item.preview }}</div>
              <!-- <div class="project-block-info">{{ item.info }}</div> -->
              <div class="columns is-multiline">
                <div class="column is-6">
                  <div class="project-galeery">
                    <NuxtImg
                      v-for="imgurl in item.img"
                      :key="imgurl"
                      :src="imgurl.url"
                      :alt="`Фото проекта ${item.title}`"
                      class="view-box"
                      sizes="sm:400px md:400px lg:400px"
                      data-fancybox="galery galery"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div class="column is-6">
                  <div class="columns is-multiline mobail-colums-gal">
                    <div
                      v-for="(imgurl, idx) in item.galery"
                      :key="imgurl"
                      class="project-galeery-mini"
                    >
                      <NuxtImg
                        :src="imgurl.url"
                        class="view-box"
                        data-fancybox="galery galery"
                        :alt="`Фото проекта ${idx + 1} / ${item.title}`"
                        sizes="sm:300px md:300px lg:300px"
                        preload
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="item.video" class="project-video">
              <ProjectVideo
                v-model:VideoObject="item.video"
                v-model:visiblePlyr="visiblePlyr"
              />
            </div>
          </div>
          <div class="columns">
            <div class="column is-12">
              <div class="project-block-desc" v-html="item.description"></div>
            </div>
          </div>
          <ProjectReviews v-model:params="route.params.id" />
        </div>
      </div>
    </div>
  </div>
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
