<script setup lang="ts">
import { useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";

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
      text: "Show",
      active: true,
    },
  ],
    { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { title } = useTitle("Offers Confirmation Show");
  useHead({
  title: title,
});
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <offer-and-offer-confirm-show-record :offerConfirmation="true" />
  </div>
</template>
