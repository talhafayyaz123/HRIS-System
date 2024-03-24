<script setup lang="ts">
import { ref, reactive } from "vue";
import {
  customerCreateRequest,
  customerUpdateRequest,
  customerShowRequest,
} from "~/utils/apiRequests";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";

const { router, Toast } = commonCode(),
  { t } = useI18n(),
  state = reactive({
    isLoading: false,
    submitted: false,
    name: "",
    vatId: "",
    zip: "",
    city: "",
    phone: "",
    state: "",
    url: "",
    fax: "",
    productType: "",
    addressLine1: "",
    addressLine2: "",
    countryId: "",
    termOfPayment: "",
    invoiceEmailAddress: "",
    paymentPeriodId: "",
    mergePdfOnDefault: false,
    applyReverseChanges: false,
    externalOrderNumber: "",
    hourlyRate: "",
    discount: "",
    defaultServiceDailyRate: "",
    productName: "",
    productId: "",
  }),
  priceListIds = ref([]),
  priceLists = ref([]),
  emit = defineEmits(["tab1Done"]),
  customerId = ref(""),
  isBankDetails = ref(false),
  bankDetails = reactive({
    isLoading: false,
    submitted: false,
    bankName: "",
    swift: "",
    iban: "",
  }),
  productTypeOptions = [
    { value: "premise", name: "On-Premise" },
    { value: "private", name: "Cloud (Private)" },
    { value: "public", name: "Cloud (Public)" },
    { value: "hosting", name: "Hosting" },
    { value: "other", name: "Other" },
  ],
  validationRules = {
    name: { required },
    vatId: { required },
    zip: { required },
    phone: { required },
    city: { required },
    url: { required },
    state: { required },
    addressLine1: { required },
    countryId: { required },
    paymentPeriodId: { required },
  },
  bankDetailsRules = {
    bankName: { required },
    swift: { required },
    iban: { required },
  },
  v$ = useVuelidate(validationRules, state),
  v2$ = useVuelidate(bankDetailsRules, bankDetails);
const rows = ref([]);
const props = defineProps({
  countries: {
    type: Array,
    default: [],
  },
  customerId: {
    type: String,
    default: "",
  },
  products: {
    type: Array,
    default: [],
  },
  termsOfPayments: {
    type: Array,
    default: [],
  },
  paymentPeriods: {
    type: Array,
    default: [],
  },
  isUpdate: {
    type: Boolean,
    default: false,
  },
});

const popRow = (index) => {
  rows.value.splice(index, 1);
};
const popPriceList = (index) => {
  priceLists.value.splice(index, 1);
};
const defaultServiceProductAdded = (data) => {
  state.productId = data.productId;
  state.productName = data.productName;
};
const priceListAdded = (data) => {
  priceLists.value = data.priceLists;
};
const isModalOpen = ref(false);

const isPriceListModalOpen = ref(false);


function hideModal() {
  isModalOpen.value = false;
}

function openModal() {
  isModalOpen.value = true;
}

function hidePriceListModal() {
  isPriceListModalOpen.value = false;
}

function openPriceListModal() {
  isPriceListModalOpen.value = true;
}


const showCustomer = () => {
  customerShowRequest(props.customerId).then((response) => {
    state.vatId = response?.data?.vatId;
    state.name = response?.data?.name;
    state.productType = response?.data?.type;
    state.addressLine1 = response?.data?.addressFirst;
    state.addressLine2 = response?.data?.addressSecond;
    state.city = response?.data?.city;
    state.state = response?.data?.state;
    state.phone = response?.data?.phone;
    state.zip = response?.data?.zip;
    state.url = response?.data?.url;
    state.fax = response?.data?.fax;
    priceLists.value = response?.data?.priceLists;
    state.productId = response?.data?.defaultServiceProduct?.id;
    state.defaultServiceDailyRate = response?.data?.defaultServiceDailyRate;
    state.hourlyRate = response?.data?.defaultServiceHourlyRate;
    state.invoiceEmailAddress = response?.data?.invoiceEmail;
    state.countryId = response?.data?.country?.id;
    state.productName = response?.data?.defaultServiceProduct?.name;
    state.discount = response?.data?.discount;
    state.termOfPayment = response?.data?.termOfPayment?.id;
    state.paymentPeriodId = response?.data?.paymentPeriodId;
    state.applyReverseChanges = response?.data?.applyReverseChange;
    state.mergePdfOnDefault = response?.data?.mergePdfOnDefault;
    state.externalOrderNumber = response?.data?.externalOrderNo;
    rows.value = response?.data?.bankDetails;

  });
};

