<script setup lang="ts">
import CreateEditContractTypesForm from "./components/CreateEditContractTypesForm.vue";

import {
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

const { t } = useI18n();

const breadCrumbsConfig = [
    {
      text: "Global Settings",
      to: "/",
    },
    {
      text: "Contract Management",
      to: "/",
    },
    {
      text: "Contract Types",
      to: "/settings/contract-management/contract-types",
    },
    {
      text: "Create",
      active: true,
    },
  ],
  { title } = useTitle("Create Contract Types"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig);

useHead({
  title: title,
});
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <create-edit-contract-types-form />
  </div>
</template>
