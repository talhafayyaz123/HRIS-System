<script setup lang="ts">
import { ref, reactive } from "vue";
import commonCode from "~/composables/common";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";


const { router, Toast } = commonCode(),
  { t } = useI18n(),
  
  isUpdate = ref(false),
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
      text: "Create",
      active: true,
    },
  ];
  const { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { title } = useTitle("Job Create");

useHead({
    title: title,
    });
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <div class="wizard-content">
      
      <!--=======================================================-->
        <create-edit-job-form
          :isUpdate="isUpdate"
        />
      <!--=======================================================-->
    </div>
  </div>
</template>
