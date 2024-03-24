<script setup lang="ts">
import { ref, reactive } from "vue";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";

import commonCode from "~/composables/common";


const { router, Toast } = commonCode(),
  { t } = useI18n(),
  skillGroupId = ref(""),
  isUpdate = ref(true),
  currentPage = ref(1),

  breadCrumbsConfig = [
    {
      text: "Admin portal",
      to: "/",
    },
    {
      text: "Skills Group",
      to: "/skill-management/skill-group",
    },
    {
      text: "Edit",
      active: true,
    },
  ];
  const { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { title } = useTitle("Skills Group Edit");

useHead({
    title: title,
    });
function refresh() {
  skillGroupId.value = router.params.id;
}
refresh();
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <div class="wizard-content">
      <create-edit-skill-group-form
          :skillGroupId="skillGroupId"
          :isUpdate="isUpdate"
        />
    </div>
  </div>
</template>
