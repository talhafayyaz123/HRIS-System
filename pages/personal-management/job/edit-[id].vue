<script setup lang="ts">
import { ref, reactive } from "vue";

import commonCode from "~/composables/common";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";


const { router, Toast } = commonCode(),
  { t } = useI18n(),
  jobId = ref(""),
  isUpdate = ref(true),
  currentPage = ref(1),

  breadCrumbsConfig = [
    {
      text: "Admin portal",
      to: "/",
    },
    {
      text: "Jobs",
      to: "/personal-management/job",
    },
    {
      text: "Edit",
      active: true,
    },
  ];
  const { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { title } = useTitle("Job Edit");

useHead({
    title: title,
    });
function refresh() {
  jobId.value = router.params.id;
}
refresh();
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <div class="wizard-content">
      <create-edit-job-form
          :jobId="jobId"
          :isUpdate="isUpdate"
        />
    </div>
  </div>
</template>
