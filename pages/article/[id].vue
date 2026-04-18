<script setup>
const route = useRoute();
import { Fancybox } from "@fancyapps/ui";
const breadcrumbLinks = ref([]);
const seoTitle = ref("");
const seoTImg = ref("");
const seoDescription = ref("");
const error = ref(null);

const article = await $fetch("/api/newsitem/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
  body: route.params.id,
});

const visible = ref(false);
const objectVideo = computed(() => article?.video);

seoTitle.value = article?.seo_title;
seoDescription.value = article?.seo_description;
seoTImg.value = article.img[0].url;
watchEffect(() => {
  if (article) {
    const item = article;
    breadcrumbLinks.value = [
      { label: "Главная", to: "/" },
      { label: "Статьи", to: `/articles/` },
      { label: item.title, to: `/article/${item.kirilica}` },
    ];
  }
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
      href: `https://profiterm.by/article/${route.params.id}`,
    },
  ],
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article?.title,
        description: article?.seo_description || article?.subtitle,
        image: article?.img?.[0]?.url,
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
          "@id": `https://profiterm.by/article/${route.params.id}`,
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
            name: "Статьи",
            item: "https://profiterm.by/articles/",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: article?.title,
            item: `https://profiterm.by/article/${route.params.id}`,
          },
        ],
      }),
    },
  ],
});
const plyr = async () => {
  const Plyr = await import("plyr");
  new Plyr.default("#y" + objectVideo.value);
};
const openModal = () => {
  visible.value = true;
  plyr();
};

const galleryImages = ref([]);

const openGallery = () => {
  // Ищем первый реальный img внутри .article-galeery
  const firstImage = document.querySelector(".article-galeery-mini .view-box");

  if (firstImage) {
    firstImage.click(); // Имитация клика
  } else {
    console.error("Первое изображение не найдено!");
  }
};
</script>

<template>
  <div class="bd-docs-main">
    <div class="container">
      <div class="content">
        <div v-if="error">{{ error.message }}</div>

        <ClientOnly>
          <Breadcrumb :links="breadcrumbLinks" />
        </ClientOnly>
        <div class="columns">
          <div class="column is-12">
            <div class="article-top">
              <div class="article-top-img">
                <NuxtImg
                  v-for="imgurl in article.img"
                  :key="imgurl"
                  :src="imgurl.url"
                  loading="lazy"
                  format="webp"
                  :alt="article.title"
                />
                <div class="article-top-desc">
                  <h1>
                    {{ article.title }}
                  </h1>
                  <strong>{{ article.subtitle }}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="columns">
          <div class="column is-12">
            <div class="article-desc" v-html="article.description"></div>
          </div>
        </div>
        <div class="columns">
          <div v-if="article.galery.length > 0" class="column is-6">
            <div class="article-galeery" @click="openGallery">
              <div class="article-galeery-button">
                <span>Галерея</span><Icon name="solar:gallery-wide-broken" />
              </div>
              <div
                v-for="(imgurl, idx) in article.galery"
                :key="imgurl"
                class="article-galeery-mini"
                v-show="idx < 4"
              >
                <NuxtImg
                  :src="imgurl.url"
                  class="view-box"
                  ref="galleryImages"
                  data-fancybox="galery galery"
                  :alt="`Фото проекта ${idx + 1} / ${article.title}`"
                  sizes="sm:300px md:300px lg:300px"
                  preload
                />
              </div>
            </div>
          </div>
          <div v-if="article.video" class="column is-6">
            <div class="article-video" @click="openModal()">
              <div class="article-galeery-button">
                <span>Видео</span
                ><Icon name="solar:video-frame-play-horizontal-broken" />
              </div>
            </div>
          </div>
        </div>
        <div class="columns">
          <div class="column is-12">
            <div class="book-share">
              <strong>Поделиться</strong>
              <div class="book-share-right">
                <Share />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ClientOnly>
      <el-dialog class="video-gal article-modal" v-model="visible">
        <div class="video-gal-item">
          <div
            :id="'y' + objectVideo"
            data-plyr-provider="youtube"
            :data-plyr-embed-id="objectVideo"
          ></div>
        </div>
      </el-dialog>
    </ClientOnly>
  </div>
