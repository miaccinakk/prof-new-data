<script setup>
const props = defineProps({
  currentId: {
    type: String,
    required: true,
  },
});

const { data: articles } = await useLazyFetch("/api/news", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
  body: {
    sortPage: 0,
    pageSize: { value: 4 },
  },
  key: `related-articles-${props.currentId}`,
  dedupe: "defer",
});

// Фильтруем текущую статью и берем только 3
const filteredArticles = computed(() => {
  if (!articles.value?.result) return [];
  return articles.value.result
    .filter((item) => item.kirilica !== props.currentId)
    .slice(0, 3);
});
</script>

<template>
  <section v-if="filteredArticles.length > 0" class="related-section" aria-label="Другие статьи">
    <h3 class="related-title">Читайте также</h3>
    <div class="related-carousel">
      <nuxt-link
        v-for="item in filteredArticles"
        :key="item._id"
        :to="`/article/${item.kirilica}`"
        class="related-card"
      >
        <NuxtImg
          v-if="item.img?.[0]?.url"
          :src="item.img[0].url"
          :alt="item.title"
          sizes="sm:300px md:280px lg:320px"
          loading="lazy"
          format="webp"
          class="related-card-img"
        />
        <div class="related-card-overlay"></div>
        <div class="related-card-content">
          <strong>{{ item.title }}</strong>
          <span v-if="item.subtitle">{{ item.subtitle }}</span>
        </div>
      </nuxt-link>
    </div>
    <div class="related-link">
      <nuxt-link to="/articles">
        Все статьи
        <Icon name="solar:arrow-right-linear" />
      </nuxt-link>
    </div>
  </section>
</template>

<style scoped lang="scss">
.related-section {
  @include float-full;
  margin: $spacing-xl 0 0;
  padding: $spacing-xl 0 0;
  border-top: 1px solid $color-border-light;
}

.related-title {
  font-size: 22px;
  font-weight: 600;
  color: $color-text-dark;
  margin: 0 0 $spacing-xl;
}

.related-carousel {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-lg;
}

.related-card {
  position: relative;
  display: block;
  text-decoration: none;
  border-radius: $border-radius-lg;
  overflow: hidden;
  aspect-ratio: 4 / 3;
  @include transition;

  &:hover {
    box-shadow: $shadow-lg;
    transform: translateY(-3px);

    .related-card-img {
      transform: scale(1.05);
    }
  }

  &-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    @include transition;
  }

  &-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.85) 0%,
      rgba(0, 0, 0, 0.4) 50%,
      rgba(0, 0, 0, 0.1) 100%
    );
    pointer-events: none;
  }

  &-content {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: $spacing-lg;
    color: #fff;
    z-index: 1;

    strong {
      display: block;
      font-size: 16px;
      font-weight: 600;
      line-height: 1.4;
      margin: 0 0 $spacing-xs;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    span {
      display: block;
      font-size: 13px;
      line-height: 1.4;
      opacity: 0.9;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }
}

.related-link {
  margin: $spacing-xl 0 0;
  text-align: center;

  a {
    display: inline-flex;
    align-items: center;
    gap: $spacing-xs;
    color: $color-secondary;
    font-size: 15px;
    font-weight: 500;
    @include transition;

    &:hover {
      color: $color-primary;
    }

    .icon {
      width: 18px;
      height: 18px;
    }
  }
}

// Mobile Styles - CSS Carousel
@media (max-width: 768px) {
  .related-section {
    margin: $spacing-lg 0 0;
    padding: $spacing-lg 0 0;
  }

  .related-title {
    font-size: 18px;
    margin: 0 0 $spacing-lg;
  }

  .related-carousel {
    display: flex;
    gap: $spacing-md;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    margin: 0 calc(-1 * $spacing-md);
    padding: 0 $spacing-md;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .related-card {
    flex: 0 0 85%;
    scroll-snap-align: start;
    aspect-ratio: 16 / 10;

    &-content {
      padding: $spacing-md;

      strong {
        font-size: 15px;
      }

      span {
        font-size: 12px;
      }
    }
  }

  .related-link {
    margin: $spacing-lg 0 0;

    a {
      font-size: 14px;
    }
  }
}
</style>
