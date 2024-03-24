<script setup lang="ts">
import { ref, reactive } from "vue";
import {
  TeamCreateRequest,
  teamUpdateRequest,
  teamShowRequest,
} from "~/utils/apiRequests";
import { useLayoutStore } from "~/store/layout";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";

const { router, Toast } = commonCode(),
  { t } = useI18n(),
  state = reactive({
    isLoading: false,
    submitted: false,
    name: "",
    departmentId: "",
    teamLeadId: "",
    teamMembers: [],
    groups: [],
  }),
  emit = defineEmits(["detailsDone"]),
  teamId = ref(""),
  teamLeads:any=ref([]),
  teamMatesArray:any=ref([]),
  validationRules = {
    name: { required },
  },
  v$ = useVuelidate(validationRules, state);

const rows = ref([]);
const props = defineProps({
  departments: {
    type: Array,
    default: [],
  },
  leads: {
    type: Array,
    default: [],
  },
  teamId: {
    type: String,
    default: "",
  },
  teamMates: {
    type: Array,
    default: [],
  },
  isUpdate: {
    type: Boolean,
    default: false,
  },
  skillGroups: {
    type: Array,
    default: [],
  },
});

const selectMmebers=(event:any)=>{
  state.teamMembers=[];
  teamMatesArray.value=props.teamMates;
  let newMembers=teamMatesArray.value.filter((item:any)=>item.value !== event);
  teamMatesArray.value=newMembers;
}

watch(
  () => props.teamMates,
  () => {
   teamLeads.value=[...props.teamMates];
  
  }
);


const showTeam = () => {
  teamShowRequest(props.teamId).then((response) => {
    const {name,departmentId,teamLeadId,skillGroups,teamMembers}= response?.data;
    state.name = name;
    state.departmentId =departmentId;
    state.teamLeadId = teamLeadId;
    
    state.groups = skillGroups;
   teamMatesArray.value=props.teamMates;
   let newMembers=teamMatesArray.value.filter((item:any)=>item.value !== state.teamLeadId);
   teamMatesArray.value=newMembers;

   state.teamMembers = teamMembers;
  });
};

const refresh = () => {
  if (router.params.id) {
    showTeam();
  }
};

refresh();

const store = () => {
  v$.value.$touch();
  if (v$.value.$invalid) {
    state.submitted = false;
    return false;
  } else {
    try {
      state.isLoading = true;
      if (props.isUpdate == true) {
        updateTeam();
      } else {
        createTeam();
      }
    } catch (e) {
      Toast.fire({ title: t("Error!"), text: t("Error"), icon: "error" });
      state.isLoading = false;
      state.submitted = false;
    }
  }
};


const updateTeam = () => {
  const layout = useLayoutStore();
  layout.changeLoaderValue(true);
  teamUpdateRequest(
    {
      name: state.name,
      departmentId: state.departmentId,
      teamLeadId: state.teamLeadId,
      teamMembers: state.teamMembers,
      skillGroups: state.groups,
    },
    props.teamId
  )
    .then((response) => {
      layout.changeLoaderValue(false);
      Toast.fire({
        icon: "success",
        title: t("Record updated successfully!"),
      });
      state.isLoading = false;
      state.submitted = false;
      emit("teamDone");
    })
    .catch((error) => {
      state.isLoading = false;
      state.submitted = false;
      Toast.fire({ icon: "error", title: t("something went wrong!") });
    })
    .finally(() => {
      layout.changeLoaderValue(false);
    });
};

const createTeam = () => {
  const layout = useLayoutStore();
  layout.changeLoaderValue(true);
  TeamCreateRequest({
    name: state.name,
    departmentId: state.departmentId,
    teamLeadId: state.teamLeadId,
    teamMembers: state.teamMembers,
    skillGroups: state.groups,
  })
    .then((response) => {
      layout.changeLoaderValue(false);
      Toast.fire({
        icon: "success",
        title: t("Record created successfully!"),
      });
      teamId.value = response?.data?.id;
      emit("teamDone");

      state.isLoading = false;
      state.submitted = false;
    })
    .catch((error) => {
      state.isLoading = false;
      state.submitted = false;
      Toast.fire({ icon: "error", title: t("something went wrong!") });
    })
    .finally(() => {
      layout.changeLoaderValue(false);
    });
};
</script>
<template>
  <div>
    <div class="card product-type">
      <div class="card-header d-flex align-items-center">
        <h3 class="card-title me-2">{{ $t("Fill Team Details") }}</h3>
        <elements-tooltip />
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"
                    ><elements-icon v-bind:icon="'userIcon'"
                  /></span>
                </div>
                <elements-input
                  v-model="state.name"
                  :label="$t('Name')"
                  :required="true"
                  id="name"
                  :disabled="state.submitted"
                  :class="{ 'is-invalid': v$.name.$error }"
                />
              </div>
            </div>
            <div v-if="v$.name.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.name.required">{{
                $t("This value is required")
              }}</span
              ><br />
            </div>
          </div>
          <div class="col-lg-6"></div>
          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <elements-multiselect
                v-model="state.departmentId"
                :options="departments"
                label="text"
                :key="state.departmentId"
                track-by="value"
                :textLabel="$t('Department')"
                :required="false"
               
              />
            </div>
          </div>
      
   
          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <elements-multiselect
                v-model="state.teamLeadId"
                :options="teamLeads"
                label="text"
                :key="state.teamLeadId"
                track-by="value"
                :textLabel="$t('Team Lead')"
                :required="false"
                @select="selectMmebers"
              />
            </div>
          </div>
          
          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <elements-multiselect
                v-model="state.teamMembers"
                :options="teamMatesArray"
                label="text"
                track-by="value"
                :key="state.teamMembers"
                :textLabel="$t('Team Memebrs')"
                :required="false"
                :multiple="true"
              />
            </div>
          </div>

          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <elements-multiselect
                v-model="state.groups"
                :options="skillGroups"
                label="text"
                track-by="value"
                :key="state.groups"
                :textLabel="$t('Skill Groups')"
                :required="false"
                :multiple="true"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="d-flex align-items-center justify-content-end mt-3">
      <button class="primary-btn me-3"  @click="navigateTo('/personal-management/teams/')">
              <elements-icon v-bind:icon="'cancelIcon'" class="me-2"/>
              <span>{{ $t("Cancel") }}</span>
          </button>
  
       <submittal-button
        @click="store()"
        :isLoading="state.isLoading"
        :icon-name="'saveIcon'"
        :buttonName="$t('Save and Proceed')"
      />
    </div>
  </div>
</template>
