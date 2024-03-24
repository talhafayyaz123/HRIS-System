<script setup lang="ts">
import CreateEditForm from "./components/CreateEditForm/index.vue";
import commonCode from "~/composables/common";

import {
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

const { router, Toast } = commonCode();
const { t } = useI18n();
const id = router.params.id;

const breadCrumbsConfig = [
    {
      text: "Global Settings",
      to: "/",
    },
    {
      text: "Travel Expense",
      to: "/",
    },
    {
      text: "Invoice Types",
      to: "/settings/travel-expense/invoice-type",
    },
    {
      text: "Edit",
      active: true,
    },
  ],
  { title } = useTitle("Edit Invoice Type"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig);

useHead({
  title: title,
});
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <create-edit-form :id="id" />
  </div>
</template>
