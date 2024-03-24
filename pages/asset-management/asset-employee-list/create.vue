<script setup lang="ts">
import CreateEditAssetEmployeeListForm from "./components/CreateEditAssetEmployeeListForm.vue";
import {
  useTranslatedColumns,
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

const { t } = useI18n(),
  breadCrumbsConfig = [
    {
      text: "Admin portal",
      to: "/",
    },
    {
      text: "Asset List",
      to: "/asset-management/asset-employee-list",
    },
    {
      text: "Create",
      active: true,
    },
  ],
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  { title } = useTitle("Asset List Create");

useHead({
  title: title,
});
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />

    <create-edit-asset-employee-list-form />
  </div>
</template>
