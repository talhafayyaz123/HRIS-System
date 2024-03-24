<script setup lang="ts">
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
      text: "Global Settings",
      to: "/",
    },
    {
      text: "Terms Of Payment",
      to: "/settings/global-settings/terms-of-payment",
    },
    {
      text: "Create",
      active: true,
    },
  ],
  { title } = useTitle("Create Terms of Payment"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig);
// Use the composable function to get translated columns

useHead({
  title: title,
});
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />

    <create-edit-terms-form />
  </div>
</template>
