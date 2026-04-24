<script setup>
const route = useRoute();
const router = useRouter();
const h1Category = ref("Статьи");
const breadcrumbLinks = ref([]);
const sortPage = ref(0);
const currentPage = ref(1);
const pageSize = ref(28);
const seoTitle = ref(
  "Статьи по монтажу систем отопления, водоснабжения и канализации."
);
const seoDescription = ref(
  "У нас вы узнаете особенности устройства тёплых полов, котельных, систем водоснабжения и канализации."
);
const seoTImg = ref("https://profiterm.by/profiterm.webp");

if (router.currentRoute.value.query.page !== undefined) {
  currentPage.value = parseInt(router.currentRoute.value.query.page);
  sortPage.value = currentPage.value * pageSize.value - pageSize.value;
}

const { data: news, refresh } = await useFetch("/api/news", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
  body: { sortPage, pageSize },
});
// Создаём отсортированные массивы
const level1 = computed(
  () => news.value?.result.filter((item) => item.level === 1) || []
);
const level2And3 = computed(
  () =>
    news.value?.result.filter((item) => item.level === 2 || item.level === 3) ||
    []
);
const otherLevels = computed(
  () => news.value?.result.filter((item) => item.level > 3) || []
);

const handleCurrentChange = (val) => {
  sortPage.value = val === 1 ? 0 : val * pageSize.value - pageSize.value;
  currentPage.value = val;
  router.replace({
    name: "articles",
    query: {
      page: currentPage.value !== 1 ? currentPage.value : undefined,
    },
  });
  refresh();
  scrollToTop();
};

watchEffect(() => {
  const toPath = route.params.id ? `/articles/${route.params.id}` : "/articles";
  breadcrumbLinks.value = [
    { label: "Главная", to: "/" },
    { label: h1Category.value, to: toPath },
  ];
});

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
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
      href: "https://profiterm.by/articles",
    },
  ],
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: seoTitle.value,
        description: seoDescription.value,
        url: "https://profiterm.by/articles",
        mainEntity: {
          "@type": "ItemList",
          itemListElement: [],
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
            item: "https://profiterm.by/articles",
          },
        ],
      }),
    },
  ],
});
</script>
<template>
  <div class="bd-docs-main main-article">
    <div class="container">
      <div class="content">
        <Breadcrumb :links="breadcrumbLinks" />
        <h1 class="h1-catalog">{{ h1Category }}</h1>
        <div class="columns is-desktop is-multiline is-variable">
          <div class="column is-8" v-for="item in level1" :key="item._id">
            <div class="article-block-top">
              <nuxt-link :to="`/article/` + item.kirilica">
                <div class="article-block-top-img">
                  <NuxtImg
                    v-for="imgurl in item.img"
                    :key="imgurl"
                    :src="imgurl.url"
                    format="webp"
                    :alt="item.title"
                  />
                  <div class="article-block-top-desc">
                    <strong>
                      {{ item.title }}
                    </strong>
                  </div>
                </div>
              </nuxt-link>
            </div>
          </div>
          <div class="column is-4">
            <div
              class="article-block-top-right"
              v-for="item in level2And3"
              :key="item._id"
            >
              <nuxt-link :to="`/article/` + item.kirilica">
                <div class="article-block-top-right-img">
                  <NuxtImg
                    v-for="imgurl in item.img"
                    :key="imgurl"
                    :src="imgurl.url"
                    loading="lazy"
                    format="webp"
                    :alt="item.title"
                  />
                  <div class="article-block-top-right-desc">
                    <strong>
                      {{ item.title }}
                    </strong>
                  </div>
                </div>
              </nuxt-link>
            </div>
          </div>
          <!-- <div class="column is-12"></div> -->
          <div class="column is-12">
            <div
              class="article-block"
              v-for="item in otherLevels"
              :key="item._id"
            >
              <nuxt-link :to="`/article/` + item.kirilica">
                <div class="article-block-img">
                  <NuxtImg
                    v-for="imgurl in item.img"
                    :key="imgurl"
                    :src="imgurl.url"
                    loading="lazy"
                    format="webp"
                    :alt="item.title"
                  />
                </div>
                <div class="article-block-desc">
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
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.main-article {
  margin: 80px 0 0;
}

