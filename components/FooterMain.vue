<script setup>
import { useMainStore } from "~/store/maindata";
import { computed, ref, onMounted } from "vue";

const mainData = useMainStore();
const monDataNav = ref([]);

await mainData.fetchData();
monDataNav.value = mainData.getMain;

const phone = computed(() =>
  monDataNav.value.length > 0 ? monDataNav.value[0]?.phone : "",
);
const dopphone = computed(() =>
  monDataNav.value.length > 0 ? monDataNav.value[0]?.dopphone : "",
);
const email = computed(() =>
  monDataNav.value.length > 0 ? monDataNav.value[0]?.email : "",
);
</script>

<template>
  <div class="bd-docs-main">
    <div class="container">
      <footer class="footer">
        <div class="content">
          <p>
            Проектирование, монтаж систем отопления, водоснабжения, канализации.
          </p>
          <p v-if="phone">
            Tel.:<a :href="`tel:+37529` + phone" class="f-phone">{{ phone }}</a>
          </p>
          <p v-if="dopphone">
            Tel.:<a :href="`tel:+37529` + dopphone" class="f-phone">{{
              dopphone
            }}</a>
          </p>
          <p v-if="email">E-mail.: {{ email }}</p>
          <div class="social-links">
            <a href="https://www.instagram.com/profiterm.by/" target="_blank">
              <Icon name="hugeicons:instagram" />
            </a>
            <a href="https://www.facebook.com/profitherm.by" target="_blank">
              <Icon name="hugeicons:facebook-01" />
            </a>
            <a
              href="https://www.youtube.com/channel/UC3wkjV2806LxgRBjtnPR4eQ"
              target="_blank"
            >
              <Icon name="ph:youtube-logo-light" />
            </a>
          </div>
          <p><span>© 2024 «ПРОФИТЕРМ»</span></p>
          <!-- <p class="f-dev">
            <span>Разработка -</span
            ><nuxt-link target="_blank" to="https://fastsite.tech"
              >fastsite.tech</nuxt-link
            >
          </p> -->
        </div>
      </footer>
    </div>
  </div>
</template>

<style scoped lang="scss">
.footer {
  background-color: $color-bg-light !important;
  color: $color-text-muted;
  padding: $spacing-xl $spacing-xxl $spacing-lg !important;
  border-radius: $border-radius-lg;
  margin: 100px 0 $spacing-xl;
  @include float-full;

  p {
    margin: 0 0 $spacing-sm !important;
  }

  .f-dev {
    font-size: 15px;
    margin: 0 0 0 0px !important;

    span {
      color: #637d5f;
    }

    a {
      margin: 0 0 0 $spacing-xs;
      font-weight: 600;
      color: #637d5f;
    }
  }
}

.social-links {
  margin: 0 0 $spacing-lg;

  a {
    margin: 0 $spacing-xs 0 0;
    color: $color-text-gray;
    display: inline-block;

    &:hover {
      opacity: 0.5;
      @include transition(opacity);
    }

    .icon {
      height: $spacing-xxl;
      width: $spacing-xxl;
    }
  }
}

.f-phone {
  color: $color-text-gray;
}

// Mobile Styles
@media (max-width: 1023px) {
  .footer {
    margin: 60px 0 1rem;
    padding: $spacing-lg $spacing-lg 0px !important;
    background-color: $color-bg-light !important;

    p {
      font-size: 13px;
    }
  }
}
</style>
