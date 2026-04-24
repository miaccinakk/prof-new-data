<script setup>
const props = defineProps({
  video: {
    type: Object,
    default: {},
  },
});
const objectVideo = computed(() => props.video);
// Сортировка массива по полю `level` по возрастанию
const sortedSystem = computed(() => {
  return objectVideo.value.sort((a, b) => a.level - b.level);
});

const visibleModal = ref(false);
const VideoObject = ref({});
const OpenModal = (item) => {
  visibleModal.value = true;
  VideoObject.value = item;
};
const visibleModalClose = (item) => {
  visibleModal.value = item;
};
</script>

<template>
  <div class="columns is-multiline">
    <div class="column is-12">
      <h4 class="index-h4">Видеообзоры наши работ</h4>
    </div>
    <div class="column is-12">
      <div class="video-slide">
        <Swiper
          :height="100"
          :space-between="30"
          :modules="[
            SwiperAutoplay,
            SwiperEffectCreative,
            SwiperNavigation,
            SwiperPagination,
          ]"
          :slides-per-view="1.3"
          :loop="false"
          :autoplay="{
            delay: 70000,
            disableOnInteraction: true,
          }"
          :creative-effect="{
            prev: {
              shadow: false,
              translate: ['-20%', 0, -1],
            },
            next: {
              translate: ['100%', 0, 0],
            },
          }"
          :breakpoints="{
            300: {
              slidesPerView: 1.3,
            },
            680: {
              slidesPerView: 3,
            },
            1650: {
              slidesPerView: 4,
            },
          }"
        >
          <SwiperSlide
            v-for="slide in sortedSystem"
            :key="slide._id"
            :pagination="{ clickable: true, dynamicBullets: true }"
          >
            <NuxtImg
              v-for="(img, idx) in slide.img"
              :key="idx"
              :src="img.url"
              width="270"
              height="300"
              sizes="270px"
              loading="lazy"
              decoding="async"
              format="webp"
              fit="cover"
              quality="75"
              :alt="`Видео обзор проекта ${idx + 1} - ${slide.title}`"
            />
            <div class="video-slide-bg" @click="OpenModal(slide)">
              <!-- <Icon name="formkit:youtube" /> -->
            </div>
          </SwiperSlide>
        </Swiper>
        <div class="video-all">
          <nuxt-link to="/catalog">
            Все проекты
            <Icon name="ph:images-light" />
          </nuxt-link>
        </div>
      </div>
    </div>
    <index-ModalVideo
      v-model:visibleModal="visibleModal"
      v-model:VideoObject="VideoObject"
      @visibleModalClose="visibleModalClose"
    />
  </div>
</template>

<style scoped lang="scss">
.video-slide {
  margin: 0 0 100px;

  :deep(.swiper-slide) {
    position: relative;
    padding: 0px 0px 0px 0;
    float: left;
    border-radius: $border-radius-lg;
    margin: 0 0 0px;
    height: 130px;
    display: flex;
    align-items: center;
    overflow: hidden;

    img {
      @include img-cover;
      border-radius: $border-radius-lg;
    }
  }

  &-bg {
    @include absolute-fill;
    background: rgba(51, 51, 51, 0.15);
    color: rgba(255, 255, 255, 0.54);
    @include flex-center;
    cursor: pointer;

    > .icon {
      width: 45px;
      height: $spacing-xxl;
    }

    &:hover {
      @include transition;
      background: rgba(0, 0, 0, 0.34);
      box-shadow: $shadow-md;

      .icon {
        @include transition;
        opacity: 1;
      }
    }
  }
}

.video-all {
  margin: $spacing-lg 0 0 0;

  a {
    color: $color-text-dark;
    font-size: 23px;
    font-family: $font-family-accent !important;
    font-weight: 500;
  }
}

// Mobile Styles
@media (max-width: 1023px) {
  .video-slide {
    margin: 0 0 60px;

    :deep(.swiper-slide) {
      height: 190px;
    }
  }
}
</style>
