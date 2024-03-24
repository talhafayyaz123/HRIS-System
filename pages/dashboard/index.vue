<script setup lang="ts">
import { useLayoutStore } from "@/store/layout";
import { ref } from "vue";
import commonCode from "~/composables/common";
useHead({
    title: `Dashboard`,
})
const store = useLayoutStore();
const title = ref("Dashboard");
const currentPerPage = ref(10);
const totalRecords = ref(0);
const currentPage = ref(1);
const totalPages = ref(1);
const data = ref({});
const { t } = useI18n();
const { router, Toast, deleteAlert } = commonCode()
const items = [
    {
        text: "Admin portal",
        to: "/",
    },
    {
        text: "Dashboard",
        active: true,
    },
];


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
