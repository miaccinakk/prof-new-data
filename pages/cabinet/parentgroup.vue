<script setup>
definePageMeta({
  middleware: "auth",
  layout: "custom",
});

// const pageTotal = ref(0)
const sortPage = ref(0);
const currentPage = ref(1);
const pageSize = ref(4);
const drawer = ref(false);
const buttonEdit = ref(false);
const dell = ref({});
const form = ref({
  typecalk: "",
  level: 0,
  title: "",
  icon: "",
});

const {
  data: parentgroup,
  error,
  refresh,
} = await useFetch("/api/parentgroup/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
  body: computed(() => ({
    sortPage: sortPage.value,
    pageSize: pageSize.value,
  })),
});

const addGroupcalk = async () => {
  let updatecalk = "api/update/updateparentgroup";
  if (buttonEdit.value == true) {
    updatecalk = "api/add/addparentgroup";
  }
  const { data: responseData } = await useFetch(`/${updatecalk}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: form.value,
  });
  if (responseData) {
    refresh();
    form.value = {};
  }
};
const drawerDel = async (id) => {
  dell.value = { _id: id };
  const { data: responseData } = await useFetch(
    "/api/delete/deleteparentgroup/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: dell.value,
    },
  );
  if (responseData) {
    refresh();
  }
};
const drawerIn = (item) => {
  console.log(item);
  form.value._id = item._id;

  ((form.value.title = item.title),
    (form.value.level = item.level),
    (form.value.icon = item.icon),
    (drawer.value = true));
  buttonEdit.value = false;
};

const drawerNull = () => {
  drawer.value = true;
  buttonEdit.value = true;
  form.value = {};
};
const handleCurrentChange = (val) => {
  if (val == 1) {
    sortPage.value = 0;
  } else {
    sortPage.value = val * 4 - 4;
  }
  currentPage.value = val;
  refresh();
};
</script>

<template>
  <div class="container">
    <div class="columns">
      <div class="column is-8">
        <div class="content">
          <div class="cat-h1-cab">
            <h1>ParentGroupCalk</h1>
            <button class="button is-white" type="primary" @click="drawerNull">
              <span class="icon">
                <Icon class="modal-b-svg" name="solar:add-square-broken" />
              </span>
              <span>Добавить Родителя</span>
            </button>
          </div>
          <div class="drawer-add">
            <div v-if="parentgroup.result" class="drawer-cat-all">
              <div
                class="drawer-cat"
                v-for="item in parentgroup.result"
                :key="item"
              >
                <div class="drawer-cat-left">
                  <strong>{{ item.title }}</strong>
                </div>
                <div class="drawer-cat-right">
                  <button
                    class="button is-warning is-normal is-light"
                    type="submit"
                    @click="drawerIn(item)"
                  >
                    Edit
                  </button>
                  <button
                    class="button is-danger is-normal is-light"
                    type="submit"
                    @click="drawerDel(item._id)"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
            <ClientOnly>
              <el-drawer
                v-model="drawer"
                title="I am the title"
                :with-header="false"
                size="60%"
              >
                <span>Hi there!</span>
                <div class="drawer-block">
                  <form @submit.prevent="addGroupcalk">
                    <div class="field">
                      <div class="control">
                        <input
                          class="input"
                          type="text"
                          placeholder="level"
                          v-model="form.level"
                        />
                      </div>
                    </div>

                    <div class="field">
                      <div class="control">
                        <input
                          class="input"
                          type="text"
                          placeholder="title"
                          v-model="form.title"
                        />
                      </div>
                    </div>
                    <div class="field">
                      <div class="control">
                        <input
                          class="input"
                          type="text"
                          placeholder="icon"
                          v-model="form.icon"
                        />
                      </div>
                    </div>
                    <div class="field">
                      <div class="control">
                        <button
                          v-if="buttonEdit == true"
                          class="button is-success"
                          type="submit"
                        >
                          Save
                        </button>
                        <button
                          v-else
                          class="button is-success"
                          type="submit"
                          @click="drawer = false"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </el-drawer>
            </ClientOnly>
          </div>
        </div>
        <el-pagination
          background
          layout="prev, pager, next"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="parentgroup.count"
          @current-change="handleCurrentChange"
        />
      </div>
      <div class="column is-4">
        <cabinet-LeftBar />
      </div>
    </div>
  </div>
</template>

<style>
.cat-h1-cab {
  float: left;
  width: 100%;
  margin: 0 0 20px;
}
.cat-h1-cab h1 {
  float: left;
}
.cat-h1-cab button {
  float: right;
  font-size: 15px;
  border-radius: 5px;
}
</style>
