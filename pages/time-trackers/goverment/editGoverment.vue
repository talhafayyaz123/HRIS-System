<script setup lang="ts">
import { ref, reactive, onMounted, toRefs } from "vue";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import genericFunctionality from "~/composables/genericFunctionality";
import genericFeatures from "~/composables/generic";
import { useTimeTrackerStore } from "~/store/timeTracker";

const {
  apiRoute,
  data,
  showFunc,
  storeFunc,
  updateFunc,
  submitted,
  isLoading,
} = genericFunctionality();

const { fetchListing } = genericFeatures();

apiRoute.value = routes.TIME_TRACKER;
const { router, Toast } = commonCode();
const { t } = useI18n();
const timeTackerStrore = useTimeTrackerStore();
let parentStartTime = timeTackerStrore.$state.startTime;


const typeOptions = [
  { value: "task", name: "Task" },
  { value: "break", name: "Break" },
  { value: "vacation", name: "Vacation" },
  { value: "illness", name: "Illness" },
  { value: "internal", name: "Internal" },
  { value: "training", name: "Training" },
  { value: "Take from overdue", name: "Take from overdue" },
  { value: "sales-presales", name: "Sales/Presales" },
  { value: "meeting", name: "Meeting" },
  { value: "public holiday", name: "Public Holiday" },
  { value: "newEntry", name: "New Entry" },
  { value: "ams", name: "Ams" },
  { value: "ticket", name: "Ticket" },
  { value: "travel-expense", name: "Travel Expense" },
];

const customerTypes = [
  { value: "customer", name: "Customer" },
  { value: "lead", name: "Lead" },
]

const props = defineProps(["showModal", "hideModal","govermentRecord",'isUuid']);

const initialStateGovermentData = {
  type: "",
  description: "",
  startTime: "08:00",
  endTime: "",
  hours: "",
  customerType: "",
  customerId: "",
},
  goverment = reactive({ ...initialStateGovermentData }),
  validationRulesGoverment = {
    type: { required },
    description: { required },
    startTime: { required },
    hours: { required },
  },
  v$ = useVuelidate(validationRulesGoverment, goverment)

const update = () => {
  if (!validateGovermentForm()) {
    return;
  }
  
  try {
    isLoading.value = true;
    apiRoute.value = routes.TIME_TRACKER_UPDATE;
    updateFunc(
      goverment,
    props.isUuid,
    "/time-trackers"
  );
  resetForm();
  props.hideModal();
  } catch (e) {
    Toast.fire({ title: t("Error!"), text: t("Error"), icon: "error" });
    isLoading.value = false;
    submitted.value = false;
  }
};

const customerOptions = ref([]);
const customerTypeChanged = async (item: any) => {
  // if (goverment.type !== "sales-presales") {
  //   customerOptions.value = [];
  //   return;
  // }

let url=item == 'lead' ? routes.LEAD : routes.COMPANY;
let payLoad= {
      page: 1,
      perPage: 10,
      sortBy: 'id',
      order: 'desc',
      search: ''
    };
 await fetchListing(url,payLoad).then((response: any) => {
  let responseData=response?.value?.data;
    
  customerOptions.value = (item == 'lead') ? responseData?.leads : responseData?.customers.map((team: any) => {
      return {
          name: team.name,
          value: team.id,
      };
  });

  });


};

const validateStartEndTime = (startTime: any, endTime: any, accountedTime: any) => {
  // Get the number of hours left in the day from the start time
  const startHour = parseInt(startTime?.split(":")?.[0]) || 0; // extract the hour value from the start time string, default to 0 if not present
  const startMinute = parseInt(startTime?.split(":")?.[1]) || 0; // extract the minute value from the start time string, default to 0 if not present
  const diff = 24 - (startHour + startMinute / 60); // calculate the number of hours left in the day

  // Check if the accounted time exceeds the number of hours left in the day
  if (accountedTime > diff) {
    return false;
  }

  // Check if start and end times are present
  if (!startTime || !endTime) {
    return false;
  }

  // Parse start and end times into Date objects
  const start = new Date(`2000-01-01T${startTime}`); // set the date to a fixed value to simplify the code
  const end = new Date(`2000-01-01T${endTime}`);

  // Check if the end time crosses over to the next day
  if (end.getHours() === 0 && end.getMinutes() > 0) {
    return false;
  }

  // Check if the end time is after the start time
  return end > start;
}

const validateGovermentForm = () => {
  //Form field validation
  v$.value.$touch();
  if (v$.value.$invalid) {
    submitted.value = false;
    return false;
  }
  //Check if type is sales-presales then customer type & id is required
  if (goverment.type == "sales-presales" && (!goverment.customerId || !goverment.customerType)) {
    Toast.fire({ title: t("Validation!"), text: t("Please Select values against Pre Sales!"), icon: "error" });
    return false;
  }
  // Validation ttime
  if (
    !validateStartEndTime(
      goverment?.startTime,
      goverment?.endTime,
      goverment?.hours
    )
  ) {
    Toast.fire({ title: t("Error!"), text: t("End time cannot be before start time or beyond the current day."), icon: "error" });
    return false;
  }
  return true;
}

const startTimeChanged = () => {
  hoursChanged(goverment.hours);
  // if (this.selectedGovermentTimeIndex == 0) {
  parentStartTime = goverment.startTime;
  // }
}

const endTimeChanged = () => {
  goverment.hours = diff(
    goverment.startTime,
    goverment.endTime
  );
}

