<script setup lang="ts">
import { ref, reactive, watch, onMounted, computed } from "vue";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required, requiredIf } from "@vuelidate/validators";
import { routes } from "~/utils/apiRoutes";
import Multiselect from "@vueform/multiselect";
import { dateFormatter } from "~/utils/helperFunctions";
import { formatDateLite } from "~/utils/helperFunctions";
import offerAndConfirmOffer from "~/composables/offerAndConfirmOffer";
import { useLayoutStore } from "~/store/layout";

import {
  customerRequest,
  leadRequest,
  getSaleOfferRequest,
  genericListingRequest,
  getSaleOfferConfirmationRequest,
  editSaleOfferConfirmationRequest,
  addSaleOfferConfirmationRequest,
  getUserListFromComsumerIdRequest,
  getProjectsFromComsumerIdRequest,
} from "~/utils/apiRequests";

const layout = useLayoutStore();
const props = defineProps(["recordId"]);

const { router, Toast } = commonCode();
const {
  state,
  isLoading,
  isModalOpen,
  selectedComponentType,
  parentComponentIndex,
  companyDetail,
  softwareLicencesTableData,
  optionalSoftwareLicencesTableData,
  softwareMaintenanceTableData,
  optionalSoftwareMaintenanceTableData,
  servicesTableData,
  optionalServicesTableData,
  servicesTableDataByCategory,
  optionalServicesTableDataByCategory,
  amsTableData,
  optionalAmsTableData,
  hostingTableData,
  optionalHostingTableData,
  cloudTableData,
  optionalCloudTableData,
  additiontalDescToggle,
  addSlaToggle,
  calculateTotalNetto,
  calculateProductValue,
  calculateSummery,
  productAdded,
  addProduct,
  hideModal,
  showModal,
  fetchAndPopulateOnUpdate,
  productType,
  optionalProductType,
  createCategories,
  updatePeriodOfAllProducts,
  generate,
  generateProcessTemplate,
} = offerAndConfirmOffer(),
  { t } = useI18n(),
  offerOptions = ref([]),
  receiverTypeOptions = [
    { value: "customer", name: "Customer" },
    { value: "lead", name: "Lead" },
  ],
  receiverOptions = ref([]),
  contactPersonOptions = ref([]),
  termOfPaymentOptions = ref([]),
  projectOptions = ref([]),
  offerTypeOptions = [
    { value: "budget_offer", name: "Budget Offer" },
    { value: "offer", name: "Offer" },
  ],
  templateOptions = [
    { value: "empty", name: "Empty" },
    { value: "project", name: "Project" },
  ],
  groupedByOptions = [
    { value: "nothing", name: "Nothing" },
    { value: "category", name: "Category" },
  ],
  offerConfirmationStatusOptions = [
    { value: "draft", name: "Draft" },
    { value: "approved", name: "Approved" },
    { value: "send", name: "Sent" },
  ],
  validationRules = {
    receiverType: { required },
    customerId: { required },
    termOfPaymentId: { required },
    offerType: { required },
    expiryDate: { required },
    offerConfirmationStatus: {
      required: requiredIf(function () {
        return (
          props.recordId
        );
      }),
    },

  },
  v$ = useVuelidate(validationRules, state);

const softwareLicencesSummery = reactive({
  netto: null,
  tax: [],
  total: null,
});
const softwareMaintenanceSummery = reactive({
  netto: null,
  tax: [],
  total: null,
});
const serviceSummery = reactive({
  netto: null,
  tax: [],
  total: null,
});
const serviceSummeryByCategory = reactive({
  netto: null,
  tax: [],
  total: null,
});
const amsSummery = reactive({
  netto: null,
  tax: [],
  total: null,
});
const hostingSummery = reactive({
  netto: null,
  tax: [],
  total: null,
});
const cloudSummery = reactive({
  netto: null,
  tax: [],
  total: null,
});

