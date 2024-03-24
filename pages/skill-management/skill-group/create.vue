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
      text: "Skills Group",
      to: "/skill-management/skill-group",
    },
    {
      text: "Create",
      active: true,
    },
  ];
  const { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { title } = useTitle("Skills Group Create");

useHead({
    title: title,
    });
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <div class="wizard-content">
      
      <!--=======================================================-->
        <create-edit-skill-group-form
          :isUpdate="isUpdate"
        />
      <!--=======================================================-->
    </div>
  </div>
</template>
