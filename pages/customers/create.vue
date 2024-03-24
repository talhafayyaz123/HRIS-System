<script setup lang="ts">
import { ref, reactive } from "vue";
import {
  productByCategoryRequest,
} from "~/utils/apiRequests";
import commonCode from "~/composables/common";
import { routes } from "~/utils/apiRoutes";
import genericFunctionality from "~/composables/genericFunctionality";
import genericFeatures from "~/composables/generic";
import {useLayoutStore} from "~/store/layout";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";


const { router, Toast } = commonCode(),
  { showGenericListing } = genericFeatures(),
  { submitted, isLoading, apiRoute, storeFunc } = genericFunctionality(),
  { t } = useI18n(),
  customerId = ref(""),
  state = reactive({
    isLoading: false,
    submitted: false,
  }),
  isUpdate = ref(false),
  currentPage = ref(1),
  order = ref("asc"),
  column = ref("id"),
  termsOfPayments = ref([]),
  paymentPeriods = ref([]),
  locations = ref([]),
  countries = ref([]),
  softwareProducts = ref([]),
  serviceProducts = ref([]),
  breadCrumbsConfig = [
    {
      text: "Admin portal",
      to: "/",
    },
    {
      text: "Customers",
      to: "/customers",
    },
    {
      text: "Create",
      active: true,
    },
  ],
  step = ref(1),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  { title } = useTitle("Customers Create");
const tab1Done = (data) => {
  step.value = 2;
  customerId.value = data?.customerId;
  isUpdate.value = true;
};

const getLocations = (data) => {
  locations.value = data?.locations.map((location: any) => {
    return {
      text: location.addressFirst,
      value: location.id,
    };
  });
};

const tab4Done = () => {
    Toast.fire({
      icon: "success",
      title: t("Record created successfully!"),
    });
    navigateTo("/customers");
  },
  refresh = async () => {
    const layout = useLayoutStore();
    layout.changeLoaderValue(true);
    let termOfPaymentsListing = await showGenericListing(routes.TERMS_OF_PAYMENT);
    if (!!termOfPaymentsListing?.data?.termOfPayments) {
      termsOfPayments.value = termOfPaymentsListing.data.termOfPayments.map(
        (ts: any) => {
          return { value: ts.id, text: ts.name };
        }
      );
    }
    let paymentPeriodsListing = await showGenericListing(routes.PRODUCT_PAYMENT_PERIOD);
    if (!!paymentPeriodsListing?.data?.paymentPeriods) {
      paymentPeriods.value = paymentPeriodsListing.data.paymentPeriods.map(
        (ts: any) => {
          return { value: ts.id, text: ts.name };
        }
      );
    }
    productByCategoryRequest({
      page: currentPage.value,
      perPage: 10,
      sortBy: column.value,
      order: order.value,
      search: "",
      type: "service",
    }).then((response) => {
      serviceProducts.value = response?.data;
    });
    let countryListing = await showGenericListing(routes.COUNTRY,  {all: true, sortBy: 'name', order: 'asc'});
    if (!!countryListing?.data) {
      countries.value = countryListing?.data.map((ts: any) => {
        return { value: ts.id, text: ts.name };
      });
    }
    layout.changeLoaderValue(false);
  };
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
          <button
            class="nav-link"
            :class="{ active: step === 1, 'step-done': step > 1 }"
          >
            {{ $t("Customers") }}
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            :class="{ active: step === 2, 'step-done': step > 2 }"
          >
            {{ $t("Licenses") }}
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            :class="{ active: step === 3, 'step-done': step > 3 }"
          >
            {{ $t("Locations") }}
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            :class="{ active: step === 4, 'step-done': step > 4 }"
          >
            {{ $t("Employees") }}
          </button>
        </li>
      </ul>
    </div>
    <div class="wizard-content">
      <!--=======================================================-->
      <!--=======================================================-->
      <div class="" v-show="step === 1">
        <customers-details
          :customerId="customerId"
          :countries="countries"
          :paymentPeriods="paymentPeriods"
          :termsOfPayments="termsOfPayments"
          @tab1Done="tab1Done"
          :products="serviceProducts"
          :isUpdate="isUpdate"
        />
      </div>
      <!--=======================================================-->
      <!--=======================================================-->
      <div class="" v-show="step === 2">
        <customers-licenses
          :key="softwareProducts?.length"
          :customerId="customerId"
          @backToDetails="step = 1"
          @licensesDone="step = 3"
        />
      </div>
      <!--=======================================================-->
      <!--=======================================================-->
      <div class="" v-show="step === 3">
        <customers-locations
          @tab3Done="step = 4"
          @getLocations="getLocations"
          @backToTab2="step = 2"
          :countries="countries"
          :customerId="customerId"
        />
      </div>
      <!--=======================================================-->
      <!--=======================================================-->
      <div class="" v-show="step === 4">
        <customers-employees
          @tab4Done="tab4Done"
          @backToTab3="step = 3"
          :locations="locations"
          :customerId="customerId"
        />
      </div>
    </div>
  </div>
</template>
