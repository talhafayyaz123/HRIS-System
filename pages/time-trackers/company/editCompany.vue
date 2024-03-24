<script setup lang="ts">
import { ref, reactive, onMounted, toRefs } from "vue";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import genericFunctionality from "~/composables/genericFunctionality";

import genericFeatures from "~/composables/generic";
const {
  apiRoute,
  showFunc,
  storeFunc,
  updateFunc,
  submitted,
  isLoading,
} = genericFunctionality();

const { showGenericListing } = genericFeatures();

const { router, Toast } = commonCode();
const { t } = useI18n();

const initialStateNewEntry = {
  companyId: "",
  hours: "0.00",
  description: "",
};

const initialStateTicketData = {
  companyId: "",
  hours:'0.00',
  description:'',
  moduleId: "",
};

const initialStateAmsData = {
  companyId: "",
  hours: "0.00",
  moduleId: "",
  totalRemainingHours: "0.00",
  description: "",
};

const initialStateTaskData = {
    companyId: "",
    hours: "0.00",
    moduleId: "",
    description: "",
};

const initialTravelExpenseData={
  companyId: "",
  description: "",
  hours: "0.00",
  moduleId: "",
},

  company = reactive({ ...initialStateNewEntry }),
  ticketData = reactive({ ...initialStateTicketData }),
  amsData = reactive({ ...initialStateAmsData }),
  taskData = reactive({ ...initialStateTaskData }),
  travelExpenseInfo = reactive({ ...initialTravelExpenseData }),

  taskAdditionalInfo = {
    estimatedTime: "",
    spentTime: "",
    plannedFinishedDate: "",
    expectedFinishedDate: "",
  },
  typeOptions = [
    { value: "task", name: "Task" },
    { value: "ticket", name: "Ticket" },
    { value: "ams", name: "AMS" },
    { value: "newEntry", name: "New Entry" },
     { value: "travel-expense", name: "Travel Expense" },
  ];
const props = defineProps(["showModal", "hideModal", "customers",'companyRecord']),
  validationRulesNewEntry = {
    companyId: { required },
    description: { required },
  },
  validationRulesTicket = {
    description: { required },
  },
  validationRulesAms = {
    companyId: { required },
    description: { required },
    hours: { required },
  },
  validationRulesTask = {
    moduleId: { required },
    description: { required },
    hours: { required },
    companyId: { required },
  },

  validationRulesTravelExpense = {
    companyId: { required },
    description: { required },
  },

  v$ = useVuelidate(validationRulesNewEntry, company),
  vTicket$ = useVuelidate(validationRulesTicket, ticketData),
  vAms$ = useVuelidate(validationRulesAms, amsData),
  vTask$ = useVuelidate(validationRulesTask, taskData),
  vtravelExpense$ = useVuelidate(validationRulesTravelExpense, travelExpenseInfo);

apiRoute.value = routes.TIME_TRACKER;

const type = ref( '');
const projects = ref([]);
const mileStones = ref([]);
const tickets = ref([]);
const tasks = ref([]);
const ticketComments = ref([]);
const note = ref("");
const goodWill = ref(false);
const projectId = ref("");
const mileStoneId = ref("");
const selectedComments = ref({});
const isSpentTimeError = ref(false);
const companyUuid = ref(false);

const update = () => {
  if (type.value == "task") {
    vTask$.value.$touch();
    if (vTask$.value.$invalid) {
      submitted.value = false;
      return false;
    }
  } else if (type.value == "newEntry") {
    v$.value.$touch();
    if (v$.value.$invalid) {
      submitted.value = false;
      return false;
    }
  } else if (type.value == "ticket") {
    vTicket$.value.$touch();
    if (vTicket$.value.$invalid) {
      submitted.value = false;
      return false;
    }
  } else if (type.value == "ams") {
    vAms$.value.$touch();
    if (vAms$.value.$invalid) {
      submitted.value = false;
      return false;
    }
  }else if (type.value == "travel-expense") {
    vtravelExpense$.value.$touch();
    if (vtravelExpense$.value.$invalid) {
      submitted.value = false;
      return false;
    }
  }

  try {
    isLoading.value = true;
    updateTtimeTrackerRecord();
  } catch (e) {
    Toast.fire({ title: t("Error!"), text: t("Error"), icon: "error" });
    isLoading.value = false;
    submitted.value = false;
  }
};

const updateTtimeTrackerRecord = () => {
  
    var record;
    if (type.value === "newEntry") {
      record = company;
    } else if (type.value === "ams") {
      record = amsData;
    } else if (type.value === "task") {
      record = taskData;
    }else if (type.value==='ticket'){
      record = ticketData;
    }else if (type.value==='travel-expense'){
      record = travelExpenseInfo;
    }

    var data = {
      type: type.value,
      internalNote: note.value,
      isGoodwill: goodWill.value,
    };
    data = { ...data, ...record };

    
     updateFunc(
      data,
        companyUuid.value,
        "/time-trackers" 
      );

   
    resetForm();
    props.hideModal();
  
};