</template>
<style scoped lang="scss">
.article-top {
  @include float-full;
  height: 480px;
  margin: $spacing-xl 0 0 0;

  &-img {
    width: 100%;
    height: 100%;
    float: left;
    position: relative;

    img {
      @include img-cover;
      border-radius: $border-radius-lg;
      box-shadow: $shadow-md;
    }
  }

  &-desc {
    position: absolute;
    padding: $spacing-xxl 8%;
    float: left;
    height: 100%;
    width: 100%;
    @include absolute-fill;
    display: flex;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.7) 100%
    );
    border-radius: $border-radius-lg;
    @include flex-column;
    justify-content: center;
    align-items: flex-start;

    strong {
      color: $color-white;
      font-weight: 500;
      font-size: 19px;
      line-height: 1.7;
      max-width: 600px;
    }
  }

  h1 {
    @include float-full;
    margin: 0px 0 $spacing-lg;
    font-size: 33px;
    font-weight: 700;
    line-height: 1.4;
    color: $color-white;
    max-width: 600px;
  }
}

.article-desc {
  @include float-full;
  margin: $spacing-xl 0 $spacing-xl;
  font-size: 16px;

  p {
    margin-bottom: 0.4em !important;
    line-height: 1.6;
  }
}

.article-galeery {
  height: 160px;
  @include float-full;
  background: $color-white;
  border: 3px dashed #acacac;
  border-radius: $border-radius-lg;

  &-mini {
    height: 100%;
    width: 33.3333333%;
    float: left;
    opacity: 0;
    height: 0;
    width: 0;
  }

  img {
    @include img-cover;
    border-radius: $border-radius-lg;
    cursor: pointer;
  }

  &-button {
    width: 100%;
    height: 100%;
    @include flex-center;
    @include flex-column;
    cursor: pointer;

    span {
      color: #2a2a2a;
      font-weight: 500;
      margin: 0 0 $spacing-xs;
      font-size: 16px;
    }

    .icon {
      height: $spacing-xxl;
      width: $spacing-xxl;
      color: #2a2a2a;
    }
  }
}

.article-video {
  height: 160px;
  @include float-full;
  background: $color-white;
  border: 3px dashed #acacac;
  border-radius: $border-radius-lg;
  cursor: pointer;

  :deep(.plyr--video) {
    height: 100%;
  }
}

.book-share {
  display: inline-block;
  margin: $spacing-sm 0 0 0;

  > strong {
    margin: 0 0 $spacing-sm;
    font-weight: 600;
  }

  &-right {
    display: flex;
    margin: $spacing-sm 0 0 0;

    :deep(.button) {
      width: $spacing-xxl;
      height: $spacing-xxl;
      background-color: #f5f8fc;
      border-color: #f5f8fc;
      @include transition;
      color: #4d4d4d;
      margin: 0 $spacing-sm 0 0px;
    }
  }
}

// Mobile Styles
@media (max-width: 768px) {
  .article-galeery,
  .article-video {
    height: 110px;
    margin: 0 0 $spacing-lg;
  }

  .article-galeery-button .icon {
    width: $spacing-xl;
  }

  .article-top {
    height: 350px;
    margin: 0px 0 0 0;

    h1 {
      @include float-full;
      margin: 0px 0 $spacing-lg;
      font-size: $spacing-lg;
    }

    &-desc {
      background: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0) -101%,
        rgba(0, 0, 0, 0.7) 100%
      );

      strong {
        color: $color-white;
        font-weight: 500;
        font-size: 14px;
      }
    }
  }
}
</style>
