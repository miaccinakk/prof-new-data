<script setup>
import jsPDF from "jspdf";

// Инициализация переменных
const calkObject = ref([]);
const visibleSteep = ref(true);
const activeNames = ref([]);
const summEdit = ref([]);
const totalCost = ref(0);
const titleBlock = ref("");
const suumItem = ref([]);
const inputObject = ref({ items: [] });
const selectedValues = ref([]);
const checkedValues = ref([]);
const previousSelectedValues = ref([]);
const isCalculated = ref(false);
const totalCostPdf = ref("");
const parentGrArr = ref("");

let originalCalkObject = [];

const { data: parentgroup } = await useFetch("/api/parentgroup/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
  body: {},
});
if (parentgroup.value) {
  parentGrArr.value = parentgroup.value.result.sort(
    (a, b) => a.level - b.level,
  );
}

const rawGroupcalk = await $fetch("/api/groupcalk/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
});

const { data: elementcalk } = await useFetch("/api/elementcalk/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
});

const { data: rawTypecalk } = await useFetch("/api/typecalk/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
});

const { data: rawItemcalk } = await useFetch("/api/itemcalk/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
});

const nevStep = (id) => {
  const filteredArray = calkObject.value.filter(
    (item) => item.parentgroup === id,
  );
  calkObject.value = filteredArray;
  visibleSteep.value = false;
};

const backStep = () => {
  console.log(originalCalkObject.value);
  totalCost.value = 0;
  summEdit.value = [];
  suumItem.value = [];
  // selectedValues.value = [];
  // checkedValues.value = [];
  visibleSteep.value = true;
  calkObject.value = originalCalkObject.value;
};
const filteredElementOptions = (groupArray, allGroups) => {
  // Проверяем, что groupArray определен и является массивом

  if (!groupArray || !Array.isArray(groupArray)) {
    console.error("groupArray is not an array or is undefined:", groupArray);
    return [];
  }

  // Фильтруем элементы по массиву идентификаторов из groupArray
  return elementcalk.value
    .filter((el) => groupArray.includes(el._id))
    .map((el) => ({
      value: el._id,
      label: el.title || el.name, // Используем title или name для отображения
    }));
};

onMounted(async () => {
  let typecalk = [];
  let itemcalk = [];
  let groupcalk = [];

  try {
    typecalk =
      typeof rawTypecalk.value === "string"
        ? JSON.parse(rawTypecalk.value)
        : rawTypecalk.value;
    itemcalk =
      typeof rawItemcalk.value === "string"
        ? JSON.parse(rawItemcalk.value)
        : rawItemcalk.value;
    groupcalk =
      typeof rawGroupcalk === "string"
        ? JSON.parse(rawGroupcalk)
        : rawGroupcalk;
  } catch (e) {
    console.error("Failed to parse JSON data:", e);
  }

  if (
    Array.isArray(typecalk) &&
    Array.isArray(itemcalk) &&
    Array.isArray(groupcalk)
  ) {
    const typecalkMap = {};
    typecalk.sort((a, b) => a.level - b.level);
    typecalk.forEach((type) => {
      typecalkMap[type._id] = { ...type, items: [], groups: [] };
    });
    itemcalk.forEach((item) => {
      if (typecalkMap[item.typecalk]) {
        typecalkMap[item.typecalk].items.push(item);
      }
    });

    groupcalk.forEach((group) => {
      if (typecalkMap[group.typecalk]) {
        const groupCopy = {
          ...group,
          groupArray:
            typeof group.group === "string" && group.group.trim() !== ""
              ? group.group.split(",")
              : [],
        };
        typecalkMap[group.typecalk].groups.push(groupCopy);
      }
    });
    let count = 0;

    calkObject.value = Object.values(typecalkMap).map((type) => {
      // Сортировка items и groups по уровню
      const sortedItems = type.items.sort((a, b) => a.level - b.level);
      const sortedGroups = type.groups.sort((a, b) => a.level - b.level);

      // Добавление поля count к каждому элементу
      const itemsWithCount = sortedItems.map((item) => ({
        ...item,
        count: count++, // Добавляем поле count и увеличиваем его
      }));

      const groupsWithCount = sortedGroups.map((group) => ({
        ...group,
        count: count++, // Добавляем поле count и увеличиваем его
      }));

      // Создание нового массива AllGroup
      const AllGroup = [...itemsWithCount, ...groupsWithCount];

      // Возвращаем объект с добавленным массивом AllGroup
      return {
        ...type,
        AllGroup: AllGroup,
      };
    });
  }
  originalCalkObject.value = calkObject.value;
  const combined = calkObject.value.flatMap((type) => type.AllGroup);

  // titleBlock.value = titleWork;
  summEdit.value = combined.map(() => 0);

  suumItem.value = combined.map(() => 0);
  selectedValues.value = combined.map(() => null);
  checkedValues.value = combined.map(() => true);
  activeNames.value = calkObject.value.map((item) => item._id);
  // visibleSteep.value = false;
  isCalculated.value = false;
});