// list offer to show in dropDown where user select offer.
onMounted(async function () {
  const res = await genericListingRequest(routes.SALE_OFFER, { all: true });
  offerOptions.value = res.data.map((el) => {
    return {
      value: el.id,
      customerName: el[`Customer.customer.name`],
      offerNumber: el.offerNumber,
      totalNetto: el.totalNetto,
    };
  });
});

// fetch the offer values when offer Id Change
watch(
  () => state.offerId,
  async (offerId) => {
    try {
      if (!offerId || props.recordId) { // in edit case don't fetch the offer records
        return;
      }
      layout.changeLoaderValue(true);
      const res = await getSaleOfferRequest(offerId, {
        all: true,
      });

      fetchAndPopulateOnUpdate(res); // call to populate the values in state
      layout.changeLoaderValue(false);
    } catch (e) {
      console.log(e);
      layout.changeLoaderValue(false);
    }
  }
);
// For edit case fetch the record
onMounted(async function () {
  try {
    if (!props.recordId) {
      return;
    }
    layout.changeLoaderValue(true);
    const res = await getSaleOfferConfirmationRequest(props.recordId);
    fetchAndPopulateOnUpdate(res, props.recordId); // call to populate the values in state
    layout.changeLoaderValue(false);
  } catch (e) {
    console.log(e);
    layout.changeLoaderValue(false);
  }
});
// receiverOptions will populate on basic of receiverType
watch(
  () => state.receiverType,
  async (receiverType, receiverTypePrev) => {
    try {
      const receiverRes =
        receiverType === "customer"
          ? await customerRequest()
          : await leadRequest();
      receiverOptions.value =
        receiverType === "customer"
          ? receiverRes?.data?.customers?.map((rs: any) => {
            return {
              value: rs?.id,
              name: rs?.name,
              companyName: rs?.name,
              companyNumber: rs?.number,
              address: rs?.location?.addressFirst,
              code: rs?.location?.zip,
              city: rs?.location?.city,
              state: rs?.location?.state,
              country: rs?.location?.country?.name,
            };
          })
          : receiverRes?.data?.leads?.map((rs: any) => {
            return {
              value: rs?.id,
              name: rs?.name,
              companyName: rs?.name,
              companyNumber: rs?.number,
              address: rs?.location?.addressFirst,
              code: rs?.location?.zip,
              city: rs?.location?.city,
              state: rs?.location?.state,
              country: rs?.location?.country?.name,
            };
          });
      if (receiverType !== receiverTypePrev && !props.recordId && !state.offerId) {
        // when receiver type change, set the receiver/customerId to null
        state.customerId = null;
      }
    } catch (e) {
      console.log(e);
    }
  }
);
// contact person and project will populate on basic of customerId which is receiver
watch(
  () => state.customerId,
  async (customerId) => {
    try {
      if (!customerId) {
        return;
      }
      const resPerson = await getUserListFromComsumerIdRequest({
        limit_start: 0,
        limit_count: 25,
        type: "customer",
        company_id: customerId,
      });
      const resProject = await getProjectsFromComsumerIdRequest({
        companyId: customerId,
      });
      contactPersonOptions.value = resPerson?.data.map((cp: any) => {
        return {
          value: cp.id,
          name: cp.first_name + " " + cp.last_name,
        };
      });

      projectOptions.value = resProject?.data.map((rp: any) => {
        return {
          value: rp.id,
          name: rp.name,
        };
      });
    } catch (e) {
      console.log(e);
    }
  }
);
// set companyDetail object
watch(
  [
    () => state.customerId,
    () => state.contactPersonId,
    () => receiverOptions.value,
  ],
  (
    [customerId, contactPersonId, receiverOptions],
    [] // array containing previous values
  ) => {
    receiverOptions.map((opt) => {
      if (opt.value === customerId) {
        companyDetail.companyName = opt?.companyName;
        companyDetail.companyNumber = opt?.companyNumber;
        companyDetail.address = opt?.address;
        companyDetail.code = opt?.code;
        companyDetail.city = opt?.city;
        companyDetail.state = opt?.state;
        companyDetail.country = opt?.country;
      }
    });
    contactPersonOptions.value.map((opt) => {
      if (opt.value === contactPersonId) {
        companyDetail.contactPerson = opt.companyName;
      }
    });
  }
);
// populate payment terms on basic of termOfPaymentId
watch(() => state.termOfPaymentId,
  (termOfPaymentId) => {
    if (termOfPaymentId) {
      termOfPaymentOptions.value.map((termOption) => {
        if (termOption.value === termOfPaymentId) {
          state.paymentTerm = termOption.name;
          return;
        }
      });
    }
  }
);

