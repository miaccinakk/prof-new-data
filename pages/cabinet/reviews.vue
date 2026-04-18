<script setup>
import { UploadFilled } from "@element-plus/icons-vue";
definePageMeta({
  middleware: "auth",
  layout: "custom",
});
const config = useRuntimeConfig();
const { data: project } = await useFetch("/api/project/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
  body: {},
});
// const pageTotal = ref(0)
const sortPage = ref(0);
const currentPage = ref(1);
const pageSize = ref(4);
const drawer = ref(false);
const buttonEdit = ref(false);
const dell = ref({});
const imfArr = ref([]);
const fileUpload = ref([]);
const fileDelte = ref([]);
const form = ref({
  level: "",
  project: "",
  name: "",
  img: [],
  description: "",
});
const {
  data: reviews,
  error,
  refresh,
} = await useFetch("/api/reviews/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
  body: computed(() => ({
    sortPage: sortPage.value,
    pageSize: pageSize.value,
  })),
});

const addReviews = async () => {
  const bodyFils = new FormData();
  let updatereviews = "api/update/updatereviews";
  if (buttonEdit.value == true) {
    updatereviews = "api/add/addreviews";
  } else {
    if (fileDelte.value.length != 0) {
      const { data: responseDell } = await useFetch("/api/deletefiles/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
        body: { img: fileDelte.value },
      });
    }
  }
  const { data: responseData } = await useFetch(`/${updatereviews}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: form.value,
  });

  for (let i = 0; i < fileUpload.value.length; i++) {
    bodyFils.append("file", fileUpload.value[i]);
  }
  if (form.value.img.length != 0) {
    await useFetch("/api/multiupload", {
      method: "POST",
      body: bodyFils,
      onResponse(context) {},
    });
  }
  if (responseData) {
    refresh();
    form.value = {
      project: "",
      name: "",
      img: [],
      description: "",
      level: "",
    };
    imfArr.value = [];
    form.value.description = "<p></p>";
  }
};
const drawerDel = async (id, img) => {
  let arrImg = [];
  for (let item in img) {
    if (img[item].name != undefined) {
      arrImg.push(img[item]);
    }
  }
  if (arrImg.length != 0) {
    const { data: responseDell } = await useFetch("/api/deletefiles/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: { img: arrImg },
    });
  }
  dell.value = { _id: id };
  const { data: responseData } = await useFetch("/api/delete/deletereviews/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: dell.value,
  });
  if (responseData) {
    refresh();
  }
};
const drawerIn = (item) => {
  form.value.img = [];
  fileUpload.value = [];
  if (item.img.length) {
    form.value.img = item.img;
    imfArr.value = item.img;
  }
  ((form.value._id = item._id),
    (form.value.level = item.level),
    (form.value.project = item.project),
    (form.value.name = item.name),
    (form.value.description = item.description),
    (drawer.value = true));
  buttonEdit.value = false;
  fileDelte.value = [];
};

const drawerNull = () => {
  drawer.value = true;
  buttonEdit.value = true;
  imfArr.value = [];
  fileUpload.value = [];
  for (let item in form.value) {
    form.value[item] = "";
    if (item == "description") {
      form.value[item] = "<p></p>";
    }
    if (item == "img") {
      form.value[item] = [];
    }
  }
  delete form.value["_id"];
};
const handleCurrentChange = (val) => {
  if (val == 1) {
    sortPage.value = 0;
  } else {
    sortPage.value = val * pageSize.value - pageSize.value;
  }
  currentPage.value = val;
  refresh();
};
const addImg = (fileData) => {
  const filename = fileData.name;
  const randomPart = Math.random().toString(36).substring(7);
  const newFilename = randomPart + filename;

  const modifiedFile = new File([fileData], newFilename, {
    type: fileData.type,
  });

  fileUpload.value.push(modifiedFile);
  form.value.img.push({
    name: modifiedFile.name,
    url: `${config.public.filesPath}${modifiedFile.name}`,
  });
};

const beforeRemove = (file, fileList) => {
  form.value.img = [];
  fileDelte.value.push(file);
  form.value.img = imfArr.value;
  if (file.size != undefined && fileList.length == 1) {
    fileDelte.value = [];
  }
};
const handleCloseDrawer = () => {
  drawer.value = false;
  refresh();
};
</script>

<template>
  <div class="container">
    <div class="columns">
      <div class="column is-8">
        <div class="content">
          <div class="cat-h1-cab">
            <h1>Reviews</h1>
            <button class="button is-white" type="primary" @click="drawerNull">
              <span class="icon">
                <Icon class="modal-b-svg" name="solar:add-square-broken" />
              </span>
              <span>Добавить отзыв</span>
            </button>
          </div>
          <div class="drawer-add">
            <div v-if="reviews.result" class="drawer-cat-all">
              <div
                class="drawer-cat"
                v-for="item in reviews.result"
                :key="item"
              >
                <div class="drawer-cat-left">
                  <div class="drawer-cat-img">
                    <NuxtImg
                      v-if="item.img.length"
                      :src="item.img[0].url"
                      :alt="item.img[0].name"
                      format="wepb"
                    />
                    <img v-else src="/noimg.webp" />
                  </div>
                  <span>{{ item.level }}</span
                  ><strong>{{ item.name }}</strong>
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
                    @click="drawerDel(item._id, item.img)"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
            <ClientOnly>
              <el-drawer
                v-model="drawer"
                :before-close="handleCloseDrawer"
                title="I am the title"
                :with-header="false"
                size="60%"
              >
                <span>Hi there!</span>
                <div class="drawer-block">
                  <form
                    @submit.prevent="addReviews"
                    enctype="multipart/form-data"
                  >
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
                      <el-select
                        v-model="form.project"
                        class=""
                        placeholder="project"
                        size="large"
                      >
                        <el-option
                          v-for="item in project.result"
                          :key="item._id"
                          :label="item.title"
                          :value="item.kirilica"
                        />
                      </el-select>
                    </div>
                    <div class="field">
                      <div class="control">
                        <input
                          class="input"
                          type="text"
                          placeholder="user name"
                          v-model="form.name"
                        />
                      </div>
                    </div>
                    <div class="field">
                      <div class="control">
                        <QuillEditor
                          v-model:content="form.description"
                          contentType="html"
                          toolbar="full"
                          theme="snow"
                        ></QuillEditor>
                      </div>
                    </div>
                    <div class="field">
                      <div class="control">
                        <el-upload
                          class="upload-demo"
                          :before-upload="addImg"
                          :before-remove="beforeRemove"
                          drag
                          action="#"
                          multiple
                          list-type="picture"
                          v-model:file-list="imfArr"
                        >
                          <el-icon class="el-icon--upload"
                            ><upload-filled
                          /></el-icon>
                          <div class="el-upload__text">
                            Drop img here or <em>click to upload </em>
                          </div>
                        </el-upload>
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
          :total="reviews.count"
          @current-change="handleCurrentChange"
        />
      </div>
      <div class="column is-4">
        <cabinet-LeftBar />
      </div>
    </div>
  </div>
</template>