const costWork = () => {
  totalCost.value = 0;
  totalCostPdf.value = 0;
  suumItem.value = [];

  let allFieldsFilled = true;

  // Проходим по каждому объекту в calkObject.value
  calkObject.value.forEach((type) => {
    // Проходим по каждому элементу в AllGroup текущего типа
    type.AllGroup.forEach((item, index) => {
      if (!checkedValues.value[item.count]) {
        suumItem.value[item.count] = 0;
        return;
      }

      const quantity = Number(summEdit.value[item.count]) || 0;

      // Исправленная проверка, учитывающая только типы с required элементом
      if (item.type && (!selectedValues.value[item.count] || quantity === 0)) {
        allFieldsFilled = false;
      }

      let finalCost = 0;

      if (item.cost !== undefined) {
        const itemCost = (Number(item.cost) || 0) * quantity;

        if (
          item.unitcoefficient !== undefined &&
          item.coefficient !== undefined
        ) {
          if (quantity >= Number(item.unitcoefficient)) {
            const coefficientReduction =
              1 - (Number(item.coefficient) || 0) / 100;
            finalCost = itemCost * coefficientReduction;
          } else {
            finalCost = itemCost;
          }
        } else {
          finalCost = itemCost;
        }
      } else {
        finalCost = quantity;
      }

      totalCost.value += finalCost;
      suumItem.value[item.count] = finalCost;
      totalCostPdf.value = totalCost.value.toFixed(2);
    });
  });

  // Убираем нулевые значения из suumItem
  suumItem.value = suumItem.value.filter((value) => value !== 0);

  // Обновляем статус расчета
  isCalculated.value = allFieldsFilled;
};

const updateCost = (selectedId, index) => {
  const selectedElement = elementcalk.value.find((el) => el._id === selectedId);
  if (selectedElement) {
    const itemCost = selectedElement.cost || 0;
    if (summEdit.value[index] !== itemCost) {
      summEdit.value[index] = itemCost;
    }
  } else {
    if (summEdit.value[index] !== 0) {
      summEdit.value[index] = 0;
    }
  }
  // console.log(summEdit.value);
  costWork();
};

watch(
  selectedValues,
  (newValues) => {
    isCalculated.value = false;
    newValues.forEach((value, index) => {
      if (value !== previousSelectedValues.value[index]) {
        updateCost(value, index);
      }
    });
    previousSelectedValues.value = [...newValues];
  },
  { deep: true, immediate: true },
);

watch(
  summEdit,
  (newValues) => {
    costWork();
  },
  { deep: true },
);
const calculateTotal = () => {
  let allFieldsFilled = true;

  // Проходим по каждому элементу в calkObject.value
  calkObject.value.forEach((type) => {
    // Проходим по каждому элементу в AllGroup текущего типа
    type.AllGroup.forEach((item, index) => {
      if (!checkedValues.value[item.count]) return; // Игнорировать заблокированные элементы

      if (item.type && !summEdit.value[item.count]) {
        allFieldsFilled = false;
      }

      if (
        !item.type &&
        (!selectedValues.value[item.count] || !summEdit.value[item.count])
      ) {
        allFieldsFilled = false;
      }
    });
  });

  if (allFieldsFilled) {
    costWork();
    isCalculated.value = true;
  } else {
    openNotif();
  }
};

