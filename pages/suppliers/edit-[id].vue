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
      text: "Edit",
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
{ title } = useTitle("Supplier Edit");
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
    <div class="wizard-tab">
      <ul class="" id="myTab" role="tablist">
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            id="supplier-tab"
            type="button"
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
            :class="{ active: step === 2 }"
          >
            {{ $t("Location") }}
          </button>
        </li>
      </ul>
    </div>
    <div>
      <div id="supplier" v-show="step === 1">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Address Details</h3>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-lg-6 col-md-6">
                <div class="form-group">
                  <elements-input
                    v-model="state.name"
                    :label="$t('Name')"
                    :required="true"
                    id="name"
                    :disabled="state.submitted"
                    :class="{ 'is-invalid': v$.name.$error }"
                  />
                  <div v-if="v$.name.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="v$.name.required">{{
                      $t("This value is required")
                    }}</span
                    ><br />
                  </div>
                </div>
              </div>
              <div class="col-lg-6 col-md-6">
                <div class="form-group">
                  <elements-input
                    v-model="state.vatId"
                    :label="$t('VAT ID')"
                    :required="true"
                    id="vatId"
                    :disabled="state.submitted"
                    :class="{ 'is-invalid': v$.vatId.$error }"
                  />
                  <div v-if="v$.vatId.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="v$.vatId.required">{{
                      $t("This value is required")
                    }}</span
                    ><br />
                  </div>
                </div>
              </div>
              <div class="col-lg-6 col-md-6">
                <div class="form-group">
                  <elements-input
                    v-model="state.addressLine1"
                    :label="$t('Address Line 1')"
                    :required="true"
                    id="addressLine1"
                    :disabled="state.submitted"
                    :class="{ 'is-invalid': v$.addressLine1.$error }"
                  />
                  <div v-if="v$.addressLine1.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="v$.addressLine1.required">{{
                      $t("This value is required")
                    }}</span
                    ><br />
                  </div>
                </div>
              </div>
              <div class="col-lg-6 col-md-6">
                <div class="form-group">
                  <elements-input
                    v-model="state.addressLine2"
                    :label="$t('Address Line 2')"
                    id="addressLine2"
                    :disabled="state.submitted"
                  />
                </div>
              </div>
              <div class="col-lg-6 col-md-6">
                <div class="form-group">
                  <elements-input
                    v-model="state.zip"
                    :label="$t('Zip')"
                    :required="true"
                    id="zip"
                    :disabled="state.submitted"
                    :class="{ 'is-invalid': v$.zip.$error }"
                  />
                  <div v-if="v$.zip.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="v$.zip.required">{{
                      $t("This value is required")
                    }}</span
                    ><br />
                  </div>
                </div>
              </div>
              <div class="col-lg-6 col-md-6">
                <div class="form-group">
                  <elements-input
                    v-model="state.city"
                    :label="$t('City')"
                    :required="true"
                    id="city"
                    :disabled="state.submitted"
                    :class="{ 'is-invalid': v$.city.$error }"
                  />
                  <div v-if="v$.city.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="v$.city.required">{{
                      $t("This value is required")
                    }}</span
                    ><br />
                  </div>
                </div>
              </div>
              <div class="col-lg-6 col-md-6">
                <div class="form-group">
                  <elements-multiselect
                    v-model="state.countryId"
                    :options="countries"
                    label="text"
                    :key="state.countryId"
                    track-by="value"
                    :textLabel="$t('Country')"
                    :required="true"
                    :class="{ 'is-invalid': v$.countryId.$error }"
                  />
                  <div v-if="v$.countryId.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="v$.countryId.required">{{
                      $t("This value is required")
                    }}</span
                    ><br />
                  </div>
                </div>
              </div>
              <div class="col-lg-6 col-md-6">
                <div class="form-group">
                  <elements-input
                    v-model="state.state"
                    :label="$t('State')"
                    :required="true"
                    id="state"
                    :disabled="state.submitted"
                    :class="{ 'is-invalid': v$.state.$error }"
                  />
                  <div v-if="v$.state.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="v$.state.required">{{
                      $t("This value is required")
                    }}</span
                    ><br />
                  </div>
                </div>
              </div>
              <div class="col-lg-4 col-md-6">
                <div class="form-group">
                  <elements-input
                    v-model="state.phone"
                    :label="$t('Phone')"
                    :required="true"
                    id="phone"
                    :disabled="state.submitted"
                    :class="{ 'is-invalid': v$.phone.$error }"
                  />
                  <div v-if="v$.phone.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="v$.phone.required">{{
                      $t("This value is required")
                    }}</span
                    ><br />
                  </div>
                </div>
              </div>
              <div class="col-lg-4 col-md-6">
                <div class="form-group">
                  <elements-input
                    v-model="state.fax"
                    :label="$t('Fax')"
                    id="fax"
                    :disabled="state.submitted"
                  />
                </div>
              </div>
              <div class="col-lg-4 col-md-6">
                <div class="form-group">
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text"
                        ><elements-icon v-bind:icon="`emailIcon`"
                      /></span>
                    </div>
                    <elements-input
                      v-model="state.email"
                      :label="$t('Email')"
                      :required="true"
                      id="email"
                      :disabled="state.submitted"
                      :class="{ 'is-invalid': v$.email.$error }"
                    />
                  </div>
                </div>
                <div v-if="v$.email.$error" class="invalid-feedback">
                  <span class="text-danger" v-if="v$.email.required">{{
                    $t("This value is required")
                  }}</span
                  ><br />
                <span v-if="v$.email.email" class="text-danger">{{
                  $t("Please enter valid email.")
                }}</span>
                </div>
              </div>
              <div class="col-lg-6 col-md-6">
                <div class="form-group">
                  <elements-input
                    v-model="state.url"
                    :label="$t('Url')"
                    :required="true"
                    id="url"
                    :disabled="state.submitted"
                    :class="{ 'is-invalid': v$.url.$error }"
                  />
                  <div v-if="v$.url.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="v$.url.required">{{
                      $t("This value is required")
                    }}</span
                    ><br />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card mt-3">
          <div class="card-header">
            <h3 class="card-title">Payment Details</h3>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <elements-multiselect
                    v-model="state.termOfPayment"
                    :options="termsOfPayments"
                    :key="state.termOfPayment"
                    label="text"
                    track-by="value"
                    :textLabel="$t('Terms of Payment')"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card mt-3">
          <div class="card-header pt-0 d-flex align-items-center justify-content-between">
            <h3 class="card-title">Bank Details</h3>
            <div class="cursor-pointer" v-if="isBankDetails">
              <elements-icon v-bind:icon="'xIcon'" @click="isBankDetails = false" />
            </div>
          </div>
          <div class="card-body">
            <div class="row">
              <div v-if="isBankDetails" class="col-md-12 mb-3">
                <div class="bank-details-card card">
                  <div class="card-body">
                    <div class="row">
                      <div class="col-md-4">
                        <div class="form-group mb-0">
                          <elements-input
                            v-model="state2.bankName"
                            :label="$t('Bank Name')"
                            :required="true"
                            id="bankName"
                            :class="{
                              'is-invalid':
                                v2$.bankName.$error && state2.submitted,
                            }"
                          />
                          <div
                            v-if="v2$.bankName.$error && state2.submitted"
                            class="invalid-feedback"
                          >
                            <span
                              class="text-danger"
                              v-if="v2$.bankName.required && state2.submitted"
                              >{{ $t("This value is required") }}</span
                            ><br />
                          </div>
                        </div>
                      </div>
                      <div class="col-md-4">
                        <div class="form-group mb-0">
                          <elements-input
                            v-model="state2.swift"
                            :label="$t('BIC.Swift')"
                            :required="true"
                            id="swift"
                            :class="{
                              'is-invalid':
                                v2$.swift.$error && state2.submitted,
                            }"
                          />
                          <div
                            v-if="v2$.swift.$error && state2.submitted"
                            class="invalid-feedback"
                          >
                            <span
                              class="text-danger"
                              v-if="v2$.swift.required && state2.submitted"
                              >{{ $t("This value is required") }}</span
                            ><br />
                          </div>
                        </div>
                      </div>
                      <div class="col-md-4">
                        <div class="form-group mb-0">
                          <elements-input
                            v-model="state2.iban"
                            :label="$t('IBAN')"
                            :required="true"
                            id="iban"
                            :class="{
                              'is-invalid': v2$.iban.$error && state2.submitted,
                            }"
                          />
                          <div
                            v-if="v2$.iban.$error && state2.submitted"
                            class="invalid-feedback"
                          >
                            <span
                              class="text-danger"
                              v-if="v2$.iban.required && state2.submitted"
                              >{{ $t("This value is required") }}</span
                            ><br />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-12 col-12 mt-3">
            <div
              @click.prevent="addBankDetails()"
              class="add-bank-btn d-flex align-items-center cursor-pointer"
            >
              <elements-icon v-bind:icon="`addcircleIcon`" class="me-2" />
              {{ $t("add bank details") }}
            </div>
          </div>
            </div>
            <div v-if="rows.length > 0" class="row">
              <div class="col-12">
                <div class="table-responsive mt-3">
                  <table class="doc-table table">
                    <thead>
                      <tr>
                        <th>Bank Name</th>
                        <th>BIC.SWIFT</th>
                        <th>IBAN</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in rows" :key="index">
                        <td>{{ item?.bankName }}</td>
                        <td>{{ item?.swift }}</td>
                        <td>{{ item?.iban }}</td>
                        <td>
                          <i
                            class="mdi mdi-delete edit-icon"
                            @click.prevent="popRow(index)"
                          ></i>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="form-group text-right mt-3 d-flex align-items-center justify-content-between"
        >
          <submittal-button
            @click="store()"
            :isLoading="state.submitted"
            :buttonName="$t('Next')"
          />
        </div>
      </div>
      <div id="location" v-show="step === 2">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Add Location Details</h3>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-lg-6 col-md-6">
                <div class="form-group">
                  <elements-input
                    v-model="location.addressLine1"
                    :label="$t('Address Line 1')"
                    :required="true"
                    id="addressLine1"
                    :class="{
                      'is-invalid':
                        v3$.addressLine1.$error && location.submitted,
                    }"
                  />
                  <div
                    v-if="v3$.addressLine1.$error && location.submitted"
                    class="invalid-feedback"
                  >
                    <span
                      class="text-danger"
                      v-if="v3$.addressLine1.required && location.submitted"
                      >{{ $t("This value is required") }}</span
                    ><br />
                  </div>
                </div>
              </div>
              <div class="col-lg-6 col-md-6">
                <div class="form-group">
                  <elements-input
                    v-model="location.addressLine2"
                    :label="$t('Address Line 2')"
                    id="addressLine2"
                  />
                </div>
              </div>
              <div class="col-lg-6 col-md-6">
                <div class="form-group">
                  <elements-input
                    v-model="location.zip"
                    :label="$t('Zip')"
                    :required="true"
                    id="zip"
                    :class="{
                      'is-invalid': v3$.zip.$error && location.submitted,
                    }"
                  />
                  <div
                    v-if="v3$.zip.$error && location.submitted"
                    class="invalid-feedback"
                  >
                    <span
                      class="text-danger"
                      v-if="v3$.zip.required && location.submitted"
                      >{{ $t("This value is required") }}</span
                    ><br />
                  </div>
                </div>
              </div>
              <div class="col-lg-6 col-md-6">
                <div class="form-group">
                  <elements-input
                    v-model="location.city"
                    :label="$t('City')"
                    :required="true"
                    id="city"
                    :class="{
                      'is-invalid': v3$.city.$error && location.submitted,
                    }"
                  />
                  <div
                    v-if="v3$.city.$error && location.submitted"
                    class="invalid-feedback"
                  >
                    <span
                      class="text-danger"
                      v-if="v3$.city.required && location.submitted"
                      >{{ $t("This value is required") }}</span
                    ><br />
                  </div>
                </div>
              </div>
              <div class="col-lg-6 col-md-6">
                <div class="form-group">
                  <elements-multiselect
                    v-model="location.countryId"
                    :key="location.countryId"
                    :options="countries"
                    label="text"
                    track-by="value"
                    :textLabel="$t('Country')"
                    :required="true"
                    :class="{
                      'is-invalid': v3$.countryId.$error && location.submitted,
                    }"
                  />
                  <div
                    v-if="v3$.countryId.$error && location.submitted"
                    class="invalid-feedback"
                  >
                    <span
                      class="text-danger"
                      v-if="v3$.countryId.required && location.submitted"
                      >{{ $t("This value is required") }}</span
                    ><br />
                  </div>
                </div>
              </div>
              <div class="col-lg-6 col-md-6">
                <div class="form-group">
                  <elements-input
                    v-model="location.state"
                    :label="$t('State')"
                    :required="true"
                    id="state"
                    :class="{
                      'is-invalid': v3$.state.$error && location.submitted,
                    }"
                  />
                  <div
                    v-if="v3$.state.$error && location.submitted"
                    class="invalid-feedback"
                  >
                    <span
                      class="text-danger"
                      v-if="v3$.state.required && location.submitted"
                      >{{ $t("This value is required") }}</span
                    ><br />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <button @click.prevent="addLocation()" class="secondary-btn">
              {{ $t("Add Location") }}
            </button>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="table-responsive mt-3">
              <table class="doc-table table">
                <thead>
                  <tr>
                    <th>Country</th>
                    <th>ZIP</th>
                    <th>State</th>
                    <th>City</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in locations" :key="index">
                    <td>{{ item?.country?.name }}</td>
                    <td>{{ item?.zip }}</td>
                    <td>{{ item?.state }}</td>
                    <td>{{ item?.city }}</td>
                    <td>
                      <i
                        v-if="item?.isHeadQuarter == false"
                        class="mdi mdi-delete edit-icon"
                        @click.prevent="popLocation(index, item?.id)"
                      ></i>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div
          class="form-group text-right mt-3 d-flex align-items-center justify-content-between"
        >
          <button class="primary-btn" @click.prevent="prev()">Previous</button>
          <submittal-button
            @click.prevent="done()"
            :isLoading="state.submitted"
            :iconName="'updateIcon'"
            :buttonName="$t('Update')"
          />
        </div>
      </div>
    </div>
  </div>
</template>
