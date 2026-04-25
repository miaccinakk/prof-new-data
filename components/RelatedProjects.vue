<script setup>
const props = defineProps({
  currentId: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: "",
  },
});

const { data: projects } = await useLazyFetch("/api/projectindex", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
  body: {
    sortPage: 0,
    pageSize: 4,
    category: props.category || undefined,
  },
  key: `related-projects-${props.currentId}`,
  dedupe: "defer",
});

// Фильтруем текущий проект и берем только 3
const filteredProjects = computed(() => {
  if (!projects.value?.result) return [];
  return projects.value.result
    .filter((item) => item.kirilica !== props.currentId)
    .slice(0, 3);
});
</script>

<template>
  <section v-if="filteredProjects.length > 0" class="related-section" aria-label="Другие проекты">
    <h3 class="related-title">Другие проекты</h3>
    <div class="related-grid">
      <nuxt-link
        v-for="item in filteredProjects"
        :key="item._id"
        :to="`/project/${item.kirilica}`"
        class="related-card"
      >
        <div class="related-card-img">
          <NuxtImg
            v-if="item.img?.[0]?.url"
            :src="item.img[0].url"
            :alt="item.title"
            sizes="sm:150px md:200px lg:280px"
            loading="lazy"
            format="webp"
          />
        </div>
        <div class="related-card-content">
          <strong>{{ item.title }}</strong>
          <span>{{ item.preview }}</span>
        </div>
      </nuxt-link>
    </div>
    <div class="related-link">
      <nuxt-link to="/catalog">
        Смотреть все проекты
        <Icon name="solar:arrow-right-linear" />
      </nuxt-link>
    </div>
  </section>
</template>

<style scoped lang="scss">
.related-section {
  @include float-full;
  margin: $spacing-xxl 0 0;
  padding: $spacing-xxl 0 0;
  border-top: 1px solid $color-border-light;
}

.related-title {
  font-size: 22px;
  font-weight: 600;
  color: $color-text-dark;
  margin: 0 0 $spacing-xl;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-lg;
}

.related-card {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: $color-text-dark;
  border-radius: $border-radius-lg;
  overflow: hidden;
  background: $color-bg-gray;
  @include transition;

  &:hover {
    box-shadow: $shadow-md;
    transform: translateY(-2px);
  }

  &-img {
    height: 160px;
    overflow: hidden;

    img {
      @include img-cover;
    }
  }

  &-content {
    padding: $spacing-md;

    strong {
      display: block;
      font-size: 15px;
      font-weight: 600;
      line-height: 1.4;
      margin: 0 0 $spacing-xs;
      color: $color-text-dark;
    }

    span {
      display: block;
      font-size: 13px;
      color: $color-text-medium;
      line-height: 1.4;
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

// Mobile Styles
@media (max-width: 768px) {
  .related-section {
    margin: $spacing-xl 0 0;
    padding: $spacing-xl 0 0;
  }

  .related-title {
    font-size: 18px;
    margin: 0 0 $spacing-lg;
  }

  .related-grid {
    grid-template-columns: 1fr;
    gap: $spacing-md;
  }

  .related-card {
    flex-direction: row;

    &-img {
      width: 120px;
      min-width: 120px;
      height: 100px;
    }

    &-content {
      padding: $spacing-sm $spacing-md;
      display: flex;
      flex-direction: column;
      justify-content: center;

      strong {
        font-size: 14px;
      }

      span {
        font-size: 12px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
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