const refresh = () => {
  if (router.params.id) {
    showCustomer();
  }
};

refresh();

const addBankDetails = () => {
  isBankDetails.value = true;
  bankDetails.submitted = true;
  v2$.value.$touch();
  if (v2$.value.$invalid) {
    return false;
  } else {
    bankDetails.submitted = false;
    const obj = {
      bankName: bankDetails.bankName,
      swift: bankDetails.swift,
      iban: bankDetails.iban,
    };
    rows.value.push(obj);
    isBankDetails.value = false;
    bankDetails.swift = "";
    bankDetails.bankName = "";
    bankDetails.iban = "";
  }
};

const store = () => {
  v$.value.$touch();
  if (v$.value.$invalid) {
    state.submitted = false;
    return false;
  } else {
    try {
      state.isLoading = true;
      priceLists.value.forEach((priceList) => {
        priceListIds.value.push(priceList.id)
      });
      if (props.isUpdate == true) {
        updateCompany();
      } else {
        createCompany();
      }
    } catch (e) {
      Toast.fire({ title: t("Error!"), text: t("Error"), icon: "error" });
      state.isLoading = false;
      state.submitted = false;
    }
  }
};

const updateCompany = () => {
  
  customerUpdateRequest(
    {
      name: state.name,
      vatId: state.vatId,
      addressFirst: state.addressLine1,
      addressSecond: state.addressLine2,
      type: state.productType,
      zip: state.zip,
      city: state.city,
      countryId: state.countryId,
      state: state.state,
      phone: state.phone,
      fax: state.fax,
      url: state.url,
      priceLists: priceListIds.value,
      termOfPaymentId: state.termOfPayment,
      invoiceEmail: state.invoiceEmailAddress,
      paymentPeriodId: state.paymentPeriodId,
      applyReverseChange: state.applyReverseChanges,
      mergePdfOnDefault: state.mergePdfOnDefault,
      externalOrderNo: state.externalOrderNumber,
      bankDetails: rows.value,
      defaultServiceProduct: state.productId,
      defaultServiceDailyRate: state.defaultServiceDailyRate,
      defaultServiceHourlyRate: state.hourlyRate,
      discount: state.discount,
    },
    props.customerId
  )
    .then((response) => {
      Toast.fire({
        icon: "success",
        title: t("Record updated successfully!"),
      });
      state.isLoading = false;
      state.submitted = false;
      emit("tab1Done", { customerId: response?.data?.id });
    })
    .catch((error) => {
      state.isLoading = false;
      state.submitted = false;
      Toast.fire({ icon: "error", title: t("something went wrong!") });
    });
};

