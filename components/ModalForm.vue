<script setup>
const visible = ref(false);
const statusButton = ref(false);
const form = ref({
  email: "",
  name: "",
  phone: "",
  info: "",
  description: "",
});
const modalSucces = ref(false);
const addFilter = async () => {
  statusButton.value = true;
  const { data: responseData } = await useFetch("/api/contact/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: form.value,
  });
  if (responseData) {
    statusButton.value = false;
    modalSucces.value = true;
    form.value = {};
    visible.value = false;
  }
};
</script>
<template>
  <div>
    <!-- Form -->
    <button class="button index-b-modal cat-b" @click="visible = true">
      <span>Оформить заявку</span>
      <span class="icon">
        <Icon name="bx:bxs-layer-plus" />
      </span>
    </button>
    <Teleport to="body">
      <div v-if="modalSucces" class="modal-succes">
        <strong>Благодарим за заявку!</strong>
        <p>Мы свяжемся с Вами в ближайшее время.</p>
        <button class="delete is-large" @click="modalSucces = false"></button>
      </div>
    </Teleport>
    <Teleport to="body">
      <ClientOnly>
        <el-dialog
          v-model="visible"
          class="modal-form"
          title="Сформируйте свой запрос."
        >
          <form @submit.prevent="addFilter">
            <div class="field">
              <div class="control">
                <input
                  class="input"
                  type="text"
                  placeholder="Контактное лицо"
                  v-model="form.name"
                />
              </div>
            </div>
            <div class="field">
              <div class="control">
                <input
                  class="input"
                  type="email"
                  placeholder="Email"
                  v-model="form.email"
                />
              </div>
            </div>
            <div class="field">
              <div class="control">
                <input
                  class="input"
                  type="number"
                  placeholder="Телефон"
                  v-model="form.phone"
                />
              </div>
            </div>

            <div class="field">
              <div class="control">
                <input
                  class="input"
                  type="text"
                  placeholder="Адрес объекта"
                  v-model="form.info"
                />
              </div>
            </div>
            <div class="field">
              <div class="control">
                <textarea
                  class="textarea"
                  placeholder="Комментарии"
                  v-model="form.description"
                >
                </textarea>
              </div>
            </div>
            <div class="field">
              <div class="control">
                <button
                  class="button send-form"
                  :class="{ 'is-loading': statusButton }"
                  type="submit"
                  :disabled="statusButton ? statusButton == true : false"
                >
                  <span>Отправить</span>
                  <span class="icon">
                    <Icon name="ri:send-plane-fill" />
                  </span>
                </button>
              </div>
            </div>
          </form>
        </el-dialog>
      </ClientOnly>
    </Teleport>
  </div>
</template>

<style scoped lang="scss">
.modal-succes {
  background: $color-success;
  padding: $spacing-xxl;
  border-radius: 18px;
  position: fixed;
  z-index: 99999;
  display: block;
  float: left;
  top: 80px;
  left: 0;
  right: 0;
  max-width: 500px;
  width: 100%;
  margin: 0 auto;

  strong {
    @include float-full;
    margin: 0 0 $spacing-sm;
    font-size: 21px;
  }

  p {
    @include float-full;
    font-size: 15px;
  }

  .delete {
    float: left;
    position: absolute;
    top: $spacing-lg;
    right: $spacing-lg;
  }
}

:deep(.video-gal),
:deep(.rev-dialog),
:deep(.modal-form) {
  border-radius: $border-radius-xxl !important;
  padding: $spacing-xxl !important;

  .el-icon {
    height: 3em;
    width: 3em;
    color: $color-text-dark !important;

    svg {
      height: 3em;
      width: 3em;
    }
  }

  .el-dialog__headerbtn {
    position: absolute;
    top: $spacing-lg;
    right: $spacing-lg;
  }
}

// Mobile Styles
@media (max-width: 1023px) {
  :deep(.video-gal),
  :deep(.rev-dialog),
  :deep(.modal-form) {
    width: 100% !important;
    margin: 0 !important;
    border-radius: 0px !important;
    padding: 60px $spacing-sm !important;
    bottom: 0;
    height: 100%;
    min-height: 100%;
    display: inline-table;
  }
}
</style>
