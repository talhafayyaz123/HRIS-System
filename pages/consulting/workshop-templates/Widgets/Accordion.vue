<template>
  <div :class="[ 'template-card', selectedWidget?.id == id && selectedWidgetType == 'card' ? '' : '', ]">
    <div class="template-card-header d-flex align-items-center justify-content-between">
      <div class="">
        <input class="tab-checkbox" type="checkbox" :id="id" :checked="true" />
        <h3 class="card-title" :for="id">
          {{ $t(card.configuration.heading) }}
        </h3>
      </div>
      <ElementsIcon class="cursor-pointer" v-bind:icon="'xIcon'" v-if="!showPreview"
        @click.stop="$emit('removeCard', true)" />
    </div>
    <div class="template-card-body p-3">
      <div class="">
        <draggable v-model="card.rows" :move="() => !showPreview" group="rows" item-key="id">
          <!-- The row component is the component that will hold our columns which in turn hold all the widgets -->
          <template #item="{ element: row, index }">
            <Row @removeRow="removeRow(index)" :row="row" :id="row.id" />
          </template>
        </draggable>
        <div v-if="!showPreview" class="d-flex align-items-center justify-content-center">
          <div @click="addRow" class="secondary-btn cursor-pointer">
            <ElementsIcon v-bind:icon="'addIcon'" class="me-2" />
            <span>{{$t("Add Row")}}</span>
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

    &:hover {}
  }
}

.tab-content {
  min-height: 200px;
}

// :checked
input:checked {
  ~.tab-content {
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
