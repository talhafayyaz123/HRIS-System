<script setup lang="ts">
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
      text: "Show",
      active: true,
    },
  ],
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  { title } = useTitle("Offers Edit");
useHead({
  title: title,
});

</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <offer-and-offer-confirm-show-record />
  </div>
</template>
