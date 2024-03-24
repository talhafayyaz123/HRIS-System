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
  projectDetail = reactive({
    name : "",
    status : 'new',
    description : "", 
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
  validationRules = {
    name: { required },
    plannedStartDate: { required },
  },


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
  mileStoneId: {
    type: String,
    default: "",
  },
  isUpdate: {
    type: Boolean,
    default: false,
  },
});

async function  refresh()  {

  apiRoute.value = routes.PROJECT_MILESTONE;
  if (props.mileStoneId) {

     let response = await showFunc(props.mileStoneId)
    if(response?.success){
      const record = data.value;

      const {name,status,description,
      planned_start_date,planned_finished_date,actual_start_date,actual_finished_date,earliest_start_date,
      expected_finished_date}= response?.data;
    
      projectDetail.name = name;
      projectDetail.status = status;
      projectDetail.description = description;
      projectDetail.plannedStartDate = planned_start_date;
      projectDetail.plannedFinishedDate = planned_finished_date;
      projectDetail.actualStartDate = actual_start_date;
      projectDetail.actualFinishedDate = actual_finished_date;
      projectDetail.earliestStartDate = earliest_start_date;
      projectDetail.expectedfinishedDate = expected_finished_date;
    
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
        updateProjectMileStone();
      } else {
        createProjectMileStone();
      }
    } catch (e) {
      Toast.fire({ title: t("Error!"), text: t("Error"), icon: "error" });
      isLoading.value = false;
      submitted.value = false;
    }
  }
};

const updateProjectMileStone = () => {
   const payLoad = {
    name: projectDetail.name,
    status : projectDetail.status,
    description : projectDetail.description,
    planned_start_date :projectDetail.plannedStartDate,
    planned_finished_date :projectDetail.plannedFinishedDate,
    actual_start_date  :projectDetail.actualStartDate,
    actual_finished_date  :projectDetail.actualFinishedDate,
    earliest_start_date  :projectDetail.earliestStartDate,
    expected_finished_date  :projectDetail.expectedfinishedDate,
    project_id  :props.projectId,
  };

    updateFunc(payLoad,props.mileStoneId,"/project-management/projects/edit-"+props.projectId+'?milestone=1'); 
};

const createProjectMileStone = () => {
  const payLoad = {
    name: projectDetail.name,
    status : projectDetail.status,
    description : projectDetail.description,
    planned_start_date :projectDetail.plannedStartDate,
    planned_finished_date :projectDetail.plannedFinishedDate,
    actual_start_date  :projectDetail.actualStartDate,
    actual_finished_date  :projectDetail.actualFinishedDate,
    earliest_start_date  :projectDetail.earliestStartDate,
    expected_finished_date  :projectDetail.expectedfinishedDate,
    project_id  :props.projectId,
  };

    storeFunc(payLoad, "/project-management/projects/edit-"+props.projectId+'?milestone=1');
};
</script>
<template>
  <div>
    <div class="card product-type">
      <div class="card-header">
        <h3 class="card-title">{{ $t('Fill Project Details') }}</h3>
      </div>
   
      <div class="card-body">
        <div class="row">

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
                :required="false"
              />
              
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
                :disabled="submitted"  type="date" :class="{ 'is-invalid': v$.plannedStartDate.$error }" />
            </div>
            <div v-if="v$.plannedStartDate.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.plannedStartDate.required">{{
                  $t("This value is required")
                }}</span
                ><br />
              </div>
          </div>

          <div class="col-lg-4">
            <div class="form-group">
              <elements-input v-model="projectDetail.plannedFinishedDate" :label="$t('Planned Finished Date')" :required="false" id="planned_finished_date"
                :disabled="submitted"  type="date" />
            </div>
           
          </div>


          <div class="col-lg-4">
            <div class="form-group">
              <elements-input v-model="projectDetail.actualStartDate" :label="$t('Actual Start Date')" :required="false" id="actual_start_date"
                :disabled="submitted"  type="date" />
            </div>
           
          </div>


          <div class="col-lg-4">
            <div class="form-group">
              <elements-input v-model="projectDetail.actualFinishedDate" :label="$t('Actual Finished Date')" :required="false" id="actual_finished_date"
                :disabled="submitted"  type="date" />
            </div>
           
          </div>


          <div class="col-lg-4">
            <div class="form-group">
              <elements-input v-model="projectDetail.earliestStartDate" :label="$t('Earliest Start Date')" :required="false" id="earliest_start_date"
                :disabled="submitted"  type="date" />
            </div>
           
          </div>

          <div class="col-lg-4">
            <div class="form-group">
              <elements-input v-model="projectDetail.expectedfinishedDate" :label="$t('Earliest Finished Date')" :required="false" id="expected_finished_date"
                :disabled="submitted"  type="date" />
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