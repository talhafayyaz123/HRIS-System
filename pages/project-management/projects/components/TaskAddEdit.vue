<script setup lang="ts">
import genericFunctionality from "~/composables/genericFunctionality";
import { routes } from "~/utils/apiRoutes";
import { MdEditor } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import genericFeatures from "~/composables/generic";
const runtimeConfig = useRuntimeConfig();

const { apiRoute, data, showFunc, storeFunc, updateFunc ,submitted, isLoading} =
  genericFunctionality();

import { ref, reactive } from "vue";

import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";

const {showGenericListing } = genericFeatures();

const { router, Toast } = commonCode(),

  { t } = useI18n(),
  projectTask = reactive({
    name : "",
    status : 'new',
    description : "", 
    plannedStartDate :"",
    plannedFinishedDate :"",
    actualStartDate  :"",
    actualFinishedDate  :"",
    earliestStartDate  :"",
    expectedfinishedDate  :"",
    mileStoneId:'',
    estimatedTime:0,
    spendTime :0,
    priority:'medium',
    employeeId:''
  }),
  currentPage = ref(1),
  order = ref("asc"),
  column = ref("id"),
  milestones=ref([]),
  managers=ref([]),
  validationRules = {
    name: { required },
    mileStoneId: { required },
  },

  priorityOptions = [
    { value: 'low',text:'Low' },
    { value: 'high' ,text:'High'},
    { value: 'medium' ,text:'Medium'}
  ],

  statusOptions = [
    { value: 'new',text:'New' },
    { value: 'done' ,text:'Done'},
    { value: 'in-work' ,text:'In Work'},
    { value: 'in-review' ,text:'In Review'},
    { value: 'blocked' ,text:'Blocked'},
  ],
  v$ = useVuelidate(validationRules, projectTask);

const props = defineProps({
  projectId: {
    type: String,
    default: "",
  },
  taskId: {
    type: String,
    default: "",
  },
  isUpdate: {
    type: Boolean,
    default: false,
  },
});

async function  refresh()  {

  apiRoute.value = routes.PROJECT_TASK;
  if (props.taskId) {

     let response = await showFunc(props.taskId)
    if(response?.success){

      const {name,status,description,
      planned_start_date,planned_finished_date,actual_start_date,actual_finished_date,earliest_start_date,
      expected_finished_date,priority,estimated_time,spend_time,milestone_id,employee_id}= response?.data;
    
      projectTask.name = name;
      projectTask.status = status;
      projectTask.description = description;
      projectTask.plannedStartDate = planned_start_date;
      projectTask.plannedFinishedDate = planned_finished_date;
      projectTask.actualStartDate = actual_start_date;
      projectTask.actualFinishedDate = actual_finished_date;
      projectTask.earliestStartDate = earliest_start_date;
      projectTask.expectedfinishedDate = expected_finished_date;

      projectTask.priority = priority;
      projectTask.estimatedTime = estimated_time;
      projectTask.spendTime = spend_time;
      projectTask.mileStoneId = milestone_id;
      projectTask.employeeId = employee_id;
    }
  }

  showGenericListing(routes.PROJECT_MILESTONE,{
    projectId:props.projectId
  }
).then((response:any) => {
    milestones.value = response?.data?.project_milestones.map((milestone: any) => {
      
      return {
        text: milestone.name,
        value: milestone.id,
      };
    });
  });


  showGenericListing(runtimeConfig.public.authBaseUrl+routes.LIST_USERS,{
    limit_start: 0,
    limit_count: 25,
    type: "employee",
  }).then((response) => {

    managers.value = response?.data?.map((manager: any) => {
      return {
        text: manager.first_name+'  '+manager.last_name,
        value: manager.id,
      };
    });

  });

};

refresh();

const store = () => {
  v$.value.$touch();
  if (v$.value.$invalid) {
    submitted.value = false;
    return false;
  } else {
    try {
      isLoading.value = true;
      if (props.isUpdate == true) {
        updateProjectTask();
      } else {
        createProjectTask();
      }
    } catch (e) {
      Toast.fire({ title: t("Error!"), text: t("Error"), icon: "error" });
      isLoading.value = false;
      submitted.value = false;
    }
  }
};

const updateProjectTask = () => {
   const payLoad = {
    name: projectTask.name,
    status : projectTask.status,
    description : projectTask.description,
    planned_start_date :projectTask.plannedStartDate,
    planned_finished_date :projectTask.plannedFinishedDate,
    actual_start_date  :projectTask.actualStartDate,
    actual_finished_date  :projectTask.actualFinishedDate,
    earliest_start_date  :projectTask.earliestStartDate,
    expected_finished_date  :projectTask.expectedfinishedDate,
    project_id  :props.projectId,
    milestone_id  :projectTask.mileStoneId,
    estimated_time  :projectTask.estimatedTime,
    spend_time  :projectTask.spendTime,
    employee_id  :projectTask.employeeId,
  };
 
  updateFunc(payLoad,props.taskId,"/project-management/projects/edit-"+props.projectId+'?task=1'); 
};

