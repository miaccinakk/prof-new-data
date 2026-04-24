<script setup>
const h4Category = ref("Статьи");
const { data: news } = await useFetch("/api/news", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
  body: JSON.stringify({ 
    levelFilter: true,
    selectFields: true,  // Запрашиваем только нужные поля
    pageSize: 3          // Ограничиваем до 3 статей
  }),
  lazy: true,
  key: 'index-news',     // Уникальный ключ для дедупликации
});
</script>
<template>
  <div class="columns is-multiline">
    <div class="column is-12">
      <h4 class="index-h4">{{ h4Category }}</h4>
    </div>

    <div class="column is-12">
      <div class="columns is-multiline">
        <div
          class="column is-4"
          v-for="(item, index) in news.result"
          :key="item._id"
        >
          <div class="article-index" :class="{ 'border-none': index === 2 }">
            <nuxt-link :to="`/article/` + item.kirilica">
              <strong>
                {{ item.title }}
              </strong>
            </nuxt-link>
          </div>
        </div>
        <div class="column is-12">
          <div class="article-all">
            <nuxt-link to="/articles">
              Все статьи
              <Icon name="healthicons:register-book-outline" />
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.article-all {
  margin: $spacing-lg 0 0 0;

  a {
    color: $color-text-dark;
    font-size: 23px;
    font-family: $font-family-accent !important;
    font-weight: 500;
    color: #333;
  }
}

.article-index {
  a {
    color: #303030;
    font-family: Caveat !important;
    font-size: 23px;
    font-weight: 500;
    strong {
      font-size: $spacing-lg;
      color: #303030;
    }
  }
}

// Mobile Styles
@media (max-width: 768px) {
  .article-all {
    margin: -10px 0 $spacing-md 0;
  }

  .article-index {
    margin: 0 0 0px;
    padding: 0 0 $spacing-md;
    border-bottom: 1px solid $color-border-light;

    a strong {
      font-size: 16px;
      color: #303030;
    }
  }

  .border-none {
    border: none;
  }
}
</style>
