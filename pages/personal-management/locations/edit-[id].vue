<script setup lang="ts">
import { ref, reactive } from "vue";

import commonCode from "~/composables/common";


const { router, Toast } = commonCode(),
  { t } = useI18n(),
  locationId = ref(""),
  isUpdate = ref(true),
  currentPage = ref(1),

  breadCrumbsConfig = [
    {
      text: "Admin portal",
      to: "/",
    },
    {
      text: "Location",
      to: "/personal-management/locations",
    },
    {
      text: "Edit",
      active: true,
    },
  ];

  const { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { title } = useTitle("Location Edit");

useHead({
    title: title,
    });

function refresh() {
  locationId.value = router.params.id;
}
refresh();
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <div class="wizard-content">
      <create-edit-location-form
          :locationId="locationId"
          :isUpdate="isUpdate"
        />
    </div>
  </div>
</template>
