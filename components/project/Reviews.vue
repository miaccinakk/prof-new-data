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
</script>

<template>
  <div class="item-rew" v-if="reviews && reviews.length > 0">
    <h2>Отзывы о проекте</h2>
    <div v-for="item in reviews" :key="item._id" class="item-rew-card">
      <div class="item-rew-block">
        <!-- Аватар слева -->
        <div class="item-rew-block-avatar">
          <NuxtImg
            v-for="(itemurl, idx) in item.img"
            :key="idx"
            :src="itemurl.url"
            :alt="`Фото ${item.name}`"
            width="120"
            height="120"
            loading="lazy"
            format="webp"
            fit="cover"
            quality="80"
          />
        </div>
        <!-- Контент справа -->
        <div class="item-rew-block-content">
          <div class="item-rew-block-header">
            <strong class="item-rew-name">{{ item.name }}</strong>
          </div>
          <div v-html="item.description" class="item-rew-text"></div>
        </div>
      </div>
      <!-- Видео если есть -->
      <div v-if="item.video" class="item-rew-video">
        <video
          v-for="(vid, vidx) in item.video"
          :key="vidx"
          :src="vid.url"
          controls
          preload="metadata"
        ></video>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.item-rew {
  @include float-full;
  margin: 60px 0 40px;

  > h2 {
    font-size: 1.5em;
    margin: 0 0 30px;
    font-weight: 600;
  }
}

.item-rew-card {
  @include float-full;
  background: #f9f9f9;
  border-radius: $border-radius-lg;
  padding: 24px;
  margin-bottom: 20px;
}

.item-rew-block {
  display: flex;
  gap: 24px;
  align-items: flex-start;

  &-avatar {
    flex-shrink: 0;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &-content {
    flex: 1;
    min-width: 0;
  }

  &-header {
    margin-bottom: 12px;
  }
}

.item-rew-name {
  font-size: 18px;
  font-weight: 600;
  color: $color-text-dark;
  display: block;
}

.item-rew-text {
  font-size: 15px;
  line-height: 1.7;
  color: #444;

  :deep(p) {
    margin-bottom: 10px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.item-rew-video {
  margin-top: 20px;

  video {
    width: 100%;
    max-width: 500px;
    border-radius: $border-radius-md;
  }
}

// Mobile Styles
@media (max-width: 1023px) {
  .item-rew {
    margin: 40px 0 20px;

    > h2 {
      font-size: 1.25em;
      margin: 0 0 20px;
    }
  }

  .item-rew-card {
    padding: 16px;
  }

  .item-rew-block {
    flex-direction: column;
    gap: 16px;
    align-items: center;
    text-align: center;

    &-avatar {
      width: 80px;
      height: 80px;
    }

    &-content {
      width: 100%;
    }
  }

  .item-rew-name {
    font-size: 16px;
  }

  .item-rew-text {
    font-size: 14px;
    text-align: left;
  }

  .item-rew-video {
    margin-top: 16px;

    video {
      max-width: 100%;
    }
  }
}
</style>
