<script setup lang="ts">
import { ref, reactive } from "vue";
import { listEmployeesRequest } from "~/utils/apiRequests";
import commonCode from "~/composables/common";
import { routes } from "~/utils/apiRoutes";
import genericFunctionality from "~/composables/genericFunctionality";
import genericFeatures from "~/composables/generic";
import { useLayoutStore } from "~/store/layout";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";

const { router, Toast } = commonCode(),
  { showGenericListing } = genericFeatures(),
  { submitted, isLoading, apiRoute, storeFunc } = genericFunctionality(),
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
  paymentPeriods = ref([]),
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
      text: "Create",
      active: true,
    },
  ],
  step = ref(1),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  { title } = useTitle("Leads Create");
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
    title: t("Record created successfully!"),
  });
  navigateTo("/leads");
};

const store = () => {
  step.value += 1;
};

async function refresh() {
  const layout = useLayoutStore();
  layout.changeLoaderValue(true);
  listEmployeesRequest({
    limit_start: 0,
    limit_count: 100,
    type: "employee",
    company_id: "",
  }).then((response) => {
    employees.value = response?.data.map((employee: any) => {
      return {
        text: employee.first_name + " " + employee.last_name,
        value: employee.id,
      };
    });
  });
  let paymentPeriodsListing = await showGenericListing(routes.PRODUCT_PAYMENT_PERIOD);
    if (!!paymentPeriodsListing?.data?.paymentPeriods) {
      paymentPeriods.value = paymentPeriodsListing.data.paymentPeriods.map(
        (ts: any) => {
          return { value: ts.id, text: ts.name };
        }
      );
    }
  let termOfPaymentsListing = await showGenericListing(routes.TERMS_OF_PAYMENT);
  if (!!termOfPaymentsListing?.data?.termOfPayments) {
    termsOfPayments.value = termOfPaymentsListing.data.termOfPayments.map(
      (ts: any) => {
        return { value: ts.id, text: ts.name };
      }
    );
  }
  let leadStatusesListing = await showGenericListing(routes.LEAD_STATUS);
  if (!!leadStatusesListing?.data?.data) {
    leadStatuses.value = leadStatusesListing.data.data.map((ts: any) => {
      return { value: ts.id, text: ts.name };
    });
  }
  let contractReportsSourcesListing = await showGenericListing(
    routes.CONTACT_REPORT_SOURCE
  );
  if (!!contractReportsSourcesListing?.data?.data) {
    contractReportsSources.value = contractReportsSourcesListing.data.data.map(
      (ts: any) => {
        return { value: ts.id, text: ts.name };
      }
    );
  }

  let countryListing = await showGenericListing(routes.COUNTRY,  {all: true, sortBy: 'name', order: 'asc'});
  if (!!countryListing?.data) {
    countries.value = countryListing.data.map((ts: any) => {
      return { value: ts.id, text: ts.name };
    });
  }
  layout.changeLoaderValue(false);
}

refresh();
useHead({
  title: title,
});
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <div class="wizard-tab">
      <ul class="">
        <li class="nav-item" role="presentation">
          <button class="nav-link" :class="{ active: step === 1, 'step-done': step > 1 }">
            {{ $t("Lead") }}
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" :class="{ active: step === 2, 'step-done': step > 2 }">
            {{ $t("Locations") }}
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" :class="{ active: step === 3, 'step-done': step > 3 }">
            {{ $t("Employees") }}
          </button>
        </li>
      </ul>
    </div>
    <div class="wizard-content">
      <!--=======================================================-->
      <!--=======================================================-->
      <div class="" v-show="step === 1">
        <leads-details :leadId="leadId" :countries="countries" :termsOfPayments="termsOfPayments" 
          :paymentPeriods="paymentPeriods" :leadStatuses="leadStatuses" @detailsDone="detailsDone" 
          :isUpdate="isUpdate" :assignee="employees" :contractReportsSources="contractReportsSources" />
      </div>
      <!--=======================================================-->
      <!--=======================================================-->
      <div class="" v-show="step === 2">
        <leads-locations @locationsDone="locationsDone" @getLocations="getLocations" @backToDetails="step = 1"
          :countries="countries" :leadId="leadId" />
      </div>
      <!--=======================================================-->
      <!--=======================================================-->
      <div class="" v-show="step === 3">
        <leads-employees @employeesDone="employeesDone" @backToLocations="step = 2" :locations="locations"
          :leadId="leadId" />
      </div>
    </div>
  </div>
</template>
