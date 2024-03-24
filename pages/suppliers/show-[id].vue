<script setup lang="ts">
import { ref, reactive } from "vue";
import {
  supplierUpdateRequest,
  supplierShowRequest,
  supplierLocationDeleteRequest,
  supplierLocationCreateRequest,
} from "~/utils/apiRequests";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import { routes } from "~/utils/apiRoutes";
import genericFunctionality from "~/composables/genericFunctionality";
import genericFeatures from "~/composables/generic";
import { useLayoutStore } from "~/store/layout";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";

const { router, Toast, deleteAlert } = commonCode(),
  { showGenericListing } = genericFeatures(),
  { submitted, isLoading, apiRoute, storeFunc } = genericFunctionality(),
  { t } = useI18n(),
  supplierId = router.params.id,
  state = reactive({
    isLoading: false,
    submitted: false,
    name: "",
    vatId: "",
    addressLine1: "",
    addressLine2: "",
    zip: "",
    state: "",
    countryId: "",
    email: "",
    phone: "",
    url: "",
    fax: "",
    city: "",
    termOfPayment: "",
  }),
  isBankDetails = ref(false),
  location = reactive({
    isLoading: false,
    submitted: false,
    addressLine1: "",
    addressLine2: "",
    zip: "",
    city: "",
    countryId: "",
    state: "",
  }),
  state2 = reactive({
    isLoading: false,
    submitted: false,
    bankName: "",
    swift: "",
    iban: "",
  }),
  breadCrumbsConfig = [
    {
      text: "Admin portal",
      to: "/",
    },
    {
      text: "Suppliers",
      to: "/suppliers",
    },
    {
      text: "Show",
      active: true,
    },
  ],
  currentPage = ref(1),
  order = ref("asc"),
  column = ref("id"),
  termsOfPayments = ref([]),
  countries = ref([]),
  step = ref(1),
  isUpdate = ref(false),
  validationRules2 = {
    bankName: { required },
    swift: { required },
    iban: { required },
  },
  validationRules = {
    name: { required },
    vatId: { required },
    addressLine1: { required },
    zip: { required },
    city: { required },
    countryId: { required },
    url: { required },
    phone: { required },
    state: { required },
    email: { required, email }
  },
  validationRules3 = {
    addressLine1: { required },
    zip: { required },
    countryId: { required },
    city: { required },
    state: { required },
  },
  v$ = useVuelidate(validationRules, state),
  v2$ = useVuelidate(validationRules2, state2),
  v3$ = useVuelidate(validationRules3, location);
