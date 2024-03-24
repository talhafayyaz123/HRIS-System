<script setup lang="ts">
import { ref, reactive, onMounted, toRefs } from "vue";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required, requiredIf } from "@vuelidate/validators";
import genericFunctionality from "~/composables/genericFunctionality";
import genericFeatures from "~/composables/generic";
import { useTimeTrackerStore } from "~/store/timeTracker";
import {getEndTime,diff} from  '~/utils/helperFunctions';


const {
  apiRoute,
  data,
  showFunc,
  storeFunc,
  updateFunc,
  submitted,
  isLoading,
} = genericFunctionality();
const timeTackerStrore = useTimeTrackerStore();
const {fetchListing, showGenericListing } = genericFeatures();

const { router, Toast } = commonCode();
const { t } = useI18n();

const initialStateNewEntry = {
  companyId: "",
  hours: "0.00",
  description: "",
};

const initialStateTicketData = {
  ticketNumber: "",
  companyId: "",
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

const initialTaskAdditionalInfo={
  estimatedTime: "",
    spentTime: "",
    plannedFinishedDate: "",
    expectedFinishedDate: "",
};


const initialTravelExpenseData={
  companyId: "",
};

const selectedTravelExpenses:any = ref({}),

  company = reactive({ ...initialStateNewEntry }),
  ticketData = reactive({ ...initialStateTicketData }),
  amsData = reactive({ ...initialStateAmsData }),
  taskData = reactive({ ...initialStateTaskData }),
  taskAdditionalInfo = reactive({ ...initialTaskAdditionalInfo }),
  travelExpenseInfo = reactive({ ...initialTravelExpenseData }),

  typeOptions = [
    { value: "task", name: "Task" },
    { value: "ticket", name: "Ticket" },
    { value: "ams", name: "AMS" },
    { value: "travel-expense", name: "Travel Expense" },
    { value: "newEntry", name: "New Entry" },
  ];
const props = defineProps(["showModal", "hideModal", "customers"]),
  validationRulesNewEntry = {
    companyId: { required },
    description: { required },
  },
  validationRulesTicket = {
    ticketNumber: { required },
    companyId: { required },
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

    selectedTravelExpenses: {
      required: requiredIf(function () {
        return (
          travelExpense.value.length ==0
        );
      }),
    },

  },

  v$ = useVuelidate(validationRulesNewEntry, company),
  vTicket$ = useVuelidate(validationRulesTicket, ticketData),
  vAms$ = useVuelidate(validationRulesAms, amsData),
  vTask$ = useVuelidate(validationRulesTask, taskData),
  vtravelExpense$ = useVuelidate(validationRulesTravelExpense, travelExpenseInfo);

apiRoute.value = routes.TIME_TRACKER;

const type = ref("");
const projects = ref([]);
const mileStones = ref([]);
const tickets = ref([]);
const tasks = ref([]);
const ticketComments = ref([]);
const internalNote = ref("");
const isGoodwill = ref(false);
const projectId = ref("");
const mileStoneId = ref("");
const selectedComments:any = ref({});

const isSpentTimeError = ref(false);
const travelExpense = ref([]);

const  matchDates=(date1:any, date2:any) =>{
    return (
        date1.getUTCDate() == date2.getUTCDate() &&
        date1.getUTCMonth() == date2.getUTCMonth() &&
        date1.getUTCFullYear() == date2.getUTCFullYear()
    );
};

const validateStartEndTime=(startTime:String, endTime:String, accountedTime:any )=> {
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
};

const store = () => {
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
    saveTtimeTrackerRecord();
  } catch (e) {
    Toast.fire({ title: t("Error!"), text: t("Error"), icon: "error" });
    isLoading.value = false;
    submitted.value = false;
  }
};

