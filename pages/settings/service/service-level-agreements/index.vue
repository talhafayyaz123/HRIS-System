<script setup lang="ts">
import commonCode from "~/composables/common";
import { ref } from "vue";

import {
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

const { t } = useI18n();
const breadCrumbsConfig = [
    {
      text: "Global Settings",
      to: "/",
    },
    {
      text: "Service",
      to: "/",
    },
    {
      text: "Service Level Agreements",
      active: true,
    },
  ],

  { title } = useTitle("Service Level Agreements"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  step = ref(1);

  useHead({
  title: title,
});
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <div class="tab-header">
      <ul class="" id="myTab" role="tablist">
        <!-- TODO: may be need in future -->
        <!-- <li class="nav-item" role="presentation">
          <button class="nav-link active" id="sla-inf-tab" data-bs-toggle="tab" data-bs-target="#sla-inf" type="button"
            role="tab" aria-controls="sla-inf" aria-selected="true">
            {{$t("SLA Infrastructure")}}
          </button>
        </li> -->
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="sla-service-tab" @click="step = 1" :class="{ active: step === 1}">
            {{$t("SLA Service Times")}}
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="sla-level-tab" @click="step = 2" :class="{ active: step === 2}">
            {{$t("SLA Level")}}
          </button>
        </li>
      </ul>
    </div>
    <div class=" mt-3" id="myTabContent">
      <!-- TODO: may be need in future -->
      <!-- <div class="tab-pane fade show active" id="sla-inf" role="tabpanel" aria-labelledby="sla-inf-tab">
        <sla-infrastructure />
      </div> -->
      <div class="" id="sla-service"  v-show="step === 1">
        <sla-service-times />
      </div>
      <div class="" id="sla-level"  v-show="step === 2">
        <sla-level />
      </div>
    </div>
  </div>
</template>