.article-block {
  height: 180px;
  @include float-full;
  margin: 0 0 $spacing-xl;

  a {
    float: left;
    width: 100%;
    color: $color-black;
    height: 100%;
  }

  &-img {
    width: 250px;
    height: 100%;
    float: left;

    img {
      @include img-cover;
      border-radius: $border-radius-lg;
      box-shadow: $shadow-md;
    }
  }

  &-desc {
    padding: 0 0 0 $spacing-md;
    float: left;
    height: 180px;
    display: flex;
    align-items: center;
    width: 50%;

    > strong {
      @include float-full;
      margin: $spacing-lg 0 $spacing-lg;
      font-size: 21px;
      padding: 0 0 0 $spacing-lg;
      font-weight: 700;
      line-height: 1.5;
      text-transform: uppercase;
    }

    > span {
      @include float-full;
      height: 80px;
      display: none;
    }
  }

  &-top {
    @include float-full;
    height: 380px;

    a {
      float: left;
      width: 100%;
      color: $color-black;
      height: 100%;
    }

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
      padding: 60px 60px;
      float: left;
      height: 100%;
      align-items: flex-end;
      width: 100%;
      @include absolute-fill;
      display: flex;
      background: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 0.7) 100%
      );
      border-radius: $border-radius-lg;

      > strong {
        @include float-full;
        margin: 0px 0 0px;
        font-size: 26px;
        font-weight: 700;
        line-height: 1.6;
        color: $color-white;
      }
    }

    &-right {
      height: 180px;
      @include float-full;
      margin: 0px 0 $spacing-lg;

      a {
        float: left;
        width: 100%;
        color: $color-black;
        height: 100%;
      }

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
        padding: $spacing-lg $spacing-xxl;
        float: left;
        height: 100%;
        align-items: flex-end;
        width: 100%;
        @include absolute-fill;
        display: flex;
        background: linear-gradient(
          to bottom,
          rgba(0, 0, 0, 0) 0%,
          rgba(0, 0, 0, 0.7) 100%
        );
        border-radius: $border-radius-lg;

        > strong {
          @include float-full;
          margin: $spacing-lg 0 0px;
          font-size: 16px;
          font-weight: 700;
          line-height: 1.5;
          color: $color-white;
        }
      }
    }
  }
}

// Mobile Styles
@media (max-width: 1023px) {
  .article-block-top {
    margin: 0 0 $spacing-xl;
  }

  .h1-catalog {
    font-size: 18px !important;
    font-weight: 800 !important;
    line-height: 1.2 !important;
    margin: 0 0 $spacing-lg !important;
  }
}

@media (max-width: 768px) {
  .main-article {
    margin: $spacing-lg 0 0;
  }

  .article-block {
    height: auto;
    @include float-full;
    margin: 0 0 0px;
    border-bottom: 1px solid #bcbcbc;

    &-top {
      @include float-full;
      height: 280px;
      margin: 0 0 $spacing-lg;

      &-desc {
        padding: $spacing-lg;

        > strong {
          font-size: 22px;
        }
      }
    }

    &-img {
      display: none;
    }

    &-desc {
      width: 100%;
      height: auto;
      padding: $spacing-lg 0;

      > strong {
        @include float-full;
        margin: $spacing-sm 0 $spacing-sm;
        font-size: 19px;
        padding: 0 0 0 $spacing-sm;
        font-weight: 700;
        line-height: 1.5;
        text-transform: uppercase;
      }
    }

    &-top-right {
      height: 160px;

      &-desc {
        padding: $spacing-lg $spacing-lg;
      }
    }
  }
}
</style>
