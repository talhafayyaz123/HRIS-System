<script setup lang="ts">
import genericFunctionality from "~/composables/genericFunctionality";
import { routes } from "~/utils/apiRoutes";
import { MdEditor } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import { useLayoutStore } from "~/store/layout";
import genericFeatures from "~/composables/generic";

const { apiRoute, data, showFunc, storeFunc, updateFunc ,submitted, isLoading} =
  genericFunctionality();

import { ref, reactive , onMounted} from "vue";

import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";

const {showGenericListing } = genericFeatures();
const { router, Toast } = commonCode(),

  { t } = useI18n(),
  state = reactive({
    name: "",
    skills: [],
    jobs: [],
    teams: [],
  }),
  currentPage = ref(1),
  order = ref("asc"),
  column = ref("id"),
  skills=ref([]),
  jobs=ref([]),
  teams=ref([]),
  validationRules = {
    name: { required },
    skills: { required },
  },
  v$ = useVuelidate(validationRules, state);

const props = defineProps({
  skillGroupId: {
    type: String,
    default: "",
  },
  isUpdate: {
    type: Boolean,
    default: false,
  },
});


async function refresh(){
  
  const layout = useLayoutStore();
  layout.changeLoaderValue(true);
  apiRoute.value = routes.SKILL_GROUPS;
   if (router.params.id) {
    
    let response = await showFunc(props.skillGroupId)
    if(response?.success){
      const {name,skills,jobs,teams}= response?.data;
      state.name = name;
      state.skills = skills;
      state.jobs = jobs;
      state.teams = teams;
    }

  } 

  showGenericListing(routes.SKILL).then((response:any) => {
    skills.value = response?.data?.skills.map((skill: any) => {
      return {
        text: skill.name,
        value: skill.id,
      };
    });
  }); 

  showGenericListing(routes.JOB).then((response:any) => {
    jobs.value = response?.data?.jobs.map((job: any) => {
      return {
        text: job.title,
        value: job.id,
      };
    });
  }); 
    
  showGenericListing(routes.TEAM).then((response:any) => {
    teams.value = response?.data?.teams.map((team: any) => {
      return {
        text: team.name,
        value: team.id,
      };
    });
  }).finally(() => {
      layout.changeLoaderValue(false);
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
        updateFunc(state,props.skillGroupId, "/skill-management/skill-group");
      } else {
        storeFunc(state, "/skill-management/skill-group");
      }
    } catch (e) {
      Toast.fire({ title: t("Error!"), text: t("Error"), icon: "error" });
      isLoading.value = false;
      submitted.value = false;
    }
  }
};

</script>
<template>
  <div>
    <div class="card product-type">
      <div class="card-header d-flex align-items-center">
        <h3 class="card-title me-2">{{$t("Fill Skill Group Details")}}</h3>
        <elements-tooltip/>
      </div>

      <div class="card-body">
        <div class="row">
          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <elements-input
                v-model="state.name"
                :label="$t('Name')"
                :required="true"
                id="name"
                :disabled="submitted"
                :class="{ 'is-invalid': v$.name.$error }"
                :max="30"
              /> 
            
            </div>
            <div v-if="v$.name.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.name.required">{{
                  $t("This value is required")
                }}</span
                ><br />
              </div>
          </div>


           <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <elements-multiselect
                v-model="state.skills"
                :options="skills"
                label="text"
                :key="state.skills"
                track-by="value"
                :textLabel="$t('Skills')"
                :required="true"
                :multiple="true"
                :class="{ 'is-invalid': v$.skills.$error }"
              />
              
            </div>
            <div v-if="v$.skills.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.skills.required">{{
                  $t("This value is required")
                }}</span
                ><br />
              </div>
          </div> 


          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <elements-multiselect
                v-model="state.jobs"
                :options="jobs"
                label="text"
                :key="state.jobs"
                track-by="value"
                :textLabel="$t('Jobs')"
                :required="false"
                :multiple="true"
              />
            
            </div>
          </div> 



          <div class="col-lg-6 col-md-6">
            <div class="form-group">
          <elements-multiselect
                v-model="state.teams"
                :options="teams"
                label="text"
                :key="state.teams"
                track-by="value"
                :textLabel="$t('Teams')"
                :required="false"
                :multiple="true"
                
              />
            </div>
          </div>
    

    
        </div>
      </div>
    </div>
    <div class="mt-3 d-flex align-items-center justify-content-end">
      <button class="primary-btn me-3">
            <elements-icon v-bind:icon="'cancelIcon'" class="me-2" />
            <span>{{ $t("Cancel") }}</span>
          </button>
      <submittal-button @click="store()" :isLoading="isLoading" :icon-name="'saveIcon'" :buttonName="$t('Save and Proceed')" />
    </div>
  </div>
</template>