const hoursChanged = async (value: any) => {
  const quarterEnums = {
    25: 15,
    50: 30,
    75: 45,
  };
  await nextTick(); // Assuming nextTick is defined somewhere else.
  const parsedValue = parseFloat(value).toFixed(2);
  goverment.hours = parsedValue;

  goverment.endTime = (() => {
    const tokens = (goverment?.startTime ?? "").split(":");
    let endTime = "";
    const splitValues = parsedValue.split(".");
    const beforeFloatingPoint = splitValues[0] || "0";
    const afterFloatingPoint = (splitValues[1] || "0").slice(0, 2);
    let sumHours = +tokens[0] + +beforeFloatingPoint;
    let sumMinutes = +tokens[1] + (quarterEnums[+afterFloatingPoint] || +afterFloatingPoint);

    if (sumMinutes >= 60) {
      sumMinutes = sumMinutes % 60;
      sumHours += 1;
    }

    if (sumHours >= 24) {
      sumHours = sumHours % 24;
    }

    endTime = `${sumHours < 10 ? "0" : ""}${sumHours}:${sumMinutes < 10 ? "0" : ""}${sumMinutes}`;
    return endTime;
  })();

};

 watch(
  () => props.govermentRecord,
  () => {
    const { type, startTime, endTime, hours, customerType, description, customerId } = props.govermentRecord;
    goverment.type=type;
    goverment.startTime=startTime;
    goverment.endTime=endTime;
    goverment.hours=hours;
    goverment.customerType=customerType;
    goverment.description=description;
    customerTypeChanged(customerType);
    goverment.customerId=customerId;
  }
);

const resetForm = () => {
  Object.assign(goverment, initialStateGovermentData);
};


const closeModal = () => {
  props.hideModal();
  resetForm();
}


</script>

<template>
  <Modal :showModal="props.showModal" @hideModal="props.hideModal" title="Goverment" class="modal-md">
   
     <div class="row mt-4">
      <div class="col-12">
        <div class="form-group">
          <elements-multiselect v-model="goverment.type" :options="typeOptions" label="name" track-by="value"
            :textLabel="$t('Type')" :required="true" :class="{ 'is-invalid': v$.type.$error }" />
        </div>
        <div v-if="v$.type.$error" class="invalid-feedback">
          <span class="text-danger" v-if="v$.type.required">{{
            $t("This value is required")
          }}</span>
        </div>
      </div>
    </div>
    <!-- Goverment Type is pre-sale then  -->
    <div class="row mt-4" v-if="goverment.type === 'sales-presales'">
     
      <div class="col-6">
        <div class="form-group">
          <elements-multiselect v-model="goverment.customerType" @update:model-value="customerTypeChanged"
            :options="customerTypes" label="name" track-by="value" :textLabel="$t('Customer Type')" />
        </div>
      </div>
      <div class="col-6" v-if="customerOptions?.length > 0">
        <div class="form-group">
          <elements-multiselect v-model="goverment.customerId" :options="customerOptions" label="name" track-by="value"
            :textLabel="$t('Receiver')" />
        </div>
      </div>
    </div>
    <!-- Goverment Description -->
    <div class="row mt-4">
      <div class="col-12">
        <div class="form-group textarea">
          <textarea v-model="goverment.description" cols="30" rows="10" class="form-control" placeholder="."
            :required="true" :class="{ 'is-invalid': v$.description.$error }"></textarea>
          <label for="" class="input-label">{{ $t('Description') }}</label>
        </div>
        <div v-if="v$.description.$error" class="invalid-feedback">
          <span class="text-danger" v-if="v$.description.required">{{
            $t("This value is required")
          }}</span>
        </div>
      </div>
    </div>
    <!-- Goverment Start Time -->
    <div class="row mt-4">
      <div class="col-12">
        <div class="form-group">
          <elements-input v-model="goverment.startTime" @input="startTimeChanged" :label="$t('Start Time')" :required="true" type="time"
            :class="{ 'is-invalid': v$.startTime.$error }" />
        </div>
        <div v-if="v$.startTime.$error" class="invalid-feedback">
          <span class="text-danger" v-if="v$.startTime.required">{{
            $t("This value is required")
          }}</span>
        </div>
      </div>
    </div>
    <!-- Goverment Hours -->
    <div class="row mt-4">
      <div class="col-12">
        <div class="form-group">
          <elements-input v-model="goverment.hours" :label="$t('Hours Taken')" :required="true" type="number"
            :class="{ 'is-invalid': v$.hours.$error }" @update:model-value="hoursChanged" />
        </div>
        <div v-if="v$.hours.$error" class="invalid-feedback">
          <span class="text-danger" v-if="v$.hours.required">{{
            $t("This value is required")
          }}</span>
        </div>
      </div>
    </div>
    <!-- Goverment End Time -->
    <div class="row mt-4">
      <div class="col-12">
        <div class="form-group">
          <elements-input v-model="goverment.endTime" @input="endTimeChanged" :label="$t('End Time')" type="time" />
        </div>
      </div>
    </div>

    <div class="d-flex align-items-center justify-content-end mt-3">
      <button type="button" class="primary-btn me-2" data-bs-dismiss="modal" @click="closeModal()">
        {{ $t('Close') }}
      </button>
      <submittal-button @click="update()" :buttonName="$t('Update')" />
    </div>
  </Modal>
</template>
