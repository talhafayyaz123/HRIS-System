<script setup lang="ts">
import CreateEditForm from "./components/CreateEditForm/index.vue";

import {
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

const breadCrumbsConfig = [
    {
      text: "Global Setting",
      to: "/",
    },
    {
      text: "Travel Expense",
      to: "/",
    },
    {
      text: "Request Types",
      to: "/settings/travel-expense/request-type",
    },
    {
      text: "Create",
      active: true,
    },
  ],
  { title } = useTitle("Create Request Type"),
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
