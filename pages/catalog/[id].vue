<script setup>
const route = useRoute();
const router = useRouter();
const ParamsCat = ref(route.params.id);
const sortPage = ref(0);
const currentPage = ref(1);
const pageSize = ref(6);
const description = ref("");

// Обновление текущей страницы и sortPage на основе query параметра
if (router.currentRoute.value.query.page !== undefined) {
  currentPage.value = parseInt(router.currentRoute.value.query.page, 10);
  sortPage.value = currentPage.value * pageSize.value - pageSize.value;
}

// Создаем реактивный объект для body
const requestBody = computed(() => ({
  ParamsCat: ParamsCat.value,
  sortPage: sortPage.value,
  pageSize: pageSize.value,
}));

// Используем useFetch с реактивным body
const { data: project, refresh } = await useFetch("/api/projectindex", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
  body: requestBody,
});

// Обработчик изменения страницы
const handleCurrentChange = (val) => {
  if (val === 1) {
    sortPage.value = 0;
  } else {
    sortPage.value = val * pageSize.value - pageSize.value;
  }
  currentPage.value = val;

  router.replace({
    name: "catalog-id",
    query: {
      page: currentPage.value !== 1 ? currentPage.value : undefined,
    },
  });

  // refresh(); // Обновление данных при смене страницы
  scrollToTop();
};

// Установка описания для категории
const catDescription = (item) => {
  description.value = item;
};

// Функция прокрутки страницы вверх
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
</script>

<template>
  <div class="bd-docs-main">
    <div class="container">
      <div class="content">
        <!-- Navigation component for category -->
        <nav-category @catDescription="catDescription" />
        <!-- Display project items in a grid layout -->
        <div
          class="columns is-desktop is-multiline is-variable mobail-variable"
        >
          <div
            class="column is-4"
            v-for="item in project.result"
            :key="item._id"
          >
            <div class="catalog-block">
              <nuxt-link :to="`/project/` + item.kirilica">
                <div class="catalog-block-img">
                  <NuxtImg
                    v-for="imgurl in item.img"
                    :key="imgurl.url"
                    :src="imgurl.url"
                    preload
                    format="webp"
                    :alt="item.title"
                  />
                </div>
                <div class="catalog-block-desc">
                  <strong>{{ item.title }}</strong>
                  <span>{{ item.preview }}</span>
                </div>
              </nuxt-link>
            </div>
          </div>
        </div>

        <!-- Pagination component -->
        <el-pagination
          class="pagination-list"
          background
          layout="prev, pager, next"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="project.count"
          @current-change="handleCurrentChange"
        />
      </div>

      <!-- Display description if available -->

      <div class="dscription-cat" v-if="description" v-html="description"></div>
    </div>
  </div>
</template>
<style scoped lang="scss">
@use "@/assets/scss/mixins" as *;

.catalog-block {
  display: flex;
  height: 180px;
  margin-bottom: $spacing-md;

  a {
    display: flex;
    width: 100%;
    height: 100%;
    color: #000;
    text-decoration: none;
  }

  &-img {
    width: 50%;
    height: 100%;
    overflow: hidden;
    position: relative;

    img {
      @include img-cover;
      border-radius: 12px;
      box-shadow: 0 0 26px -14px #000000a8;
      display: block;
    }
  }

  &-desc {
    width: 50%;
    height: 100%;
    display: flex;
    align-items: center;
    padding-left: 15px;

    > strong {
      font-size: 16px;
      line-height: 1.4;
    }
  }
}
.dscription-cat {
  width: 100%;
  margin: 100px 0 20px;
  line-height: 1.6;
}
@media (max-width: 1023px) {
  .mobail-variable {
    float: left;
  }
  .dscription-cat {
    margin: 60px 0 0;
  }
  .catalog-block {
    flex-direction: column;
    height: auto;
    margin-bottom: 0px;

    &-img {
      height: 160px;
      width: 45%;
    }

    &-desc {
      height: 160px;
      width: 55%;

      > strong {
        font-size: 14px;
      }
    }
  }
}
</style>
