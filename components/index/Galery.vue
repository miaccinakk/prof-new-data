<script setup>
const props = defineProps({
  galery: {
    type: Array,
    default: () => [],
  },
  description: {
    type: String,
    default: "",
  },
});

const objectGalery = computed(() => props.galery);
const objectDesc = computed(() => props.description);

// Функция для сортировки массива по level, пустые значения перемещаются в конец
const sortGallery = (gallery) => {
  return gallery
    .map((item) => ({
      ...item,
      level: item.level ? parseInt(item.level) : Number.MAX_SAFE_INTEGER,
    }))
    .sort((a, b) => a.level - b.level);
};

// Функция для разделения массива на подмассивы, первый подмассив будет содержать 5 элементов, остальные по 6 элементов
const chunkArraySpecial = (array) => {
  const result = [];
  if (array.length > 0) {
    result.push(array.slice(0, 5)); // Первый подмассив с 5 элементами
  }
  for (let i = 5; i < array.length; i += 6) {
    result.push(array.slice(i, i + 6)); // Остальные подмассивы с 6 элементами
  }
  return result;
};
const sortedImages = computed(() => {
  return sortGallery(objectGalery.value).flatMap((slide) => slide.img);
});

const chunkedImages = computed(() => chunkArraySpecial(sortedImages.value));

const iconSvg = ref(`
<svg
  version="1.0"
  xmlns="http://www.w3.org/2000/svg"
  width="700.000000pt"
  height="512.000000pt"
  viewBox="0 0 700.000000 512.000000"
  preserveAspectRatio="xMidYMid meet"
>
  <g
    transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
    fill="#000000"
    stroke="none"
  >
    <path
      d="M4990 3770 c-333 -50 -687 -135 -936 -225 -199 -73 -187 -63 -182
      -151 3 -41 7 -76 9 -78 2 -2 20 -7 40 -11 30 -6 37 -4 41 12 4 15 39 26 189
      61 225 52 472 103 476 98 2 -2 -40 -29 -94 -61 -521 -309 -1091 -780 -1743
      -1441 -487 -494 -737 -839 -889 -1228 -40 -102 -47 -145 -32 -209 5 -26 9 -21
      42 56 81 190 252 437 519 747 512 596 993 1038 1600 1472 216 154 679 463 859
      573 23 14 8 -6 -170 -217 -94 -110 -177 -211 -186 -224 -16 -25 -16 -30 6
      -182 l6 -44 100 118 c268 315 321 382 392 501 25 43 59 110 74 150 25 62 29
      85 29 171 0 97 -5 133 -19 131 -3 0 -62 -9 -131 -19z"
    ></path>
  </g>
</svg>
`);

const currentIndex = ref(0);

const onSlideChangeGal = (swiper) => {
  currentIndex.value = swiper.realIndex;
};
</script>
<template>
  <div>
    <div class="gall-slider">
      <div class="columns is-multiline">
        <div class="column is-12 m-none">
          <h4 class="mt-6 mb-6 index-h4">Галерея</h4>
        </div>
        <div class="column is-6">
          <div class="index-gall-desc">
            <div v-html="objectDesc"></div>
          </div>
        </div>
        <div class="column is-12 m-block">
          <h4 class="mt-6 mb-6 index-h4">Галерея</h4>
        </div>
        <div class="column is-6 p-0">
          <div class="slider">
            <div class="slider-one">
              <ClientOnly>
                <Swiper
                  :height="300"
                  :space-between="0"
                  :modules="[
                    SwiperAutoplay,
                    SwiperEffectCreative,
                    SwiperNavigation,
                    SwiperPagination,
                  ]"
                  :slides-per-view="1"
                  :navigation="{
                    nextEl: '.swiper-button-prev-gal',
                    prevEl: '.swiper-button-next-gal',
                  }"
                  :loop="false"
                  @slideChange="onSlideChangeGal"
                >
                  <SwiperSlide
                    v-for="(slide, index) in chunkedImages"
                    :key="index"
                  >
                    <div
                      v-for="(img, idx) in slide"
                      :key="idx"
                      class="image-grid"
                      :alt="`Фото галерея  ${index}`"
                      :class="{
                        [`image-${idx + 1}`]: index !== 0,
                        [`image-${idx + 1}-spechal`]: index === 0,
                      }"
                    >
                      <NuxtImg
                        :src="img.url"
                        :alt="`Фото галереи ${index * 6 + idx + 1}`"
                        data-fancybox="galery project"
                        width="180"
                        height="250"
                        sizes="250px"
                        loading="lazy"
                        decoding="async"
                        format="webp"
                        fit="cover"
                        quality="70"
                      />
                    </div>
                  </SwiperSlide>
                </Swiper>
              </ClientOnly>
            </div>
            <div class="slider-one-navigation sl-m">
              <div
                class="swiper-button-next-gal"
                :class="{ opacitynull: currentIndex === 0 }"
              >
                <div v-html="iconSvg" class="slider-one-svg"></div>
                <span>Раньше</span>
              </div>

              <div class="swiper-button-prev-gal">
                <span>Больше</span>
                <div v-html="iconSvg" class="slider-one-svg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.gall-slider {
  margin: 60px 0 120px;
  @include float-full;
}

