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
    { label: "Контакты", to: `/contacts` },
  ];
});
const title = ref("Контакты компании Профитерм");
const description = ref(
  "На этой странице вы сможете найти контакты для связи с нами."
);
const imgOg = ref("https://profiterm.by/profiterm.webp");

useSeoMeta({
  title: title.value,
  ogTitle: title.value,
  description: description.value,
  ogDescription: description.value,
  ogImage: imgOg.value,
  twitterCard: "summary_large_image",
});

// Add canonical URL
useHead({
  link: [
    {
      rel: "canonical",
      href: "https://profiterm.by/contacts",
    },
  ],
});
</script>
<template>
  <div>
    <div class="container">
      <div class="content">
        <ClientOnly>
          <Breadcrumb :links="breadcrumbLinks" />
        </ClientOnly>
        <h1>Контакты</h1>
        <div v-html="main[0].contacts"></div>
      </div>
    </div>
  </div>
</template>
