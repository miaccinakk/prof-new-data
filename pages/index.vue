<script setup>
import { useWindowSize } from "@vueuse/core";
import { useMainStore } from "~/store/maindata";

definePageMeta({
  title: "My index page",
  layout: "default",
});

// Async components for deferred loading - улучшает First Contentful Paint
const LazyIndexGalery = defineAsyncComponent(
  () => import("~/components/index/Galery.vue"),
);
const LazyIndexVideo = defineAsyncComponent(
  () => import("~/components/index/Video.vue"),
);
const LazyIndexSystem = defineAsyncComponent(
  () => import("~/components/index/System.vue"),
);
const LazyIndexNews = defineAsyncComponent(
  () => import("~/components/index/News.vue"),
);
const LazyIndexWork = defineAsyncComponent(
  () => import("~/components/index/Work.vue"),
);
const LazyIndexReviews = defineAsyncComponent(
  () => import("~/components/index/Reviews.vue"),
);

const mainData = useMainStore();
const monDataNav = ref([]);

// Non-blocking data fetch using lazy
mainData.fetchData();
monDataNav.value = mainData.getMain;

const seoTitle = computed(() =>
  monDataNav.value.length > 0
    ? monDataNav.value[0]?.seo_title
    : "Проектирование, монтаж систем отопления, водоснабжения, канализации",
);
const seoDescription = computed(() =>
  monDataNav.value.length > 0
    ? monDataNav.value[0]?.seo_description
    : "Предлагаем приемлемые цены, гарантию до 5 лет и рассрочку платежа. Высококачественные инженерные системы для комфортного и беззаботного проживания в частном доме.",
);

const { width } = useWindowSize();
const windowWidth = ref(width.value);
const descGal = ref("");
const isVideoLoaded = ref(false);
const isContentVisible = ref(false);

// Use lazy fetch to not block initial render
const { data: main, pending } = await useLazyFetch("/api/main/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
  server: true,
  transform: (data) => data, // Кэширование данных
});

// Watch for data changes to set descGal
watch(
  main,
  (newMain) => {
    if (newMain?.one) {
      for (let item in newMain.one) {
        if (newMain.one[item] && newMain.one[item]["description"]) {
          descGal.value = newMain.one[item]["description"];
          break;
        }
      }
    }
  },
  { immediate: true },
);

watchEffect(() => {
  windowWidth.value = width.value;
});

const videos = computed(() => {
  if (!main.value?.one) return [];
  return main.value.one.map((item) => {
    const isDesktop = windowWidth.value >= 700;
    return {
      ...item,
      videos: isDesktop ? item.video : item.video_mobail,
      poster:
        isDesktop && item.img?.[0]
          ? item.img[0].url
          : item.img?.[1]
            ? item.img[1].url
            : null,
    };
  });
});

onMounted(() => {
  // Показываем контент быстрее
  requestAnimationFrame(() => {
    isContentVisible.value = true;
  });

  // Отложенная загрузка видео после первого рендера
  requestIdleCallback?.(() => {
    isVideoLoaded.value = true;
  }) ||
    setTimeout(() => {
      isVideoLoaded.value = true;
    }, 800);
});

useSeoMeta({
  title: seoTitle.value,
  ogTitle: seoTitle.value,
  description: seoDescription.value,
  ogDescription: seoDescription.value,
  ogImage: "/profiterm.webp",
  twitterCard: "summary_large_image",
  canonical: "https://profiterm.by/",
});
</script>

<template>
  <div class="bd-docs-main">
    <!-- Hero section with video - показываем постер сразу -->
    <div class="cover-video-index">
      <div class="video-index" v-for="(item, index) in videos" :key="index">
        <!-- Показываем постер как фон пока видео загружается -->
        <div
          v-if="item.poster && !isVideoLoaded"
          class="video-poster-fallback"
          :style="{ backgroundImage: `url(${item.poster})` }"
        ></div>

        <ClientOnly>
          <video
            v-if="isVideoLoaded && item.videos?.[0]?.url"
            muted
            autoplay
            loop
            webkit-playsinline
            playsinline
            preload="none"
            :poster="item.poster"
          >
            <source :src="item.videos[0].url" type="video/mp4" />
          </video>
        </ClientOnly>
        <div class="container">
          <div class="video-block-inf">
            <h1>{{ item.title }}</h1>
            <h2 v-html="item.preview"></h2>
            <ModalForm />
          </div>
        </div>
        <div class="cover-image-fon"></div>
      </div>
    </div>

    <!-- Main content with lazy loaded components -->
    <div class="container">
      <div class="content index-content">
        <Suspense>
          <LazyIndexGalery
            v-if="main?.two"
            v-model:galery="main.two"
            v-model:description="descGal"
          />
          <template #fallback>
            <div class="skeleton-loader" style="height: 400px"></div>
          </template>
        </Suspense>

        <Suspense>
          <LazyIndexVideo v-if="main?.three" v-model:video="main.three" />
          <template #fallback>
            <div class="skeleton-loader" style="height: 300px"></div>
          </template>
        </Suspense>

        <Suspense>
          <LazyIndexSystem />
          <template #fallback>
            <div class="skeleton-loader" style="height: 400px"></div>
          </template>
        </Suspense>

        <Suspense>
          <LazyIndexNews />
          <template #fallback>
            <div class="skeleton-loader" style="height: 200px"></div>
          </template>
        </Suspense>

        <div class="index-calk">
          <span
            >Для определения стоимости работ Вы можете сов��ршить предварительный
            расчёт!</span
          >
          <nuxt-link to="/calculator">Перейти к расчёту</nuxt-link>
        </div>

        <ClientOnly>
          <Suspense>
            <LazyIndexWork />
            <template #fallback>
              <div class="skeleton-loader" style="height: 300px"></div>
            </template>
          </Suspense>
        </ClientOnly>

        <Suspense>
          <LazyIndexReviews />
          <template #fallback>
            <div class="skeleton-loader" style="height: 300px"></div>
          </template>
        </Suspense>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.index-content {
  h4 {
    color: $color-text-medium !important;
    font-size: 22px !important;
    margin: 0 0 $spacing-lg !important;
    font-weight: 700 !important;
    text-transform: uppercase;

    .icon {
      margin: -2px $spacing-sm 0 0%;
      color: $color-secondary;
      display: none;
    }
  }
}

