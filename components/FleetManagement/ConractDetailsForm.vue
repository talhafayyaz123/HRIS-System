<script setup lang="ts">
import {ref, reactive, watch} from "vue";
import commonCode from "~/composables/common";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import "md-editor-v3/lib/style.css";
import moment from "moment/moment";

const {router, Toast} = commonCode(),
    {t} = useI18n(),
    state = reactive({
      isLoading: false,
      submitted: false,
      contactNumber: "",
      leasingRate: 0.00,
      leasingStartDate: "",
      leasingEndDate: "",
      contractPeriodMonths: null,
      deliveryDate: "",
      miles: "",
      damageProtection: {
        freeExtraKilometers: 0.00,
        freeLessKilometers: 0,
        perAdditionalKilometers: 0,
        perLessKilometers: 0
      },
      leasing: {
        freeExtraKilometers: 0.00,
        freeLessKilometers: 0,
        perAdditionalKilometers: 0,
        perLessKilometers: 0
      },
      maintenanceAndAbstraction: {
        freeExtraKilometers: 0.00,
        freeLessKilometers: 0,
        perAdditionalKilometers: 0,
        perLessKilometers: 0
      },
    }),
    emit = defineEmits(["nextStep"]),
    customerId = ref(""),

    validationRules = {
      contactNumber: {required},
      leasingRate: {required},
      deliveryDate: {required},
      leasingStartDate: {required},
      leasingEndDate: {required},
      contractPeriodMonths: {required},
      miles: {required}
    },
    v$ = useVuelidate(validationRules, state)
const rows = ref([]);
const leasingsStartDate = ref(null);
const leasingsEndDate = ref(null);
const contractsPeriodMonths = ref(null);
const props = defineProps({
  fleetCar: {
    type: Object,
    default: [],
  },
  isUpdate: {
    type: Boolean,
    default: false,
  },
});

watch(
    () => state.leasingStartDate,
    (leasingStartDate) => {
        calculateLeasingEndDate()
    }
)

watch(
    () => state.contractPeriodMonths,
    (contractPeriodMonths) => {
        calculateLeasingEndDate()
    }
)


const store = () => {
  v$.value.$touch();
  if (v$.value.$invalid) {
    state.submitted = false;
    return false;
  } else {
    try {
      state.contractPeriodMonths = state.contractPeriodMonths.toString();
      state.isLoading = true;
      emit("nextStep", {step: 2, fields: state});
    } catch (e) {
      Toast.fire({title: t("Error!"), text: t("Error"), icon: "error"});
      state.isLoading = false;
      state.submitted = false;
    }
  }
};

const calculateLeasingEndDate = () => {
    const startDate = new Date(state.leasingStartDate);
    const periodMonths = parseInt(state.contractPeriodMonths);

    if (!isNaN(startDate) && !isNaN(periodMonths)) {
        const endDate = new Date(startDate);
        endDate.setMonth(startDate.getMonth() + periodMonths);
        state.leasingEndDate = endDate.toISOString().substr(0, 10);
    } else {
        state.leasingEndDate = null;
    }
}

