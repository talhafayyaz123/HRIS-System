<template>
  <div class="template-editor">
    <div class="card mt-4">
      <div class="card-header d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center">
          <h3 class="card-title me-2" v-if="$route.name !== 'WorkshopTemplatesShow'">{{ $t("Template Editor") }}</h3>
          <ElementsTooltip />
        </div>
        <WidgetConfiguration v-if="!showPreview" />
      </div>
      <div class="card-body pt-3">
        <div class="card p-3">
          <div :class="[$route.name !== 'WorkshopTemplatesShow' ? 'template-editor' : '',]">
            <Toolbar v-if="$route.name !== 'WorkshopTemplatesShow'" />
            <!-- 
              The cards will hold our accordions, not the components themselves but the data related to the components.
              using draggable allows us to change the ordering of the card using drag and drop
          -->
            <draggable :move="() => !showPreview" v-model="cards" group="cards" item-key="id">
              <!-- The accordion component is the main component that holds are our inputs -->
              <template #item="{ element: card, index }">
                <Accordion @click.native="selectWidget(index)" @removeCard="removeCard(index)" :card="card" :id="card.id"
                  class="my-3" />
              </template>
            </draggable>
            <!-- 
              This section displays a add card button of sorts that adds a card 
              if the showPreview state is set to true then hide this section
          -->
            <div v-if="!showPreview" class="d-flex align-items-center justify-content-center">
              <div @click="addCard" class="secondary-btn cursor-pointer">
                <ElementsIcon v-bind:icon="'addIcon'" class="me-2" />
                <span>{{ $t('Add Card') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, onBeforeUnmount } from "vue";
import Accordion from "../Widgets/Accordion.vue";
import Toolbar from "./Toolbar.vue";
import WidgetConfiguration from "./WidgetConfiguration.vue";
import { useWorkshopTemplateStore } from "~/store/workshopTemplate";
import commonCode from "~/composables/common";
import { v4 as uuid } from "uuid";
import draggable from "vuedraggable";
import {
  workshopTemplateCardCreateRequest,
  workshopTemplateCardDeleteRequest,
} from "~/utils/apiRequests";

const workshop = useWorkshopTemplateStore();
const props = defineProps({
  workshopTemplateId: {
    type: Number,
    required: true,
  },
  isGetCards: {
    type: Boolean,
    default: false
  },
  cardsFromAPI: {
    type: Array,
    default: () => [],
  },
});
const { router, Toast } = commonCode();

const emit = defineEmits(["getCards"])
const cards = ref([]),
  { t } = useI18n();
onMounted(() => {
  syncCardsAndCardsFromAPI();
});

onBeforeUnmount(() => {
  const workshop = useWorkshopTemplateStore();
  const obj = {
    widgets: {},
    groups: {},
  };
  workshop.setInputConfiguration(obj);
});

watch(
  () => props.cardsFromAPI,
  () => {
    syncCardsAndCardsFromAPI();
  }
);

watch(
  () => props.isGetCards,
  (value) => {
    if (value == true) {
      emit("getCards", cards.value);
    }

  }
);

const showPreview = computed(function () {
  const workshop = useWorkshopTemplateStore();
  return workshop?.showPreview;
});

const syncCardsAndCardsFromAPI = () => {
  cards.value = [...props.cardsFromAPI];
};

const addCard = async () => {
  try {
    const card = {
      id: uuid(), // Replace with your UUID generation logic
      type: "card",
      rows: [],
      configuration: {
        heading: `Card Heading ${cards.value.length + 1}`,
      },
    };

    workshopTemplateCardCreateRequest({
      workshopTemplateId: props.workshopTemplateId,
      configuration: card.configuration,
    })
      .then((response) => {
        Toast.fire({
          icon: "success",
          title: t("Record created successfully!"),
        });
        card.id = response?.data?.id ?? card.id; // set the card id from the API response
        cards.value = [...cards.value, { ...card }];
      })
      .catch((error) => {
        Toast.fire({ icon: "error", title: "Something went wrong..!!" });
      });
  } catch (e) {
    console.log(e);
  }
};

const removeCard = async (index) => {
  try {
    const removedCard = cards.value.splice(index, 1);
    workshopTemplateCardDeleteRequest(removedCard?.[0]?.id)
      .then((response) => {
        if (removedCard?.[0]?.id == workshop.selectedWidget?.id) {
          workshop.setSelectedWidget(null);
          workshop.setSelectedWidgetType("");
        }
        Toast.fire({
          icon: "success",
          title: t("Record deleted successfully!"),
        });
      })
      .catch((error) => {
        Toast.fire({ icon: "error", title: t("Something went wrong") });
      });
  } catch (e) {
    console.log(e);
  }
};
const selectWidget = (index) => {
  if (!showPreview.value) {
    workshop.setSelectedWidget(cards.value[index]);
    workshop.setSelectedWidgetType("card");
  }
};
</script>

<style scoped>
.add-card-section {
  min-height: 50px;
  width: 300px;
  border: 2px solid gray;
  border-style: dashed;
  margin: 1rem;
  cursor: pointer;
  user-select: none;
}

.template-editor {
  background-color: white;
}
</style>
