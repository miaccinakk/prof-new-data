<script setup>
import { useMainStore } from "~/store/maindata";
import { computed, ref } from "vue";

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

// Навигационные ссылки
const navLinks = [
  { to: "/catalog", label: "Наши работы" },
  { to: "/calculator", label: "Стоимость" },
  { to: "/installment", label: "Рассрочка" },
  { to: "/articles", label: "Статьи" },
  { to: "/about", label: "О нас" },
  { to: "/contacts", label: "Контакты" },
];
</script>

<template>
  <div class="bd-docs-main">
    <div class="container">
      <footer class="footer">
        <div class="footer-content">
          <!-- Левая колонка - О компании -->
          <div class="footer-col footer-about">
            <p class="footer-desc">
              Проектирование, монтаж систем отопления, водоснабжения, канализации.
            </p>
            <div class="footer-contacts">
              <p v-if="phone">
                <a :href="`tel:+37529` + phone" class="f-phone">{{ phone }}</a>
              </p>
              <p v-if="dopphone">
                <a :href="`tel:+37529` + dopphone" class="f-phone">{{ dopphone }}</a>
              </p>
              <p v-if="email" class="f-email">{{ email }}</p>
            </div>
            <div class="social-links">
              <a href="https://www.instagram.com/profiterm.by/" target="_blank" aria-label="Instagram">
                <Icon name="hugeicons:instagram" />
              </a>
              <a href="https://www.facebook.com/profitherm.by" target="_blank" aria-label="Facebook">
                <Icon name="hugeicons:facebook-01" />
              </a>
              <a href="https://www.youtube.com/channel/UC3wkjV2806LxgRBjtnPR4eQ" target="_blank" aria-label="YouTube">
                <Icon name="ph:youtube-logo-light" />
              </a>
            </div>
          </div>

          <!-- Правая колонка - Навигация -->
          <nav class="footer-col footer-nav" aria-label="Навигация в подвале">
            <ul class="footer-nav-list">
              <li v-for="link in navLinks" :key="link.to">
                <nuxt-link :to="link.to">{{ link.label }}</nuxt-link>
              </li>
            </ul>
          </nav>
        </div>

        <!-- Нижняя строка -->
        <div class="footer-bottom">
          <span class="footer-copy">© 2024 «ПРОФИТЕРМ»</span>
          <nuxt-link to="/sitemap" class="footer-sitemap">Карта сайта</nuxt-link>
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
}

.footer-content {
  display: flex;
  justify-content: space-between;
  gap: $spacing-xl;
  margin-bottom: $spacing-lg;
}

.footer-col {
  flex: 1;
}

.footer-about {
  max-width: 400px;
}

.footer-desc {
  margin: 0 0 $spacing-md !important;
  line-height: 1.5;
}

.footer-contacts {
  margin-bottom: $spacing-md;

  p {
    margin: 0 0 $spacing-xs !important;
  }
}

.f-phone {
  color: $color-text-gray;
  font-weight: 500;

  &:hover {
    color: $color-primary;
  }
}

.f-email {
  color: $color-text-gray;
}

.social-links {
  display: flex;
  gap: $spacing-sm;

  a {
    color: $color-text-gray;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    &:hover {
      opacity: 0.6;
      @include transition(opacity);
    }

    .icon {
      height: $spacing-xxl;
      width: $spacing-xxl;
    }
  }
}

.footer-nav {
  display: flex;
  justify-content: flex-end;
  max-width: 200px;
}

.footer-nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;

  li a {
    color: $color-text-gray;
    font-size: 14px;
    text-decoration: none;
    @include transition;

    &:hover {
      color: $color-primary;
    }
  }
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: $spacing-md;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

.footer-copy {
  font-size: 13px;
}

.footer-sitemap {
  font-size: 13px;
  color: $color-text-muted;
  text-decoration: none;
  @include transition;

  &:hover {
    color: $color-primary;
  }
}

// Mobile Styles
@media (max-width: 768px) {
  .footer {
    margin: 60px 0 1rem;
    padding: $spacing-lg !important;
  }

  .footer-content {
    flex-direction: column;
    gap: $spacing-lg;
  }

  .footer-about {
    max-width: 100%;
  }

  .footer-desc,
  .footer-contacts p,
  .footer-nav-list li a {
    font-size: 13px;
  }

  .footer-nav {
    justify-content: flex-start;
    max-width: 100%;
  }

  .footer-nav-list {
    flex-direction: row;
    flex-wrap: wrap;
    gap: $spacing-sm $spacing-md;
  }

  .footer-bottom {
    flex-direction: column;
    gap: $spacing-sm;
    text-align: center;
  }

  .social-links .icon {
    height: 28px;
    width: 28px;
  }
}
</style>