onMounted(async function () {
  try {
    const res = await genericListingRequest(routes.TERMS_OF_PAYMENT, {
      all: true,
    });
    termOfPaymentOptions.value = res?.data?.termOfPayments?.map((ts: any) => {
      return { value: ts.id, name: ts.name };
    });
  } catch (e) {
    console.log(e);
  }
});

async function saveOffersHandler(recordId, update) {
  // stop here if form is invalid
  v$.value.$touch();
  if (v$.value.$invalid) {
    return;
  } else {
    try {
      const logedinUserId = localStorage.getItem("user_id");
      const formData = {
        ...(state.offerId && { offerId: state.offerId }),
        ...(state.receiverType && { receiverType: state.receiverType }),
        ...(state.customerId && { customerId: state.customerId }),
        ...(state.contactPersonId && {
          contactPersonId: state.contactPersonId,
        }),
        ...(state.termOfPaymentId && {
          termOfPaymentId: state.termOfPaymentId,
        }),
        ...(state.projectId && { projectId: state.projectId }),
        ...(state.offerType && { offerType: state.offerType }),
        ...(state.template && { template: state.template }),
        ...(state.groupBy && { groupBy: state.groupBy }),
        ...(state.expiryDate && { expiryDate: state.expiryDate }),
        ...(state.offerConfirmationStatus && {
          offerConfirmationStatus: state.offerConfirmationStatus,
        }),

        ...(state.paymentTerm && { paymentTerm: state.paymentTerm }),
        ...(state.coverLetterText && {
          coverLetterText: state.coverLetterText,
        }),
        ...(state.descriptionText && {
          descriptionText: state.descriptionText,
        }),
        createdBy: logedinUserId, // loggedIn user id.
        ...(state.removeFromStatistics && {
          removeFromStatistics: state.removeFromStatistics,
        }),
        productComponents: {
          ...(softwareLicencesTableData.value?.length > 0 && {
            license: softwareLicencesTableData.value,
          }),
          ...(softwareMaintenanceTableData.value?.length > 0 && {
            maintenance: softwareMaintenanceTableData.value,
          }),
          ...(state.groupBy === "nothing" &&
            servicesTableData.value?.length > 0 && {
            service: servicesTableData.value,
          }),
          ...(state.groupBy === "category" &&
            servicesTableDataByCategory.value?.length > 0 && {
            service: servicesTableDataByCategory.value,
          }),
          ...(amsTableData.value?.length > 0 && {
            application: amsTableData.value,
          }),
          ...(hostingTableData.value?.length > 0 && {
            hosting: hostingTableData.value,
          }),
          ...(cloudTableData.value?.length > 0 && {
            cloud: cloudTableData.value,
          }),
        },
        optionalProductComponents: {
          ...(optionalSoftwareLicencesTableData.value?.length > 0 && {
            license: optionalSoftwareLicencesTableData.value,
          }),
          ...(optionalSoftwareMaintenanceTableData.value?.length > 0 && {
            maintenance: optionalSoftwareMaintenanceTableData.value,
          }),
          ...(state.groupBy === "nothing" &&
            optionalServicesTableData.value?.length > 0 && {
            service: optionalServicesTableData.value,
          }),
          ...(state.groupBy === "category" &&
            optionalServicesTableDataByCategory.value?.length > 0 && {
            service: optionalServicesTableDataByCategory.value,
          }),
          ...(optionalAmsTableData.value?.length > 0 && {
            application: optionalAmsTableData.value,
          }),
          ...(optionalHostingTableData.value?.length > 0 && {
            hosting: optionalHostingTableData.value,
          }),
          ...(optionalCloudTableData.value?.length > 0 && {
            cloud: optionalCloudTableData.value,
          }),
        },
      };
      const res = (recordId && update)
        ? await editSaleOfferConfirmationRequest(formData, props?.recordId)
        : await addSaleOfferConfirmationRequest(formData);

      Toast.fire({
        title: (recordId && update) ? "Updated" : "Created",
        icon: "success",
      });
      navigateTo("/order-confirmation");
      isLoading.value = false;
    } catch (e) {
      console.log(e);
      Toast.fire({ title: t("Error!"), text: t("Error"), icon: "error" });
      isLoading.value = false;
    }
  }
}

