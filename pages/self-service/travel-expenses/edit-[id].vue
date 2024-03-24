<script setup lang="ts">
import {ref} from "vue";
import {routes} from "~/utils/apiRoutes";
import genericFunctionality from "~/composables/genericFunctionality";
import commonCode from "~/composables/common";

useHead({
  title: `Travel Expenses Edit`,
});

const {router} = commonCode(),
    {apiRoute, showFunc} = genericFunctionality(),
    {t} = useI18n(),
    items = [
      {
        text: "Admin portal",
        to: "/",
      },
      {
        text: "Travel Expenses",
        to: "/self-service/travel-expenses",
      },
      {
        text: "Edit",
        active: true,
      },
    ],
    title = t("Edit Travel Expenses"),
    step = ref(1),
    travelExpense = ref([]),
    travelExpenseId = router.params.id;

const refresh = async () => {
  apiRoute.value = routes.TRAVEL_EXPENSE;
  if (travelExpenseId) {
    const response = await showFunc(travelExpenseId);
    if (response?.success) {
      travelExpense.value = response.data;
    }
  }
};

refresh();
</script>
<template>
  <div>
    <page-header :title="title" :items="items"/>
    <div class="wizard-tab">
      <ul class="">
        <li class="nav-item" role="presentation">
          <button
              @click="step = 1"
              class="nav-link"
              :class="{ active: step === 1, 'step-done': step > 1 }"
          >
            Request Details
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
              @click="step = 2"
              class="nav-link"
              :class="{ active: step === 2, 'step-done': step > 2 }"
          >
            Bills
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
              @click="step = 3"
              class="nav-link"
              :class="{ active: step === 3, 'step-done': step > 3 }"
          >
            Private Transportation
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
              @click="step = 4"
              class="nav-link"
              :class="{ active: step === 4, 'step-done': step > 4 }"
          >
            Day Specifications
          </button>
        </li>
      </ul>
    </div>
    <div class="wizard-content">
      <div v-show="step === 1">
        <self-service-travel-expenses-request-details :travelExpense="travelExpense"/>
      </div>
      <div v-show="step === 2">
        <self-service-travel-expenses-bills :travelExpenseId="travelExpense?.id"/>
      </div>
      <div v-show="step === 3">
        <self-service-travel-expenses-private-transportation :travelExpenseId="travelExpense?.id"/>
      </div>
      <div v-show="step === 4">
        <self-service-travel-expenses-day-specifications :travelExpenseId="travelExpense?.id"/>
      </div>
    </div>
  </div>
</template>
