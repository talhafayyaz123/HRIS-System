<script setup lang="ts">
import genericFunctionality from "~/composables/genericFunctionality";
import { ref } from "vue";
import commonCode from "~/composables/common";
import contentView from "./components/content-view.vue";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";

const {
  handleSearch,
} = genericFunctionality(),
  { router, Toast, deleteAlert } = commonCode();
  
const breadCrumbsConfig = [
  {
    text: "Admin portal",
    to: "/",
  },
  {
    text: "Employee",
    active: true,
  },
];
const optionalItems = {
  searchBar: true,
  listBar: true,
  isBtnShow: true,
  btnText: "Create User Profile",
  path: "/personal-management/employees/create",
};
const props = defineProps({
  currentView: String,
});

const currentView = ref('list');

function updateView(view) {
  currentView.value = view;
}
const { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { title } = useTitle("Employee");

useHead({
    title: title,
    });
</script>

<template>
  <div>
    <page-header :title="title" :items="items" :optionalItems="optionalItems" :currentView="currentView"
      @update-view="updateView" @watchEvent="handleSearch" />
    <content-view :currentView="currentView" />
  </div>
</template>