// watch software licance to calculate summery
watch(
  () => softwareLicencesTableData.value,
  (softwareLicencesData) => {
    calculateSummery(softwareLicencesData, softwareLicencesSummery);
  },
  { deep: true }
);
// watch software maintenance to calculate summery
watch(
  () => softwareMaintenanceTableData.value,
  (softwareMaintenanceData) => {
    calculateSummery(softwareMaintenanceData, softwareMaintenanceSummery);
  },
  { deep: true }
);
// watch services to calculate summery
watch(
  () => servicesTableData.value,
  (serviceTable) => {
    calculateSummery(serviceTable, serviceSummery);
  },
  { deep: true }
);
// watch servicesByCategory to calculate summery
watch(
  () => servicesTableDataByCategory.value,
  (serviceTable) => {
    calculateSummery(serviceTable, serviceSummeryByCategory);
  },
  { deep: true }
);
// watch hosting to calculate summery
watch(
  () => hostingTableData.value,
  (hostingTable) => {
    calculateSummery(hostingTable, hostingSummery);
  },
  { deep: true }
);
// watch cloud to calculate summery
watch(
  () => cloudTableData.value,
  (cloudTable) => {
    calculateSummery(cloudTable, cloudSummery);
  },
  { deep: true }
);
// watch ams to calculate summery
watch(
  () => amsTableData.value,
  (amsTableData) => {
    calculateSummery(amsTableData, amsSummery);
  },
  { deep: true }
);

// when componentType is service and groupBy is category, then group the services according to categories
watch(
  [
    () => state.groupBy,
    () => servicesTableData.value,
    () => optionalServicesTableData.value,
  ],
  (
    [groupByValue, servicesTableDataValue, optionalServicesTableDataValue],
    [] // array containing previous values
  ) => {
    if (groupByValue === "category" && servicesTableDataValue.length > 0) {
      const serviceByCategory = createCategories(servicesTableDataValue);
      // removing the deplicate values
      servicesTableDataByCategory.value = serviceByCategory.filter(
        (obj, index) => {
          return index === serviceByCategory.findIndex((o) => obj.id === o.id);
        }
      );
    }
    if (
      groupByValue === "category" &&
      optionalServicesTableDataValue.length > 0
    ) {
      const optionalServiceByCategory = createCategories(
        optionalServicesTableDataValue
      );
      // removing the deplicate values
      optionalServicesTableDataByCategory.value =
        optionalServiceByCategory.filter((obj, index) => {
          return (
            index ===
            optionalServiceByCategory.findIndex((o) => obj.id === o.id)
          );
        });
    }
  },
  { deep: true }
);

</script>