.cover-video-index {
  background: $color-white;
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100vh;
}

.video-index {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: #e2e2e2;

  > video {
    @include img-cover;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }

  :deep(.index-b-modal) {
    background-color: transparent !important;
    color: $color-white !important;
    box-shadow: $shadow-lg;
    padding: 7px $border-radius-lg;
    border-radius: $border-radius-md !important;
    font-weight: 400;
    height: auto;
    font-size: 16px !important;
    border: 1px solid $color-white !important;

    &:hover {
      background-color: $color-white !important;
      border-color: $color-white !important;
      box-shadow: rgba(8, 27, 75, 0.35) 0px 2px 0px;
      @include transition;
      color: $color-text-dark !important;
    }
  }
}

.cover-image-fon {
  @include absolute-fill;
  background: linear-gradient(-1deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3));
}

.video-block-inf {
  display: flex;
  align-items: baseline;
  padding: 210px 0 100px;
  border-radius: 22px;
  color: $color-white;
  flex-flow: column;
  justify-content: center;
  z-index: 22;
  position: relative;

  > h1 {
    color: $color-white;
    width: 60%;
    font-size: 40px;
    font-weight: 500;
    line-height: 1.4;
  }

  > h2 {
    width: 50%;
    font-size: 17px;
    font-weight: 500;
    margin: $spacing-lg 0 80px;
  }
}

.index-calk {
  padding: $spacing-xxl;
  margin: 70px 0 70px;
  border: 3px dotted $color-border-light;
  border-radius: $spacing-md;
  @include flex-column;
  gap: $spacing-lg;

  span {
    font-size: 18px;
    line-height: 1.4;
    max-width: 800px;
    color: #757575;
  }

  a {
    background-color: transparent;
    color: #131313;
    box-shadow: $shadow-lg;
    padding: $spacing-sm $border-radius-lg;
    border-radius: $border-radius-md;
    height: auto;
    font-size: 16px !important;
    border: 1px solid #5d5d5d;
    width: 210px;
    text-align: center;
    margin: $spacing-md 0 0;

    &:hover {
      @include transition;
      box-shadow: rgba(8, 27, 75, 0.65) 0px 6px 20px -6px;
      border: 1px solid $color-white;
      color: $color-black;
    }
  }
}

.video-poster-fallback {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  z-index: 0;
}

.skeleton-loader {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: $border-radius-md;
  margin: $spacing-lg 0;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

// Mobile Styles
@media (max-width: 1023px) {
  .index-calk {
    padding: $spacing-lg;
    margin: $spacing-xxl 0 50px;

    span {
      font-size: 16px;
      line-height: 1.6;
      max-width: 800px;
      color: #757575;
    }

    a {
      padding: $spacing-sm $border-radius-lg;
      font-size: 15px !important;
      width: 200px;
      margin: $spacing-xs 0 0;
    }
  }

  .cover-video-index {
    height: auto;
    overflow: visible;
  }

  .index-content {
    h4 {
      margin: 0 0 0px !important;
      font-size: 17px !important;

      &.rev-h4 {
        margin: $spacing-xxl 0 0 0 !important;
      }

      &.stage-h4 {
        margin: 0px 0 $spacing-sm 0 !important;
      }
    }
  }

  .video-index {
    margin: 0 0 55px;
    height: auto;
    position: relative;
    padding: 66px 0 $spacing-xxl;

    :deep(.index-b-modal) {
      font-size: 14px !important;
      padding: 7px $border-radius-lg !important;
      margin: 0 0 0px !important;
    }
  }

  .video-block-inf {
    padding: 35px 0px $spacing-md;

    > h1 {
      width: 100%;
      font-size: 21px;
      line-height: 1.5;
    }

    > h2 {
      width: 100%;
      margin: 46px 0 42px;
      font-size: 15px;
      opacity: 0.8;
      line-height: 1.5;
    }
  }
}
</style>