const createProjectTask = () => {
  const payLoad = {
    name: projectTask.name,
    status : projectTask.status,
    description : projectTask.description,
    planned_start_date :projectTask.plannedStartDate,
    planned_finished_date :projectTask.plannedFinishedDate,
    actual_start_date  :projectTask.actualStartDate,
    actual_finished_date  :projectTask.actualFinishedDate,
    earliest_start_date  :projectTask.earliestStartDate,
    expected_finished_date  :projectTask.expectedfinishedDate,
    project_id  :props.projectId,
    milestone_id  :projectTask.mileStoneId,
    estimated_time  :projectTask.estimatedTime,
    spend_time  :projectTask.spendTime,
    employee_id  :projectTask.employeeId,
  };

    storeFunc(payLoad, "/project-management/projects/edit-"+props.projectId+'?task=1');
};
</script>
<template>
  <div>
    <div class="card product-type">
      <div class="card-header">
        <h3 class="card-title">{{ $t('Fill Project Task Details') }}</h3>
      </div>
      <div class="card-body">
        <div class="row">

          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-input
                v-model="projectTask.name"
                :label="$t('Name')"
                :required="true"
                id="name"
                :disabled="submitted"
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


          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-multiselect
                v-model="projectTask.status"
                :options="statusOptions"
                label="text"
                :key="projectTask.status"
                track-by="value"
                :textLabel="$t('Status')"
                :required="false"
              />
              
            </div>
          </div>


          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-multiselect
                v-model="projectTask.mileStoneId"
                :options="milestones"
                label="text"
                :key="projectTask.mileStoneId"
                track-by="value"
                :textLabel="$t('Mile Stone')"
                :required="true"
                :class="{ 'is-invalid': v$.mileStoneId.$error }"
              />
              <div v-if="v$.mileStoneId.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.mileStoneId.required">{{
                  $t("This value is required")
                }}</span
                ><br />
              </div>
            </div>
          </div>

          <div class="col-lg-12">
            <div class="form-group">
              <MdEditor
                :preview="false"
                :style="'height:300px;'"
                :language="'en-US'"
                v-model="projectTask.description"
              />
            </div>
          </div>
 
          <div class="col-lg-4">
            <div class="form-group">
              <elements-input v-model="projectTask.plannedStartDate" :label="$t('Planned Start Date')" :required="false" id="planned_start_date"
                :disabled="submitted"  type="date" />
            </div>
          
          </div>

          <div class="col-lg-4">
            <div class="form-group">
              <elements-input v-model="projectTask.plannedFinishedDate" :label="$t('Planned Finished Date')" :required="false" id="planned_finished_date"
                :disabled="submitted"  type="date" />
            </div>
           
          </div>


          <div class="col-lg-4">
            <div class="form-group">
              <elements-input v-model="projectTask.actualStartDate" :label="$t('Actual Start Date')" :required="false" id="actual_start_date"
                :disabled="submitted"  type="date" />
            </div>
           
          </div>


          <div class="col-lg-4">
            <div class="form-group">
              <elements-input v-model="projectTask.actualFinishedDate" :label="$t('Actual Finished Date')" :required="false" id="actual_finished_date"
                :disabled="submitted"  type="date" />
            </div>
           
          </div>


          <div class="col-lg-4">
            <div class="form-group">
              <elements-input v-model="projectTask.earliestStartDate" :label="$t('Earliest Start Date')" :required="false" id="earliest_start_date"
                :disabled="submitted"  type="date" />
            </div>
           
          </div>

          <div class="col-lg-4">
            <div class="form-group">
              <elements-input v-model="projectTask.expectedfinishedDate" :label="$t('Earliest Finished Date')" :required="false" id="expected_finished_date"
                :disabled="submitted"  type="date" />
            </div>

          </div>


          <div class="col-lg-4">
            <div class="form-group">
              <elements-input v-model="projectTask.estimatedTime" :label="$t('Estimated Time (hrs) ')" :required="false" id="estimated_time"
                :disabled="submitted"  type="number" />
            </div>
           
          </div>

          <div class="col-lg-4">
            <div class="form-group">
              <elements-input v-model="projectTask.spendTime" :label="$t('Spent Time (hrs) ')" :required="false" id="spend_time"
                :disabled="submitted"  type="number" />
            </div>
           
          </div>


          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-multiselect
                v-model="projectTask.priority"
                :options="priorityOptions"
                label="text"
                :key="projectTask.priority"
                track-by="value"
                :textLabel="$t('Priority')"
                :required="true"
              />
              
            </div>
          </div>


          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-multiselect
                v-model="projectTask.employeeId"
                :options="managers"
                label="text"
                :key="projectTask.employeeId"
                track-by="value"
                :textLabel="$t('Assignee')"
                :required="true"
              />
              
            </div>
          </div>
        
        
  

        </div>
      </div>
    </div>

    <div class="form-group text-right mt-3">
      <submittal-button
        @click="store()"
        :isLoading="isLoading"
        :buttonName="$t('Save')"
      />
    </div>
  </div>
</template>