<template>
  <div>
    <div class="card">
      <div class="card-header d-flex align-items-center">
        <h3 class="card-title me-2">{{ $t("Configuration") }}</h3>
        <ElementsTooltip />
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-lg-4">
            <div class="form-group">
              <Multiselect v-model="state.offerId" placeholder="Offer" label="name" :options="offerOptions"
                :disabled="props.recordId">
                <template v-slot:beforelist>
                  <div class="d-flex justify-content-between" :style="' width: 100%'">
                    <p>{{ $t('Offer Number') }}</p>
                    <p>{{ $t('Customer/Lead') }}</p>
                    <p>{{ $t('Netto Total') }}</p>
                  </div>
                </template>

                <template v-slot:singlelabel="{ value }">
                  <div class="multiselect-single-label">
                    <p>{{ value.offerNumber }}</p>
                  </div>
                </template>

                <template v-slot:option="{ option }">
                  <div class="d-flex justify-content-between" :style="' width: 100%'">
                    <p>
                      {{ option.offerNumber }}
                    </p>
                    <p>
                      {{ option.customerName }}
                    </p>
                    <p>
                      {{ option.totalNetto }}
                    </p>
                  </div>
                </template>
              </Multiselect>
            </div>
          </div>
          <div class="col-lg-8"></div>
          <div class="col-lg-4">
            <div class="form-group">
              <elements-multiselect v-model="state.receiverType" :options="receiverTypeOptions" :key="state.receiverType"
                label="name" track-by="value" :textLabel="$t('Reciever Type')" :required="true"
                :class="{ 'is-invalid': v$.receiverType.$error }" />
              <div v-if="v$.receiverType.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.receiverType.required">{{
                  $t("This value is required")
                }}</span>
              </div>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <elements-multiselect v-model="state.customerId" :options="receiverOptions" :key="state.customerId"
                label="name" track-by="value" :textLabel="$t('Reciever')" :required="true"
                :class="{ 'is-invalid': v$.customerId.$error }" />

            </div>
            <div v-if="v$.customerId.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.customerId.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <elements-multiselect v-model="state.contactPersonId" :key="state.contactPersonId"
                :options="contactPersonOptions" label="name" track-by="value" :textLabel="$t('Contact Person')" />
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <elements-multiselect v-model="state.termOfPaymentId" :options="termOfPaymentOptions"
                :key="state.termOfPaymentId" label="name" track-by="value" :textLabel="$t('Terms of Payment')"
                :required="true" :class="{ 'is-invalid': v$.termOfPaymentId.$error }" />

            </div>
            <div v-if="v$.termOfPaymentId.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.termOfPaymentId.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <elements-multiselect v-model="state.projectId" :options="projectOptions" :key="state.projectId"
                label="name" track-by="value" :textLabel="$t('Project')" />
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <elements-multiselect v-model="state.offerType" :options="offerTypeOptions" :key="state.offerType"
                label="name" track-by="value" :textLabel="$t('Offer Type')" :required="true"
                :class="{ 'is-invalid': v$.offerType.$error }" />

            </div>
            <div v-if="v$.offerType.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.offerType.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div>
          <div class="col-lg-4" v-if="state.offerType === 'budget_offer'">
            <div class="form-group">
              <elements-multiselect v-model="state.template" :options="templateOptions" :key="state.template" label="name"
                track-by="value" :textLabel="$t('Template')" />
            </div>
          </div>
          <div class="col-lg-4" v-if="state.offerType === 'budget_offer'">
            <div class="form-group">
              <elements-multiselect v-model="state.groupBy" :options="groupedByOptions" :key="state.groupBy" label="name"
                track-by="value" :textLabel="$t('Grouped by')" />
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text">
                    <ElementsIcon v-bind:icon="'dateIcon'" />
                  </span>
                </div>
                <elements-input v-model="state.expiryDate" :key="state.expiryDate" :label="$t('Expiry date')"
                  :required="true" id="group-name" :class="{ 'is-invalid': v$.expiryDate.$error }" type="date" />
              </div>
            </div>
            <div v-if="v$.expiryDate.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.expiryDate.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div>

          <div class="col-lg-12">
            <div class="form-group textarea">
              <textarea v-model="state.paymentTerm" class="form-control" placeholder="."></textarea>
              <label for="" class="input-label">{{ $t("Payment Terms") }}</label>
            </div>
          </div>

        </div>
      </div>
      <div class="card-header pt-0 d-flex align-items-center">
        <h3 class="card-title me-2">{{ $t("Components") }}</h3>
        <ElementsTooltip />
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-lg-3">
            <div class="form-group checkbox-group">
              <input class="checkbox-input" type="checkbox" id="license" value="license" v-model="productType" />
              <label class="checkbox-label" for="license">{{ $t('Software Licences') }}</label>
            </div>
          </div>
          <div class="col-lg-3">
            <div class="form-group checkbox-group">
              <input class="checkbox-input" type="checkbox" id="license" value="license" v-model="productType" />
              <label class="checkbox-label" for="license">{{ $t('Software Maintenance') }}</label>
            </div>

          </div>
          <div class="col-lg-3">
            <div class="form-group checkbox-group">
              <input class="checkbox-input" type="checkbox" id="services" value="service" v-model="productType" />
              <label class="checkbox-label" for="services">{{ $t('Services') }}</label>
            </div>

          </div>
          <div class="col-lg-3">
            <div class="form-group checkbox-group">
              <input class="checkbox-input" type="checkbox" id="application" value="application" v-model="productType" />
              <label class="checkbox-label" for="application">{{ $t('Application Management Service') }}</label>
            </div>

          </div>
          <div class="col-lg-3">
            <div class="form-group checkbox-group">
              <input class="checkbox-input" type="checkbox" id="hosting" value="hosting" v-model="productType" />
              <label class="checkbox-label" for="hosting">{{ $t('Hosting') }}</label>
            </div>

          </div>
          <div class="col-lg-3">
            <div class="form-group checkbox-group">
              <input class="checkbox-input" type="checkbox" id="cloud" value="cloud" v-model="productType" />
              <label class="checkbox-label" for="cloud">{{ $t('Cloud') }}</label>
            </div>
          </div>
          <div class="col-lg-3">
            <div class="form-group checkbox-group">
              <input class="checkbox-input" type="checkbox" id="removeFromStatistics" value="removeFromStatistics"
                v-model="state.removeFromStatistics" />
              <label class="checkbox-label" for="removeFromStatistics">{{ $t('Remove From Statistics') }}:</label>
            </div>
          </div>
          <div class="col-lg-4" v-if="props.recordId">
            <div class="form-group">
              <elements-multiselect v-model="state.offerConfirmationStatus" :options="offerConfirmationStatusOptions"
                :key="state.offerConfirmationStatus" label="name" track-by="value" :textLabel="$t('Confirmation Status')"
                :required="true" :class="{ 'is-invalid': v$.offerConfirmationStatus.$error }" />

            </div>
            <div v-if="v$.offerConfirmationStatus.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.offerConfirmationStatus.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div>


        </div>
      </div>
    </div>
    <div class="card mt-3">
      <div class="row">
        <div class="col-lg-6">
          <div class="card-header d-flex">
            <h3 class="card-title me-2">{{ $t("Cover Letter Text") }}</h3>
            <elements-tooltip />
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-lg-12">
                <div class="form-group textarea">
              <textarea v-model="state.coverLetterText" cols="30" rows="10" class="form-control"
                placeholder="."></textarea>
              <label for="" class="input-label">{{ $t('Cover Letter Text') }}</label>
            </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="card-header ps-0 d-flex">
            <h3 class="card-title me-2">{{ $t("Order Confirmation Description Text") }}</h3>
            <elements-tooltip />
          </div>
          <div class="card-body ps-4">
            <div class="row">

              <div class="col-lg-12">
                <div class="form-group textarea">
              <textarea v-model="state.descriptionText" cols="30" rows="10" class="form-control"
                placeholder="."></textarea>
              <label for="" class="input-label">{{ $t('Order Confirmation Description Text') }}</label>
            </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card mt-3" v-if="companyDetail.companyName">
      <div class="card-header d-flex align-items-center">
        <h3 class="card-title me-2">{{ $t("Company Details") }}</h3>
      </div>

      <div class="card-body">
        <span>
          {{ companyDetail?.companyName ?? "-" }}
          <div v-if="state.contactPersonId">
            {{ companyDetail?.contactPerson ?? "-" }}
            <br />
          </div>
          <br v-else />
          {{ companyDetail?.address ?? "-" }}
          <br />
          {{ companyDetail.code ?? " - " }}&nbsp;{{ companyDetail.city ?? "-" }}
          <br />
          {{ companyDetail?.state ?? " - " }}
          <br />
          {{ companyDetail?.country ?? " - " }}
        </span>
      </div>
    </div>

    <!-- <div class="my-5 text-gray-500 flex justify-between font-bold">
        <h1 class="secondary-color text-2xl">
            {{$t("DraftOffer Confirmation")}}
        </h1>
        <h6>
          {{ dateFormatter(new Date()) }}
        </h6>
    </div> -->
    <div class="card mt-3">
      <div class="card-header d-flex">
        <h3 class="card-title me-2">{{ $t("Draft Offer") }}</h3>
        <ElementsTooltip />
      </div>
      <div class="card-body draft-offer mt-3">
        <div class="row">
          <div class="col-lg-4">
            <ul>
              <li>
                <h4>{{ $t("Customer Nr.") }}</h4>
                <p>{{ companyDetail.companyNumber ?? "-" }}</p>
              </li>
              <li>
                <h4>{{ $t("Project Nr.") }}</h4>
                <p>{{ state?.projectId ?? "-" }}</p>
              </li>
              <li>
                <h4>{{ $t("Offer No") }}</h4>
                <p>{{}}</p>
              </li>
            </ul>
          </div>
          <div class="col-lg-4">
            <ul>
              <li v-if="state.logedinUserId">
                <h4>{{ $t("Created By") }}</h4>
                <p>{{ state.logedinUserId }}</p>
              </li>
              <li v-if="state.expiryDate">
                <h4>{{ $t("Expiry Date") }}</h4>
                <p>
                  {{
                    dateFormatter(
                      formatDateLite(new Date(state.expiryDate)),
                      globalLanguage
                    )
                  }}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div v-for="(prodType, index) in productType" :key="index">
      <div v-if="prodType === `license`">
        <offer-and-offer-confirm-software-licanace-maintinance-table
          :softwareLicencesTableData="softwareLicencesTableData"
          :optionalSoftwareLicencesTableData="optionalSoftwareLicencesTableData"
          :softwareMaintenanceTableData="softwareMaintenanceTableData" :optionalSoftwareMaintenanceTableData="optionalSoftwareMaintenanceTableData
            " :softwareLicencesSummery="softwareLicencesSummery"
          :softwareMaintenanceSummery="softwareMaintenanceSummery" :optionalProductType="optionalProductType"
          @addProduct="addProduct" @additiontalDescToggle="additiontalDescToggle"
          @calculateProductValue="calculateProductValue" />
      </div>

      <div v-if="prodType === `service`">
        <offer-and-offer-confirm-service-table :servicesTableData="servicesTableData"
          :servicesTableDataByCategory="servicesTableDataByCategory"
          :optionalServicesTableData="optionalServicesTableData" :optionalServicesTableDataByCategory="optionalServicesTableDataByCategory
            " :groupBy="state.groupBy" :serviceSummery="serviceSummery"
          :serviceSummeryByCategory="serviceSummeryByCategory" :optionalProductType="optionalProductType"
          @addProduct="addProduct" @additiontalDescToggle="additiontalDescToggle"
          @calculateProductValue="calculateProductValue" />
      </div>
      <div v-if="prodType === `application`">
        <offer-and-offer-confirm-ams-table :amsTableData="amsTableData" :optionalAmsTableData="optionalAmsTableData"
          :globalPeriodAMS="globalPeriodAMS" :amsSummery="amsSummery" :optionalProductType="optionalProductType"
          @addProduct="addProduct" @additiontalDescToggle="additiontalDescToggle" @addSlaToggle="addSlaToggle"
          @updatePeriodOfAllProducts="updatePeriodOfAllProducts" @calculateProductValue="calculateProductValue" />
      </div>

      <div v-if="prodType === `hosting`">
        <offer-and-offer-confirm-hosting-table :hostingTableData="hostingTableData"
          :optionalHostingTableData="optionalHostingTableData" :hostingSummery="hostingSummery"
          :optionalProductType="optionalProductType" @addProduct="addProduct"
          @additiontalDescToggle="additiontalDescToggle" @updatePeriodOfAllProducts="updatePeriodOfAllProducts"
          @calculateProductValue="calculateProductValue" />
      </div>

      <div v-if="prodType === `cloud`">
        <offer-and-offer-confirm-cloud-table :cloudTableData="cloudTableData"
          :optionalCloudTableData="optionalCloudTableData" :cloudSummery="cloudSummery"
          :optionalProductType="optionalProductType" @addProduct="addProduct"
          @additiontalDescToggle="additiontalDescToggle" @updatePeriodOfAllProducts="updatePeriodOfAllProducts"
          @calculateProductValue="calculateProductValue" />
      </div>
    </div>

    <offer-and-offer-confirm-add-software-licances-product v-if="isModalOpen &&
      (selectedComponentType === 'licences' ||
        selectedComponentType === 'licencesOptional')
      " :showModal="isModalOpen" :hideModal="hideModal" @productAdded="productAdded" />

    <offer-and-offer-confirm-add-services-product v-if="isModalOpen &&
      (selectedComponentType === 'services' ||
        selectedComponentType === 'servicesOptional' ||
        selectedComponentType === 'childServices')
      " :showModal="isModalOpen" :hideModal="hideModal" @productAdded="productAdded" />

    <offer-and-offer-confirm-add-ams-product v-if="isModalOpen &&
      (selectedComponentType === 'ams' ||
        selectedComponentType === 'amsOptional')
      " :showModal="isModalOpen" :hideModal="hideModal" @productAdded="productAdded" />

    <offer-and-offer-confirm-add-hosting-product v-if="isModalOpen &&
      (selectedComponentType === 'hosting' ||
        selectedComponentType === 'hostingOptional' ||
        selectedComponentType === 'childHosting')
      " :showModal="isModalOpen" :hideModal="hideModal" @productAdded="productAdded" />

    <offer-and-offer-confirm-add-cloud-product v-if="isModalOpen &&
      (selectedComponentType === 'cloud' ||
        selectedComponentType === 'cloudOptional' ||
        selectedComponentType === 'childCloud')
      " :showModal="isModalOpen" :hideModal="hideModal" @productAdded="productAdded" />

    <div v-if="props.recordId" class="mt-4 d-flex align-items-center justify-content-end">
      <submittal-button @click="generate('pdf')" :isLoading="isLoading" :buttonName="$t('Generate PDF')" />
    </div>
    <div v-if="props.recordId" class="mt-4 d-flex align-items-center justify-content-end">
      <submittal-button @click="generate('docx')" :isLoading="isLoading" :buttonName="$t('Generate Docx')" />
    </div>
    <div v-if="props.recordId" class="mt-4 d-flex align-items-center justify-content-end">
      <button class="primary-btn me-3" @click="navigateTo('/order-confirmation')">
        <elements-icon v-bind:icon="'cancelIcon'" class="me-2" />
        <span>{{ $t("Cancel") }}</span>
      </button>
      <submittal-button @click="saveOffersHandler(props.recordId, true)" :isLoading="isLoading"
        :buttonName="$t('Update')" />
    </div>

    <div v-else class="mt-4 d-flex align-items-center justify-content-end">
      <button class="primary-btn me-3" @click="navigateTo('/order-confirmation')">
        <elements-icon v-bind:icon="'cancelIcon'" class="me-2" />
        <span>{{ $t("Cancel") }}</span>
      </button>
      <submittal-button :disabled="!state.offerId" @click="saveOffersHandler" :isLoading="isLoading" :icon-name="'saveIcon'"
        :buttonName="$t('Save and Proceed')" />
    </div>
  </div>
</template>
