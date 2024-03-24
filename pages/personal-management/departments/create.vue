<script setup lang="ts">
import { ref, reactive } from "vue";
import commonCode from "~/composables/common";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";


const { router, Toast } = commonCode(),
  { t } = useI18n(),
  
  state = reactive({
    isLoading: false,
    submitted: false,
  }),
  isUpdate = ref(false),
  currentPage = ref(1),
  order = ref("asc"),
  column = ref("id"),
  departments = ref([]),
  breadCrumbsConfig = [
    {
      text: "Admin portal",
      to: "/",
    },
    {
      text: "Department",
      to: "/personal-management/departments",
    },
    {
      text: "Create",
      active: true,
    },
  ],
  step = ref(1);
const prev = () => {
  step.value -= 1;
};
const departmentDone = () => {
  Toast.fire({
    icon: "success",
    title: t("Record created successfully!"),
  });
  navigateTo("/personal-management/departments");
};
const { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { title } = useTitle("Department Create");

useHead({
    title: title,
    });
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <div class="wizard-content">
      
      <!--=======================================================-->
        <create-edit-department-form
          @departmentDone="departmentDone"
          :isUpdate="isUpdate"
        />
      <!--=======================================================-->
    </div>
  </div>
</template>
