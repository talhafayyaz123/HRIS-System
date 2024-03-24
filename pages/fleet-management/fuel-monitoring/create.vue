<script setup lang="ts">
import {ref, reactive, onMounted} from "vue";
import {FleetListRequest, fuelReceiptCreateRequest} from "~/utils/apiRequests";
import commonCode from "~/composables/common";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import { useLayoutStore } from "~/store/layout";
import genericFunctionality from "~/composables/genericFunctionality";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";

const {apiRoute, data, showFunc, storeFunc, updateFunc, submitted, isLoading} =
    genericFunctionality();


const {router, Toast} = commonCode(),
    {t} = useI18n(),
    breadCrumbsConfig = [
      {
        text: "Admin portal",
        to: "/",
      },
      {
        text: "Fuel Monitoring",
        to: "/fleet-management/fuel-monitoring",
      },
      {
        text: "Create",
        active: true,
      },
    ],
    currentPage = ref(1),
    order = ref("asc"),
    column = ref("id"),
    fleetList = ref([]),
    state = reactive({
      isLoading: false,
      submitted: false,
      product: "",
      managerId: "",
      unit: "Liter",
      totalBrutto: "",
      fleetCarId: "",
      totalNetto: "",
      tax: "",
      actualMileage: "",
      pricePerUnit: "",
      deliveryDate: "",
      quantity: "",
    }),
    validationRules = {
      product: {required},
      managerId: {required},
      unit: {required},
      fleetCarId: {required},
      totalNetto: {required},
      totalBrutto: {required},
      tax: {required},
      actualMileage: {required},
      pricePerUnit: {required},
      deliveryDate: {required},
      quantity: {required},
    },
    producktOptions = [
      {value: 'diesel', text: 'Diesel'},
      {value: 'electronic', text: 'Electronic'},
      {value: 'gasoline', text: 'Gasoline'},
    ],

    v$ = useVuelidate(validationRules, state);

const store = () => {
  v$.value.$touch();
  if (v$.value.$invalid) {
    state.submitted = false;
    return false;
  } else {
    try {
      state.isLoading = true;
      createFuelReceipt();
    } catch (e) {
      Toast.fire({ title: t("Error!"), text: t("Error"), icon: "error" });
      state.isLoading = false;
      state.submitted = false;
    }
  }
};

const createFuelReceipt = () => {
  const layout = useLayoutStore();
  layout.changeLoaderValue(true);
  fuelReceiptCreateRequest({
    actualMileage: state.actualMileage,
    deliveryDate: state.deliveryDate,
    fleetCarId: state.fleetCarId,
    managerId: state.managerId,
    pricePerUnit: state.pricePerUnit,
    product: state.product,
    quantity: state.quantity,
    totalBrutto: state.totalBrutto,
    totalNetto: state.totalNetto,
    unit: state.unit,
    tax: state.tax,
      // firstName: state.firstName,
  })
      .then((response) => {
        Toast.fire({
          icon: "success",
          title: t("Record created successfully!"),
        });
        state.isLoading = false;
        state.submitted = false;
        navigateTo("/fleet-management/fuel-monitoring");
      })
      .catch((error) => {
        state.isLoading = false;
        state.submitted = false;
        Toast.fire({icon: "error", title: t("something went wrong!")});
      }).finally(() => {
      layout.changeLoaderValue(false);
    });
};

async function refresh() {
  const layout = useLayoutStore();
  layout.changeLoaderValue(true);
  FleetListRequest({
    page: currentPage.value,
    perPage: 100,
    sortBy: column.value,
    order: order.value,
    search: "",
  }).then((response) => {
    fleetList.value = response?.data?.data.map((fleetCar: any) => {
      return {
        text: fleetCar.licenceNumber,
        value: fleetCar.id,
      };
    });
  }).finally(() => {
      layout.changeLoaderValue(false);
    });
}

