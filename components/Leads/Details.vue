<script setup lang="ts">
import { ref, reactive } from "vue";
import {
  leadCreateRequest,
  leadUpdateRequest,
  leadShowRequest,
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
    leadStatus: "",
    notes: "",
    invoiceEmailAddress: "",
    productType: "",
    addressLine1: "",
    addressLine2: "",
    countryId: "",
    termOfPayment: "",
    size: "",
    paymentPeriodId: "",
    expiryDate: "",
    orderProbability: "",
    assignees: [],
    contractReportsSource: [],
  }),
  emit = defineEmits(["detailsDone"]),
  leadId = ref(""),
  bankDetails = reactive({
    isLoading: false,
    submitted: false,
    bankName: "",
    swift: "",
    iban: "",
  }),
  isBankDetails = ref(false),
  productTypeOptions = [
    { value: "premise", name: "On-Premise" },
    { value: "private", name: "Cloud (Private)" },
    { value: "public", name: "Cloud (Public)" },
    { value: "hosting", name: "Hosting" },
    { value: "other", name: "Other" },
  ],
  sizeOptions = [
    { value: "tiny", name: "Tiny" },
    { value: "small", name: "Small" },
    { value: "medium", name: "Medium" },
    { value: "big", name: "Big" },
    { value: "corporate", name: "Corporate" },
  ],
  validationRules = {
    name: { required },
    vatId: { required },
    zip: { required },
    city: { required },
    url: { required },
    state: { required },
    addressLine1: { required },
    countryId: { required },
    leadStatus: { required },
    size: { required },
    assignees: { required },
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
  leadStatuses: {
    type: Array,
    default: [],
  },
  paymentPeriods: {
    type: Array,
    default: [],
  },
  leadId: {
    type: String,
    default: "",
  },
  termsOfPayments: {
    type: Array,
    default: [],
  },
  isUpdate: {
    type: Boolean,
    default: false,
  },
  assignee: {
    type: Array,
    default: [],
  },
  contractReportsSources: {
    type: Array,
    default: [],
  },
});

const popRow = (index) => {
  rows.value.splice(index, 1);
};