async function refresh() {
  showGenericListing(routes.TICKETS).then((response: any) => {
    tickets.value = response?.data?.tickets.map((ticket: any) => {
      return {
        text: ticket.ticketNumber,
        value: ticket.id,
        comments: ticket.ticketComment,
      };
    });
  });

  showGenericListing(routes.PROJECT_DETAIL).then((response: any) => {
    projects.value = response?.data?.projects.map((project: any) => {
      return {
        text: project.name,
        value: project.uuid,
        number: project.number,
      };
    });
  });
}

watch(
  () => props.showModal,
  () => {
    if (props.showModal) {
      refresh();
    }
  }
);

watch(
  () => props.companyRecord,
  () => {
    const {moduleType,isGoodwill,internalNote,companyId,time,description,uuid,additionalInfo,moduleId}=props.companyRecord;
    type.value=moduleType;
    goodWill.value = isGoodwill;
    note.value = internalNote; 
    companyUuid.value = uuid; 
    if(moduleType==='newEntry'){
      company.companyId=companyId;
      company.hours=time;
      company.description=description;
    }else if (moduleType==='task'){
      const {project,milestone,task}=additionalInfo;
      taskDescription(project,milestone,task);
      taskData.moduleId=moduleId;
      taskData.companyId=companyId;
      taskData.description = description; 
    }else if(moduleType==='ticket'){
     ticketData.companyId=companyId;
     ticketData.description=description;
     ticketData.hours=time;
     ticketData.moduleId=moduleId;
    }else if(moduleType==='ams'){
      getRemainingHours(companyId);
      amsData.companyId=companyId;
      amsData.description=description;
      amsData.hours=time;
    }else if(moduleType==='travel-expense'){
      travelExpenseInfo.companyId=companyId;
      travelExpenseInfo.description=description;
      travelExpenseInfo.hours=time;
      travelExpenseInfo.moduleId=moduleId;
    }
   
  }
);


const getRemainingHours = (val: any) => {
  const ams = props.customers
    .filter((customer: any) => customer.value === val)
    .map((customer: any) => customer.ams);
     if(ams){
   amsData.moduleId = ams[0]?.id ?? 0;

  amsData.totalRemainingHours =
    (ams[0]?.serviceHoursYear ?? 0) - (ams[0]?.usedHours ?? 0);
  }
};


const taskDescription = (project: any,milestone: any,task: any) => {
   
  const {
    estimated_time,
    spend_time,
    planned_finished_date,
    expected_finished_date,
    description,
  } = task;

//Define additional info data
taskAdditionalInfo.estimatedTime = estimated_time
    ? parseFloat(estimated_time).toFixed(2)
    : "0.00";
  taskAdditionalInfo.spentTime = spend_time
    ? parseFloat(spend_time).toFixed(2)
    : "0.00";
  taskAdditionalInfo.plannedFinishedDate = planned_finished_date;
  taskAdditionalInfo.expectedFinishedDate = expected_finished_date;

  //Define accounted time
  let spentTime = spend_time ?? 0;
  let estimateTime = estimated_time ?? 0;
  let time = (parseFloat(estimateTime) - parseFloat(spentTime)).toFixed(2);
  taskData.hours = time > 0 ? time : "0.00";
};

const updateAccountedTime = () => {
  let hours = taskData.hours;
  if (hours != "" && hours != "0.00") {
    isSpentTimeError.value =
      parseFloat(hours) + parseFloat(taskAdditionalInfo.spentTime) >
      taskAdditionalInfo.estimatedTime;
  }
};

const resetForm = () => {
  type.value = "";
  goodWill.value = false;
  note.value = "";
  Object.assign(company, initialStateNewEntry);
  Object.assign(ticketData, initialStateTicketData);
  Object.assign(amsData, initialStateAmsData);
  Object.assign(taskData, initialStateTaskData);
};
</script>

