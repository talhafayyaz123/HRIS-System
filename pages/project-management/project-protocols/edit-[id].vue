<script setup lang="ts">
import { ref, reactive } from "vue";
import {
  termsOfPaymentRequest,
  countriesListRequest,
  requestLeadStatusRequest,
  listEmployeesRequest,
  requestContactReportSourceRequest,
  leadShowRequest
} from "~/utils/apiRequests";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";


const { router, Toast } = commonCode(),
  { t } = useI18n(),
  leadId = ref(""),
  state = reactive({
    isLoading: false,
    submitted: false,
  }),
  isUpdate = ref(false),
  currentPage = ref(1),
  order = ref("asc"),
  column = ref("id"),
  termsOfPayments = ref([]),
  employees = ref([]),
  locations = ref([]),
  leadStatuses = ref([]),
  contractReportsSources = ref([]),
  countries = ref([]),
  breadCrumbsConfig = [
    {
      text: "Admin portal",
      to: "/",
    },
    {
      text: "Leads",
      to: "/leads",
    },
    {
      text: "Edit",
      active: true,
    },
  ],
  step = ref(1);
const prev = () => {
  step.value -= 1;
};
const detailsDone = (data) => {
  step.value = 2;
  leadId.value = data?.leadId;
  isUpdate.value = true;
};

const locationsDone = () => {
  step.value = 3;
};

const getLocations = (data) => {
  locations.value = data?.locations.map((location: any) => {
    return {
      text: location.addressFirst,
      value: location.id,
    };
  });
};

const employeesDone = () => {
  Toast.fire({
    icon: "success",
    title: t("Record updated successfully!"),
  });
  navigateTo("/leads");
};

const store = () => {
  step.value += 1;
};


const getEmployees = () => {
  step.value = 4
  leadShowRequest(leadId.value).then((response) => {
    locations.value = response?.data?.customerLocations.map((location: any) => {
    return {
      text: location.addressFirst,
      value: location.id,
    };
  });
  });
};


function refresh() {
  
  leadId.value = router.params.id;
  termsOfPaymentRequest({
    page: currentPage.value,
    perPage: 10,
    sortBy: column.value,
    order: order.value,
    search: "",
  }).then((response) => {
    termsOfPayments.value = response?.data?.termOfPayments.map(
      (termOfPayment: any) => {
        return {
          text: termOfPayment.name,
          value: termOfPayment.id,
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
  requestLeadStatusRequest({
    page: currentPage.value,
    perPage: 10,
    sortBy: column.value,
    order: order.value,
    search: "",
  }).then((response) => {
    leadStatuses.value = response?.data?.data.map((leadStatus: any) => {
      return {
        text: leadStatus.name,
        value: leadStatus.id,
      };
    });
  });
  requestContactReportSourceRequest({
    page: currentPage.value,
    perPage: 10,
    sortBy: column.value,
    order: order.value,
    search: "",
  }).then((response) => {
    contractReportsSources.value = response?.data?.data.map((contractReportsSource: any) => {
      return {
        text: contractReportsSource.name,
        value: contractReportsSource.id,
      };
    });
  });
  countriesListRequest({
    page: currentPage.value,
    perPage: 10,
    sortBy: column.value,
    order: order.value,
    search: "",
  }).then((response) => {
    countries.value = response?.data?.map((country: any) => {
      return {
        text: country.name,
        value: country.id,
      };
    });
  });
}
const { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { title } = useTitle("Leads Edit");

useHead({
    title: title,
    });
refresh();
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <div class="wizard-tab">
      <ul class="nav nav-tabs justify-content-start">
        <li class="nav-item" role="presentation">
          <button
            class="nav-link step-done"
            @click="step=1"
          >
            {{ $t('Lead') }}
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link step-done"
            @click="step=2"
          >
            {{ $t('Locations') }}
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link step-done"
            @click="getEmployees()"
          >
            {{ $t('Employees') }}
          </button>
        </li>
      </ul>
    </div>
    <div class="wizard-content">
      <!--=======================================================-->
      <!--=======================================================-->
      <div class="" v-show="step === 1">
        <leads-details
          :leadId="leadId"
          :countries="countries"
          :termsOfPayments="termsOfPayments"
          :leadStatuses="leadStatuses"
          @detailsDone="detailsDone"
          :isUpdate="isUpdate"
          :assignee="employees"
          :contractReportsSources="contractReportsSources"
        />
      </div>
      <!--=======================================================-->
      <!--=======================================================-->
      <div class="" v-show="step === 2">
        <leads-locations
          @locationsDone="locationsDone"
          @getLocations="getLocations"
          @backToDetails="step = 1"
          :countries="countries"
          :leadId="leadId"
        />
      </div>
      <!--=======================================================-->
      <!--=======================================================-->
      <div class="" v-show="step === 3">
        <leads-employees
          @employeesDone="employeesDone"
          @backToLocations="step = 2"
          :locations="locations"
          :leadId="leadId"
        />
      </div>
    </div>
  </div>
</template>
