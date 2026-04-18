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
    { label: "Рассрочка платежа", to: `/installment` },
  ];
});
const title = ref("Рассрочка на работы Профитерм");
const description = ref(
  "На этой странице вы сможете найти иформацию о рассрочке платежа."
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

// Add canonical URL and JSON-LD structured data
useHead({
  link: [
    {
      rel: "canonical",
      href: "https://profiterm.by/installment",
    },
  ],
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: title.value,
        description: description.value,
        url: "https://profiterm.by/installment",
        mainEntity: {
          "@type": "Organization",
          name: "Профитерм",
          url: "https://profiterm.by",
        },
      }),
    },
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Главная",
            item: "https://profiterm.by/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Рассрочка платежа",
            item: "https://profiterm.by/installment",
          },
        ],
      }),
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
        <h1>Рассрочка платежа</h1>
        <div v-html="main[0].installment"></div>
      </div>
    </div>
  </div>
</template>
