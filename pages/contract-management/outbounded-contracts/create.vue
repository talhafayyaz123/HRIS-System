<script setup lang="ts">
import CreateEditOutboundedContract from "./components/CreateEditOutboundedContract.vue";
import {
  useTranslatedColumns,
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

const { t } = useI18n(),
  breadCrumbsConfig = [
    {
      text: "Admin Portal",
      to: "/",
    },
    {
      text: "Outbounded Contracts",
      to: "/contract-management/outbounded-contracts",
    },
    {
      text: "Create",
      active: true,
    },
  ],
  { title } = useTitle("Create Outbounded Contracts"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig);

useHead({
  title: title,
});
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <create-edit-outbounded-contract />
  </div>
</template>
