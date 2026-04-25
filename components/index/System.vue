<script setup>
import { useWindowSize } from "@vueuse/core";
import { ref, computed, watchEffect, nextTick, onMounted } from "vue";

const isWidth = ref("left");
const activeName = ref("first0");
const infoNone = ref(true);
const loadedVideos = ref({}); // Отслеживание загруженных видео
const isComponentVisible = ref(false); // Компонент виден на экране
const systemRef = ref(null); // Ссылка на контейнер для IntersectionObserver

const { data: system } = await useFetch("/api/system/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
  lazy: true, // Ожидание запроса до момента использования
});

// Сортируем данные после загрузки
const sortedSystem = computed(() => {
  return system.value
    ? [...system.value].sort((a, b) => a.level - b.level)
    : [];
});

const { width } = useWindowSize();
const windowWidth = ref(width.value);

const widtFun = () => {
  if (width.value <= 700) {
    isWidth.value = "top";
    infoNone.value = false;
  } else {
    isWidth.value = "left";
    infoNone.value = true;
  }
};

watchEffect(() => {
  widtFun();
});

// Загружаем видео при смене вкладки
const loadVideo = async (tabKey) => {
  if (!loadedVideos.value[tabKey]) {
    loadedVideos.value[tabKey] = true;
    await nextTick(); // Ждем обновления DOM перед загрузкой
  }
};

// Загружаем первое видео только когда компонент становится видимым
onMounted(async () => {
  // Ждём nextTick чтобы ref был доступен после ClientOnly
  await nextTick();
  
  // Используем IntersectionObserver для ленивой загрузки
  if (typeof IntersectionObserver !== 'undefined' && systemRef.value) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isComponentVisible.value) {
            isComponentVisible.value = true;
            loadedVideos.value["first0"] = true;
            observer.disconnect(); // Отключаем после первого показа
          }
        });
      },
      { rootMargin: '50px', threshold: 0.1 } // Загружаем когда 10% компонента видно
    );
    observer.observe(systemRef.value);
  } else {
    // Fallback для SSR или старых браузеров - загружаем с задержкой
    setTimeout(() => {
      loadedVideos.value["first0"] = true;
    }, 3000);
  }
});
</script>

<template>
  <div ref="systemRef">
    <div class="columns is-multiline">
      <div class="column is-12">
        <h4 class="index-h4">Инженерные Системы</h4>
      </div>
      <div class="column is-12">
        <ClientOnly>
          <div :class="!infoNone ? 'system-tabs-mobail' : 'system-tabs'">
            <el-tabs
              :tab-position="isWidth"
              v-model="activeName"
              @tab-click="(tab) => loadVideo(tab.paneName)"
            >
              <el-tab-pane
                v-for="(tab, idx) in sortedSystem"
                :key="idx"
                :name="'first' + idx"
              >
                <template #label>
                  <span class="custom-tabs-label">
                    <strong>{{ tab.title }}</strong>
                    <p v-if="tab.info" v-show="infoNone">{{ tab.info }}</p>
                  </span>
                </template>

                <div v-if="loadedVideos['first' + idx]">
                  <video
                    v-for="itemvideo in tab.video"
                    :key="itemvideo.url"
                    class="lazy-video"
                    muted
                    autoplay
                    loop
                    webkit-playsinline
                    playsinline
                    preload="none"
                    :poster="itemvideo.img"
                    type="video/webm"
                    :src="itemvideo.url"
                  >
                    <source class="video-source" src="" type="video/mp4" />
                  </video>
                  <div v-html="tab.description" class="mobail-tabs"></div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </ClientOnly>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.system-tabs {
  @include float-full;
  margin: -30px 0 100px;

  :deep(.el-tabs__content) {
    overflow: visible;
  }

  :deep(.el-tabs--left .el-tabs__active-bar.is-left) {
    left: 0;
    width: 4px;
    border-radius: $border-radius-sm;
    background: $color-border-light;
  }

  :deep(.el-tabs--left .el-tabs__nav-wrap.is-left::after) {
    width: 0;
  }

  // Фиксированный layout: 40% список / 60% видео
  :deep(.el-tabs--left) {
    display: flex;
    flex-direction: row;
    width: 100%;
  }

  :deep(.el-tabs__header) {
    flex: 0 0 40%;
    width: 40%;
    max-width: 40%;
    margin-right: 0px !important;
  }

  :deep(.el-tabs__content) {
    flex: 0 0 60%;
    width: 60%;
    max-width: 60%;
  }

  :deep(.el-tabs) {
    overflow: visible;
  }

  :deep(.el-tabs__nav) {
    width: 100%;
  }

  .custom-tabs-label {
    > strong {
      @include float-full;
      font-size: 17px;
      color: #a2a2a2;
    }

    > p {
      @include float-full;
      font-size: 15px;
      margin: $spacing-sm 0;
      line-height: 1.6;
      color: #a2a2a2;
    }
  }

  :deep(.is-active) strong,
  :deep(.is-active) p {
    color: $color-text-dark;
  }

  :deep(.el-tabs__item:hover) {
    strong,
    p {
      @include transition;
      color: $color-text-dark;
    }
  }

  :deep(.el-tabs__item.is-left) {
    text-align: left !important;
    font-size: 19px;
    padding: $spacing-sm 0px $spacing-sm $spacing-xl;
    float: right;
    width: 100%;
    height: auto;
    display: block;
    white-space: break-spaces;
    margin: 0 0 $spacing-sm;
  }

  :deep(.el-tabs--left .el-tabs__header.is-left) {
    padding: 70px 0 0;
  }

  :deep(.el-tab-pane) {
    padding: 0px 0% 0 10%;
    overflow: visible;
    width: 100%;
  }

  video {
    height: auto;
    max-width: 100%;
    width: 100%;
    height: 400px;
    border-radius: $border-radius-lg;
    overflow: hidden;
    object-fit: cover;
    margin: 0 0 90px;
    position: relative;
    top: 70px;
    box-shadow:
      rgba(0, 12, 121, 0.1) 0px 30px 80px,
      rgba(0, 12, 121, 0.1) 0px 12px 24px;
  }
}

