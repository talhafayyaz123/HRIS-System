<script setup lang="ts">
import genericFunctionality from "~/composables/genericFunctionality";
import { routes } from "~/utils/apiRoutes";
import { MdEditor } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import genericFeatures from "~/composables/generic";
import moment from 'moment';
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
  projectDetail = reactive({
    isInternalProject:false,
    name : "",
    number : "",
    status : 'new',
    customerId :"",
    description : "", 
    managerId :"",
    estimatedTime:0,
    neededTime :0,
    plannedStartDate :"",
    plannedFinishedDate :"",
    actualStartDate  :"",
    actualFinishedDate  :"",
    earliestStartDate  :"",
    expectedfinishedDate  :""
  }),
  currentPage = ref(1),
  order = ref("asc"),
  column = ref("id"),
  customers=ref([]),
  managers=ref([]),
  validationRules = {
    name: { required },
    managerId: { required },
    customerId: { required },
  },
  startDateError:any=ref('') ,
  endtDateError:any=ref('') ,
  actualStartDateError:any=ref(''),
  actualEndtDateError:any=ref('') ,
  earliestStartDateError:any=ref(''),
  earliestEndDateError:any=ref('') ,
  saveBtnDisabled=ref(false),
  statusOptions = [
    { value: 'new',text:'New' },
    { value: 'done' ,text:'Done'},
    { value: 'in-work' ,text:'In Work'},
    { value: 'in-review' ,text:'In Review'},
    { value: 'blocked' ,text:'Blocked'},
  ],
  v$ = useVuelidate(validationRules, projectDetail);

const props = defineProps({
  projectId: {
    type: String,
    default: "",
  },
  isUpdate: {
    type: Boolean,
    default: false,
  },
});