const createCompany = () => {
  customerCreateRequest({
    name: state.name,
    vatId: state.vatId,
    addressFirst: state.addressLine1,
    addressSecond: state.addressLine2,
    type: state.productType,
    zip: state.zip,
    city: state.city,
    fax: state.fax,
    countryId: state.countryId,
    state: state.state,
    phone: state.phone,
    url: state.url,
    priceLists: priceListIds.value,
    termOfPaymentId: state.termOfPayment,
    invoiceEmail: state.invoiceEmailAddress,
    paymentPeriodId: state.paymentPeriodId,
    applyReverseChange: state.applyReverseChanges,
    mergePdfOnDefault: state.mergePdfOnDefault,
    externalOrderNo: state.externalOrderNumber,
    bankDetails: rows.value,
    defaultServiceProduct: state.productId,
    defaultServiceDailyRate: state.defaultServiceDailyRate,
    defaultServiceHourlyRate: state.hourlyRate,
    discount: state.discount,
  })
    .then((response) => {
      Toast.fire({
        icon: "success",
        title: t("Record created successfully!"),
      });
      customerId.value = response?.data?.id;
      emit("tab1Done", { customerId: response?.data?.id });

      state.isLoading = false;
      state.submitted = false;
    })
    .catch((error) => {
      state.isLoading = false;
      state.submitted = false;
      Toast.fire({ icon: "error", title: t("something went wrong!") });
    });
};
</script>
<template>
  <div>
    <div class="card product-type">
      <div class="card-header d-flex align-items-center">
        <h3 class="card-title me-2">{{ $t("Fill Personal Details") }}</h3>
        <elements-tooltip />
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"
                    ><elements-icon v-bind:icon="`buildingIcon`"
                  /></span>
                </div>
                <elements-input
                  v-model="state.name"
                  :label="$t('Name')"
                  :required="true"
                  id="name"
                  :disabled="state.submitted"
                  :class="{ 'is-invalid': v$.name.$error }"
                />
              </div>
            </div>
            <div v-if="v$.name.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.name.required">{{
                $t("This value is required")
              }}</span
              ><br />
            </div>
          </div>
          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <elements-multiselect
                v-model="state.productType"
                :options="productTypeOptions"
                label="name"
                :key="state.productType"
                track-by="value"
                :textLabel="$t('Type')"
              />
            </div>
          </div>

          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"
                    ><elements-icon v-bind:icon="`locationIcon`"
                  /></span>
                </div>
                <elements-input
                  v-model="state.addressLine1"
                  :label="$t('Address Line 1')"
                  :required="true"
                  id="addressLine1"
                  :disabled="state.submitted"
                  :class="{ 'is-invalid': v$.addressLine1.$error }"
                />
              </div>
            </div>
            <div v-if="v$.addressLine1.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.addressLine1.required">{{
                $t("This value is required")
              }}</span
              ><br />
            </div>
          </div>
          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"
                    ><elements-icon v-bind:icon="`locationIcon`"
                  /></span>
                </div>
                <elements-input
                  v-model="state.addressLine2"
                  :label="$t('Address Line 2')"
                  id="addressLine2"
                  :disabled="state.submitted"
                />
              </div>
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
            </div>
            <div v-if="v$.zip.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.zip.required">{{
                $t("This value is required")
              }}</span
              ><br />
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
            </div>
            <div v-if="v$.city.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.city.required">{{
                $t("This value is required")
              }}</span
              ><br />
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
            </div>
            <div v-if="v$.countryId.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.countryId.required">{{
                $t("This value is required")
              }}</span
              ><br />
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
            </div>
            <div v-if="v$.state.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.state.required">{{
                $t("This value is required")
              }}</span
              ><br />
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
            </div>
            <div v-if="v$.vatId.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.vatId.required">{{
                $t("This value is required")
              }}</span
              ><br />
            </div>
          </div>
          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"
                    ><elements-icon v-bind:icon="`phoneIcon`"
                  /></span>
                </div>
                <elements-input
                  v-model="state.phone"
                  :label="$t('Phone')"
                  :required="true"
                  id="phone"
                  :disabled="state.submitted"
                  :class="{ 'is-invalid': v$.phone.$error }"
                />
              </div>
            </div>
            <div v-if="v$.phone.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.phone.required">{{
                $t("This value is required")
              }}</span
              ><br />
            </div>
          </div>
          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"
                    ><elements-icon v-bind:icon="`faxIcon`"
                  /></span>
                </div>
                <elements-input
                  v-model="state.fax"
                  :label="$t('Fax')"
                  id="fax"
                  :disabled="state.submitted"
                />
              </div>
            </div>
          </div>
          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"
                    ><elements-icon v-bind:icon="`urlIcon`"
                  /></span>
                </div>
                <elements-input
                  v-model="state.url"
                  :label="$t('URL')"
                  :required="true"
                  id="url"
                  :disabled="state.submitted"
                  :class="{ 'is-invalid': v$.url.$error }"
                />
              </div>
            </div>
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
    <div class="card mt-4">
      <div class="card-header d-flex align-items-center">
        <h3 class="card-title me-2">{{ $t("Payment Details") }}</h3>
        <elements-tooltip />
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-8">
            <div class="form-group">
              <elements-multiselect
                v-model="state.termOfPayment"
                :options="termsOfPayments"
                label="text"
                track-by="value"
                :key="state.termOfPayment"
                :textLabel="$t('Terms of Payment')"
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
                  v-model="state.invoiceEmailAddress"
                  :label="$t('Invoice Email Address')"
                  id="invoiceEmailAddress"
                  :disabled="state.submitted"
                />
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="form-group">
              <elements-multiselect
                v-model="state.paymentPeriodId"
                :options="paymentPeriods"
                label="text"
                :key="state.paymentPeriodId"
                track-by="value"
                :textLabel="$t('Default Payment Period')"
                :required="true"
                :class="{ 'is-invalid': v$.paymentPeriodId.$error }"
              />
            </div>
            <div v-if="v$.paymentPeriodId.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.paymentPeriodId.required">{{
                $t("This value is required")
              }}</span
              ><br />
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="form-group checkbox-group d-flex align-items-start">
              <input
                class="checkbox-input"
                type="checkbox"
                v-model="state.mergePdfOnDefault"
                id="mergePdfOnDefault"
              />
              <label class="checkbox-label m-0" for="mergePdfOnDefault">
                Merge PDFs on default
              </label>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="form-group checkbox-group d-flex align-items-start">
              <input
                class="checkbox-input"
                type="checkbox"
                v-model="state.applyReverseChanges"
                id="applyReverseChanges"
              />
              <label class="checkbox-label m-0" for="applyReverseChanges">
                Apply Reverse Change
              </label>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="form-group">
              <elements-input
                v-model="state.externalOrderNumber"
                :label="$t('External Order Number')"
                id="externalOrderNumber"
                :disabled="state.submitted"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="card-header pt-0 d-flex align-items-center justify-content-between">
        <h3 class="card-title">{{ $t("Bank Details") }}</h3>
        <div class="cursor-pointer" v-if="isBankDetails">
          <elements-icon v-bind:icon="'xIcon'" @click="isBankDetails = false" />
        </div>
      </div>
      <div class="card-body mt-3">
        <div v-if="isBankDetails" class="row">
          <div class="col-md-4">
            <div class="form-group mt-0">
              <elements-input
                v-model="bankDetails.bankName"
                :label="$t('Bank Name')"
                :required="true"
                id="bankName"
                :class="{
                  'is-invalid': v2$.bankName.$error && bankDetails.submitted,
                }"
              />
            </div>
            <div
              v-if="v2$.bankName.$error && bankDetails.submitted"
              class="invalid-feedback"
            >
              <span
                class="text-danger"
                v-if="v2$.bankName.required && bankDetails.submitted"
                >{{ $t("This value is required") }}</span
              ><br />
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group mt-0">
              <elements-input
                v-model="bankDetails.swift"
                :label="$t('BIC.Swift')"
                :required="true"
                id="swift"
                :class="{
                  'is-invalid': v2$.swift.$error && bankDetails.submitted,
                }"
              />
            </div>
            <div
              v-if="v2$.swift.$error && bankDetails.submitted"
              class="invalid-feedback"
            >
              <span
                class="text-danger"
                v-if="v2$.swift.required && bankDetails.submitted"
                >{{ $t("This value is required") }}</span
              ><br />
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group mt-0">
              <elements-input
                v-model="bankDetails.iban"
                :label="$t('IBAN')"
                :required="true"
                id="iban"
                :class="{
                  'is-invalid': v2$.iban.$error && bankDetails.submitted,
                }"
              />
            </div>
            <div
              v-if="v2$.iban.$error && bankDetails.submitted"
              class="invalid-feedback"
            >
              <span
                class="text-danger"
                v-if="v2$.iban.required && bankDetails.submitted"
                >{{ $t("This value is required") }}</span
              ><br />
            </div>
          </div>
        </div>
        <div class="mt-3">
          <div
            @click.prevent="addBankDetails()"
            class="add-bank-btn cursor-pointer"
          >
            <elements-icon v-bind:icon="'addcircleIcon'" class="me-2" />
            {{ $t("add bank details") }}
          </div>
        </div>
      </div>
    </div>
    <div v-if="rows.length > 0" class="table-responsive mt-4">
      <table class="doc-table table">
        <thead>
          <tr>
            <th>{{ $t("Bank Name") }}</th>
            <th>{{ $t("BIC.SWIFT") }}</th>
            <th>{{ $t("IBAN") }}</th>
            <th>{{ $t("Action") }}</th>
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
    <div class="card mt-4">
      <div class="card-header d-flex align-items-center">
        <h3 class="card-title me-2">{{ $t("Default Service Details") }}</h3>
        <elements-tooltip />
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-4">
            <div class="form-group">
              <div class="form-control product-modal-btn" @click="openModal()">
                <span class="">{{ state?.productName }}</span>
              </div>
              <label for="" class="input-label"
                >{{ $t("Default Service Product") }}
              </label>
            </div>
            <customers-add-product
              :showModal="isModalOpen"
              :products="products"
              :hideModal="hideModal"
              :key="products.length"
              @productAdded="defaultServiceProductAdded"
            />
            <customers-add-price-list
              :showModal="isPriceListModalOpen"
              :products="products"
              :hideModal="hidePriceListModal"
              :key="products.length"
              @priceListAdded="priceListAdded"
            />
          </div>
          <div class="col-md-4">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"
                    ><elements-icon v-bind:icon="`dollarIcon`"
                  /></span>
                </div>
                <elements-input
                  v-model="state.hourlyRate"
                  :label="$t('Hourly Rate')"
                  id="hourlyRate"
                  type="number"
                  :disabled="state.submitted"
                />
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"
                    ><elements-icon v-bind:icon="`percentageIcon`"
                  /></span>
                </div>
                <elements-input
                  v-model="state.discount"
                  :label="$t('Discount')"
                  id="discount"
                  :disabled="state.submitted"
                  type="number"
                />
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"
                    ><elements-icon v-bind:icon="`dollarIcon`"
                  /></span>
                </div>
                <elements-input
                  v-model="state.name"
                  :label="$t('Default Service Hourly Rate')"
                  id="defaultServiceHourlyRate"
                  :disabled="state.submitted"
                  type="number"
                />
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"
                    ><elements-icon v-bind:icon="`dollarIcon`"
                  /></span>
                </div>
                <elements-input
                  v-model="state.defaultServiceDailyRate"
                  :label="$t('Default Service Daily Rate')"
                  id="defaultServiceDailyRate"
                  :disabled="state.submitted"
                  type="number"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card mt-4">
      <div class="card-header d-flex align-items-center">
        <h3 class="card-title me-2">{{ $t("Add Default Price List") }}</h3>
        <elements-tooltip />
      </div>
      <div class="card-body">
        <div class="row">
          <div class="mt-3">
          <div
          @click="openPriceListModal()"
            class="add-bank-btn cursor-pointer"
          >
            <elements-icon v-bind:icon="'addcircleIcon'" class="me-2" />
            {{ $t("Add Price List") }}
          </div>
        </div>
        <div v-if="priceLists.length > 0" class="table-responsive mt-4">
      <table class="doc-table table">
        <thead>
          <tr>
            <th>{{ $t("Name") }}</th>
            <th>{{ $t("Status") }}</th>
            <th>{{ $t("Is Default") }}</th>
            <th>{{ $t("Action") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in priceLists" :key="index">
            <td>{{ item?.name }}</td>
            <td>{{ item?.status }}</td>
            <td>{{ item?.isDefault }}</td>
            <td>
              <i
                class="mdi mdi-delete edit-icon"
                @click.prevent="popPriceList(index)"
              ></i>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
        </div>
      </div>
    </div>
    <div class="mt-3 d-flex align-items-center justify-content-end">
      <button class="primary-btn me-3" @click="navigateTo('/customers')">
        <elements-icon v-bind:icon="'cancelIcon'" class="me-2" />
        <span>{{ $t("Cancel") }}</span>
      </button>
      <submittal-button
        @click="store()"
        :isLoading="state.isLoading"
        :iconName="'saveIcon'"
        :buttonName="$t('Save and Proceed')"
      />
    </div>
  </div>
</template>
