<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { routes } from "~/utils/apiRoutes";
import commonCode from "~/composables/common";
import genericFeatures from "~/composables/generic";
import {
  compensationAndBenefitsCreateRequest,
  compensationAndBenefitsShowRequest,
  illnessLeaveCreateRequest,
  illnessLeaveRequest
} from "~/utils/apiRequests";
import genericFunctionality from "~/composables/genericFunctionality";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";

const { router, Toast, deleteAlert } = commonCode();
const { showGenericListing } = genericFeatures(),
  { submitted, isLoading, apiRoute, storeFunc } = genericFunctionality(),
  { t } = useI18n(),
  state = reactive({
    userId: "",
    isLoading: false,
    submitted: false,
    compensationType: "",
    grossMonthlySalary: "0.0",
    grossHourlySalary: "0.0",
    contractNumber: "",
    insuranceCompany: "",
    amountMonthly: "0.0",
    startDate: "",
    endDate: "",
    days: "",
    addNotes: "",
    notes: ""
  }),
  errorStartDate = ref(""),
  leaves = ref([]),
  validationRules = {
    startDate: { required },
    endDate: { required },
  },
  v$ = useVuelidate(validationRules, state),
  differenceInDays = ref(0),
  props = defineProps({
    userProfileId: {
      type: String,
      default: "",
    },
  }),
  emit = defineEmits(["compensationDone", "backToJob"]),
  store = () => {
    createCompensation();
  };

const createCompensation = () => {
  state.submitted = true;
  state.isLoading = true;
  compensationAndBenefitsCreateRequest({
    employeeId: props.userProfileId,
    grossMonthlySalary: state.grossMonthlySalary,
    grossHourlySalary: state.grossHourlySalary,
    compensationType: state.compensationType,
    amountMonthly: state.amountMonthly,
    insuranceCompany: state.insuranceCompany,
    contractNumber: state.contractNumber,
  })
    .then((response) => {
      Toast.fire({
        icon: "success",
        title: t("Record updated successfully!"),
      });
      state.submitted = false;
      state.isLoading = false;
      emit("compensationDone");
    })
    .catch((error) => {
      state.submitted = false;
      state.isLoading = false;
      Toast.fire({ icon: "error", title: t("something went wrong!") });
    });
};

watch(
  () => state.grossMonthlySalary,
  (val) => {
    state.grossHourlySalary = (val / 328).toFixed(2);
  }
);
watch(
  () => state.startDate,
  (val) => {
    errorStartDate.value = ""
    calculateDays();
  }
);

watch(
  () => state.endDate,
  (val) => {
    errorStartDate.value = ""
    calculateDays();
  }
);

watch(
  () => state.grossHourlySalary,
  (val) => {
    state.grossMonthlySalary = (val * 328).toFixed(2);
  }
);

const showCustomer = () => {
  compensationAndBenefitsShowRequest(props.userProfileId).then((response) => {
    const {
      grossMonthlySalary,
      grossHourlySalary,
      compensationType,
      amountMonthly,
      insuranceCompany,
      contractNumber,
    } = response?.data;
    state.grossMonthlySalary = grossMonthlySalary;
    state.grossHourlySalary = grossHourlySalary;
    state.compensationType = compensationType;
    state.amountMonthly = amountMonthly;
    state.insuranceCompany = insuranceCompany;
    state.contractNumber = contractNumber;
  });
};


const showLeaves = () => {
  illnessLeaveRequest({
    employeeId: props.userProfileId,
  }).then((response) => {
    leaves.value = response?.data

    // const {
    //   grossMonthlySalary,
    //   grossHourlySalary,
    //   compensationType,
    //   amountMonthly,
    //   insuranceCompany,
    //   contractNumber,
    // } = response?.data;
    // state.grossMonthlySalary = grossMonthlySalary;
    // state.grossHourlySalary = grossHourlySalary;
    // state.compensationType = compensationType;
    // state.amountMonthly = amountMonthly;
    // state.insuranceCompany = insuranceCompany;
    // state.contractNumber = contractNumber;
  });
};