const saveTtimeTrackerRecord = () => {

  let timeTrackerData=timeTackerStrore.$state.timeTrackerRecord?.timeTrackerGovernment;
    
    //Set start time as end time of last government entry if data exists
 let startTime = timeTrackerData?.length >0 ? timeTrackerData[
    timeTrackerData?.length - 1]?.endTime
    : "08:00:00";

    let  endTime='';
    let  governmentDescription='';
    let  governmentHour='';
      
    if(!startTime){

      startTime="08:00:00";;
    }
   
    
  if (
    type.value === "newEntry" ||
    type.value === "ams" ||
    type.value === "task"
  ) {
    var record;
    if (type.value === "newEntry") {
      record = company;
      endTime = getEndTime(startTime, company.hours);
       governmentDescription=company.description;
       governmentHour=company.hours;
    
    } else if (type.value === "ams") {
      record = amsData;
      endTime =getEndTime(startTime, amsData.hours);
      governmentDescription=amsData.description;
      governmentHour=amsData.hours;

    } else if (type.value === "task") {
      record = taskData;
      endTime = getEndTime(startTime, taskData.hours);
      governmentDescription=taskData.description;
      governmentHour=taskData.hours;
    }

    const payLoad = {
      date: new Date().toJSON().slice(0, 10),
      timeTrackerCompany: record,
      timeTrackerGovernment:[],
      userId: localStorage.getItem("user_id"),
    };

    const data = {
      type: type.value,
      internalNote: internalNote.value,
      isGoodwill: isGoodwill.value,
    };
    payLoad.timeTrackerCompany = { ...payLoad.timeTrackerCompany, ...data };

  
    const governmentPayload = {
      type: type.value,
      internalNote:  internalNote.value,
      startTime: startTime,
      endTime: endTime,
      description: governmentDescription,
      hours: governmentHour,
    };
    payLoad.timeTrackerGovernment = { ...payLoad.timeTrackerGovernment, ...governmentPayload };
    
    if(payLoad?.timeTrackerCompany?.hours){
      //If time crosses 24 hours, set end time to 0 and hours to 0
      if (!validateStartEndTime(startTime,endTime,payLoad?.timeTrackerCompany?.hours)) {
          const startHour = parseInt(startTime?.split(":")?.[0]) || 0; // extract the hour value from the start time string, default to 0 if not present
          const startMinute = parseInt(startTime?.split(":")?.[1]) || 0; // extract the minute value from the start time string, default to 0 if not present
          const diff = 24 - (startHour + startMinute / 60); // calculate the number of hours left in the day
          endTime = getEndTime(startTime, diff); // get the end time
          payLoad.timeTrackerGovernment.endTime = endTime;
      }
    }
  
    storeFunc(payLoad, "/time-trackers");
    resetForm();
    props.hideModal();
  } else if (type.value === "ticket") {
    for (const [key, value] of Object.entries(selectedComments.value)) {
      if (value) {
        let comment = ticketComments.value.filter(
          (item: any) => item.id == key
        );

        const payLoad = {
          date: new Date().toJSON().slice(0, 10),
          timeTrackerCompany: ticketData,
          timeTrackerGovernment:[],
          userId: localStorage.getItem("user_id"),
        };
        let description=  "Ticket " +
            ticketData.ticketNumber +
            " \nDescription:" +
            comment?.[0]?.["text"];

        const data = {
          type: type.value,
          internalNote: internalNote.value,
          isGoodwill: isGoodwill.value,
          hours: comment?.[0]?.["time"] ? comment[0]["time"] : 0,
          moduleId: key,
          description:description,
        };

        payLoad.timeTrackerCompany = { ...payLoad.timeTrackerCompany, ...data };
      
       // government record
        let endTime = getEndTime(startTime, comment?.[0]?.["time"]);
        let governmentHours = diff(startTime, endTime);
        
        let isError = !validateStartEndTime(
            startTime,
            endTime,
            comment?.[0]?.["time"]
        );
          
     
        if (endTime === "Invalid Date") {
          endTime = "";
            governmentHours = 0;
        } else if (isError) {
            endTime = startTime;
            governmentHours = 0;
        }
    
       
        let governmentPayload = {
          type: type.value,
          description: description,
          internalNote:  internalNote.value,
          startTime: startTime,
          endTime: endTime,
          hours: governmentHours
      };
      payLoad.timeTrackerGovernment = { ...payLoad.timeTrackerGovernment, ...governmentPayload };
     
     storeFunc(payLoad, "/time-trackers");
      }
    }

    resetForm();
    props.hideModal();
  }else if (type.value === "travel-expense") {
   ///////////
   
//Loop selected travel expenses to create an individual record

  for (const [key, value] of Object.entries(selectedTravelExpenses.value)) {
      if (value) {
        let expense = travelExpense.value.filter(
          (item: any) => item.value == key
        );

        expense=expense[0];

        let time = +(expense?.fromDiscrepancy ?? 0);
        let description = `Arrival`;
        let endTime = getEndTime(startTime, time);
        let governmentHours = diff(startTime, endTime);
        let companyHours = time;

        let isError = validateStartEndTime(
            startTime,
            endTime,
            time
        );

        if (endTime === "Invalid Date") {
            endTime = "";
            governmentHours = 0;
        } else if (isError) {
            endTime = startTime;
            governmentHours = 0;
        }

        let timeTrackerCompany = {
            type: type.value,
            moduleId:key,
            description: description,
            internalNote: internalNote.value,
            hours: companyHours,
            companyId: travelExpenseInfo.companyId,
            isGoodwill: isGoodwill.value ?? false,
        };

        let timeTrackerGovernment = {
            type: type.value,
            description: description,
            internalNote: internalNote.value,
            startTime: startTime,
            endTime: endTime,
            hours: governmentHours,
            commentId:null
        };


        //Inititalize payload
        let payload = {
          date: new Date().toJSON().slice(0, 10),
          userId: localStorage.getItem("user_id"),
          timeTrackerCompany: timeTrackerCompany,
          timeTrackerGovernment: timeTrackerGovernment,
      };

      storeFunc(payload);
     
       // if the fromDate and toDate are same then we must create another entry
       if (
          matchDates(
              new Date(expense.fromDate),
              new Date(expense.toDate)
          )
        )  {
        
          //Set start time as end time of last government entry if data exists
          let newStartTime =startTime
            let time = +(expense?.toDiscrepancy ?? 0);
          let description = `Departure`;
          let endTime = getEndTime(newStartTime, time);
          let governmentHours =diff(newStartTime, endTime);
          let companyHours = time;
          let isError = validateStartEndTime(
              newStartTime,
              endTime,
              time
          );
          if (endTime === "Invalid Date") {
              endTime = "";
              governmentHours = 0;
          } else if (isError) {
              endTime = startTime;
              governmentHours = 0;
          }

          let timeTrackerCompany = {
               type: type.value,
              moduleId: key,
              description: description,
              internalNote: internalNote.value,
              hours: companyHours,
              companyId: travelExpenseInfo.companyId,
              isGoodwill: isGoodwill.value ?? false,
          };


          let timeTrackerGovernment = {
            type: type.value,
            description: description,
            internalNote: internalNote.value,
            startTime: newStartTime,
            endTime: endTime,
            hours: governmentHours,
            commentId: null,
         };
   

         
          //Inititalize payload
          let payload = {
              date: new Date().toJSON().slice(0, 10),
              userId: localStorage.getItem("user_id"),
              timeTrackerCompany: timeTrackerCompany,
              timeTrackerGovernment: timeTrackerGovernment,
          };


          storeFunc(payload);
      }


      }

    }
    resetForm();
    props.hideModal();
   /////////
  }
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

const getTicketComments = (val: any) => {
  let ticket: never[] = tickets.value.filter((item: any) => item.value === val && item.time !== null  );
  ticketComments.value = ticket?.[0]?.["comments"];
};

const getRemainingHours = (val: any) => {
  const ams = props.customers
    .filter((customer: any) => customer.value === val)
    .map((customer: any) => customer.ams);
  amsData.moduleId = ams[0]?.id ?? 0;
  amsData.totalRemainingHours =
    (ams[0]?.serviceHoursYear ?? 0) - (ams[0].usedHours ?? 0);
};

const getMilestones = (val: any) => {
  showGenericListing(routes.PROJECT_MILESTONE, {
    projectId: val,
  }).then((response) => {
    tasks.value = [];
    mileStones.value = [];
    mileStones.value = response?.data?.project_milestones?.map(
      (mileStone: any) => {
        return {
          text: mileStone.name,
          value: mileStone.uuid,
          tasks: mileStone?.projectTasks,
        };
      }
    );
  });
};

const getTasks = (val: any) => {
  const mileStoneTasks = mileStones.value
    .filter((mileStone: any) => mileStone.value === val)
    .map((mileStone: any) => mileStone.tasks);

  tasks.value = mileStoneTasks[0]?.map((task: any) => {
    return {
      text: task.name,
      value: task.id,
      estimatedTime: task?.estimated_time,
      spendTime: task?.spend_time,
      plannedFinishedDate: task?.planned_finished_date,
      expectedFinishedDate: task?.expected_finished_date,
      description: task?.description,
    };
  });
};

const task = (val: any) => {
  const selectedTask = tasks.value.filter((task: any) => task.value === val)[0];
  const {
    estimatedTime,
    spendTime,
    plannedFinishedDate,
    expectedFinishedDate,
    description,
  } = selectedTask;

  //Define additional info data
  taskAdditionalInfo.estimatedTime = estimatedTime
    ? parseFloat(estimatedTime).toFixed(2)
    : "0.00";
  taskAdditionalInfo.spentTime = spendTime
    ? parseFloat(spendTime).toFixed(2)
    : "0.00";
  taskAdditionalInfo.plannedFinishedDate = plannedFinishedDate;
  taskAdditionalInfo.expectedFinishedDate = expectedFinishedDate;

  //Define accounted time
  let spentTime = spendTime ?? 0;
  let estimateTime = estimatedTime ?? 0;
  let time = (parseFloat(estimateTime) - parseFloat(spentTime)).toFixed(2);

  taskData.hours = time > 0 ? time : "0.00";

  //Get task number
  //Define description data from task
  const project = projects.value.find((item) => {
    return (item as any).value == projectId.value;
  });

  const mileStore = mileStones.value.find((mileStone) => {
    return (mileStone as any).value == mileStoneId.value;
  });

  let plainText = "Project ID: " + project.number + "\n";
  plainText += "Project Name: " + project.text + "\n";
  plainText += "Milestone Name: " + mileStore.text + "\n";
  plainText += "Task Description:" + "\n";
  plainText += description?.trim() || "";
  taskData.description = plainText;
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
  isGoodwill.value = false;
  internalNote.value = "";
  Object.assign(company, initialStateNewEntry);
  Object.assign(ticketData, initialStateTicketData);
  Object.assign(amsData, initialStateAmsData);
  Object.assign(taskData, initialStateTaskData);
  ticketComments.value = [];
  selectedTravelExpenses.value=[];
  Object.assign(taskAdditionalInfo, initialTaskAdditionalInfo);
  Object.assign(travelExpenseInfo, initialTravelExpenseData);
  mileStones.value = [];
  projects.value = [];
  projectId.value  ="";
};


const selectTravelExpense=(val:string)=>{

 
  fetchListing(routes.APPROVED_TRAVEL_EXPENSE+'?companyId='+val+'&date='+new Date().toJSON().slice(0, 10)).then((response: any) => {
     
    travelExpense.value = response.value?.data?.travelExpense.map((ts: any) => {
      
       return {
         value: ts.id,
         travelNumber: ts.travelNumber,
         fromDate: ts.fromDate,
         toDate: ts.toDate,
         description: ts.description,
         fromDiscrepancy: ts.from_discrepancy,
         toDiscrepancy: ts.to_discrepancy,
       };
     });
   });
}
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
          />
        </div>
      </div>
    </div>
    <!--==================TASK==================-->
    <div class="row" v-if="type == 'task'">
      <div class="col-lg-6">
        <div class="form-group">
          <elements-multiselect
            :options="projects"
            v-model="projectId"
            label="text"
            track-by="uuid"
            :textLabel="$t('Projects')"
            :required="true"
            @select="getMilestones"
          />
        </div>
      </div>
      <div class="col-lg-6">
        <div class="form-group">
          <elements-multiselect
            v-model="mileStoneId"
            :options="mileStones"
            label="text"
            track-by="value"
            :textLabel="$t('Milestone')"
            :required="true"
            @select="getTasks"
          />
        </div>
      </div>
      <div class="col-lg-6">
        <div class="form-group">
          <elements-multiselect
            v-model="taskData.moduleId"
            :options="tasks"
            label="text"
            track-by="value"
            :textLabel="$t('Task Number')"
            :required="true"
            @select="task"
            :class="{ 'is-invalid': vTask$.moduleId.$error }"
          />

          <div v-if="vTask$.moduleId.$error" class="invalid-feedback">
            <span class="text-danger" v-if="vTask$.moduleId.required">{{
              $t("This value is required")
            }}</span
            ><br />
          </div>
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
            type="number"
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
      <div class="col-lg-6">
        <div class="form-group">
          <elements-multiselect
            v-model="taskData.companyId"
            :options="customers"
            label="text"
            track-by="value"
            :textLabel="$t('Customer')"
            :required="true"
            :class="{ 'is-invalid': vTask$.companyId.$error }"
          />
          <div v-if="vTask$.companyId.$error" class="invalid-feedback">
            <span class="text-danger" v-if="vTask$.companyId.required">{{
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
          <elements-multiselect
            v-model="ticketData.ticketNumber"
            :options="tickets"
            label="text"
            track-by="value"
            :textLabel="$t('Ticket Number')"
            :required="true"
            @select="getTicketComments"
            :class="{ 'is-invalid': vTicket$.ticketNumber.$error }"
          />
          <div v-if="vTicket$.ticketNumber.$error" class="invalid-feedback">
            <span class="text-danger" v-if="vTicket$.ticketNumber.required">{{
              $t("This value is required")
            }}</span
            ><br />
          </div>
        </div>
      </div>

      <div class="col-lg-12" v-if="ticketComments.length > 0">
        <div class="form-group">
          <table class="w-full">
            <thead>
              <tr>
                <th class="px-4 py-2 text-left">{{ $t('Select') }}</th>
                <th class="px-4 py-2 text-left">{{ $t('Description') }}</th>
                <th class="px-4 py-2 text-left">{{ $t('Accounted Time') }}</th>
              </tr>
            </thead>
            <tbody>

              <tr v-for="comment in ticketComments">
                <td class="px-4 py-2 border-b border-gray-200" v-if="comment?.time">
                  <label class="inline-flex items-center">
                    <input
                      type="checkbox"
                      :id="selectedComments[comment.id]"
                      v-model="selectedComments[comment.id]"
                      class="comment-checkbox h-5 w-5 text-blue-600"
                  /></label>
                </td>

                <td class="px-4 py-2 border-b border-gray-200"  v-if="comment?.time">
                  {{ comment?.text }}
                </td>
                <td class="px-4 py-2 border-b border-gray-200"  v-if="comment?.time">
                  {{ comment?.time }}
                </td>
              </tr>
            </tbody>
          </table>
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
            :class="{ 'is-invalid': vTicket$.companyId.$error }"
          />
          <div v-if="vTicket$.companyId.$error" class="invalid-feedback">
            <span class="text-danger" v-if="vTicket$.companyId.required">{{
              $t("This value is required")
            }}</span
            ><br />
          </div>
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
            type="number"
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
            @select="selectTravelExpense"
          />
          <div v-if="vtravelExpense$.companyId.$error" class="invalid-feedback">
            <span class="text-danger" v-if="vtravelExpense$.companyId.required">{{
              $t("This value is required")
            }}</span
            ><br />
          </div>
        </div>
      
      </div>

      <div v-if="vtravelExpense$.selectedTravelExpenses.$error" class="invalid-feedback" >
              <span class="text-danger" v-if="vtravelExpense$.selectedTravelExpenses.required">{{
                $t("This travel expense is required")
              }}</span>
            </div>

      <div class="col-lg-12" v-if="travelExpense.length > 0">
        <div class="form-group">
          <table class="w-full">
            <thead>
              <tr>
                <th class="px-4 py-2 text-left">{{ $t('Select') }}</th>
                <th style="width: 12%" class="px-4 py-2 text-left">
                        {{ $t("Travel Req. No.") }}
                        </th>
                        <th style="width: 15%" class="px-4 py-2 text-left">
                            {{ $t("From Date") }}
                        </th>
                        <th style="width: 15%" class="px-4 py-2 text-left">
                            {{ $t("To Date") }}
                        </th>
                        <th style="width: 10%" class="px-4 py-2 text-left">
                            {{ $t("Arrival Travel Time") }}
                        </th>
                        <th style="width: 10%" class="px-4 py-2 text-left">
                            {{ $t("Departure Travel Time") }}
                        </th>
              </tr>
            </thead>
            <tbody>
               
               <tr v-for="expense in travelExpense" :key="expense.value">
                
                <td class="px-4 py-2 border-b border-gray-200" >
                  <label class="inline-flex items-center">
                    <input
                      type="checkbox"
                      :id="selectedTravelExpenses[expense.value]"
                      v-model="selectedTravelExpenses[expense.value]"
                      class="comment-checkbox h-5 w-5 text-blue-600"
                  /></label>
                </td>

                <td class="px-4 py-2 border-b border-gray-200">
                  {{ expense?.travelNumber }}
                </td>
                <td class="px-4 py-2 border-b border-gray-200">
                  {{ expense?.fromDate }}
                </td>
                <td class="px-4 py-2 border-b border-gray-200">
                  {{ expense?.toDate }}
                </td>
                <td class="px-4 py-2 border-b border-gray-200">
                  {{ expense?.fromDiscrepancy }}
                </td>
                <td class="px-4 py-2 border-b border-gray-200">
                  {{ expense?.toDiscrepancy }}
                </td>
              </tr> 

            </tbody>
          </table>
        </div>
      </div>
      
    </div>
 <!--====================================-->
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
            type="number"
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

    <div class="col-lg-12" v-if="type">
      <div class="form-group textarea">
        <textarea
          placeholder="."
          v-model="internalNote"
          class="form-control"
          cols="30"
          rows="10"
        ></textarea>
        <label for="" class="input-label">{{ $t('Iternal Note') }}</label>
      </div>
    </div>
    <div class="col-lg-6" v-if="type">
      <div class="form-group">
        <input type="checkbox" v-model="isGoodwill" class="me-2" />
        <label for="">{{ $t('is Goodwill') }}?</label>
      </div>
    </div>

    <div class="d-flex align-items-center justify-content-end mt-3">
      <button
        type="button"
        class="primary-btn me-2"
        data-bs-dismiss="modal"
        @click="() => props.hideModal()"
      >
        Close
      </button>
      <submittal-button @click="store()" v-if="type" :buttonName="$t('Add')" />
    </div>
  </Modal>
</template>
