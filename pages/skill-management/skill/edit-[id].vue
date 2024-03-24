<script setup lang="ts">
import { ref, reactive } from "vue";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";

import commonCode from "~/composables/common";


const { router, Toast } = commonCode(),
  { t } = useI18n(),
  skilId = ref(""),
  isUpdate = ref(true),
  currentPage = ref(1),

  breadCrumbsConfig = [
    {
      text: "Admin portal",
      to: "/",
    },
    {
      text: "Skills",
      to: "/skill-management/skill",
    },
    {
      text: "Edit",
      active: true,
    },
  ];

  const { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { title } = useTitle("Skill Edit");

useHead({
    title: title,
    });

function refresh() {
  skilId.value = router.params.id;
}
refresh();
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <div class="wizard-content">
      <create-edit-skill-form
          :skilId="skilId"
          :isUpdate="isUpdate"
        />
    </div>
  </div>
</template>