.index-gall-desc {
  display: flex;
  height: 100%;
  align-items: center;
  font-size: 17px;
  line-height: 1.6;
  padding: 0 50px 0 0;
  margin: 0 0 $spacing-lg;
}

.slider {
  @include float-full;
  margin: 0px 0 0px;

  &-one {
    @include float-full;
    position: relative;

    &-navigation {
      position: relative;
      @include float-full;
      margin: $spacing-lg 0 0;
      @include flex-between;
      align-items: flex-end;

      span {
        font-family: $font-family-accent !important;
        font-size: 27px;
        color: $color-text-dark;
      }

      .swiper-button-next,
      .swiper-button-prev {
        background: none !important;
        box-shadow: none !important;
        height: auto !important;
        width: auto !important;
        @include flex-between;
        align-items: flex-end;
        position: relative;
        right: 0;
        left: 0;

        &:after {
          display: none;
        }

        svg {
          width: 100%;
          height: 100%;
          position: relative;
        }
      }

      .swiper-button-next svg {
        transform: scale(-1, 1);
        float: left;
      }

      .swiper-button-next-gal,
      .swiper-button-prev-gal {
        background: none !important;
        box-shadow: none !important;
        height: auto !important;
        width: auto !important;
        @include flex-between;
        align-items: flex-end;
        position: relative;
        right: 0;
        left: 0;
        cursor: pointer;

        &:after {
          display: none;
        }

        svg {
          width: 100%;
          height: 100%;
          position: relative;
          transform: scaleX(1);
        }
      }

      .swiper-button-next-gal :deep(svg) {
        transform: scaleX(-1);
        float: left;
      }
    }

    &-svg {
      width: 67px;
      height: 54px;
      position: relative;
      top: -3px;
      :deep(svg) {
        height: 100%;
        position: relative;
        width: 100%;
      }
    }

    :deep(.swiper-pagination) {
      bottom: $spacing-md !important;
    }

    :deep(.swiper-slide) {
      position: relative;
      padding: 0px 0px 0px 0;
      margin: 0 0 0px;
      @include flex-between;
      flex-flow: column wrap;
      max-height: 400px;
      align-content: flex-start;

      img {
        @include img-cover;
        border-radius: $border-radius-lg;
        cursor: pointer;
      }
    }

    :deep(.swiper-button-prev) {
      left: 25px;
      bottom: 0px !important;
      top: auto;
    }

    :deep(.swiper-button-next) {
      right: 25px;
      bottom: 0px !important;
      top: auto;
    }

    .image-grid {
      object-fit: cover;
      border-radius: 6px;
      position: relative;
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      padding: $spacing-sm $spacing-sm;
      width: 33.3333% !important;
    }
  }
}

// Mobile Styles
@media (max-width: 1023px) {
  .index-gall-desc {
    font-size: 15px;
    line-height: 1.5;
    padding: 0 0px 0 0;
    margin: 0 0 $spacing-lg;
  }

  .slider-one :deep(.swiper-slide) {
    height: 400px;
  }

  .gall-slider {
    margin: 0px 0 70px;
  }

  .sl-m {
    margin: 0px 0 0 0;
  }
}
</style>
