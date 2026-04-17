<script setup>
const route = useRoute();
const router = useRouter();
const visibleBack = ref(false);
const props = defineProps({
  links: {
    type: Array,
    default: () => [],
  },
});
if (route.name == "project-id" || route.name == "article-id") {
  visibleBack.value = true;
}
</script>

<template>
  <div>
    <nav
      class="breadcrumb"
      aria-label="Breadcrumbs"
      :class="{ twobefore: visibleBack }"
    >
      <ul>
        <li v-if="visibleBack">
          <div class="button-back" @click="router.back()">
            <Icon name="solar:round-alt-arrow-left-broken" />
            <strong>Назад</strong>
            <span>|</span>
          </div>
        </li>
        <li v-for="(item, key) in links" :key="key">
          <NuxtLink v-bind="item">
            {{ item.label }}
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </div>
</template>

<style scoped lang="scss">
.breadcrumb {
  margin: 80px 0 $spacing-lg;

  ul {
    margin: 0;
    margin: 0 0 $spacing-lg !important;

    li {
      margin: 0 !important;
      height: 24px;

      a {
        color: $color-black;
        font-size: 13px;
        white-space: normal;
      }
    }
  }
}

.breadcrumb-item {
  margin: 80px 0 $spacing-xxl 0;
  font-size: 12px !important;
}

.twobefore li:nth-child(2)::before {
  content: "" !important;
}

// Mobile Styles
@media (max-width: 1023px) {
  .breadcrumb {
    margin: 60px 0 $spacing-lg;

    ul li a {
      padding: 0 0.25em;
      color: $color-black;
      font-size: 11px;
      opacity: 0.7;
    }
  }

  .breadcrumb-item {
    margin: 0 0 25px 0;
    font-size: 11px !important;
  }
}
</style>