const addDays = (date, days) => {
  const d = new Date(date.valueOf());
  d.setDate(d.getDate() + days);
  return d;
};

const matchDates = (date1, date2) => {
  return (
    date1.getDate() == date2.getDate() &&
    date1.getMonth() == date2.getMonth() &&
    date1.getFullYear() == date2.getFullYear()
  );
};

const calculateDays = () => {
  var date1 = new Date(state.startDate);
  var date2 = new Date(state.endDate);

  let weekEndDaysCount = 0;

  if (date1 && date2) {
    let startDate = date1;
    let endDate = date2;
    if (startDate.getDay() == 0 || startDate.getDay() == 6) {
      weekEndDaysCount += 1;
      startDate = addDays(startDate, 1);
      if (matchDates(startDate, endDate)) {
        if (startDate.getDay() == 0 || startDate.getDay() == 6) {
          weekEndDaysCount += 1;
        }
      }
    }
    if (startDate <= endDate) {
      let wentInsideTheLoop = false;
      while (!matchDates(startDate, endDate)) {
        wentInsideTheLoop = true;
        if (startDate.getDay() == 0 || startDate.getDay() == 6) {
          weekEndDaysCount += 1;
        }
        startDate = addDays(startDate, 1);
      }
      if (matchDates(startDate, endDate) && wentInsideTheLoop) {
        if (startDate.getDay() == 0 || startDate.getDay() == 6) {
          weekEndDaysCount += 1;
        }
      }
    }
  }

  // To calculate the time difference of two dates
  var differenceInTime = date2.getTime() - date1.getTime();

  differenceInDays.value = 0;
  differenceInDays.value = differenceInTime / (1000 * 3600 * 24);
  differenceInDays.value += 1; // since we are calculating the difference between start and end date, there is always a difference of 1, this offsets that
  differenceInDays.value -= weekEndDaysCount;
  state.days =
    isNaN(differenceInDays.value) || differenceInDays.value < 0
      ? 0
      : differenceInDays.value.toFixed(0);
};

const addIllnessDays = () => {
  v$.value.$touch();
  if (v$.value.$invalid) {
    return false;
  } else {
    if (state.endDate < state.startDate) {
      errorStartDate.value = "Start date should be smaller then end date"
      return false;
    }
    illnessLeaveCreateRequest({
      employeeId: router.params.id,
      startDate: state.startDate,
      endDate: state.endDate,
      requiredVacationDays: state.days,
      notes: state.addNotes ? state.notes : ""
    })
      .then((response) => {
        Toast.fire({
          icon: "success",
          title: t("Record updated successfully!"),
        });
        showLeaves();
      })
      .catch((error) => {

        Toast.fire({ icon: "error", title: t("something went wrong!") });
      });
  }
};

const refresh = () => {
  if (router.params.id) {
    showCustomer();
    showLeaves();
  }
};
const prev = () => {
  emit("backToJob");
};