const generatePDF = () => {
  const doc = new jsPDF();

  doc.addFileToVFS("Roboto.ttf", RobotoBase64);
  doc.addFont("Roboto.ttf", "Roboto", "normal");
  doc.setFont("Roboto");
  doc.setFontSize(11);

  doc.text("Расчет стоимости работ", 10, 10);

  let y = 20;

  // Сохраняем все используемые индексы для проверки
  const usedIndexes = new Set();

  // Проходим по каждому элементу в calkObject.value
  calkObject.value.forEach((type) => {
    type.AllGroup.forEach((item) => {
      const countIndex = item.count; // Предполагаем, что `item.count` указывает на правильный индекс
      if (countIndex === undefined) return;

      // Проверяем состояние переключателя
      const isChecked = checkedValues.value[countIndex];

      if (!isChecked) {
        return;
      }

      const quantity = parseFloat(summEdit.value[countIndex]) || 0;
      const itemCost = (item.cost || 0) * quantity;
      let finalCost = itemCost;

      if (quantity >= (item.unitcoefficient || 0)) {
        const coefficientReduction = 1 - (item.coefficient || 0) / 100;
        finalCost = itemCost * coefficientReduction;
      }

      const selectedLabel = selectedValues.value[countIndex]
        ? elementcalk.value.find(
            (el) => el._id === selectedValues.value[countIndex],
          )?.title || "Не выбрано"
        : "Не выбрано";

      doc.text(`------------------------------------------`, 10, y + 10);
      doc.text(
        `Тип работ ${countIndex + 1}: ${item.name || item.title}`,
        10,
        y,
      );
      // doc.text(`Стоимость : ${finalCost} руб.`, 10, y + 20);

      if (item.type) {
        doc.text(`Количество: ${quantity} ${item.type}`, 10, y + 5);
      } else {
        doc.text(`Выбранный элемент: ${selectedLabel}`, 10, y + 5);
      }

      y += 20;
    });
  });
  // Проверяем, что итоговая стоимость определена и корректна
  doc.text(`Итоговая стоимость: ${totalCostPdf.value} руб.`, 10, y);

  doc.save("calculation.pdf");

  // Выводим итоговую стоимость в консоль для отладки
  console.log(`Total Cost: ${totalCostPdf.value}`);
};

const updateSummEdit = (index, value) => {
  isCalculated.value = false;
  summEdit.value[index] = value ? Number(value) : 0;
};

const isSmallScreen = ref(false);

const handleResize = () => {
  isSmallScreen.value = window.innerWidth < 500;
};

