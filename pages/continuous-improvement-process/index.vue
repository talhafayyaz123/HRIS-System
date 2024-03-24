<script setup lang="ts">

import { ref, reactive, computed, watch } from "vue";
import commonCode from "~/composables/common";
import AddImprovement from "~/pages/continuous-improvement-process/components/add-improvement.vue";
import CIPList from "~/pages/continuous-improvement-process/components/CIPList.vue"
import RequestForApproval from "~/pages/continuous-improvement-process/components/requestForApproval.vue"
import {genericShowRequest} from "~/utils/apiRequests";
import {routes} from "~/utils/apiRoutes";
import genericFeatures from "~/composables/generic";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";

const
    { showGenericListing } = genericFeatures(),
    { t } = useI18n(),
    { router, Toast } = commonCode(),
    userId = localStorage.getItem('user_id') || null ,
    profileData = ref({}),
    step = ref(1),
    teams = ref([]),
    departments = ref([]),
    affectedGroups = ref([]),
    breadCrumbsConfig = [
    {
      text: "Admin portal",
      to: "/",
    },
    {
      text: "Continuous Improvement Process",
      active: true,
    },
  ],
  optionalItems = {
      searchBar: false,
      isBtnShow: false,
      btnText: "",
      path: "",
  },
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  { title } = useTitle("Continuous Improvement Process"),
  refresh = async (id: string | null) => {
      await genericShowRequest(routes.USER_PROFILE, id)
          .then((response) => {
              if (!!response?.success) {
                  profileData.value = response?.data
              }
          })

      if(!teams.value.length  ){
          await showGenericListing(routes.TEAM).then((response:any) => {
              teams.value = response?.data?.teams.map((team: any) => {
                  return {
                      name: team.name,
                      value: team.name,
                  };
              });
          });
      }
      if(!departments.value.length ){
          await showGenericListing(routes.DEPARTMENT).then((response:any) => {
              departments.value = response?.data?.departments.map((department: any) => {
                  return {
                      name: department.name,
                      value: department.name,
                  };
              });
          });
      }
      if(!affectedGroups.value.length ){
          await showGenericListing(routes.AFFECTED_GROUP).then((response:any) => {
              affectedGroups.value = response?.data?.affectedGroups.map((group: any) => {
                  return {
                      name: group.name,
                      value: group.id,
                  };
              });
          });
      }
  }

refresh(userId)
useHead({
  title: title,
});
</script>

<template>
  <div>
    <page-header :title="title" :items="items" :optionalItems="optionalItems"/>

    <div class="tab-header">
      <ul class="">
        <li class="nav-item" role="presentation">
          <button class="nav-link" @click="step = 1" :class="{ active: step === 1 }">
            {{ $t("New Improvement") }}
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" @click="step = 2" :class="{ active: step === 2}">
            {{ $t("CIP List") }}
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" @click="step = 3" :class="{ active: step === 3}">
            {{ $t("Request for Approval") }}
          </button>
        </li>
      </ul>

    </div>
    <div class="wizard-content">
      <!--=======================================================-->
      <!--=======================================================-->
      <div class="" v-show="step === 1">
        <AddImprovement :userData="profileData" :userId="profileData?.id" :step="step" :teams="teams" :departments="departments" :affectedGroups="affectedGroups"/>
      </div>
      <!--=======================================================-->
      <!--=======================================================-->
      <div class="" v-show="step === 2">
        <CIPList :userId="profileData?.id" :step="step" :affectedGroups="affectedGroups"/>
      </div>
      <!--=======================================================-->
      <!--=======================================================-->
      <div class="" v-show="step === 3">
        <RequestForApproval :userId="profileData?.id" :step="step" :affectedGroups="affectedGroups" />
      </div>
      <!--=======================================================-->
      <!--=======================================================-->
    </div>
  </div>
</template>