// Mobile Styles
@media (max-width: 1023px) {
  .system-tabs {
    margin: $spacing-sm 0 $spacing-xxl;
    display: flow-root;
    width: auto;
    float: none;
    height: 100%;

    :deep(.el-tab-pane) {
      padding: $spacing-sm 0% 0 0%;
      overflow: visible;
      float: left;
      width: 100%;
    }

    :deep(.el-tabs__header) {
      width: auto;
      margin-right: 0px !important;
    }

    :deep(.el-tabs__item.is-left) {
      font-size: 16px;
      padding: $spacing-sm $spacing-xs $spacing-xs $spacing-sm;
      margin: 0 0 0px;
      text-align: left !important;
    }

    video {
      height: 260px;
    }

    .custom-tabs-label {
      > p {
        display: none;
      }

      > strong {
        font-size: 14px;
        text-align: left;
      }
    }

    :deep(.el-tabs--left .el-tabs__active-bar.is-left) {
      width: 2px;
    }

    &-mobail {
      margin: -5px 0 75px;

      video {
        border-radius: $border-radius-lg;
        box-shadow:
          0 30px 80px rgba(0, 12, 121, 0.1),
          0 12px 24px rgba(0, 12, 121, 0.1);
        height: auto;
        height: 260px;
        margin: 0 0 $spacing-xxl;
        max-width: 100%;
        object-fit: cover;
        overflow: hidden;
        width: 100%;
      }

      :deep(.el-tabs__header) {
        padding: 0;
        position: relative;
        margin: 0 0 $spacing-sm;
      }

      :deep(.el-tabs__active-bar) {
        background-color: transparent;

        &.is-left {
          width: 2px;
        }
      }

      :deep(.el-tabs__item) {
        padding: $spacing-xs $spacing-sm !important;
        max-width: 150px;
        float: left;
        height: 50px;
        word-wrap: break-word;
        white-space: break-spaces;
        line-height: 1.2;
        border: 1px solid #d7d7d7;
        border-radius: 7px;
        margin: 0 $spacing-xs 0 0;

        &.is-active {
          color: $color-black;
          border: 1px solid #545454;
        }
      }

      .custom-tabs-label > strong {
        font-size: 13px;
        text-align: left;
        font-weight: 500;
      }

      :deep(.el-tabs__nav-prev),
      :deep(.el-tabs__nav-next) {
        border-radius: 7px;
        margin: 0 0 4px;
        bottom: 16px;
        background: #575757;
        padding: 3px 4px;
        width: auto;
        text-align: center;
      }

      :deep(.el-tabs__header .el-icon) {
        font-size: 19px;
        top: 6px;
        color: $color-white;
      }

      :deep(.el-tabs__nav-wrap) {
        overflow: hidden;
        margin-bottom: -1px;
        position: relative;
        padding: $spacing-sm $spacing-xl !important;
      }

      :deep(.el-tabs__nav-scroll) {
        overflow-x: auto;
        white-space: nowrap;
        -webkit-overflow-scrolling: touch;

        &::after {
          content: "";
          height: 0;
        }
      }
    }
  }

  .system-tabs-mobail::-webkit-scrollbar {
    display: none;
  }

  :deep(.el-tabs__nav-wrap::after) {
    height: 0 !important;
  }

  :deep(.el-tabs__nav-scroll) {
    display: flex !important;
    flex-wrap: nowrap !important;
    padding: 0px 0px $spacing-sm 0px;
  }

  :deep(.el-tabs__item) {
    flex: 0 0 auto;
  }

  .mobail-tabs {
    width: 100%;
    padding: 0 $spacing-md;
  }
}
</style>