onMounted(function () {
  state.managerId = localStorage.getItem('user_id')
});
const { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { title } = useTitle("Fuel Receipt Create");

useHead({
    title: title,
    });
refresh();
</script>

<template>
  <div>
    <page-header :title="title" :items="items"/>

    <div>
      <div id="supplier">
        <div class="card mt-3">
          <div class="card-header">
            <h3 class="card-title">{{ $t('Enter Fuel Receipt Details') }}</h3>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-lg-4 col-md-4">
                <div class="form-group">
                  <elements-multiselect
                      v-model="state.fleetCarId"
                      :options="fleetList"
                      label="text"
                      track-by="value"
                      :textLabel="$t('Select a fleet car:')"
                      :required="true"
                      :class="{ 'is-invalid': v$.fleetCarId.$error }"
                  />
                  <div v-if="v$.fleetCarId.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="v$.fleetCarId.required">{{
                        $t("This value is required")
                      }}</span
                    ><br/>
                  </div>
                </div>
              </div>
              <!--<div class="col-lg-4 col-md-4">-->
              <!--<div class="form-group">-->
              <!--<elements-input-->
              <!--v-model="state.firstName"-->
              <!--:label="$t('Manager')"-->
              <!--:required="true"-->
              <!--id="firstNameId"-->
              <!--:disabled="true"-->
              <!--:class="{ 'is-invalid': v$.firstName.$error }"-->
              <!--/>-->
              <!--<div v-if="v$.firstName.$error" class="invalid-feedback">-->
              <!--<span class="text-danger" v-if="v$.firstName.required">{{-->
              <!--$t("This value is required")-->
              <!--}}</span-->
              <!--&gt;<br/>-->
              <!--</div>-->
              <!--</div>-->
              <!--</div>-->
              <div class="col-lg-4 col-md-4">
                <div class="form-group">
                  <elements-multiselect
                      v-model="state.product"
                      :options="producktOptions"
                      label="text"
                      track-by="value"
                      :textLabel="$t('Product')"
                      :required="true"
                      :class="{ 'is-invalid': v$.product.$error }"
                  />
                  <div v-if="v$.product.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="v$.product.required">{{
                        $t("This value is required")
                      }}</span
                    ><br/>
                  </div>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-lg-4 col-md-4">
                <div class="form-group">
                  <elements-input
                      v-model="state.actualMileage"
                      :label="$t('Actual Mileage')"
                      :required="true"
                      id="actualMileageId"
                      :disabled="state.submitted"
                      :class="{ 'is-invalid': v$.actualMileage.$error }"
                  />
                  <div v-if="v$.actualMileage.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="v$.actualMileage.required">{{
                        $t("This value is required")
                      }}</span
                    ><br/>
                  </div>
                </div>
              </div>
              <div class="col-lg-4 col-md-4">
                <div class="form-group">
                  <elements-input
                      type="date"
                      v-model="state.deliveryDate"
                      :label="$t('Delivery Date')"
                      :required="true"
                      id="name"
                      :disabled="state.submitted"
                      :class="{ 'is-invalid': v$.deliveryDate.$error }"
                  />
                  <div v-if="v$.deliveryDate.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.deliveryDate.required">{{
                    $t("This value is required")
                  }}</span
                ><br/>
                  </div>
                </div>
              </div>
              <div class="col-lg-4 col-md-4">
                <div class="form-group">
                  <elements-input
                      v-model="state.quantity"
                      :label="$t('Quantity')"
                      :required="true"
                      id="quantityId"
                      :disabled="state.submitted"
                      :class="{ 'is-invalid': v$.quantity.$error }"
                  />
                  <div v-if="v$.quantity.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="v$.quantity.required">{{
                        $t("This value is required")
                      }}</span
                    ><br/>
                  </div>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-lg-4 col-md-4">
                <div class="form-group">
                  <elements-input
                      v-model="state.unit"
                      :label="$t('Unit')"
                      :required="true"
                      id="unitId"
                      :disabled="true"
                      :class="{ 'is-invalid': v$.unit.$error }"
                  />
                  <div v-if="v$.unit.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="v$.unit.required">{{
                        $t("This value is required")
                      }}</span
                    ><br/>
                  </div>
                </div>
              </div>
              <div class="col-lg-4 col-md-4">
                <div class="form-group">
                  <elements-input
                      v-model="state.pricePerUnit"
                      :label="$t('Price Per Unit')"
                      :required="true"
                      id="pricePerUnitId"
                      :disabled="state.submitted"
                      :class="{ 'is-invalid': v$.pricePerUnit.$error }"
                  />
                  <div v-if="v$.pricePerUnit.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="v$.pricePerUnit.required">{{
                        $t("This value is required")
                      }}</span
                    ><br/>
                  </div>
                </div>
              </div>
              <div class="col-lg-4 col-md-4">
                <div class="form-group">
                  <elements-input
                      v-model="state.totalNetto"
                      :label="$t('Total Netto')"
                      :required="true"
                      id="totalNettoId"
                      :disabled="state.submitted"
                      :class="{ 'is-invalid': v$.totalNetto.$error }"
                  />
                  <div v-if="v$.totalNetto.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="v$.totalNetto.required">{{
                        $t("This value is required")
                      }}</span
                    ><br/>
                  </div>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-lg-4 col-md-4">
                <div class="form-group">
                  <elements-input
                      v-model="state.tax"
                      :label="$t('Tax')"
                      :required="true"
                      id="taxId"
                      :disabled="state.submitted"
                      :class="{ 'is-invalid': v$.tax.$error }"
                  />
                  <div v-if="v$.tax.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="v$.tax.required">{{
                        $t("This value is required")
                      }}</span
                    ><br/>
                  </div>
                </div>
              </div>
              <div class="col-lg-4 col-md-4">
                <div class="form-group">
                  <elements-input
                      v-model="state.totalBrutto"
                      :label="$t('Total Brutto')"
                      :required="true"
                      id="totalBruttoId"
                      :disabled="state.submitted"
                      :class="{ 'is-invalid': v$.totalBrutto.$error }"
                  />
                  <div v-if="v$.totalBrutto.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="v$.totalBrutto.required">{{
                        $t("This value is required")
                      }}</span
                    ><br/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="form-group text-right mt-3">
          <submittal-button
              @click="store()"
              :isLoading="state.isLoading"
              :buttonName="$t('Create Fuel Receipt')"
          />
        </div>
      </div>
    </div>
  </div>
</template>
