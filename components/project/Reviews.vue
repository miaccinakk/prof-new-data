<script setup>
const props = defineProps({
  params: {
    type: String,
    default: "",
  },
});
const { data: reviews, error } = await useFetch("/api/reviews/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
  body: { Project: props.params },
});

const sliseDesc = (item) => {
  return item.replace(/<[^>]+>/g, "").slice(0, 200) + "...";
};
</script>

<template>
  <div class="project-reviews" v-if="reviews && reviews.length > 0">
    <h2 class="rev-h4">Отзыв</h2>
    <div v-for="item in reviews" :key="item._id" class="index-rew-block">
      <div class="index-rew-block-img">
        <NuxtImg
          v-for="(itemurl, idx) in item.img"
          :key="idx"
          :src="itemurl.url"
          :alt="`Фото ${item.name}`"
          width="200"
          height="220"
          loading="lazy"
          format="webp"
          fit="cover"
          quality="80"
        />
      </div>
      <div class="index-rew-block-desc">
        <strong>{{ item.name }}</strong>
        <div v-html="item.description" class="review-text"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.project-reviews {
  @include float-full;
  margin: 60px 0 40px;

  .rev-h4 {
    font-size: 1.5em;
    margin: 0 0 30px;
    font-weight: 600;
  }
}

.index-rew-block {
  @include float-full;
  margin-bottom: 30px;

  &-img {
    float: left;
    width: 200px;
    height: 220px;

    img {
      @include img-cover;
      border-radius: $border-radius-lg;
    }
  }

  &-desc {
    margin: 0 0 0 230px;
    padding: 0 $spacing-lg 0 0;
    @include flex-column;

    > strong {
      font-size: 17px;
      margin: 0 0 $spacing-md;
      @include float-full;
    }

    .review-text {
      font-size: 15px;
      line-height: 1.6;

      :deep(p) {
        margin-bottom: $spacing-sm;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}

// Mobile Styles
@media (max-width: 1023px) {
  .project-reviews {
    margin: 40px 0 20px;

    .rev-h4 {
      font-size: 1.25em;
      margin: 0 0 20px;
    }
  }

  .index-rew-block {
    margin-bottom: 20px;

    &-img {
      float: left;
      width: 150px;
      height: 210px;
    }

    &-desc {
      margin: 0 0 0 165px;
      padding: 0;

      > strong {
        font-size: 15px;
        margin: 0 0 $spacing-xs;
      }

      .review-text {
        font-size: 13px;
        line-height: 1.5;
      }
    }
  }
}
</style>
