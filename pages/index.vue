<script setup lang="ts">
import { useLayoutStore } from "@/store/layout";
import { ref } from "vue";
import commonCode from "~/composables/common";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";

const store = useLayoutStore();
const currentPerPage = ref(10);
const totalRecords = ref(0);
const currentPage = ref(1);
const totalPages = ref(1);
const data = ref({});
const { t } = useI18n();
const { router, Toast, deleteAlert } = commonCode()
const breadCrumbsConfig = [
    {
        text: "Admin portal",
        to: "/",
    },
    {
        text: "Dashboard",
        active: true,
    },
],
{ items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
{ title } = useTitle("Dashboard");

useHead({
    title: title,
})
</script>


<template>
    <div>
        <page-header :title="title" :items="items"/>

        <div class="card">
            <div class="card-header">
            </div>
        </div>
    </div>
</template>
