<script setup lang="ts">
import commonCode from "~/composables/common";
import CreateEditInvoiceForm from "./components/CreateEditInvoiceForm.vue";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";


const { router, Toast } = commonCode();
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
      text: "Edit",
      active: true,
    },
  ],
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { title } = useTitle("Invoice Edit");
  useHead({
  title: title,
});
const id = router.params.id;
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <create-edit-invoice-form :recordId="id" />
  </div>
</template>