<template>
  <Modal
    :showModal="props.showModal"
    @hideModal="props.hideModal"
    :title="`Customer`"
    class="modal-md"
  >

    <div class="row mt-4">
      <div class="col-12 col-lg-6 col-sm-12">
        <div class="form-group">
          <elements-multiselect
            v-model="type"
            :options="typeOptions"
            label="name"
            track-by="value"
            :textLabel="$t('Type')"
            :required="true"
            :disabled="true"
          />
        </div>
      </div>
    </div>
    <!--==================TASK==================-->
    <div class="row" v-if="type == 'task'">
     
     
      <div class="col-lg-6">
        <div class="form-group">
         
          <!-- Display Task additional info -->
          <div
            v-if="taskAdditionalInfo.estimatedTime"
            class="w-full bg-white rounded-md shadow mb-8 p-4 mr-6"
          >
            <p>
              <span class="font-bold">{{ $t("Estimated Time") }}:&nbsp;</span>
              {{ taskAdditionalInfo.estimatedTime }}
              <br />
              <span class="font-bold">{{ $t("Spent Time") }}:&nbsp;</span
              >{{ taskAdditionalInfo.spentTime }}
              <span
                v-if="isSpentTimeError"
                class="text-red-600"
                style="color: red"
                >({{
                  $t(
                    "our spend time is higher than your estimated time. If thats not a mistake, click on SAVE again"
                  )
                }})</span
              >
              <br />
              <span class="font-bold"
                >{{ $t("Planned Finished Date") }}:&nbsp;</span
              >{{ taskAdditionalInfo.plannedFinishedDate }}
              <br />
              <span class="font-bold"
                >{{ $t("Expected Finished Date") }}:&nbsp;</span
              >{{ taskAdditionalInfo.expectedFinishedDate }}
            </p>
          </div>
        </div>
      </div>
      <div class="col-lg-6">
        <div class="form-group">
          <elements-input
            v-model="taskData.hours"
            :label="$t('Accounted Time')"
            :required="true"
            id="group-name"
            :disabled="submitted"
            :class="{ 'is-invalid': vTask$.hours.$error }"
            @change="updateAccountedTime"
          />
          <div v-if="vTask$.hours.$error" class="invalid-feedback">
            <span class="text-danger" v-if="vTask$.hours.required">{{
              $t("This value is required")
            }}</span
            ><br />
          </div>
        </div>
      </div>

      <div class="col-lg-12">
        <div class="form-group textarea">
          <textarea
            placeholder="."
            class="form-control"
            v-model="taskData.description"
            cols="30"
            rows="10"
            :class="{ 'is-invalid': vTask$.description.$error }"
            :required="true"
          ></textarea>
          <div v-if="vTask$.description.$error" class="invalid-feedback">
            <span class="text-danger" v-if="vTask$.description.required">{{
              $t("This value is required")
            }}</span
            ><br />
          </div>
          <label for="" class="input-label">{{ $t('Description') }}</label>
        </div>
      </div>
    </div>
    <!--=================TICKET===================-->
    <div class="row" v-if="type == 'ticket'">
      <div class="col-lg-6">
        <div class="form-group">
          <elements-input
            v-model="ticketData.hours"
            :label="$t('Accounted Time')"
            :required="true"
            id="group-name"
            :disabled="true"
          />
        
        </div>
      </div>


      <div class="col-lg-6">
        <div class="form-group">
          <elements-multiselect
            v-model="ticketData.companyId"
            :options="customers"
            label="text"
            track-by="value"
            :textLabel="$t('Customer')"
            :required="true"
            :disabled="true"
          />
       
        </div>
      </div>

    
      <div class="col-lg-12">
        <div class="form-group textarea">
          <textarea
            placeholder="."
            class="form-control"
            v-model="ticketData.description"
            cols="30"
            rows="10"
            :required="true"
            :class="{ 'is-invalid': vTicket$.description.$error }"

          ></textarea>

          <div v-if="vTicket$.description.$error" class="invalid-feedback">
            <span class="text-danger" v-if="vTicket$.description.required">{{
              $t("This value is required")
            }}</span
            ><br />
          </div>

         
          <label for="" class="input-label">{{ $t('Description') }}</label>
        </div>
      </div>
      
    </div>
    <!--==================AWS==================-->
    <div class="row" v-if="type == 'ams'">
      <div class="col-lg-6">
        <div class="form-group">
          <elements-multiselect
            v-model="amsData.companyId"
            :options="customers"
            label="text"
            track-by="value"
            :textLabel="$t('Customer')"
            :required="true"
            @select="getRemainingHours"
            :class="{ 'is-invalid': vAms$.companyId.$error }"
          />
          <div v-if="vAms$.companyId.$error" class="invalid-feedback">
            <span class="text-danger" v-if="vAms$.companyId.required">{{
              $t("This value is required")
            }}</span
            ><br />
          </div>
        </div>
      </div>
      <div class="col-lg-6">
        <div class="form-group">
          <elements-input
            v-model="amsData.hours"
            :label="$t('Accounted Time')"
            :required="true"
            id="group-name"
            :disabled="submitted"
          />
        </div>
      </div>
      <div class="col-lg-6">
        <div class="form-group">
          <elements-input
            v-model="amsData.totalRemainingHours"
            :label="$t('Total Remaining Hours')"
            :readonly="true"
            :required="true"
            id="group-name"
            :disabled="submitted"
            :class="{ 'is-invalid': vAms$.hours.$error }"
          />
          <div v-if="vAms$.hours.$error" class="invalid-feedback">
            <span class="text-danger" v-if="vAms$.hours.required">{{
              $t("This value is required")
            }}</span
            ><br />
          </div>
        </div>
      </div>

      <div class="col-lg-12">
        <div class="form-group textarea">
          <textarea
            placeholder="."
            class="form-control"
            v-model="amsData.description"
            cols="30"
            rows="10"
            :class="{ 'is-invalid': vAms$.description.$error }"
          ></textarea>
          <div v-if="vAms$.description.$error" class="invalid-feedback">
            <span class="text-danger" v-if="vAms$.description.required">{{
              $t("This value is required")
            }}</span
            ><br />
          </div>
          <label for="" class="input-label">{{ $t('Description') }}</label>
        </div>
      </div>
    </div>
    <!--==================NEW ENTRY==================-->
    <div class="row" v-if="type == 'newEntry'">
      <div class="col-lg-6">
        <div class="form-group">
          <elements-multiselect
            v-model="company.companyId"
            :options="customers"
            label="text"
            track-by="value"
            :textLabel="$t('Customer')"
            :required="true"
            :class="{ 'is-invalid': v$.companyId.$error }"
          />
        </div>
        <div v-if="v$.companyId.$error" class="invalid-feedback">
          <span class="text-danger" v-if="v$.companyId.required">{{
            $t("This value is required")
          }}</span
          ><br />
        </div>
      </div>
      <div class="col-lg-6">
        <div class="form-group">
          <elements-input
            v-model="company.hours"
            :label="$t('Accounted Time')"
            :required="true"
            id="group-name"
            :disabled="submitted"
          />
        </div>
      </div>
      <div class="col-lg-12">
        <div class="form-group textarea">
          <textarea
            placeholder="."
            v-model="company.description"
            :class="{ 'is-invalid': v$.description.$error }"
            class="form-control"
            name=""
            id=""
            cols="30"
            rows="10"
          ></textarea>
          <label for="" class="input-label">{{ $t('Description') }}</label>
        </div>
        <div v-if="v$.description.$error" class="invalid-feedback">
          <span class="text-danger" v-if="v$.description.required">{{
            $t("This value is required")
          }}</span
          ><br />
        </div>
      </div>
    </div>
    <!--====================================-->
     <!--==================Travel Agency==================-->
 <div class="row" v-if="type == 'travel-expense'">
 
 <div class="col-lg-6">
   <div class="form-group">
  
     <elements-multiselect
       v-model="travelExpenseInfo.companyId"
       :options="customers"
       label="text"
       track-by="value"
       :textLabel="$t('Customer')"
       :required="true"
       :class="{ 'is-invalid': vtravelExpense$.companyId.$error }"
     />
     <div v-if="vtravelExpense$.companyId.$error" class="invalid-feedback">
       <span class="text-danger" v-if="vtravelExpense$.companyId.required">{{
         $t("This value is required")
       }}</span
       ><br />
     </div>
   </div>
 
 </div>


 <div class="col-lg-12">
        <div class="form-group textarea">
          <textarea
            placeholder="."
            v-model="travelExpenseInfo.description"
            :class="{ 'is-invalid': vtravelExpense$.description.$error }"
            class="form-control"
            name=""
            id=""
            cols="30"
            rows="10"
          ></textarea>
          <label for="" class="input-label">{{ $t('Description') }}</label>
        </div>
        <div v-if="vtravelExpense$.description.$error" class="invalid-feedback">
          <span class="text-danger" v-if="vtravelExpense$.description.required">{{
            $t("This value is required")
          }}</span
          ><br />
        </div>
      </div>


        <div class="col-lg-6">
        <div class="form-group">
          <elements-input
            v-model="travelExpenseInfo.hours"
            :label="$t('Accounted Time')"
            :required="true"
            id="group-name"
            :disabled="true"
          />
        
        </div>
      </div>

 
</div>
<!--====================================-->

    <div class="col-lg-12" v-if="type">
      <div class="form-group textarea">
        <textarea
          placeholder="."
          v-model="note"
          class="form-control"
          cols="30"
          rows="10"
        ></textarea>
        <label for="" class="input-label">{{ $t('Iternal Note') }}</label>
      </div>
    </div>
    <div class="col-lg-6" v-if="type">
      <div class="form-group">
        <input type="checkbox" v-model="goodWill" class="me-2" />
        <label for="">{{$t('is Goodwill')}}?</label>
      </div>
    </div>

    <div class="d-flex align-items-center justify-content-end mt-3">
      <button
        type="button"
        class="primary-btn me-2"
        data-bs-dismiss="modal"
        @click="() => props.hideModal()"
      >
        {{ $t('Close') }}
      </button>
      <submittal-button @click="update()" v-if="type" :buttonName="$t('Update')" />
    </div>
  </Modal>
</template>
