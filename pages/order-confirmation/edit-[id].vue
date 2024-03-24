<script setup lang="ts">
import commonCode from "~/composables/common";
import CreateEditOffersConfirmForm from "./components/CreateEditOffersConfirmForm.vue";
import { useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";
  
const { router, Toast } = commonCode();
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
      text: "Edit",
      active: true,
    },
  ],
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  { title } = useTitle("Order Confirmation Edit");

const id = router.params.id;
useHead({
  title: title,
});
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <create-edit-offers-confirm-form :recordId="id" />
  </div>
</template>
