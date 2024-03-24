<script setup lang="ts">
import CreateEditContractTypesForm from "./components/CreateEditContractTypesForm.vue";
import commonCode from "~/composables/common";

import {
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

const { router, Toast } = commonCode();
const id = router.params.id;
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
      text: "Edit",
      active: true,
    },
  ],
  { title } = useTitle("Edit Contract Type"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig);

useHead({
  title: title,
});
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <create-edit-contract-types-form :id="id" />
  </div>
</template>
