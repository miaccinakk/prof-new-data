<script setup>
const breadcrumbLinks = ref([]);
const { data: main } = await useFetch(() => "/api/allpages/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
});

watchEffect(() => {
  breadcrumbLinks.value = [
    { label: "Главная", to: "/" },
    { label: "О нас", to: `/about` },
  ];
});

const title = ref("О компании Профитерм");
const description = ref(
  "Здравствуйте. Я Дмитрий Лущик. Занимаюсь проектированием и монтажем систем отопления водоснабжения и канализации более 10ти лет."
);
const imgOg = ref(main.value?.[0]?.img?.[0]?.url ?? "");

useSeoMeta({
  title: title.value,
  ogTitle: title.value,
  description: description.value,
  ogDescription: description.value,
  ogImage: imgOg.value,
  twitterCard: "summary_large_image",
});
</script>
<template>
  <div>
    <div class="container">
      <div class="content">
        <ClientOnly>
          <Breadcrumb :links="breadcrumbLinks" />
        </ClientOnly>
        <h1>О нас</h1>
        <div class="columns is-desktop is-multiline is-variable is-5">
          <div class="column is-3">
            <div class="img-about">
              <NuxtImg
                v-for="imgurl in main[0].img"
                :key="imgurl.url"
                :src="imgurl.url"
                loading="lazy"
                format="webp"
                alt="About Us Image"
              />
            </div>
          </div>
          <div class="column is-9">
            <div v-html="main[0].about"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.img-about {
  width: 100%;
  height: 360px;

  img {
    @include img-cover;
    border-radius: 9px;
  }
}
</style>
