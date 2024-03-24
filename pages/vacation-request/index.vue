<script setup lang="ts">
import { ref, reactive } from "vue";
import commonCode from "~/composables/common";
import NewRequest from "~/pages/vacation-request/components/new-request.vue";
import MyVacations from "~/pages/vacation-request/components/my-vacations.vue";
import VacationCalendarTab from "~/pages/vacation-request/components/vacation-calendar-tab.vue";
import RequestApproval from "~/pages/vacation-request/components/request-approval.vue";
import {routes} from "~/utils/apiRoutes";
import genericFeatures from "~/composables/generic";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";

const
    { router, Toast } = commonCode(),
    { showGenericListing } = genericFeatures(),
    userId = localStorage.getItem('user_id') || null ,
    { t } = useI18n(),
    employees = ref([]),
    options = [
      { value: 'batman', name: 'Batman' },
      { value: 'robin', name: 'Robin' },
      { value: 'joker', name: 'Joker' },
    ],
    breadCrumbsConfig = [
      {
        text: "Admin portal",
        to: "/",
      },
      {
        text: "Vacation Request",
        active: true,
      },
    ],
    step = ref(1),
    refresh = async() =>{
        if(!employees.value.length){
            await showGenericListing(routes.EMPLOYEE).then((response:any) => {
                employees.value = response?.data?.employees.map((member: any) => {
                    return {
                        text: member.name,
                        value: member.id,
                        userId: member.userId
                    };
                });
            });
        }

    },

    employeeId = computed(() =>  employees.value?.filter(user => user.userId === userId))

    const { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { title } = useTitle("Vacation Request");
    useHead({
  title: title,
});
refresh();
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <div class="wizard-tab">
      <ul class="">
        <li class="nav-item" role="presentation">
          <button class="nav-link step-done" @click="step = 1" :class="{ active: step === 1 }">
            {{ $t("New Request") }}
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link step-done" @click="step = 2" :class="{ active: step === 2 }">
            {{ $t("Vacation Calender") }}
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link step-done" @click="step = 3" :class="{ active: step === 3 }">
            {{ $t("My Vacations") }}
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link step-done" @click="step = 4" :class="{ active: step === 4 }">
            {{ $t("Requests for Approval") }}
          </button>
        </li>
      </ul>
    </div>
    <div class="wizard-content vacation-request">
      <!--=======================================================-->
      <!--=======================================================-->
      <div class="" v-show="step === 1">
        <new-request :employees="employees" :defaultEmployeeId="employeeId[0]?.value" :userId="userId" :step="step" />
      </div>
      <!--=======================================================-->
      <!--=======================================================-->
      <div class="" v-show="step === 2" >
          <vacation-calendar-tab :employees="employees" :defaultEmployeeId="employeeId[0]?.value" :userId="userId" />
      </div>
      <!--=======================================================-->
      <!--=======================================================-->
      <div class="" v-show="step === 3">
        <my-vacations :employees="employees" :defaultEmployeeId="employeeId[0]?.value" :userId="userId" :step="step" />
      </div>
      <!--=======================================================-->
      <!--=======================================================-->
      <div class="" v-show="step === 4">
        <RequestApproval :employees="employees" :defaultEmployeeId="employeeId[0]?.value" :userId="userId" :step="step" />
      </div>

    </div>
  </div>
</template>