const rows = ref([]);
const locations = ref([]),
{ items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
{ title } = useTitle("Supplier Show");
const store = () => {
  v$.value.$touch();
  if (v$.value.$invalid) {
    state.submitted = false;
    return false;
  } else {
    try {
      state.isLoading = true;
      updateSupplier();
    } catch (e) {
      Toast.fire({ title: t("Error!"), text: t("Error"), icon: "error" });
      state.isLoading = false;
      state.submitted = false;
    }
  }
};

const updateSupplier = () => {
  supplierUpdateRequest(
    {
      name: state.name,
      vatId: state.vatId,
      addressFirst: state.addressLine1,
      addressSecond: state.addressLine2,
      zip: state.zip,
      phone: state.phone,
      url: state.url,
      fax: state.fax,
      city: state.city,
      email: state.email,
      state: state.state,
      countryId: state.countryId,
      termOfPaymentId: state.termOfPayment,
      bankDetails: rows.value,
    },
    supplierId
  )
    .then((response) => {
      step.value = 2;
      Toast.fire({
        icon: "success",
        title: t("Record updated successfully!"),
      });
      state.isLoading = false;
      state.submitted = false;
    })
    .catch((error) => {
      state.isLoading = false;
      state.submitted = false;
      Toast.fire({ icon: "error", title: t("something went wrong!") });
    });
};

const prev = () => {
  step.value = 1;
};

const done = () => {
  Toast.fire({
    icon: "success",
    title: t("Record updated successfully!"),
  });
  navigateTo("/suppliers");
};

const addBankDetails = () => {
  isBankDetails.value = true;
  state2.submitted = true;
  v2$.value.$touch();
  if (v2$.value.$invalid) {
    return false;
  } else {
    state2.submitted = false;
    const obj = {
      bankName: state2.bankName,
      swift: state2.swift,
      iban: state2.iban,
    };
    rows.value.push(obj);

    isBankDetails.value = false;
    state2.swift = "";
    state2.bankName = "";
    state2.iban = "";
  }
};

const addLocation = () => {
  location.submitted = true;
  v3$.value.$touch();
  if (v3$.value.$invalid) {
    return false;
  } else {
    location.submitted = false;

    createLocation();
  }
};

const createLocation = () => {
  supplierLocationCreateRequest({
    customerId: supplierId,
    addressFirst: location.addressLine1,
    addressSecond: location.addressLine2,
    city: location.city,
    zip: location.zip,
    state: location.state,
    countryId: location.countryId,
  })
    .then((response) => {
      step.value = 2;
      const obj = {
        addressLine1: response?.data?.addressFirst,
        country: {
          name: response?.data?.country?.name,
        },
        // country: response?.data?.country?.name,
        id: response?.data?.id,
        zip: response?.data?.zip,
        city: response?.data?.city,
        state: response?.data?.state,
        isHeadQuarter: response?.data?.isHeadQuarter,
      };
      locations.value.push(obj);
      Toast.fire({
        icon: "success",
        title: t("Record created successfully!"),
      });
      location.addressLine1 = "";
      location.addressLine2 = "";
      location.zip = "";
      location.city = "";
      location.state = "";
      location.countryId = ""
      state.isLoading = false;
    })
    .catch((error) => {
      state.isLoading = false;
      state.submitted = false;
      Toast.fire({ icon: "error", title: t("something went wrong!") });
    });
};

const popRow = (index) => {
  rows.value.splice(index, 1);
};

async function popLocation(index, id) {
  if (!!id) {
    await deleteAlert().then((result: { isConfirmed: any }) => {
      if (result.isConfirmed) {
        locations.value.splice(index, 1);
        supplierLocationDeleteRequest(id)
          .then((response) => {
            Toast.fire({
              icon: "success",
              title: t("Record deleted successfully!"),
            });
          })
          .catch((error) => {
            Toast.fire({ icon: "error", title: t("Something went wrong") });
          });
      }
    });
  }
}

async function refresh() {
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
    let countryListing = await showGenericListing(routes.COUNTRY,  {all: true, sortBy: 'name', order: 'asc'});
    if (!!countryListing?.data) {
      countries.value = countryListing.data.map((ts: any) => {
        return { value: ts.id, text: ts.name };
      });
    }
    supplierShowRequest(supplierId).then((response) => {
    state.vatId = response?.data?.vatId;
    state.name = response?.data?.name;
    state.addressLine1 = response?.data?.addressFirst;
    state.addressLine2 = response?.data?.addressSecond;
    state.city = response?.data?.city;
    state.state = response?.data?.state;
    state.phone = response?.data?.phone;
    state.zip = response?.data?.zip;
    state.email = response?.data?.email;
    state.url = response?.data?.url;
    state.fax = response?.data?.fax;
    state.city = response?.data?.city;
    state.countryId = response?.data?.country?.id;
    state.termOfPayment = response?.data?.termOfPayment?.id;
    rows.value = response?.data?.bankDetails;
    locations.value = response?.data?.customerLocations;
  });
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
    <div class="tab-header">
      <ul class="" role="tablist">
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            id="supplier-tab"
            type="button"
            @click="step = 1"
            :class="{ active: step === 1, 'step-done': step > 1 }"
          >
            {{ $t("Supplier") }}
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            id="location-tab"
            type="button"
            @click="step = 2"
            :class="{ active: step === 2 }"
          >
            {{ $t("Location") }}
          </button>
        </li>
      </ul>
    </div>
    <div>
      <div id="supplier" class="suplier-address-details" v-show="step === 1">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Address Details</h3>
          </div>
          <div class="card-body">
            <div class="row mt-3">
              <div class="col-lg-3 mb-3">
                <label
                  class="form-label font-bold">Supplier Number:</label>
                <p>700030</p>
              </div>
              <div class="col-lg-3 mb-3">
                <label
                  class="form-label font-bold">Name:</label>
                <p>12341234</p>
              </div>
              <div class="col-lg-3 mb-3">
                <label
                  class="form-label font-bold">URL:</label><a class="hover:text-blue-500"
                  href="https://2134" target="_blank">2134</a></div>
              <div class="col-lg-3 mb-3">
                <label
                  class="form-label font-bold">Address First:</label>
                <p>21342134</p>
              </div>
              <div class="col-lg-3 mb-3">
                <label
                  class="form-label font-bold">Address Second:</label>
                <p>1234</p>
              </div>
              <div class="col-lg-3 mb-3">
                <label
                  class="form-label font-bold">City:</label>
                <p>21341234</p>
              </div>
              <div class="col-lg-3 mb-3">
                <label
                  class="form-label font-bold">ZIP:</label>
                <p>21342134</p>
              </div>
              <div class="col-lg-3 mb-3">
                <label
                  class="form-label font-bold">Country:</label>
                <p>1234123</p>
              </div>
              <div class="col-lg-3 mb-3">
                <label
                  class="form-label font-bold">State:</label>
                <p>1234</p>
              </div>
              <div class="col-lg-3 mb-3">
                <label
                  class="form-label font-bold">VAT ID:</label>
                <p>2341234</p>
              </div>
              <div class="col-lg-3 mb-3">
                <label
                  class="form-label font-bold">Phone:</label>
                <p>1234</p>
              </div>
              <div class="col-lg-3 mb-3">
                <label
                  class="form-label font-bold">Fax:</label>
                <p>2134</p>
              </div>
            </div>
          </div>
        </div>
        <div class="card mt-3">
          <div class="card-header">
            <h3 class="card-title">Payment Details</h3>
          </div>
          <div class="card-body">
            <div class="row mt-3">
              <div class="col-lg-3"><label
                  class="form-label font-bold">Terms Of Payment:</label>
                <p>14 Tage netto</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="location" class=" suplier-address-details" v-show="step === 2">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Add Location Details</h3>
          </div>
          <div class="card-body">
            <div class="row mt-3">
              <div class="col-lg-3"><label
                  class="form-label font-bold">Address First:</label>
                <p>21342134</p>
              </div>
              <div class="col-lg-3"><label
                  class="form-label font-bold">Address Second:</label>
                <p>1234</p>
              </div>
              <div class="col-lg-3"><label
                  class="form-label font-bold">City:</label>
                <p>21341234</p>
              </div>
              <div class="col-lg-3"><label
                  class="form-label font-bold">ZIP:</label>
                <p>21342134</p>
              </div>
              <div class="col-lg-3"><label
                  class="form-label font-bold">Country:</label>
                <p>1234123</p>
              </div>
              <div class="col-lg-3"><label
                  class="form-label font-bold">State:</label>
                <p>1234</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.suplier-address-details{
  label{
    margin: 0;
    width: 100%;
  }
}
</style>