onMounted(() => {
  handleResize(); // Устанавливаем начальное значение
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
const openNotif = () => {
  ElNotification({
    title: "Ошибка",
    message: `
      <div>
        Выберите и заполните все значения!<br/>
        <strong>Не нужные пункты отключите!</strong>

        <div style="margin-top:12px; display:flex; align-items:center; gap:10px;">
          
          <!-- Включено -->
          <div style="display:flex; flex-direction:column; align-items:center;">
            <div style="
              width:40px;
              height:20px;
              background:#13ce66;
              border-radius:20px;
              position:relative;
            ">
              <div style="
                width:18px;
                height:18px;
                background:#fff;
                border-radius:50%;
                position:absolute;
                right:1px;
                top:1px;
              "></div>
            </div>
            <span style="font-size:12px;">Вкл</span>
          </div>

          <!-- Стрелка -->
          <div style="
            font-size: 28px;
            font-weight: 800;
            color: #ff4d4f;
            position: relative;
            top: -15px;
          ">
            →
          </div>

          <!-- Выключено -->
          <div style="display:flex; flex-direction:column; align-items:center;">
            <div style="
              width:40px;
              height:20px;
              background:#ff4949;
              border-radius:20px;
              position:relative;
            ">
              <div style="
                width:18px;
                height:18px;
                background:#fff;
                border-radius:50%;
                position:absolute;
                left:1px;
                top:1px;
              "></div>
            </div>
            <span style="font-size:12px;">Выкл</span>
          </div>

        </div>
      </div>
    `,
    type: "error",
    dangerouslyUseHTMLString: true,
    duration: 3000,
  });
};
const openNotifPdf = () => {
  ElNotification({
    title: "Ошибка",
    message: "Рассчитайте изначально стоимость!",
    type: "error",
  });
};

const title = ref("Калькулятор стоимости работ");
const description = ref(
  "С помощью этого калькулятора Вы сможете рассчитать стоимость работ компании Профитерм.",
);
const imgOg = ref("/profiterm.webp");

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
  <div class="container">
    <div class="content">
      <div class="columns is-multiline">
        <div class="column">
          <h1 class="h1-calk">Калькулятор</h1>
        </div>
      </div>

      <div class="columns is-multiline" v-if="visibleSteep">
        <div
          class="column is-4"
          v-for="item in parentGrArr"
          :key="item._id"
          @click="nevStep(item._id)"
        >
          <div class="calk-block">
            <Icon v-if="item.icon" :name="item.icon" />
            <strong>{{ item.title }}</strong>
          </div>
        </div>
      </div>

      <div class="columns is-multiline" v-else>
        <div class="column is-12">
          <div class="calk-block-group">
            <div class="calk-block-group-title">
              <button class="button back-step is-white" @click="backStep">
                <span class="icon">
                  <Icon name="solar:round-alt-arrow-left-broken" />
                </span>
                <span>К списку</span>
              </button>
              {{ titleBlock }}
            </div>
            <el-collapse v-model="activeNames" class="calk-collapse">
              <el-collapse-item
                v-for="itemCalk in calkObject"
                :key="itemCalk._id"
                :title="itemCalk.name || itemCalk.title"
                :name="itemCalk._id"
              >
                <div v-for="item in itemCalk.AllGroup" :key="item._id">
                  <div v-if="item.type">
                    <div class="fill-type-neme">{{ item.name }}</div>
                    <div class="field is-horizontal" v-if="item.type">
                      <div class="field-body field-control">
                        <div class="field">
                          <p class="control">
                            <input
                              class="input"
                              type="number"
                              :value="
                                summEdit[item.count] === 0
                                  ? ''
                                  : summEdit[item.count]
                              "
                              placeholder="Введите значение"
                              :disabled="!checkedValues[item.count]"
                              @input="
                                updateSummEdit(item.count, $event.target.value)
                              "
                            />
                          </p>
                        </div>
                      </div>
                      <div class="field-label is-normal">
                        <label class="label">{{ item.type }}</label>
                      </div>

                      <div class="field-label has-text-right">
                        <el-switch
                          v-model="checkedValues[item.count]"
                          @change="costWork()"
                          v-if="!item.show_check"
                          class="ml-2"
                          size="large"
                          :disabled="item.show_check"
                          style="
                            --el-switch-on-color: #13ce66;
                            --el-switch-off-color: #ff4949;
                          "
                        />
                      </div>
                    </div>
                    <div v-show="item.description" class="full-width desc-calk">
                      {{ item.description }}
                    </div>
                  </div>
                  <div v-else>
                    <div class="fill-type-neme">{{ item.title }}</div>
                    <div class="field is-horizontal">
                      <div class="field-body field-control">
                        <div class="field">
                          <el-select
                            v-model="selectedValues[item.count]"
                            clearable
                            size="large"
                            placeholder="Выберите тип"
                            style="width: 240px"
                            @change="(value) => updateCost(value, item.count)"
                          >
                            <el-option
                              v-for="option in filteredElementOptions(
                                item.groupArray,
                                itemCalk.AllGroup,
                              )"
                              :key="option.value"
                              :label="option.label"
                              :value="option.value"
                            />
                          </el-select>
                        </div>
                      </div>

                      <div class="field-label has-text-right">
                        <el-switch
                          v-model="checkedValues[item.count]"
                          @change="costWork()"
                          class="ml-2"
                          size="large"
                          :disabled="item.show_check"
                          v-if="!item.show_check"
                          style="
                            --el-switch-on-color: #13ce66;
                            --el-switch-off-color: #ff4949;
                          "
                        />
                      </div>
                    </div>
                    <div v-show="item.description" class="full-width desc-calk">
                      {{ item.description }}
                    </div>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
          <div
            :class="{
              'calk-block-cost': true,
              'reversed-order': isSmallScreen,
            }"
          >
            <button
              v-if="isCalculated"
              class="button save-pdf is-danger is-light"
              @click="generatePDF"
              :disabled="!isCalculated"
            >
              Вывести в PDF
            </button>
            <button
              v-else
              class="button save-pdf is-danger is-light"
              @click="openNotifPdf"
            >
              Вывести в PDF
            </button>
            <div v-if="isCalculated">
              <span>Итоговая стоимость:</span>
              <strong>{{ totalCost.toFixed(2) }}<span> руб.</span></strong>
              <p>
                За расчётами материалов обратитесь пожалуйста по номеру телефона
                или оставьте заявку!
              </p>
            </div>
            <button
              class="button calculate-cost is-primary is-light"
              @click="calculateTotal"
              v-else
            >
              Рассчитать
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/scss/mixins" as *;

