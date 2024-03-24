<script setup lang="ts">
import CreateEditLicenseGeneratorForm from "./components/CreateEditLicenseGeneratorForm.vue";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";


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
      text: "Create",
      active: true,
    },
  ],{ items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { title } = useTitle("Create License");
  useHead({
  title: title,
});
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />

    <create-edit-license-generator-form />
  </div>
</template>
