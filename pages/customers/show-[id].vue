<script setup lang="ts">
import { ref, reactive } from "vue";
import {
  termsOfPaymentRequest,
  countriesListRequest,
  productByCategoryRequest,
  customerShowRequest,
} from "~/utils/apiRequests";
import commonCode from "~/composables/common";
import { routes } from "~/utils/apiRoutes";
import genericFunctionality from "~/composables/genericFunctionality";
import genericFeatures from "~/composables/generic";
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
  isUpdate = ref(true),
  currentPage = ref(1),
  order = ref("asc"),
  column = ref("id"),
  termsOfPayments = ref([]),
  locations = ref([]),
  countries = ref([]),
  softwareProducts = ref([]),
  paymentPeriods = ref([]),
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
      text: "Show",
      active: true,
    },
  ],
  step = ref(1),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  { title } = useTitle("Customers Show");
const tab1Done = (data) => {
  step.value = 2;
  customerId.value = data?.customerId;
};

const getLocations = (data) => {
  locations.value = data?.locations.map((location: any) => {
    return {
      text: location.addressFirst,
      value: location.id,
    };
  });
};

const getEmployees = () => {
  step.value = 4;
  customerShowRequest(customerId.value).then((response) => {
    locations.value = response?.data?.customerLocations.map((location: any) => {
      return {
        text: location.addressFirst,
        value: location.id,
      };
    });
  });
};

const tab4Done = () => {
  Toast.fire({
    icon: "success",
    title: t("Record updated successfully!"),
  });
  navigateTo("/customers");
};

const store = () => {
  step.value += 1;
},
  refresh = async () => {
    customerId.value = router.params.id;
    let termOfPaymentsListing = await showGenericListing(
      routes.TERMS_OF_PAYMENT
    );
    if (!!termOfPaymentsListing.data.termOfPayments) {
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
    let countryListing = await showGenericListing(routes.COUNTRY, { all: true, sortBy: 'name', order: 'asc' });
    if (!!countryListing?.data) {
      countries.value = countryListing.data.map((ts: any) => {
        return { value: ts.id, text: ts.name };
      });
    }
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
          <button class="nav-link step-done" @click="step = 1" :class="{ active: step === 1 }">
            {{ $t('Customers') }}
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link step-done" @click="step = 2" :class="{ active: step === 2 }">
            {{ $t('Licenses') }}
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link step-done" @click="step = 3" :class="{ active: step === 3 }">
            {{ $t('Systems') }}
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link step-done" @click="step = 4" :class="{ active: step === 4 }">
            {{ $t('Offers') }}
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link step-done" @click="step = 5" :class="{ active: step === 5 }">
            {{ $t('Invoices') }}
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link step-done" @click="step = 6" :class="{ active: step === 6 }">
            {{ $t('Reports') }}
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link step-done" @click="step = 7" :class="{ active: step === 7 }">
            {{ $t('Projects') }}
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link step-done" @click="step = 8" :class="{ active: step === 8 }">
            {{ $t('Tickets') }}
          </button>
        </li>
      </ul>
    </div>
    <div class="wizard-content">
      <!--=======================================================-->
      <!--=======================================================-->
      <div class="" v-show="step === 1">
        <customers-details :customerId="customerId" :countries="countries" :paymentPeriods="paymentPeriods"
          :termsOfPayments="termsOfPayments" @tab1Done="tab1Done" :products="serviceProducts" :isUpdate="isUpdate" />
      </div>
      <!--=======================================================-->
      <!--=======================================================-->
      <div class="" v-show="step === 2">
        <customers-licenses :key="softwareProducts?.length" :customerId="customerId" @backToDetails="step = 1"
          @licensesDone="step = 3" />
      </div>
      <!--=======================================================-->
      <!--=======================================================-->
      <div class="" v-show="step === 3">
        <customers-system />
      </div>
      <!--=======================================================-->
      <!--=======================================================-->
      <div class="" v-show="step === 4">
        <customers-offer />
      </div>
      <!--=======================================================-->
      <!--=======================================================-->
      <div class="" v-show="step === 5">
        <customers-invoices/>
      </div>
      <!--=======================================================-->
      <!--=======================================================-->
      <div class="" v-show="step === 6">
        <customers-reports />
      </div>
      <!--=======================================================-->
      <!--=======================================================-->
      <div class="" v-show="step === 7">
        <customers-projects />
      </div>
      <!--=======================================================-->
      <!--=======================================================-->
      <div class="" v-show="step === 8">
        <customers-tickets />
      </div>
    </div>
  </div>
</template>
