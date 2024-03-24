<script setup lang="ts">
import CreateEditOffersForm from "./components/CreateEditOffersForm.vue";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";


const { t } = useI18n(),
breadCrumbsConfig = [
    {
      text: "Admin portal",
      to: "/",
    },
    {
      text: "Offers",
      to: "/offers",
    },
    {
      text: "Create",
      active: true,
    },
  ],
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  { title } = useTitle("Offers Create");

  useHead({
  title: title,
});
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />

    <create-edit-offers-form />
  </div>
</template>
