<script setup>
const route = useRoute();
const router = useRouter();
const pageSize = 6;
const description = ref("");

// Вычисляем начальную страницу из query параметра
const initialPage = parseInt(route.query.page) || 1;
const currentPage = ref(initialPage);
const sortPage = computed(() => {
  return currentPage.value === 1 ? 0 : (currentPage.value - 1) * pageSize;
});

const { data: project, refresh } = await useFetch("/api/projectindex", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
  body: computed(() => ({
    sortPage: sortPage.value,
    pageSize: pageSize,
  })),
  watch: [sortPage],
});

const handleCurrentChange = async (val) => {
  currentPage.value = val;
  router.replace({
    name: "catalog",
    query: {
      page: val !== 1 ? val : undefined,
    },
  });
  scrollToTop();
};
const catDescription = (item) => {
  description.value = item;
};
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
</script>

<template>
  <div class="bd-docs-main">
    <div class="container">
      <div class="content">
        <nav-category @catDescription="catDescription" />
        <div
          class="columns is-desktop is-multiline is-variable mobail-variable"
        >
          <div
            class="column is-4"
            v-for="item in project?.result"
            :key="item._id"
          >
            <div
              class="catalog-block"
              v-if="Array.isArray(item.img) && item.img.length"
            >
              <nuxt-link :to="`/project/` + item.kirilica">
                <div class="catalog-block-img">
                  <NuxtImg
                    v-for="imgurl in item.img"
                    :key="imgurl"
                    :src="imgurl.url"
                    preload
                    format="webp"
                    :alt="item.title"
                  />
                </div>
                <div class="catalog-block-desc">
                  <strong>
                    {{ item.title }}
                  </strong>
                  <span>
                    {{ item.preview }}
                  </span>
                </div>
              </nuxt-link>
            </div>
          </div>
        </div>
        <el-pagination
          v-if="project?.count"
          class="pagination-list"
          background
          layout="prev, pager, next"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="project.count"
          @current-change="handleCurrentChange"
        />
      </div>
      <div v-if="description" class="dscription-cat" v-html="description"></div>
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
  float: left;
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
