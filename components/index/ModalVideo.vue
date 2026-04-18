<script setup>
const props = defineProps({
  visibleModal: {
    type: Boolean,
    default: false,
  },
  VideoObject: {
    type: Object,
    default: {},
  },
});
const visible = ref(false);
// const visible = computed(() => props.visibleModal);
const objectVideo = computed(() => props.VideoObject);
watch(
  () => props.visibleModal,
  (item) => {
    plyr();
    visible.value = item;
  },
);
const emit = defineEmits(["visibleModalClose"]);
watch(visible, (input) => {
  visible.value = input;
  emit("visibleModalClose", input);
});
const plyr = async () => {
  const Plyr = await import("plyr");
  const newPlayer = new Plyr.default("#y" + objectVideo.value.yootube);
};
</script>
<template>
  <div>
    <ClientOnly>
      <el-dialog class="video-gal" v-model="visible" :title="objectVideo.title">
        <div v-if="visible == true" class="video-gal-item">
          <div
            :id="'y' + objectVideo.yootube"
            data-plyr-provider="youtube"
            :data-plyr-embed-id="objectVideo.yootube"
          ></div>
          <div v-html="objectVideo.description" class="video-gal-desc"></div>
        </div>
      </el-dialog>
    </ClientOnly>
  </div>
</template>