.calk-block {
  padding: $spacing-xl;
  background: #f1f1f1;
  cursor: pointer;
  border-radius: $border-radius-md;
  height: 200px;
  @include flex-center;
  @include flex-column;
  @include transition;

  .icon {
    font-size: 28px;
    height: $spacing-xxl;
    width: $spacing-xxl;
  }

  strong {
    margin: $spacing-sm;
    font-size: 17px;
    font-weight: 600;
  }

  &:hover {
    background: #dcdcdc;
  }

  &-group {
    margin: $spacing-lg 0 $spacing-lg;
    padding: $spacing-xl;
    border: 1px solid $color-border-light;
    border-radius: $border-radius-md;
    @include flex-column;

    &-title {
      font-weight: 600;
      font-size: 19px;
      margin: 0 0 $spacing-lg;
      @include flex-column;
      align-items: flex-start;
    }

    .el-select {
      max-width: 340px !important;
      width: 100% !important;
    }
  }

  &-cost {
    @include flex-between;
    margin: $spacing-xl 0 0;

    > div {
      text-align: right;

      > span {
        margin: 0 $spacing-sm 0 0;
      }

      > strong {
        font-size: 21px;

        > span {
          font-size: 14px;
        }
      }

      > p {
        max-width: 400px;
        margin: $spacing-lg 0 0;
        line-height: 1.3;
        font-size: 13px;
      }
    }

    &.reversed-order {
      flex-direction: column-reverse;
    }
  }
}

.calk-collapse {
  .el-collapse-item {
    &:last-child {
      margin-bottom: -2px;
    }

    &__header {
      font-size: 17px;
      font-weight: 500;
      padding: $spacing-md 0;
      height: auto;
      text-align: left;
      line-height: 1.4;
    }

    &__content {
      padding-top: 0px !important;
    }
  }

  .field-control {
    max-width: 500px;
  }

  .field-label {
    flex-basis: 0;
    flex-grow: 1;
    flex-shrink: 0;
    margin-left: 1.2rem;
    text-align: left;
    font-size: 16px;
  }

  &-item {
    margin: 0 0 $spacing-md;
    font-size: 16px;
    background: #efefef;
    display: inline-block;
    padding: 0px $spacing-xs;
    border-radius: 6px;

    b {
      font-weight: 500;
      margin: 0 $spacing-sm;
    }

    > strong {
      font-weight: 500;
      margin: 0 $spacing-sm 0 0;
      font-size: 12px;
    }

    &-cost {
      align-items: center;
      display: flex;

      strong {
        font-size: 16px;
        font-weight: 500;
      }

      span {
        font-size: 14px;
      }
    }
  }
}

.fill-type-neme {
  font-size: 15px;
  margin: $spacing-md 0 $spacing-sm;
}

.desc-calk {
  font-size: 14px;
  margin: $spacing-sm 0 0px;
  border-bottom: 2px dotted $color-border-light;
  padding: 0 0 $spacing-sm;
  width: auto !important;
  max-width: 70% !important;
}

