<script setup>
import { nextTick } from 'vue';

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
const objectVideo = computed(() => props.VideoObject);

// Загрузка Plyr CSS
const loadPlyrStyles = () => {
  if (!document.querySelector('link[href*="plyr"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.plyr.io/3.7.8/plyr.css';
    document.head.appendChild(link);
  }
};

// Инициализация плеера
const initPlyr = async () => {
  await nextTick();
  
  const playerId = "#y" + objectVideo.value;
  const playerElement = document.querySelector(playerId);
  
  if (!playerElement) {
    return;
  }
  
  // Уничтожаем предыдущий экземпляр если есть
  if (playerInstance.value) {
    try {
      playerInstance.value.destroy();
    } catch (e) {
      // ignore
    }
  }
  
  loadPlyrStyles();
  const Plyr = await import("plyr");
  playerInstance.value = new Plyr.default(playerId);
};

// Инициализация при изменении visiblePlyr
watch(
  () => props.visiblePlyr,
  async (newVal) => {
    if (newVal) {
      visible.value = true;
      await nextTick();
      await initPlyr();
    }
  },
  { immediate: true }
);

// Инициализация при монтировании если visiblePlyr уже true
onMounted(async () => {
  if (props.visiblePlyr && objectVideo.value) {
    visible.value = true;
    await nextTick();
    // Небольшая задержка для гарантии отрисовки DOM
    setTimeout(async () => {
      await initPlyr();
    }, 100);
  }
});

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
    <div v-if="visible" class="video-item-project">
      <div
        :id="'y' + objectVideo"
        data-plyr-provider="youtube"
        :data-plyr-embed-id="objectVideo"
      ></div>
    </div>
  </ClientOnly>
</template>
