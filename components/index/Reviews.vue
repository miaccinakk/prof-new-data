<script setup>
const dialogVisible = ref(false);
const removeTagDialogs = ref({});
const projectData = ref({});
const galery = ref([]);
const { data: reviews } = await useFetch("/api/reviews/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
  lazy: true,
});

const show = ref(null);

const showList = (item) => {
  dialogVisible.value = true;
  if (show.value === item) {
    show.value = null;
  } else {
    show.value = item;
  }
};

const sliseDesc = (item) => {
  return item.replace(/<[^>]+>/g, "").slice(0, 100) + "...";
};

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

const fetchProjectData = async (projectId) => {
  const { data: project } = await useFetch(() => `/api/projectitem/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: projectId,
  });
  if (project.value) {
    projectData.value[projectId] = project.value;
    galery.value = project.value[0].galery;
  }
};
const currentIndex = ref(0);

const onSlideChange = (swiper) => {
  currentIndex.value = swiper.realIndex;
};
const sortedReviews = computed(() => {
  return reviews.value
    ? [...reviews.value].sort((a, b) => a.level - b.level)
    : [];
});
</script>
<template>
  <div class="columns is-multiline">
    <div class="column is-12">
      <h4 class="rev-h4 index-h4">Отзывы наших клиентов</h4>
      <span class="publick-review"
        >Если Вы были нашим клиентом, отправьте свой отзыв, мы его обязательно
        опубликуем.</span
      >
      <ModalReview />
    </div>
    <div class="column is-12">
      <div class="reviews-slide">
        <Swiper
          :height="100"
          :space-between="20"
          :modules="[SwiperAutoplay, SwiperNavigation, SwiperPagination]"
          :slides-per-view="1.5"
          :navigation="{
            nextEl: '.swiper-button-prev',
            prevEl: '.swiper-button-next',
          }"
          :autoplay="{
            delay: 70000,
            disableOnInteraction: true,
          }"
          :breakpoints="{
            300: {
              slidesPerView: 1,
            },
            680: {
              slidesPerView: 1,
            },
            1650: {
              slidesPerView: 2,
            },
          }"
          @slideChange="onSlideChange"
        >
          <SwiperSlide v-for="(slide, idx) in sortedReviews" :key="idx">
            <div class="index-rew-block">
              <div class="index-rew-block-img">
                <NuxtImg
                  v-for="(slideurl, idx) in slide.img"
                  :key="idx"
                  :src="slideurl.url"
                  width="270"
                  height="300"
                  sizes="270px"
                  loading="lazy"
                  decoding="async"
                  format="webp"
                  fit="cover"
                  quality="75"
                  :alt="`Отзыв ${idx + 1} - ${slide.name}`"
                />
              </div>
              <div class="index-rew-block-desc">
                <strong>{{ slide.name }}</strong>

                <div
                  v-if="slide.description.length < 120"
                  v-html="sliseDesc(slide.description)"
                ></div>
                <div
                  v-else-if="slide.description.length > 120"
                  v-html="sliseDesc(slide.description)"
                ></div>
                <button
                  class="button is-white is-light button-rew-index"
                  @click="
                    removeTagDialogs[slide._id] = true;
                    fetchProjectData(slide.project);
                  "
                >
                  <span class="icon">
                    <Icon name="solar:square-bottom-up-broken" />
                  </span>
                  <span>Читать полностью...</span>
                </button>
                <ClientOnly>
                  <Teleport to="body">
                    <el-dialog
                      v-model="removeTagDialogs[slide._id]"
                      class="rev-dialog"
                      width="50%"
                    >
                      <div v-if="projectData[slide.project]">
                        <Swiper
                          :height="100"
                          :space-between="10"
                          :slides-per-view="1.5"
                          :breakpoints="{
                            300: {
                              slidesPerView: 1.5,
                            },
                            680: {
                              slidesPerView: 2,
                            },
                            1650: {
                              slidesPerView: 3,
                            },
                          }"
                          :loop="false"
                        >
                          <SwiperSlide
                            v-for="(slide, idx) in galery"
                            :key="idx"
                          >
                            <div class="index-rew-slider-img">
                              <NuxtImg
                                :src="slide.url"
                                :alt="slide.title"
                                loading="lazy"
                                format="webp"
                              />
                            </div>
                          </SwiperSlide>
                        </Swiper>
                      </div>
                      <div v-html="slide.description"></div>
                      <template #footer>
                        <span class="dialog-footer">
                          <button
                            class="button mr-3 is-light"
                            @click="removeTagDialogs[slide._id] = false"
                          >
                            Закрыть
                          </button>
                          <nuxt-link :to="`/project/` + slide.project">
                            <button
                              class="button button-rew-modal"
                              type="primary"
                              @click="removeTagDialogs[slide._id] = false"
                            >
                              Перейти к проекту
                            </button>
                          </nuxt-link>
                        </span>
                      </template>
                    </el-dialog>
                  </Teleport>
                </ClientOnly>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
        <div class="slider-one-navigation nav-review">
          <div
            class="swiper-button-next"
            :class="{ opacitynull: currentIndex === 0 }"
          >
            <div v-html="iconSvg" class="slider-one-svg"></div>
            <span>Предыдущие</span>
          </div>

          <div class="swiper-button-prev">
            <span>Ещё</span>
            <div v-html="iconSvg" class="slider-one-svg"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.reviews-slide {
  margin: 0 0 80px;

  :deep(.swiper-slide) {
    position: relative;
    padding: 0px 0px 0px 0;
    float: left;
    margin: 0 0 0px;
    height: 220px;
  }

  :deep(.swiper-button-next),
  :deep(.swiper-button-prev) {
    background: rgba(0, 0, 0, 0.35);
  }

  .index-rew-block-desc p {
    margin-bottom: $spacing-sm;
  }
}

.index-rew {
  &-block {
    @include float-full;

    &-img {
      float: left;
      width: 200px;
      height: 220px;

      img {
        @include img-cover;
        border-radius: $border-radius-lg;
        cursor: pointer;
      }
    }

    &-desc {
      margin: 0 0 0 230px;
      padding: 0 $spacing-lg 0 0;
      height: 220px;
      @include flex-column;
      justify-content: space-between;

      > strong {
        font-size: 17px;
        margin: 0 0 $spacing-md;
        @include float-full;
      }

      > div {
        font-size: 15px;
        line-height: 1.6;
      }

      .is-light.button {
        color: #0069ff;

        &:hover {
          color: #0069ff;
        }
      }
    }
  }

  &-slider-img {
    @include float-full;
    height: 180px;

    img {
      @include img-cover;
      border-radius: $border-radius-xxl;
      cursor: pointer;
    }
  }
}

.nav-review {
  margin: $spacing-xxl 0 0 0;
}

.publick-review {
  // Default styles
}

.button-rew-index {
  margin: $spacing-sm 0 0;
  width: 170px !important;
  color: #636363 !important;
  font-size: 13px !important;
  border-radius: 6px !important;
  height: auto !important;
  padding: 7px 0px !important;
  border: 0px solid #999999 !important;
  background: $color-white !important;
  @include transition;
}

.button-rew-modal {
  border: 1px solid #999999 !important;
  background: $color-white !important;
}

.button-rew-index,
.button-rew-modal {
  &:hover {
    background: $color-white !important;
    color: $color-black !important;
  }
}

.rev-b-modal {
  background: #dfdfdf !important;
  border-radius: $border-radius-md !important;
  border-color: #a4a4a4 !important;
  border: none !important;
  padding: $spacing-xs $spacing-md !important;
  color: #040404 !important;
  margin: $spacing-md 0 $spacing-xs;
  font-size: 15px !important;
}

.slider-one-navigation {
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

    :deep(svg) {
      width: 100%;
      height: 100%;
      position: relative;
    }
  }

  .swiper-button-next :deep(svg) {
    transform: scale(-1, 1);
    float: left;
  }
}

.slider-one-svg {
  width: 67px;
  height: 54px;
  position: relative;
  top: -3px;
}

// Mobile Styles
@media (max-width: 1023px) {
  .rev-b-modal {
    margin: $spacing-md 0 0;
    font-size: 13px !important;
  }

  // Мобильная версия: колонка (фото сверху, потом текст)
  .index-rew-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    height: auto;

    &-img {
      float: none;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      overflow: hidden;
      margin-bottom: $spacing-md;
      flex-shrink: 0;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
      }
    }

    &-desc {
      margin: 0;
      padding: 0;
      height: auto;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;

      > strong {
        font-size: 15px;
        margin: 0 0 $spacing-sm;
        text-align: center;
      }

      > div {
        font-size: 13px;
        line-height: 1.5;
        height: auto;
        max-height: 80px;
        overflow: hidden;
        display: block;
        text-align: center;
      }
    }
  }

  .button-rew-index {
    margin: $spacing-sm auto 0;
    font-size: 12px !important;
  }

  .reviews-slide {
    margin: 0 0 40px;

    :deep(.swiper-slide) {
      height: auto;
      min-height: 280px;
      padding: $spacing-md;
    }
  }

  .publick-review {
    font-size: 13px;
    line-height: 1.2;
    margin: $spacing-md 0 $spacing-xs;
    display: block;
  }

  .nav-review {
    margin: $spacing-sm 0 0 0;
  }
}
</style>
