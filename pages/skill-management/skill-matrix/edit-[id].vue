<script setup lang="ts">
import commonCode from "~/composables/common";
import SkillMatrixFormData from "~/pages/skill-management/skill-matrix/component/skill-matrix-form-data.vue";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";


const { router } = commonCode(),
    { t } = useI18n(),
    breadCrumbsConfig = [
        {
            text: "Admin portal",
            to: "/",
        },
        {
            text: "Skills Matrix",
            to: "/skill-management/skill-matrix",
        },
        {
            text: "Edit",
            active: true,
        },
    ];
    const { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { title } = useTitle("Skill Matrix Edit");

useHead({
    title: title,
    });

</script>

<template>
    <div>
        <page-header :title="title" :items="items" />
        <div class="wizard-content">
            <!--=======================================================-->
            <skill-matrix-form-data
                :skillMatrixId="router.params.id"
                :isUpdate="true"
            />
            <!--=======================================================-->
        </div>
    </div>
</template>
