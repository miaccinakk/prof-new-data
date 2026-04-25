<script setup>
const route = useRoute();
const h1Category = ref("Выполненные проекты");
const breadcrumbLinks = ref([]);
const seoTitle = ref("");
const seoDescription = ref("");
const description = ref("");
const seoTImg = ref("");
const emit = defineEmits(["catDescription"]);

// Загрузка данных о категории
const category = await $fetch("/api/category/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
});

if (route.params.id && category && category.length > 0) {
  const foundCategory = category.find(
    (cat) => cat.kirilica === route.params.id,
  );

  if (foundCategory) {
    h1Category.value = foundCategory.name;
    seoTitle.value = foundCategory.seo_title;
    seoDescription.value = foundCategory.seo_description;
    description.value = foundCategory.description;
    seoTImg.value = foundCategory.seo_image || "https://profiterm.by/profiterm.webp"; // Ensure seo_image exists in category data
  }
  emit("catDescription", description.value);
} else {
  const foundCategory = category.find((cat) => cat.kirilica === "");
  if (foundCategory) {
    seoTitle.value = foundCategory.seo_title;
    seoDescription.value = foundCategory.seo_description;
    description.value = foundCategory.description;
    seoTImg.value = "https://profiterm.by/profiterm.webp";
  }
  emit("catDescription", description.value);
}

// Обновление хлебных крошек при изменении `h1Category`
watchEffect(() => {
  if (h1Category.value && h1Category.value.length > 0) {
    const toPath = route.params.id ? `/catalog/${route.params.id}` : "/catalog";
    breadcrumbLinks.value = [
      { label: "Главная", to: "/" },
      { label: h1Category.value, to: toPath },
    ];
  }
});

// Обновление мета-данных
useSeoMeta({
  title: seoTitle.value,
  ogTitle: seoTitle.value,
  description: seoDescription.value,
  ogDescription: seoDescription.value,
  ogImage: seoTImg.value,
  ogUrl: canonicalUrl.value,
  twitterCard: "summary_large_image",
  twitterTitle: seoTitle.value,
  twitterDescription: seoDescription.value,
  twitterImage: seoTImg.value,
});

// Add canonical URL for catalog pages
const canonicalUrl = computed(() => {
  const basePath = route.params.id ? `/catalog/${route.params.id}` : "/catalog";
  return `https://profiterm.by${basePath}`;
});

useHead({
  link: [
    {
      rel: "canonical",
      href: canonicalUrl.value,
    },
  ],
});
</script>
<template>
  <div>
    <Breadcrumb :links="breadcrumbLinks" />
    <h1 class="h1-catalog">{{ h1Category }}</h1>
    <ModalForm />
    <div class="m-cat-nav">
      <div class="columns">
        <div class="column" v-for="item in category" :key="item._id">
          <nuxt-link class="nav-cat" :to="'/catalog/' + item.kirilica">
            <Icon v-if="item.img" :name="item.img" />
            {{ item.name }}
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
@use "@/assets/scss/mixins" as *;
.nav-cat {
  @include float-full;
  display: flex;
  align-items: center;
  padding: 0px 0 0 $spacing-xs;
  border-radius: 11px;
  line-height: 1.3;
  font-size: 13px;
  height: 60px;
  font-weight: 600;
  color: $color-text-dark;

  &.router-link-exact-active {
    background: $color-primary;
    color: $color-white;
  }

  > .icon {
    margin: 0 $spacing-sm 0 0;
    width: 35px;
  }
}

.m-cat-nav {
  margin: $spacing-xxl 0 $spacing-xl;
  @include float-full;
}
@media (max-width: 1023px) {
  .h1-catalog {
    font-size: 18px !important;
    font-weight: 800;
    line-height: 1.2;
    margin: 0 0 20px !important;
  }
  .nav-cat {
    padding: 0px 0 0 $spacing-sm;
    font-size: 13px;
    height: 50px;
    min-width: 190px;
  }

  .m-flex {
    display: flex !important;
  }

  .mobail-tabs {
    width: 100%;
    padding: 0 $spacing-md;
  }

  .m-cat-nav {
    margin: 0px 0 $spacing-lg;
    @include float-full;
  }
}
</style>
