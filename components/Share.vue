<script setup>
const props = defineProps({
  social: {
    type: Array,
    default: ["odnoklassniki", "twitter", "telegram", "vk", "facebook"],
  },
});

const share = (network, link = "") => {
  const shareUrl = window.location.href;
  const shareText = "Поделиться статьёй";

  let url = "";
  switch (network) {
    case "odnoklassniki":
      url = `https://connect.ok.ru/offer?url=${encodeURIComponent(
        shareUrl
      )}&title=${encodeURIComponent(shareText)}`;
      break;
    case "twitter":
      url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        shareUrl
      )}&text=${encodeURIComponent(shareText)}`;
      break;
    case "telegram":
      url = `https://t.me/share/url?url=${encodeURIComponent(
        shareUrl
      )}&text=${encodeURIComponent(shareText)}`;
      break;
    case "vk":
      url = `https://vk.com/share.php?url=${encodeURIComponent(
        shareUrl
      )}&title=${encodeURIComponent(shareText)}`;
      break;
    case "facebook":
      url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}`;
      break;
    default:
      url = link; // Use the custom link from props if network is not predefined
      break;
  }

  if (url) {
    window.open(url, "_blank");
  }
};
const getIconName = (networkName) => {
  switch (networkName.toLowerCase()) {
    case "facebook":
      return "bx:bxl-facebook";
    case "vk":
      return "bx:bxl-vk";
    case "twitter":
      return "mingcute:twitter-fill";
    case "telegram":
      return "mingcute:telegram-fill";
    case "odnoklassniki":
      return "jam:odnoklassniki";
    default:
      return "";
  }
};
</script>

<template>
  <div v-for="(network, index) in social" :key="index">
    <button
      class="button is-rounded"
      :title="network"
      @click="() => share(network.toLowerCase())"
    >
      <span class="icon">
        <Icon :name="getIconName(network)" />
      </span>
    </button>
  </div>
</template>

<style scoped lang="scss">
.button.is-rounded {
  width: $spacing-xxl;
  height: $spacing-xxl;
  background-color: #f5f8fc;
  border-color: #f5f8fc;
  @include transition;
  color: #4d4d4d;
  margin: 0 $spacing-sm 0 0px;
}
</style>
