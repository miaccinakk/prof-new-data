<script setup>
// Получаем категории
const { data: categories } = await useFetch("/api/category/", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=UTF-8" },
});

// Получаем проекты
const { data: projects } = await useFetch("/api/project/", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=UTF-8" },
});

// Получаем статьи
const { data: articles } = await useFetch("/api/news/", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=UTF-8" },
});

// Группируем проекты по категориям
const projectsByCategory = computed(() => {
  if (!projects.value || !categories.value) return {};
  
  const grouped = {};
  categories.value.forEach((cat) => {
    grouped[cat.kirilica] = {
      name: cat.name,
      projects: projects.value.filter((p) => p.category === cat.kirilica),
    };
  });
  return grouped;
});

// SEO
const title = "Карта сайта | Профитерм";
const description = "Полная структура сайта Профитерм: разделы, категории работ, проекты и статьи. Удобная навигация по всем страницам.";

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
  ogUrl: "https://profiterm.by/sitemap",
  twitterCard: "summary_large_image",
  twitterTitle: title,
  twitterDescription: description,
});

useHead({
  link: [{ rel: "canonical", href: "https://profiterm.by/sitemap" }],
});
</script>

<template>
  <main class="bd-docs-main sitemap-page">
    <div class="container">
      <h1 class="sitemap-title">Карта сайта</h1>

      <div class="sitemap-grid">
        <!-- Основные разделы -->
        <section class="sitemap-section">
          <h2 class="sitemap-section-title">Разделы</h2>
          <ul class="sitemap-list sitemap-list--main">
            <li><nuxt-link to="/">Главная</nuxt-link></li>
            <li><nuxt-link to="/catalog">Наши работы</nuxt-link></li>
            <li><nuxt-link to="/calculator">Калькулятор стоимости</nuxt-link></li>
            <li><nuxt-link to="/installment">Рассрочка платежа</nuxt-link></li>
            <li><nuxt-link to="/articles">Статьи</nuxt-link></li>
            <li><nuxt-link to="/about">О компании</nuxt-link></li>
            <li><nuxt-link to="/contacts">Контакты</nuxt-link></li>
          </ul>
        </section>

        <!-- Категории работ -->
        <section class="sitemap-section">
          <h2 class="sitemap-section-title">Категории работ</h2>
          <ul class="sitemap-list">
            <li v-for="cat in categories" :key="cat._id">
              <nuxt-link :to="`/catalog/${cat.kirilica}`">{{ cat.name }}</nuxt-link>
            </li>
          </ul>
        </section>

        <!-- Проекты по категориям -->
        <section class="sitemap-section sitemap-section--wide">
          <h2 class="sitemap-section-title">Проекты</h2>
          <div class="sitemap-projects">
            <div 
              v-for="(catData, catKey) in projectsByCategory" 
              :key="catKey"
              class="sitemap-category"
            >
              <h3 class="sitemap-category-title">{{ catData.name }}</h3>
              <ul class="sitemap-list sitemap-list--projects">
                <li v-for="project in catData.projects" :key="project._id">
                  <nuxt-link :to="`/project/${project.kirilica}`">{{ project.title }}</nuxt-link>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <!-- Статьи -->
        <section class="sitemap-section sitemap-section--wide">
          <h2 class="sitemap-section-title">Статьи</h2>
          <ul class="sitemap-list sitemap-list--articles">
            <li v-for="article in articles" :key="article._id">
              <nuxt-link :to="`/article/${article.kirilica}`">{{ article.title }}</nuxt-link>
            </li>
          </ul>
        </section>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
.sitemap-page {
  padding: $spacing-xxl 0;
  min-height: 60vh;
}

.sitemap-title {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 $spacing-xxl;
  color: $color-text-dark;
}

.sitemap-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-xl;
}

.sitemap-section {
  background: $color-bg-light;
  padding: $spacing-lg;
  border-radius: $border-radius-lg;

  &--wide {
    grid-column: 1 / -1;
  }
}

.sitemap-section-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 $spacing-md;
  color: $color-text-dark;
  padding-bottom: $spacing-sm;
  border-bottom: 2px solid $color-primary;
  display: inline-block;
}

.sitemap-list {
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    margin-bottom: $spacing-xs;
  }

  a {
    color: $color-text-medium;
    text-decoration: none;
    font-size: 15px;
    @include transition;

    &:hover {
      color: $color-primary;
    }
  }

  &--main a {
    font-weight: 500;
    font-size: 16px;
  }

  &--projects,
  &--articles {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: $spacing-xs $spacing-lg;
  }
}

.sitemap-projects {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: $spacing-lg;
}

.sitemap-category {
  background: rgba(255, 255, 255, 0.5);
  padding: $spacing-md;
  border-radius: $border-radius-md;
}

.sitemap-category-title {
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 $spacing-sm;
  color: $color-text-dark;
}

// Mobile Styles
@media (max-width: 768px) {
  .sitemap-page {
    padding: $spacing-xl $spacing-lg;
  }

  .sitemap-title {
    font-size: 24px;
    margin-bottom: $spacing-xl;
  }

  .sitemap-grid {
    grid-template-columns: 1fr;
    gap: $spacing-lg;
  }

  .sitemap-section {
    padding: $spacing-md;
  }

  .sitemap-section-title {
    font-size: 16px;
  }

  .sitemap-list a {
    font-size: 14px;
  }

  .sitemap-list--projects,
  .sitemap-list--articles {
    grid-template-columns: 1fr;
  }

  .sitemap-projects {
    grid-template-columns: 1fr;
  }
}
</style>