async function  refresh()  {

  apiRoute.value = routes.PROJECT_DETAIL;
  if (router.params.id) {

    let response = await showFunc(props.projectId)
    if(response?.success){
      const record = data.value;

      const {name,status,customer_id,description,estimated_time,needed_time,
      planned_start_date,planned_finished_date,actual_start_date,actual_finished_date,earliest_start_date,
      expected_finished_date,manager_id,number,is_internal_project}= response?.data;
    
      projectDetail.name = name;
      projectDetail.number = number;
      projectDetail.status = status;
      projectDetail.customerId = customer_id;
      projectDetail.description = description;
      projectDetail.estimatedTime = estimated_time;
      projectDetail.neededTime = needed_time;
      projectDetail.plannedStartDate = planned_start_date;
      projectDetail.plannedFinishedDate = planned_finished_date;
      projectDetail.actualStartDate = actual_start_date;
      projectDetail.actualFinishedDate = actual_finished_date;
      projectDetail.earliestStartDate = earliest_start_date;
      projectDetail.expectedfinishedDate = expected_finished_date;
      projectDetail.managerId = manager_id;
      projectDetail.isInternalProject=is_internal_project;
    
    }
  }

   showGenericListing(routes.COMPANY).then((response:any) => {
    customers.value = response?.data?.customers.map((customer: any) => {
      return {
        text: customer.name,
        value: customer.id,
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


 const checkStartDate=(type:string)=> {
   
    var startDateValue = ''; 
    var endDateValue = ''; 
    var startDateDisplayName = '' 
    var endDateDisplayhName =''
    var isError='';

    if(type==='planned'){
     startDateValue = projectDetail.plannedStartDate 
     endDateValue = projectDetail.plannedFinishedDate 
     startDateDisplayName = 'Planned Start Date' 
     endDateDisplayhName ='Planned Finished Date'
     isError=startDateError;
    }else if (type==='actual'){
     startDateValue = projectDetail.actualStartDate 
     endDateValue = projectDetail.actualFinishedDate 
     startDateDisplayName = 'Actual Start Date' 
     endDateDisplayhName ='Actual Finished Date '
     isError=actualStartDateError;
    }else if(type==='earliest'){
      startDateValue = projectDetail.earliestStartDate 
     endDateValue = projectDetail.expectedfinishedDate 
     startDateDisplayName = 'Earliest Start Date' 
     endDateDisplayhName ='Earliest Finished Date '
     isError=earliestStartDateError;
    }

    if(endDateValue){
      isError.value = moment(startDateValue).isBefore(endDateValue, 'day') ? true : `${startDateDisplayName} must be before ${endDateDisplayhName}`
    if(isError.value==true){
      saveBtnDisabled.value=false;
    }else{
      saveBtnDisabled.value=true;
    }
    }
    

   
  };


  const checkEndDate=(type:string)=> {
    
    var startDateValue = ''; 
    var endDateValue = ''; 
    var startDateDisplayName = '';
    var endDateDisplayhName =''; 
    var isError:any='';


    if(type==='planned'){
      startDateValue = projectDetail.plannedStartDate 
      endDateValue = projectDetail.plannedFinishedDate 
      startDateDisplayName = 'Planned Start Date'
      endDateDisplayhName ='Planned Finished Date' 
      isError=endtDateError;
    }else if(type==='actual') {
      startDateValue = projectDetail.actualStartDate 
      endDateValue = projectDetail.actualFinishedDate 
      startDateDisplayName = 'Actual Start Date'
      endDateDisplayhName ='Actual Finished Date' 
      isError=actualEndtDateError;
    }else if(type==='earliest'){
      startDateValue = projectDetail.earliestStartDate 
     endDateValue = projectDetail.expectedfinishedDate 
     startDateDisplayName = 'Earliest Start Date' 
     endDateDisplayhName ='Earliest Finished Date '
     isError=earliestEndDateError;
    }  

      isError.value = moment(endDateValue).isAfter(startDateValue, 'day') ? true : `${endDateDisplayhName} must be after ${startDateDisplayName}`
    if(isError.value==true){
      saveBtnDisabled.value=false;
    }else{
      saveBtnDisabled.value=true;
    }
  
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
        updateProject();
      } else {
        createProject();
      }
    } catch (e) {
      Toast.fire({ title: t("Error!"), text: t("Error"), icon: "error" });
      isLoading.value = false;
      submitted.value = false;
    }
  }
};

const updateProject = () => {
  const payLoad = {
    name: projectDetail.name,
    status : projectDetail.status,
    customer_id :projectDetail.customerId,
    description : projectDetail.description,
    manager_id :projectDetail.managerId,
    estimated_time:projectDetail.estimatedTime,
    needed_time :projectDetail.neededTime,
    planned_start_date :projectDetail.plannedStartDate,
    planned_finished_date :projectDetail.plannedFinishedDate,
    actual_start_date  :projectDetail.actualStartDate,
    actual_finished_date  :projectDetail.actualFinishedDate,
    earliest_start_date  :projectDetail.earliestStartDate,
    expected_finished_date  :projectDetail.expectedfinishedDate,
    is_internal_project  :projectDetail.isInternalProject,
  };
 
  updateFunc(payLoad,props.projectId, "/project-management/projects");
};

const createProject = () => {
  const payLoad = {
    name: projectDetail.name,
    status : projectDetail.status,
    customer_id :projectDetail.customerId,
    description : projectDetail.description,
    manager_id :projectDetail.managerId,
    estimated_time:projectDetail.estimatedTime,
    needed_time :projectDetail.neededTime,
    planned_start_date :projectDetail.plannedStartDate,
    planned_finished_date :projectDetail.plannedFinishedDate,
    actual_start_date  :projectDetail.actualStartDate,
    actual_finished_date  :projectDetail.actualFinishedDate,
    earliest_start_date  :projectDetail.earliestStartDate,
    expected_finished_date  :projectDetail.expectedfinishedDate,
    is_internal_project  :projectDetail.isInternalProject,
  };

    storeFunc(payLoad, "/project-management/projects");
};
</script>
<template>
  <div>
    <div class="card product-type">
      <div class="card-header">
        <h3 class="card-title">Fill Project Details</h3>
      </div>
   
      <div class="card-body">
        <div class="row">


          <div class="col-lg-12 col-md-12">
            <div class="form-group">
              <div class="form-group d-flex align-items-center">
                    <label class="me-2" for="">Internal Project:</label>
                    <input type="checkbox" id="checkbox" v-model="projectDetail.isInternalProject" />
                  </div>
            </div>
          </div>


          <div class="col-lg-4 col-md-4" v-if="props.isUpdate">
            <div class="form-group">
              <elements-input
                v-model="projectDetail.number"
                :label="$t('Number')"
                :required="true"
                id="number"
                :disabled="submitted"
                :readonly="true"
              />
            
            </div>
          </div>


          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-input
                v-model="projectDetail.name"
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
                v-model="projectDetail.status"
                :options="statusOptions"
                label="text"
                :key="projectDetail.status"
                track-by="value"
                :textLabel="$t('Status')"
                :required="true"
              />
              
            </div>
          </div>

    
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-multiselect
                v-model="projectDetail.customerId"
                :options="customers"
                label="text"
                :key="projectDetail.customerId"
                track-by="value"
                :textLabel="$t('Customer')"
                :required="true"
                :class="{ 'is-invalid': v$.customerId.$error }"
              />
              <div v-if="v$.customerId.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.customerId.required">{{
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
                v-model="projectDetail.description"
              />
            </div>
          </div>
 
          <div class="col-lg-4">
            <div class="form-group">
              <elements-input v-model="projectDetail.plannedStartDate" :label="$t('Planned Start Date')" :required="false" id="planned_start_date"
                :disabled="submitted"  type="date" @change="checkStartDate('planned')"/>
            </div>
            <div v-if="startDateError !=true" class="invalid-feedback">
                <span class="text-danger">{{
                 startDateError
                }}</span
                ><br />
              </div>
          </div>

          <div class="col-lg-4">
            <div class="form-group">
              <elements-input v-model="projectDetail.plannedFinishedDate" :label="$t('Planned Finished Date')" :required="false" id="planned_finished_date"
                :disabled="submitted"  type="date" @change="checkEndDate('planned')" />
            </div>
            <div v-if="endtDateError !=true" class="invalid-feedback">
                <span class="text-danger">{{
                 endtDateError
                }}</span
                ><br />
              </div>
          </div>


          <div class="col-lg-4">
            <div class="form-group">
              <elements-input v-model="projectDetail.actualStartDate" :label="$t('Actual Start Date')" :required="false" id="actual_start_date"
                :disabled="submitted"  type="date" @change="checkStartDate('actual')"/>
            </div>
            <div v-if="actualStartDateError !=true" class="invalid-feedback">
                <span class="text-danger">{{
                 actualStartDateError
                }}</span
                ><br />
              </div>
          </div>


          <div class="col-lg-4">
            <div class="form-group">
              <elements-input v-model="projectDetail.actualFinishedDate" :label="$t('Actual Finished Date')" :required="false" id="actual_finished_date"
                :disabled="submitted"  type="date" @change="checkEndDate('actual')"/>
            </div>
            <div v-if="actualEndtDateError !=true" class="invalid-feedback">
                <span class="text-danger">{{
                 actualEndtDateError
                }}</span
                ><br />
              </div>
          </div>


          <div class="col-lg-4">
            <div class="form-group">
              <elements-input v-model="projectDetail.earliestStartDate" :label="$t('Earliest Start Date')" :required="false" id="earliest_start_date"
                :disabled="submitted"  type="date"  @change="checkStartDate('earliest')"/>
            </div>

            <div v-if="earliestStartDateError !=true" class="invalid-feedback">
                <span class="text-danger">{{
                 earliestStartDateError
                }}</span
                ><br />
              </div>
           
          </div>

          <div class="col-lg-4">
            <div class="form-group">
              <elements-input v-model="projectDetail.expectedfinishedDate" :label="$t('Earliest Finished Date')" :required="false" id="expected_finished_date"
                :disabled="submitted"  type="date"  @change="checkEndDate('earliest')"/>
            </div>

            <div v-if="earliestEndDateError !=true" class="invalid-feedback">
                <span class="text-danger">{{
                 earliestEndDateError
                }}</span
                ><br />
              </div>

          </div>
  
          
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-multiselect
                v-model="projectDetail.managerId"
                :options="managers"
                label="text"
                :key="projectDetail.managerId"
                track-by="value"
                :textLabel="$t('Manager')"
                :required="true"
                :class="{ 'is-invalid': v$.managerId.$error }"
              />
              <div v-if="v$.managerId.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.managerId.required">{{
                  $t("This value is required")
                }}</span
                ><br />
              </div>
            </div>
          </div>
    

          <div class="col-lg-4">
            <div class="form-group">
              <elements-input v-model="projectDetail.estimatedTime" :label="$t('Estimated Time (hrs) ')" :required="false" id="estimated_time"
                :disabled="submitted"  type="number" />
            </div>
           
          </div>

          <div class="col-lg-4">
            <div class="form-group">
              <elements-input v-model="projectDetail.neededTime" :label="$t('Needed Time (hrs) ')" :required="false" id="needed_time"
                :disabled="submitted"  type="number" />
            </div>
           
          </div>


        </div>
      </div>
    </div>

    <div class="form-group text-right mt-3">
      <submittal-button
        @click="store()"
        :isLoading="isLoading"
        :disabled="saveBtnDisabled"
        :buttonName="$t('Save')"
      />
    </div>
  </div>
</template>