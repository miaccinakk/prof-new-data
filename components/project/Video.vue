<script setup>
const props = defineProps({
  visiblePlyr: {
    type: Boolean,
    default: false,
  },
  VideoObject: {
    type: String,
    default: "",
  },
});

const visible = ref(false);
const playerInstance = ref(null);
const playerReady = ref(false);

// Уникальный ID для плеера
const playerId = computed(() => "project-video-" + props.VideoObject);

// Загрузка Plyr CSS
const loadPlyrStyles = () => {
  if (
    typeof document !== "undefined" &&
    !document.querySelector('link[href*="plyr"]')
  ) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.plyr.io/3.7.8/plyr.css";
    document.head.appendChild(link);
  }
};

// Инициализация плеера
const initPlyr = async () => {
  if (!props.VideoObject || playerReady.value) return;

  // Ждем пока элемент появится в DOM
  await nextTick();

  const element = document.getElementById(playerId.value);
  if (!element) {
    // Повторная попытка через небольшую задержку
    setTimeout(() => initPlyr(), 200);
    return;
  }

  // Уничтожаем предыдущий экземпляр
  if (playerInstance.value) {
    try {
      playerInstance.value.destroy();
    } catch (e) {
      // ignore
    }
    playerInstance.value = null;
  }

  loadPlyrStyles();

  try {
    const Plyr = await import("plyr");
    playerInstance.value = new Plyr.default("#" + playerId.value, {
      youtube: {
        noCookie: true,
        rel: 0,
        showinfo: 0,
        iv_load_policy: 3,
        modestbranding: 1,
      },
    });
    playerReady.value = true;
  } catch (e) {
    // Plyr initialization error - silently ignore
  }
};

// Watch для visiblePlyr
watch(
  () => props.visiblePlyr,
  async (newVal) => {
    if (newVal && props.VideoObject) {
      visible.value = true;
      await nextTick();
      initPlyr();
    }
  },
  { immediate: true },
);

// Очистка при размонтировании
onBeforeUnmount(() => {
  if (playerInstance.value) {
    try {
      playerInstance.value.destroy();
    } catch (e) {
      // ignore
    }
  }
});
</script>

<template>
  <ClientOnly>
    <div v-if="visible && VideoObject" class="video-item-project">
      <div
        :id="playerId"
        data-plyr-provider="youtube"
        :data-plyr-embed-id="VideoObject"
      ></div>
    </div>
  </ClientOnly>
</template>

<style scoped lang="scss">
.video-item-project {
  width: 100%;
  height: 100%;

  :deep(.plyr) {
    width: 100%;
    height: 100%;
  }

  :deep(.plyr__video-wrapper) {
    height: 100%;
  }

  :deep(.plyr__video-embed) {
    height: 100%;
    padding-bottom: 0 !important;
  }

  :deep(.plyr__video-embed iframe) {
    width: 100%;
    height: 100%;
  }
}
</style>
