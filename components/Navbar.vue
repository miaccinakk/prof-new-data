<script setup>
import { useMainStore } from "~/store/maindata";
import { useWindowSize } from "@vueuse/core";
const { data: user, signOut } = useAuth();
const visibleDrawer = ref(false);
const noneEl = ref(false);
const windowWidth = ref("");
const menyMobail = ref(false);
const Exit = async () => {
  await signOut();
};
// const visibleDrawer = (item) => {
//   menyMobail.value = item;
// };
const mainData = useMainStore();

const { width, height } = useWindowSize();
watchEffect(() => {
  windowWidth.value = width.value;
});

const monDataNav = computed(() => mainData.getMain);
const phone = computed(() =>
  monDataNav.value.length > 0 ? monDataNav.value[0]?.phone : "",
);
const dopphone = computed(() =>
  monDataNav.value.length > 0 ? monDataNav.value[0]?.dopphone : "",
);
mainData.fetchData();
</script>
<template>
  <div class="bd-docs-main fix-nav">
    <div class="container">
      <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand-header">
          <nuxt-link to="/">
            <img
              src="/logotip.png"
              alt="Профитерм — инженерные системы отопления и водоснабжения"
              width="160"
              height="48"
          /></nuxt-link>
        </div>
        <div class="navbar-menu">
          <div class="navbar-start">
            <nuxt-link to="/catalog">Наши работы</nuxt-link>
            <nuxt-link to="/calculator">Стоимость</nuxt-link>
            <nuxt-link to="/installment" class="mobail-none"
              >Рассрочка</nuxt-link
            >
            <nuxt-link to="/articles" class="mobail-none">Статьи</nuxt-link>
            <nuxt-link to="/about" class="mobail-none">О нас</nuxt-link>
            <nuxt-link to="/contacts" class="mobail-none">Контакты</nuxt-link>
          </div>
        </div>
        <ClientOnly>
          <div v-if="windowWidth > 700" class="navbar-phone">
            <a :href="`tel:+37529` + phone" class="mobail-hide"
              >{{ phone }} <Icon name="ph:phone-thin"
            /></a>
          </div>
          <div v-if="windowWidth < 700" class="navbar-phone-mobail mobail-none">
            <el-dropdown trigger="click" popper-class="dropdown-header">
              <button class="button">
                <span class="icon"><Icon name="ph:phone-thin" /></span>
              </button>

              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>
                    <a :href="`tel:+37529` + phone" class="mobail-hide"
                      >{{ phone }}
                    </a></el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </ClientOnly>
        <ClientOnly>
          <div v-if="windowWidth < 700" class="mobail-meny">
            <button
              class="button hm-mobail"
              @click="visibleDrawer = !visibleDrawer"
            >
              <span class="icon">
                <Icon
                  :name="
                    menyMobail
                      ? 'solar:close-circle-broken'
                      : 'solar:hamburger-menu-broken'
                  "
                />
              </span>
            </button>
            <el-drawer v-model="visibleDrawer" class="meny-nav-cat">
              <div class="meny-nav">
                <nuxt-link to="/" @click="visibleDrawer = !visibleDrawer"
                  >Главная</nuxt-link
                >
                <nuxt-link to="/catalog" @click="visibleDrawer = !visibleDrawer"
                  >Наши работы</nuxt-link
                >
                <nuxt-link
                  to="/calculator"
                  @click="visibleDrawer = !visibleDrawer"
                  >Калькулятор</nuxt-link
                >
                <nuxt-link
                  to="/articles"
                  @click="visibleDrawer = !visibleDrawer"
                  >Статьи</nuxt-link
                >
                <nuxt-link
                  to="/installment"
                  @click="visibleDrawer = !visibleDrawer"
                  >Рассрочка платежа</nuxt-link
                >
                <nuxt-link to="/about" @click="visibleDrawer = !visibleDrawer"
                  >О нас</nuxt-link
                >
                <nuxt-link
                  to="/contacts"
                  @click="visibleDrawer = !visibleDrawer"
                  >Контакты</nuxt-link
                >
              </div>
            </el-drawer>
          </div>
        </ClientOnly>
        <div class="mobail-none admin-meny">
          <div v-if="user == null" class="">
            <div v-if="noneEl" class="buttons">
              <nuxt-link class="button is-primary" to="/login/"
                >Login</nuxt-link
              >
              <nuxt-link class="button is-light" to="/registration/"
                >Reg</nuxt-link
              >
            </div>
          </div>
          <div v-else class="">
            <div class="buttons">
              <nuxt-link class="button is-primary" to="/cabinet/"
                >Cabinet</nuxt-link
              >
              <button @click="Exit" class="button">Exit</button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </div>
