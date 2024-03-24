<template>
  <div
    :class="[
      'tabs',
      // highlight the card with a border when the id of the selectedWidget matches the id of the component
      selectedWidget?.id == id && selectedWidgetType == 'card'
        ? 'border-2 border-blue-500'
        : '',
    ]"
  >
    <div class="relative tab">
      <input class="tab-checkbox" type="checkbox" :id="id" :checked="true" />
      <label
        class="card-header rounded tab-label flex justify-between p-2 secondary-color font-bold"
        :for="id"
      >
        {{ $t(card.configuration.heading) }}
        <!-- 
                    if the showPreview state is set to true then hide the remove card icon
                 -->
        <i class="fe-trash" v-if="!showPreview"
          @click.stop="$emit('removeCard', true)"></i>
        <!-- <font-awesome-icon
          v-if="!showPreview"
          @click.stop="$emit('removeCard', true)"
          class="cursor-pointer cross text-black self-center"
          icon="fa-solid fa-xmark"
        /> -->
      </label>
      <div class="tab-content border p-2">
        <draggable
          v-model="card.rows"
          :move="() => !showPreview"
          group="rows"
          item-key="id"
        >
          <!-- The row component is the component that will hold our columns which in turn hold all the widgets -->
          <template #item="{ element: row, index }">
            <Row @removeRow="removeRow(index)" :row="row" :id="row.id" />
          </template>
        </draggable>
        <!-- 
                    This section displays a add row button that adds a row to the card 
                    if the showPreview state is set to true then hide this section
                -->
        <div v-if="!showPreview" class="flex justify-center">
          <div
            @click="addRow"
            class="add-row-section flex justify-center items-center"
          >
            <span class="flex"
              ><font-awesome-icon
                class="cursor-pointer cross text-black self-center mr-2"
                icon="fa-solid fa-plus"
              />
              <h1>Add Row</h1></span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import Row from "./Row.vue";
import { v4 as uuid } from "uuid";
import {
  workshopTemplateRowCreateRequest,
  workshopTemplateColumnCreateRequest,
  workshopTemplateRowDeleteRequest,
} from "~/utils/apiRequests";
import { useWorkshopTemplateStore } from "~/store/workshopTemplate";
import commonCode from "~/composables/common";
import draggable from "vuedraggable";

const workshop = useWorkshopTemplateStore();
const props = defineProps({
  card: {
    type: Object,
    default: () => ({
      rows: [],
    }),
  },
});
const { router, Toast } = commonCode(),
  { t } = useI18n();

const selectedWidget = computed(function () {
  const workshop = useWorkshopTemplateStore();
  return workshop?.selectedWidget;
});

const selectedWidgetType = computed(function () {
  const workshop = useWorkshopTemplateStore();
  return workshop?.selectedWidgetType;
});

const showPreview = computed(function () {
  const workshop = useWorkshopTemplateStore();
  return workshop?.showPreview;
});

const addRow = async () => {
  try {
    const row = {
      id: uuid(), // Replace with your UUID generation logic
      type: "row",
      workshopTemplatesCardId: props.card.id,
      columns: [
        {
          id: uuid(), // Replace with your UUID generation logic
          type: "column",
          widgets: [],
          configuration: {
            inlineCSS: {
              paddingLeft: 0,
              paddingRight: 0,
              paddingTop: 0,
              paddingBottom: 0,
              marginLeft: 0,
              marginRight: 0,
              marginTop: 0,
              marginBottom: 0,
              width: 300,
            },
            equallySizedColumns: false,
          },
        },
      ],
      configuration: {
        inlineCSS: {
          paddingLeft: 0,
          paddingRight: 0,
          paddingTop: 0,
          paddingBottom: 0,
          marginLeft: 0,
          marginRight: 0,
          marginTop: 0,
          marginBottom: 0,
        },
        equallySizedColumns: false,
      },
    };
    // props.card.rows = [...props.card.rows, { ...row }];

    workshopTemplateRowCreateRequest({
      workshopTemplateCardId: props.card.id,
      configuration: row.configuration,
    })
      .then((response) => {
        Toast.fire({
          icon: "success",
          title: t("Row created successfully!"),
        });
        row.id = response?.data?.id; // set the row id to the id from the response
        row.columns[0]["workshopTemplatesRowId"] = row.id; // set the workshopTemplatesRowId of the column to the one received from the response

        createColumn(row);
      })
      .catch((error) => {
        Toast.fire({ icon: "error", title: "Something went wrong..!!" });
      });
  } catch (e) {
    console.log(e);
  }
};

function createColumn(row) {
  workshopTemplateColumnCreateRequest({
    workshopTemplateRowId: row.columns[0]["workshopTemplatesRowId"],
    configuration: row.columns[0].configuration,
  })
    .then((response) => {
      Toast.fire({
        icon: "success",
        title: t("Column created successfully!"),
      });
      row.columns[0]["id"] = response?.data?.id; // set the column id to the id from the response

      props.card.rows = [...props.card.rows, { ...row }];
    })
    .catch((error) => {
      Toast.fire({ icon: "error", title: "Something went wrong..!!" });
    });
}

const removeRow = async (index) => {
  try {
    const removedRow = props.card.rows.splice(index, 1); //splice from the array on the index
    workshopTemplateRowDeleteRequest(removedRow?.[0]?.id)
          .then((response) => {
            Toast.fire({
              icon: "success",
              title: t("Record deleted successfully!"),
            });
          })
          .catch((error) => {
            console.log(error)
            Toast.fire({ icon: "error", title: t("Something went wrong") });
          });
    // remove the sliced row from the selectedWidget if the deleted row was the selected one
    if (removedRow?.[0]?.id == selectedWidget?.id) {
      workshop.setSelectedWidget(null);
      workshop.setSelectedWidgetType("");
    }
  } catch (e) {
    console.log(e);
  }
};
</script>

<style lang="scss" scoped>
.add-row-section {
  min-height: 50px;
  width: 300px;
  border: 2px solid gray;
  border-style: dashed;
  margin: 1rem;
  cursor: pointer;
  user-select: none;
}
.card-header {
  user-select: none;
  font-size: 1.2rem;
  border: 1px solid #e4e4e4;
}
.tabs {
  overflow: hidden;
}

.tab {
  width: 100%;
  color: black;
  overflow: hidden;
  &-label {
    display: flex;
    justify-content: space-between;
    cursor: pointer;
  }
  &-content {
    display: none;
    max-height: 0;
    color: black;
    transition: all 0.35s;
  }
  &-close {
    display: flex;
    justify-content: flex-end;
    font-size: 0.75em;
    cursor: pointer;
    &:hover {
    }
  }
}

.tab-content {
  min-height: 200px;
}

// :checked
input:checked {
  ~ .tab-content {
    display: block;
    max-height: initial;
  }
}

.inner-accordion-label::after {
  transform: rotate(90deg);
  transform-origin: center;
}

input[class="tab-checkbox"] {
  position: absolute;
  opacity: 0;
  z-index: -1;
}

.inner-accordion {
  display: none;
}
</style>