refresh();
</script>
<template>
  <div>
    <div class="card product-type">
      <div class="card-header d-flex align-items-center">
        <h3 class="card-title me-2">{{ $t("Compensation") }}</h3>
        <elements-tooltip />
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-input v-model="state.compensationType" :label="$t('Compensation Type')" id="jobTitle"
                :disabled="state.submitted" />
            </div>
          </div>
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-input v-model="state.grossMonthlySalary" :label="$t('Gross Monthly Salary')"
                id="grossMonthlySalary" type="number" :disabled="state.submitted" />
            </div>
          </div>
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-input v-model="state.grossHourlySalary" :label="$t('Gross Hourly Salary')" id="grossHourlySalary"
                type="number" :disabled="state.submitted" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card mt-4">
      <div class="card-header d-flex align-items-center">
        <h3 class="card-title me-2">{{ $t("Pension Plan") }}</h3>
        <elements-tooltip />
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-input v-model="state.contractNumber" :label="$t('Contract Number')" id="contractNumber"
                :disabled="state.submitted" />
            </div>
          </div>
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-input v-model="state.insuranceCompany" :label="$t('Insurance Company')" id="insuranceCompany"
                :disabled="state.submitted" />
            </div>
          </div>
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-input v-model="state.amountMonthly" :label="$t('Amount Monthly')" id="amountMonthly" type="number"
                :disabled="state.submitted" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card mt-4">
      <div class="card-header d-flex align-items-center">
        <h3 class="card-title me-2">{{ $t("Illness Leaves") }}</h3>
        <elements-tooltip />
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"><elements-icon v-bind:icon="'dateIcon'" /></span>
                </div>
                <elements-input v-model="state.startDate" :label="$t('Start Date')" id="startDate" type="date"
                  :required="true" :disabled="state.submitted"
                  :class="{ 'is-invalid': v$.startDate.$error || errorStartDate }" />
              </div>
            </div>
            <div v-if="v$.startDate.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.startDate.required">{{
                $t("This value is required")
              }}</span><br />
            </div>
            <span class="text-danger" v-if="errorStartDate">{{
              errorStartDate
            }}</span>
          </div>
          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"><elements-icon v-bind:icon="'dateIcon'" /></span>
                </div>
                <elements-input v-model="state.endDate" :label="$t('End Date')" id="endDate" type="date"
                  :disabled="state.submitted" :required="true"
                  :class="{ 'is-invalid': v$.endDate.$error || errorStartDate }" />
              </div>
            </div>
            <div v-if="v$.endDate.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.endDate.required">{{
                $t("This value is required")
              }}</span><br />
            </div>
          </div>
          <div class="col-lg-6 col-md-6">
            <div class="form-group">

              <elements-input v-model="state.days" :label="$t('Days')" id="days" readonly type="number"
                :disabled="state.submitted" />
            </div>
          </div>
          <div class="col-lg-6 col-md-6">
            <div class="form-group checkbox-group">
              <input type="checkbox" class="checkbox-input" id="checkbox" v-model="state.addNotes" />
              <label class="ms-2 checkbox-label" for="checkbox">{{ $t('Add Notes') }}</label>

              <!-- <elements-input
                v-model="state.amountMonthly"
                :label="$t('Amount Monthly')"
                id="amountMonthly"
                type="checkbox"
                :disabled="state.submitted"
              /> -->
            </div>
          </div>
          <div v-if="state.addNotes" class="col-lg-6 col-md-12">
            <div class="form-group textarea">
              <textarea v-model="state.notes" cols="30" rows="10" class="form-control"></textarea>

              <label for="" class="input-label">{{ $t('Notes') }}</label>
            </div>
          </div>
          <div class="col-md-12 mt-3 d-flex align-items-center justify-content-end">
            <button @click.prevent="addIllnessDays()" class="secondary-btn">
              <ElementsIcon v-bind:icon="'addIcon'" class="me-2" />
              {{ $t("Create") }}
            </button>
          </div>
        </div>
      </div>

    </div>
    <div v-if="leaves.length > 0" class="table-responsive mt-3">
      <table class="doc-table table">
        <thead>
          <tr>
            <th>{{ $t("Start Date") }}</th>
            <th>{{ $t("End Date") }}</th>
            <th>{{ $t("Days") }}</th>
            <th>{{ $t("Notes") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in leaves" :key="index">
            <td>{{ item?.startDate }}</td>
            <td>{{ item?.endDate }}</td>
            <td>{{ item?.requiredVacationDays }}</td>
            <td>{{ item?.notes }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="form-group text-right mt-3 d-flex align-items-center justify-content-end">
      <button class="link_text primary-btn me-3" @click.prevent="prev()">
        <elements-icon v-bind:icon="`backIcon`" class="me-2" />
        {{ $t("Previous") }}
      </button>
      <submittal-button @click.prevent="store()" :isLoading="state.isLoading" :buttonName="$t('Save and Proceed')"
        :iconName="'saveIcon'" />
    </div>
  </div>
</template>
