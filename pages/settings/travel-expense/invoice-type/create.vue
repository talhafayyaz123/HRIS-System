<script setup lang="ts">
import CreateEditForm from "./components/CreateEditForm/index.vue";

import {
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

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
      text: "Create",
      active: true,
    },
  ],
  { title } = useTitle("Create Invoice Type"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig);

useHead({
  title: title,
});
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />

    <create-edit-form />
  </div>
</template>
