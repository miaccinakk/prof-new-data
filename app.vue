<script setup>
// useHead({
//   script: [
//     {
//       src: "https://www.googletagmanager.com/gtag/js?id=AW-815779075",
//       async: true,
//       tagPosition: "head",
//     },
//     {
//       children: `
//         window.dataLayer = window.dataLayer || [];
//         function gtag(){dataLayer.push(arguments);}
//         gtag('js', new Date());
//         gtag('config', 'AW-815779075');
//       `,
//       tagPosition: "head",
//     },
//   ],
// });
</script>
<template>
  <div>
    <NuxtLayout>
      <keep-alive>
        <NuxtPage />
      </keep-alive>
    </NuxtLayout>
  </div>
</template>
