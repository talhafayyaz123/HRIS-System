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
      text: "Countries",
      to: "/settings/global-settings/countries",
    },
    {
      text: "Create",
      active: true,
    },
  ],
  { title } = useTitle("Create Countries"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig);

useHead({
  title: title,
});
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <create-edit-countries-form />
  </div>
</template>
