<script setup lang="ts">
import commonCode from "~/composables/common";
import CreateEditLicenseGeneratorForm from "./components/CreateEditLicenseGeneratorForm.vue";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";


const { router, Toast } = commonCode();
const { t } = useI18n(),
breadCrumbsConfig = [
     {
      text: "Admin Portal",
      to: "/",
    },
    {
      text: "License Generator",
      to: "/licenses",
      active: true,
    },
    {
      text: "Edit",
      active: true,
    },
  ],{ items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { title } = useTitle("Edit License");
  useHead({
  title: title,
});
const id = router.params.id;
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
     <create-edit-license-generator-form :recordId="id" />
  </div>
</template>
