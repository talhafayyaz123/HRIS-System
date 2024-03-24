<script setup lang="ts">
import commonCode from "~/composables/common";
import CreateEditOffersForm from "./components/CreateEditOffersForm.vue";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";

const { router, Toast } = commonCode();
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
      text: "Edit",
      active: true,
    },
  ],
    { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { title } = useTitle("Offers Create");

const id = router.params.id;

useHead({
  title: title,
});
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <create-edit-offers-form :recordId="id" />
  </div>
</template>