</template>

<style scoped lang="scss">
.navbar {
  padding: $spacing-sm 0px 6.18px 0px;

  &-start {
    margin: 0 0 0 50px;
    align-items: center;

    a {
      font-weight: 700;
      color: $color-text-light;
      border: 0px solid $color-border;
      padding: 7px $spacing-lg $spacing-md;
      border-radius: $border-radius-lg;
      font-size: 12px;
      text-transform: uppercase;
      height: auto;

      &:hover {
        text-decoration: underline;
        color: $color-accent;
      }
    }
  }

  &-brand-header {
    img {
      max-height: 100%;
      width: 110px;
    }
  }

  &-menu .navbar-start {
    align-items: center;
  }

  &-phone {
    padding: 7px 0px $spacing-md;

    a {
      color: $color-primary;
      font-size: 14px;
      font-weight: 500;
    }

    .icon {
      color: $color-accent-red;
      margin: 0 0px 0 $spacing-xs;
      transform: scaleX(-1);
      top: -1px;
      position: relative;
    }
  }

  &-phone-mobail {
    .icon {
      color: $color-accent-red;
      transform: scaleX(-1);
    }
  }
}

.fix-nav {
  position: fixed;
  top: 0;
  z-index: 222;
  background: $color-white;
  left: 0;
  right: 0;
}

.meny-nav {
  position: relative;

  > button {
    margin: 0 0 0 50px;
  }
}

.meny-nav-cat {
  position: absolute;
  background: $color-white;
  padding: $spacing-xl $spacing-xl $spacing-md;
  border-radius: $border-radius-xl;
  width: 430px;
  margin: $spacing-sm 0 0 50px;
  box-shadow: $shadow-sm;

  a {
    display: flex;
    align-items: center;
    margin: 0 0 $spacing-md;
    color: $color-text-dark;
    font-size: 16px;
  }
}

.meny-nav-img {
  height: 70px;
  width: 100px;
  border-radius: $border-radius-md;
  overflow: hidden;
  margin: 0 $spacing-md 0 0;

  img {
    @include img-cover;
  }
}

// Mobile Styles
@media (max-width: 1023px) {
  .navbar-start {
    margin: 0 0 0 -5px;
    position: absolute;
    left: 70px;
    top: $spacing-sm;

    a {
      font-weight: 500;
      font-size: 11px;
      padding: 0px 0px 3px $spacing-lg;
      display: inline-block;
      position: relative;
      top: 0px;

      &:first-child::after {
        content: "|";
        position: absolute;
        right: -12px;
      }
    }
  }

  .navbar {
    padding: $spacing-xs 0;
    height: auto;
    min-height: auto !important;
    display: flex;
    width: 100%;
    justify-content: space-between;

    &-menu {
      display: block !important;
      background: transparent !important;
      box-shadow: none !important;
      margin: 0 0 0 0px !important;
      padding: 0 0 0 0 !important;
    }

    &-end {
      display: none;
    }

    &-brand {
      float: left;
      padding: $spacing-xs $spacing-md $spacing-md;
      height: 15px;

      &-header {
        float: left;
        padding: $spacing-xs 0 0px;

        img {
          height: 100%;
          max-width: 70px;
          height: 21px;
        }
      }
    }

    &-phone-mobail {
      position: absolute;
      right: 45px;

      .el-tooltip__trigger {
        border: none;
        background: transparent;
        height: auto;
        padding: 0px $spacing-md;
        transform: scaleX(-1);

        .icon {
          height: 36px;
          width: 28px;
        }
      }
    }
  }

  .hm-mobail {
    background: transparent !important;
    height: auto !important;
    padding: 0px $spacing-xs 0px 18px !important;
    border: none !important;

    .icon {
      height: 35px !important;
      width: 36px !important;
    }
  }

  .meny-nav-cat {
    width: auto !important;
    height: auto !important;
    left: $spacing-xs !important;
    right: $spacing-xs !important;
    margin: 0;
    top: $spacing-xs !important;
    bottom: $spacing-xs !important;
    background: #262626 !important;

    a {
      color: $color-white;
      text-decoration: none;
      font-size: 18px;
      padding: $spacing-xs $spacing-md;
      margin: $spacing-sm 0;
      @include transition;
      cursor: pointer;
      width: 100%;
      font-weight: 400;
    }

    :deep(.el-drawer__close-btn) {
      padding: 0;

      .el-icon {
        height: 1em;
        width: 1em;
        font-size: 44px;
        color: $color-white;
      }
    }

    :deep(.el-drawer__header) {
      padding: 0;
    }
  }
}
</style>
