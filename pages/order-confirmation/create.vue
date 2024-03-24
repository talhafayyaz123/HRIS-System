<script setup lang="ts">
import CreateEditOffersConfirmForm from "./components/CreateEditOffersConfirmForm.vue";

import {
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

const { t } = useI18n(),
breadCrumbsConfig = [
    {
      text: "Admin portal",
      to: "/",
    },
    {
      text: "Order Confirmation",
      to: "/order-confirmation",
    },
    {
      text: "Create",
      active: true,
    },
  ],
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  { title } = useTitle("Order Confirmation Create");
  useHead({
  title: title
});
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
      <create-edit-offers-confirm-form />
  </div>
</template>
