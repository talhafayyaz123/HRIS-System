<script setup lang="ts">
import { ref, reactive } from "vue";
import {
  teamMembersList,
  departmentListRequest,
  listEmployeesRequest,
  skillGroupsList
} from "~/utils/apiRequests";
import commonCode from "~/composables/common";


const { router, Toast } = commonCode(),
  { t } = useI18n(),
  teamId = ref(""),
  state = reactive({
    isLoading: false,
    submitted: false,
  }),
  isUpdate = ref(true),
  currentPage = ref(1),
  order = ref("asc"),
  column = ref("id"),
  teamMates = ref([]),
  employees = ref([]),
  skillGroups = ref([]),
  departments = ref([]),
  breadCrumbsConfig = [
    {
      text: "Admin portal",
      to: "/",
    },
    {
      text: "Team",
      to: "/personal-management/teams",
    },
    {
      text: "Edit",
      active: true,
    },
  ],
  step = ref(1);

const teamDone = () => {
  Toast.fire({
    icon: "success",
    title: t("Record updated successfully!"),
  });
  navigateTo("/personal-management/teams");
};


function refresh() {
  
  teamId.value = router.params.id;
  teamMembersList({
    page: currentPage.value,
    perPage: 10,
    sortBy: column.value,
    order: order.value,
    search: "",
  }).then((response) => {
    teamMates.value = response?.data?.employees.map(
      (employee: any) => {
        return {
          text: employee.firstName,
          value: employee.id,
        };
      }
    );
  });
  listEmployeesRequest({
    limit_start: 0,
    limit_count: 25,
    type: "employee",
    company_id: ""
  })
    .then((response) => {
    employees.value = response?.data.map((employee: any) => {
      return {
        text: employee.first_name + ' ' + employee.last_name,
        value: employee.id,
      };
    });
  });
  skillGroupsList({
    page: currentPage.value,
    perPage: 10,
    sortBy: column.value,
    order: order.value,
    search: "",
  }).then((response) => {
    skillGroups.value = response?.data?.skillGroups.map((group: any) => {
      return {
        text: group.name,
        value: group.id,
      };
    });
  });
  departmentListRequest({
    page: currentPage.value,
    perPage: 10,
    sortBy: column.value,
    order: order.value,
    search: "",
  }).then((response) => {
    departments.value = response?.data?.departments.map((department: any) => {
      return {
        text: department.name,
        value: department.id,
      };
    });
  });
}
refresh();

const { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { title } = useTitle("Team Edit");

useHead({
    title: title,
    });
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <div class="wizard-content">
        <create-edit-team-form
          :teamId="teamId"
          :departments="departments"
          :teamMates="teamMates"
          @teamDone="teamDone"
          :isUpdate="isUpdate"
          :skillGroups="skillGroups"
        />
    </div>
  </div>
</template>
