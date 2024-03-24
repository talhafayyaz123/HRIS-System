<script setup lang="ts">
import CreateEditInvoiceForm from "./components/CreateEditInvoiceForm.vue";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";


const { t } = useI18n(),
breadCrumbsConfig = [
    {
      text: "Admin portal",
      to: "/",
    },
    {
      text: "Invoices",
      to: "/finance/invoices",
    },
    {
      text: "Create",
      active: true,
    },
  ],
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { title } = useTitle("Invoice Create");
  useHead({
  title: title,
});
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />

    <create-edit-invoice-form />
  </div>
</template>