</script>
<template>
  <div>
    <div class="card product-type">
      <div class="card-header">
        <h3 class="card-title">Contract Details</h3>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-lg-4 col-md-6">
            <div class="form-group">
              <elements-input
                  v-model="state.contactNumber"
                  :label="$t('Contact Number')"
                  :required="true"
                  id="contactNumber"
                  :disabled="state.submitted"
                  :class="{ 'is-invalid': v$.contactNumber.$error }"
              />
              <div v-if="v$.contactNumber.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.contactNumber.required">{{
                    $t("This value is required")
                  }}</span
                ><br/>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="form-group">
              <elements-input
                  type="number"
                  v-model="state.leasingRate"
                  :label="$t('Leasing Rate')"
                  :required="true"
                  id="leasingRate"
                  :disabled="state.submitted"
                  :class="{ 'is-invalid': v$.leasingRate.$error }"
              />
              <div v-if="v$.leasingRate.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.leasingRate.required">{{
                    $t("This value is required")
                  }}</span
                ><br/>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
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
          <div class="col-lg-4 col-md-6">
            <div class="form-group">
              <elements-input
                  type="date"
                  v-model="state.leasingStartDate"
                  :label="$t('Leasing Start Date')"
                  :required="true"
                  id="name"
                  :disabled="state.submitted"
                  :class="{ 'is-invalid': v$.leasingStartDate.$error }"
              />
              <div v-if="v$.leasingStartDate.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.leasingStartDate.required">{{
                    $t("This value is required")
                  }}</span
                ><br/>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="form-group">
              <elements-input
                  v-model="state.contractPeriodMonths"
                  :label="$t('Contract Period Months')"
                  :required="true"
                  id="name"
                  :disabled="state.submitted"
                  :class="{ 'is-invalid': v$.contractPeriodMonths.$error }"
              />
              <div v-if="v$.contractPeriodMonths.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.contractPeriodMonths.required">{{
                    $t("This value is required")
                  }}</span
                ><br/>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="form-group">
              <elements-input
                  type="date"
                  v-model="state.leasingEndDate"
                  :label="$t('Leasing End Date')"
                  :required="true"
                  id="brand"
                  :disabled="state.submitted"
                  :class="{ 'is-invalid': v$.leasingEndDate.$error }"
              />
              <div v-if="v$.leasingEndDate.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.leasingEndDate.required">{{
                    $t("This value is required")
                  }}</span
                ><br/>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="form-group">
              <elements-input
                  v-model="state.miles"
                  :label="$t('Miles/Year')"
                  :required="true"
                  id="modelKey"
                  :disabled="state.submitted"
                  :class="{ 'is-invalid': v$.miles.$error }"
              />
              <div v-if="v$.miles.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.miles.required">{{
                    $t("This value is required")
                  }}</span
                ><br/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card mt-3">
      <div class="card-header">
        <h3 class="card-title">Service Information</h3>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="row justify-content-between">
            <div class="col px-0">
              <div class="form-group">
              </div>
            </div>
            <div class="col px-0 text-center">
              <div class="form-group">
                <b>Per additional kilometer</b>
              </div>
            </div>
            <div class="col px-0 text-center">
              <div class="form-group">
                <b>Free extra kilometers</b>
              </div>
            </div>
            <div class="col px-0 text-center">
              <div class="form-group">
                <b>Per less kilometers</b>
              </div>
            </div>
            <div class="col px-0 text-center">
              <div class="form-group">
                <b>Free less kilometers</b>
              </div>
            </div>
          </div>
          <div class="row justify-content-between">
            <div class="col px-0">
              <div class="form-group">
                Leasing (vehicle transfer)
              </div>
            </div>
            <div class="col px-0">
              <div class="form-group">
                <elements-input
                    type="number"
                    v-model="state.leasing.perAdditionalKilometers"
                    :required="true"
                    id="perAdditionalKilometers"
                    :disabled="state.submitted"
                />
              </div>
            </div>
            <div class="col px-0">
              <div class="form-group">
                <elements-input
                    type="number"
                    v-model="state.leasing.freeExtraKilometers"
                    :required="true"
                    id="freeExtraKilometers"
                    :disabled="state.submitted"
                />
              </div>
            </div>
            <div class="col px-0">
              <div class="form-group">
                <elements-input
                    type="number"
                    v-model="state.leasing.perLessKilometers"
                    :required="true"
                    id="perLessKilometers"
                    :disabled="state.submitted"
                />
              </div>
            </div>
            <div class="col px-0">
              <div class="form-group">
                <elements-input
                    type="number"
                    v-model="state.leasing.freeLessKilometers"
                    :required="true"
                    id="totalMileage"
                    :disabled="state.submitted"
                />
              </div>
            </div>
          </div>
          <div class="row justify-content-between">
            <div class="col px-0">
              <div class="form-group">
                Damage Protection
              </div>
            </div>
            <div class="col px-0">
              <div class="form-group">
                <elements-input
                    type="number"
                    v-model="state.damageProtection.perAdditionalKilometers"
                    :required="true"
                    id="perAdditionalKilometers"
                    :disabled="state.submitted"
                />
              </div>
            </div>
            <div class="col px-0">
              <div class="form-group">
                <elements-input
                    type="number"
                    v-model="state.damageProtection.freeExtraKilometers"
                    :required="true"
                    id="freeExtraKilometers"
                    :disabled="state.submitted"
                />
              </div>
            </div>
            <div class="col px-0">
              <div class="form-group">
                <elements-input
                    type="number"
                    v-model="state.damageProtection.perLessKilometers"
                    :required="true"
                    id="perLessKilometers"
                    :disabled="state.submitted"
                />
              </div>
            </div>
            <div class="col px-0">
              <div class="form-group">
                <elements-input
                    type="number"
                    v-model="state.damageProtection.freeLessKilometers"
                    :required="true"
                    id="freeLessKilometers"
                    :disabled="state.submitted"
                />
              </div>
            </div>
          </div>
          <div class="row justify-content-between">
            <div class="col px-0">
              <div class="form-group">
                Maintenance & Protection
              </div>
            </div>
            <div class="col px-0">
              <div class="form-group">
                <elements-input
                    type="number"
                    v-model="state.maintenanceAndAbstraction.perAdditionalKilometers"
                    :required="true"
                    id="perAdditionalKilometers"
                    :disabled="state.submitted"
                />
              </div>
            </div>
            <div class="col px-0">
              <div class="form-group">
                <elements-input
                    type="number"
                    v-model="state.maintenanceAndAbstraction.freeExtraKilometers"
                    :required="true"
                    id="freeExtraKilometers"
                    :disabled="state.submitted"
                />
              </div>
            </div>
            <div class="col px-0">
              <div class="form-group">
                <elements-input
                    type="number"
                    v-model="state.maintenanceAndAbstraction.perLessKilometers"
                    :required="true"
                    id="perLessKilometers"
                    :disabled="state.submitted"
                />
              </div>
            </div>
            <div class="col px-0">
              <div class="form-group">
                <elements-input
                    type="number"
                    v-model="state.maintenanceAndAbstraction.freeLessKilometers"
                    :required="true"
                    id="freeLessKilometers"
                    :disabled="state.submitted"
                />
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
          :buttonName="$t('Next')"
      />
    </div>
  </div>
</template>
