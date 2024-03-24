<script setup lang="ts">
import { ref, reactive } from "vue";
import commonCode from "~/composables/common";


const { router, Toast } = commonCode(),
  { t } = useI18n(),
  
  isUpdate = ref(false),
  breadCrumbsConfig = [
    {
      text: "Admin portal",
      to: "/",
    },
    {
      text: "Projects",
      to: "/project-management/projects",
    },
    {
      text: "Create",
      active: true,
    },
  ];

  const { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { title } = useTitle("Project Create");

useHead({
    title: title,
    });
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <div class="wizard-content">
      
      <!--=======================================================-->
        <project-detail
          :isUpdate="isUpdate"
        />
      <!--=======================================================-->
    </div>
  </div>
</template>
