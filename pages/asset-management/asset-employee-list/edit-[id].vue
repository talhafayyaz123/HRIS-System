<script setup lang="ts">
import commonCode from "~/composables/common";
import CreateEditAssetEmployeeListForm from "./components/CreateEditAssetEmployeeListForm.vue";
import {
  useTranslatedColumns,
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

const { router, Toast } = commonCode();
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
      text: "Edit",
      active: true,
    },
  ],
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  { title } = useTitle("Asset List Edit");

const id = router.params.id;

useHead({
  title: title,
});
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <create-edit-asset-employee-list-form :recordId="id" />
  </div>
</template>
