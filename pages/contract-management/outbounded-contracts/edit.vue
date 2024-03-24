<script setup lang="ts">
import commonCode from "~/composables/common";
import CreateEditOutboundedContract from "./components/CreateEditOutboundedContract.vue";
import {
  useTranslatedColumns,
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

const { router, Toast } = commonCode();
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
      text: "Edit",
      active: true,
    },
  ],
  { title } = useTitle("Edit Outbounded Contracts"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig);

const id = router.params.id;

useHead({
  title: title,
});
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <create-edit-outbounded-contract :recordId="id" />
  </div>
</template>
