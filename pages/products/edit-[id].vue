<script setup lang="ts">
import ProductSetup from "./components/ProductSetup.vue";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";

const breadCrumbsConfig = [
  {
    text: "Admin portal",
    to: "/",
  },
  {
    text: "Products",
    to: "/products",
  },
  {
    text: "Edit",
    active: true,
  },
],
{ items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
{ title } = useTitle("Products Edit");

useHead({
  title: title,
});
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <product-setup />
  </div>
</template>
