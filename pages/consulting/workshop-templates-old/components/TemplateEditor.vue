<template>
  <div>
    <h6
      v-if="$route.name !== 'WorkshopTemplatesShow'"
      class="text-xl font-normal leading-normal mb-2 text-cyan-800 mt-5"
    >
      {{ $t("Template Editor") }}
    </h6>
    <div
      :class="[
        $route.name !== 'WorkshopTemplatesShow'
          ? 'template-editor shadow p-2'
          : '',
      ]"
    >
      <!-- 
              the selected widget configuration will appear here.
              is toggled when the gear icon is clicked on the right side of the display
              if the showPreview state is set to true then hide the configuration
          -->
      <WidgetConfiguration v-if="!showPreview" />
      <!-- 
              Toolbar contains all the available widget icons that can be dragged and dropped onto a column
              Toolbar is hidden for the show page
          -->
      <Toolbar v-if="$route.name !== 'WorkshopTemplatesShow'" />
      <!-- 
              The cards will hold our accordions, not the components themselves but the data related to the components.
              using draggable allows us to change the ordering of the card using drag and drop
          -->
      <draggable
        :move="() => !showPreview"
        v-model="cards"
        group="cards"
        item-key="id"
      >
        <!-- The accordion component is the main component that holds are our inputs -->
        <template #item="{ element: card, index }">
          <Accordion
            @click.native="selectWidget(index)"
            @removeCard="removeCard(index)"
            :card="card"
            :id="card.id"
            class="my-5"
          />
        </template>
      </draggable>
      <!-- 
              This section displays a add card button of sorts that adds a card 
              if the showPreview state is set to true then hide this section
          -->
      <div v-if="!showPreview" class="flex justify-center">
        <div
          @click="addCard"
          class="add-card-section flex justify-center items-center"
        >
          <span class="flex"
            ><font-awesome-icon
              class="cursor-pointer cross text-black self-center mr-2"
              icon="fa-solid fa-plus"
            />
            <h1>Add Card</h1></span
          >
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
    if(value == true){
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
          title: t("Card created successfully!"),
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