.back-step {
  font-size: 13px !important;
  padding-left: $spacing-xs !important;
  margin: 0 0 $spacing-lg;
}

.h1-calk {
  margin: 150px 0 $spacing-lg;
}

.disabled_cack_check .calk-block {
  background: #f1f1f1 !important;
  opacity: 0.4;
}

.index-calk {
  padding: $spacing-xxl;
  margin: 70px 0 70px;
  border: 3px dotted $color-border-light;
  border-radius: $spacing-md;
  @include flex-column;
  gap: $spacing-lg;

  span {
    font-size: 18px;
    line-height: 1.4;
    max-width: 800px;
    color: #757575;
  }

  a {
    background-color: transparent;
    color: #131313;
    box-shadow: $shadow-lg;
    padding: $spacing-sm $border-radius-lg;
    border-radius: $border-radius-md;
    height: auto;
    font-size: 16px !important;
    border: 1px solid #5d5d5d;
    width: 210px;
    text-align: center;
    margin: $spacing-md 0 0;

    &:hover {
      @include transition;
      box-shadow: rgba(8, 27, 75, 0.65) 0px 6px 20px -6px;
      border: 1px solid $color-white;
      color: $color-black;
    }
  }
}
.switch-hint {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;

  .arrow {
    font-size: 26px;
    font-weight: 700;
    color: #ff4d4f;
    position: relative;
    top: -18px;
  }
}
.full-width {
  width: 100%;
  max-width: 100%;
}
@media (max-width: 1023px) {
  .index-calk {
    padding: $spacing-lg;
    margin: $spacing-xxl 0 50px;

    span {
      font-size: 16px;
      line-height: 1.6;
      max-width: 800px;
      color: #757575;
    }

    a {
      padding: $spacing-sm $border-radius-lg;
      font-size: 15px !important;
      width: 200px;
      margin: $spacing-xs 0 0;
    }
  }

  .calk-block {
    height: 150px;

    strong {
      font-size: 16px;
    }
  }

  .h1-calk {
    margin: 80px 0 $spacing-xl !important;
    font-size: 18px !important;
    font-weight: 800 !important;
    line-height: 1.2 !important;
  }

  .calk-collapse {
    .el-collapse-item__header {
      font-size: 16px;
      font-weight: 700;
      height: auto !important;
      line-height: 1.5;
      padding: $spacing-md 0 $spacing-md;
      text-align: left;
    }

    .field-label {
      line-height: 3 !important;
      font-size: 13px !important;
      font-weight: 600 !important;
    }

    .field-control {
      max-width: 200px;
    }

    .el-collapse-item__content {
      padding-bottom: $spacing-sm !important;
    }

    .field:not(:last-child) {
      margin-bottom: 0rem;
      display: flex;
    }
  }

  .calk-block-group {
    margin: $spacing-lg 0 $spacing-lg;
    padding: $spacing-sm;
    border: 1px solid #ededed;

    .el-select {
      width: 200px !important;
    }
  }

  .calk-block-cost {
    flex-direction: column;
    .button {
      width: 100%;
    }
    > div {
      margin: $spacing-lg 0 0;
    }

    .button:first-child {
      margin: $spacing-lg 0 0px;
    }
  }

  .fill-type-neme {
    font-size: 15px;
    margin: $spacing-md 0 $spacing-sm;
    line-height: 1.4;
  }

  .back-step {
    font-size: 13px !important;
    margin: $spacing-sm 0 0px;
    padding-left: $spacing-xs !important;
  }

  .desc-calk {
    font-size: 14px;
    margin: $spacing-sm 0 0px;
    padding: 0 0 $spacing-sm;
    border-bottom: 2px dotted $color-border-light;
    max-width: 100% !important;
  }

  .button-back {
    margin: 0 3px 0 0;

    .icon {
      margin-right: 3px !important;
      height: $spacing-lg !important;
      width: $spacing-lg !important;
    }

    > strong {
      margin: 0 0 0 0px;
      font-size: 13px;
    }

    > span {
      margin: 0 0 0 3px;
    }
  }
}
</style>