const showCustomer = () => {
  leadShowRequest(props.leadId).then((response) => {
    state.name = response?.data?.name;
    state.productType = response?.data?.productType;
    state.vatId = response?.data?.vatId;
    state.addressLine1 = response?.data?.addressFirst;
    state.addressLine2 = response?.data?.addressSecond;
    state.zip = response?.data?.zip;
    state.city = response?.data?.city;
    state.countryId = response?.data?.country?.id;
    state.state = response?.data?.state;
    state.phone = response?.data?.phone;
    state.fax = response?.data?.fax;
    state.url = response?.data?.url;
    
    state.paymentPeriodId = response?.data?.paymentPeriodId;
    state.leadStatus = response?.data?.leadStatus?.id;
    state.notes = response?.data?.notes;
    state.size = response?.data?.size;
    state.orderProbability = response?.data?.orderProbability;
    state.expiryDate = response?.data?.expiryDate;
    // state.contractReportsSource = response?.data?.contactReportSource;
    for (const item of response?.data?.contactReportSource) {
      state.contractReportsSource.push(item?.id);
    }
    state.assignees = response?.data?.assignee;
    state.termOfPayment = response?.data?.termOfPayment?.id;
    state.invoiceEmailAddress = response?.data?.invoiceEmail;
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
  isBankDetails.value = true
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
    isBankDetails.value = false
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
  leadUpdateRequest(
    {
      name: state.name,
      productType: state.productType,
      vatId: state.vatId,
      addressFirst: state.addressLine1,
      addressSecond: state.addressLine2,
      zip: state.zip,
      city: state.city,
      countryId: state.countryId,
      state: state.state,
      phone: state.phone,
      paymentPeriodId: state.paymentPeriodId,
      url: state.url,
      fax: state.fax,
      termOfPaymentId: state.termOfPayment,
      leadStatusId: state.leadStatus,
      expiryDate: state.expiryDate,
      orderProbability: state.orderProbability,
      invoiceEmail: state.invoiceEmailAddress,
      notes: state.notes,
      size: state.size,
      assignee: state.assignees,
      contactReportSource: state.contractReportsSource,
      bankDetails: rows.value,
    },
    props.leadId
  )
    .then((response) => {
      Toast.fire({
        icon: "success",
        title: t("Record updated successfully!"),
      });
      state.isLoading = false;
      state.submitted = false;
      emit("detailsDone", { leadId: response?.data?.id });
    })
    .catch((error) => {
      state.isLoading = false;
      state.submitted = false;
      Toast.fire({ icon: "error", title: t("something went wrong!") });
    });
};

const createCompany = () => {
  leadCreateRequest({
    name: state.name,
    productType: state.productType,
    vatId: state.vatId,
    addressFirst: state.addressLine1,
    addressSecond: state.addressLine2,
    zip: state.zip,
    city: state.city,
    countryId: state.countryId,
    state: state.state,
    phone: state.phone,
    url: state.url,
    paymentPeriodId: state.paymentPeriodId,
    fax: state.fax,
    termOfPaymentId: state.termOfPayment,
    leadStatusId: state.leadStatus,
    expiryDate: state.expiryDate,
    orderProbability: state.orderProbability,
    invoiceEmail: state.invoiceEmailAddress,
    notes: state.notes,
    size: state.size,
    assignee: state.assignees,
    contactReportSource: state.contractReportsSource,
    bankDetails: rows.value,
  })
    .then((response) => {
      Toast.fire({
        icon: "success",
        title: t("Record created successfully!"),
      });
      leadId.value = response?.data?.id;
      emit("detailsDone", { leadId: response?.data?.id });

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
          <div class="col-lg-4 col-md-4">
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
          <div class="col-lg-4 col-md-4">
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
          <div class="col-lg-4 col-md-4">
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
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"
                    ><elements-icon v-bind:icon="`phoneIcon`"
                  /></span>
                </div>
                <elements-input
                  v-model="state.phone"
                  :label="$t('Phone')"
                  id="phone"
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
                  :label="$t('Url')"
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
          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <elements-multiselect
                v-model="state.leadStatus"
                :options="leadStatuses"
                label="text"
                :key="state.leadStatus"
                track-by="value"
                :textLabel="$t('Status')"
                :required="true"
                :class="{ 'is-invalid': v$.leadStatus.$error }"
              />
            </div>
            <div v-if="v$.leadStatus.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.leadStatus.required">{{
                $t("This value is required")
              }}</span
              ><br />
            </div>
          </div>
          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <elements-input
                v-model="state.notes"
                :label="$t('Notes')"
                id="url"
                :disabled="state.submitted"
              />
            </div>
          </div>
          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <elements-multiselect
                v-model="state.size"
                :options="sizeOptions"
                label="name"
                :key="state.size"
                track-by="value"
                :textLabel="$t('Size')"
                :required="true"
                :class="{ 'is-invalid': v$.size.$error }"
              />
            </div>
            <div v-if="v$.size.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.size.required">{{
                $t("This value is required")
              }}</span
              ><br />
            </div>
          </div>
          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <elements-input
                v-model="state.orderProbability"
                :label="$t('Order Probability')"
                id="orderProbability"
                :type="'number'"
                :disabled="state.submitted"
              />
            </div>
          </div>
          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"
                    ><elements-icon v-bind:icon="`dateIcon`"
                  /></span>
                </div>
                <elements-input
                  v-model="state.expiryDate"
                  :label="$t('Expiring Date')"
                  id="expiryDate"
                  :type="'date'"
                  :disabled="state.submitted"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card mt-4">
      <div class="card-header d-flex align-items-center">
        <h3 class="card-title me-2">{{ $t("Add Assignees") }}</h3>
        <elements-tooltip />
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <elements-multiselect
                v-model="state.assignees"
                :options="assignee"
                label="text"
                track-by="value"
                :key="state.assignees"
                :textLabel="$t('Assignee')"
                :required="true"
                :multiple="true"
                :class="{ 'is-invalid': v$.assignees.$error }"
              />
              <div v-if="v$.assignees.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.assignees.required">{{
                  $t("This value is required")
                }}</span
                ><br />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card mt-4">
      <div class="card-header d-flex align-items-center">
        <h3 class="card-title me-2">{{ $t("Add Contact Report Sources") }}</h3>
        <elements-tooltip />
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <elements-multiselect
                v-model="state.contractReportsSource"
                :options="contractReportsSources"
                label="text"
                track-by="value"
                :key="state.contractReportsSource"
                :textLabel="$t('Contract Report Source')"
                :multiple="true"
              />
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
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-input
                v-model="state.invoiceEmailAddress"
                :label="$t('Invoice Email Address')"
                id="invoiceEmailAddress"
                :disabled="state.submitted"
              />
            </div>
          </div>
        </div>
        <div class="row">

          <div class="col-lg-4 col-md-6">
            <div class="form-group">
              <elements-multiselect
                v-model="state.paymentPeriodId"
                :options="paymentPeriods"
                label="text"
                :key="state.paymentPeriodId"
                track-by="value"
                :textLabel="$t('Default Payment Period')"
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
      <div class="card-body">
        <div class="row align-items-center">
          <div v-if="isBankDetails" class="col-md-4">
            <div class="form-group">
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
          <div v-if="isBankDetails" class="col-md-4">
            <div class="form-group">
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
          <div v-if="isBankDetails" class="col-md-3">
            <div class="form-group">
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
            <div class="table-responsive mt-4">
              <table class="doc-table table">
                <thead>
                  <tr>
                    <th>{{ $t("Bank Name") }}</th>
                    <th>{{ $t("BIC.SWIFT") }}</th>
                    <th>{{ $t("IBAN") }}</th>
                    <th>{{ $t("Actions") }}</th>
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

    <div class="text-right mt-3 d-flex align-items-center justify-content-end">
      <button
            class="primary-btn me-3"
            @click="navigateTo('/leads')"
          >
            <elements-icon v-bind:icon="'cancelIcon'" class="me-2" />
            <span>{{ $t("Cancel") }}</span>
          </button>
      <submittal-button
        @click="store()"
        :isLoading="state.isLoading"
        :buttonName="$t('Save and Proceed')"
        :iconName="'saveIcon'"
      />
    </div>
  </div>
</template>
