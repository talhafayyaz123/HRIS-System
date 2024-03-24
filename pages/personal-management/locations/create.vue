<script setup lang="ts">
import { ref, reactive } from "vue";
import commonCode from "~/composables/common";


const { router, Toast } = commonCode(),
  { t } = useI18n(),
  
  state = reactive({
    isLoading: false,
    submitted: false,
  }),
  isUpdate = ref(false),
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
      text: "Create",
      active: true,
    },
  ];

  const { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { title } = useTitle("Location Create");

useHead({
    title: title,
    });
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <div class="wizard-content">
      
      <!--=======================================================-->
        <create-edit-location-form
          :isUpdate="isUpdate"
        />
      <!--=======================================================-->
    </div>
  </div>
</template>
