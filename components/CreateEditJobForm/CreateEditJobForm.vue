<script setup lang="ts">
import genericFunctionality from "~/composables/genericFunctionality";
import { routes } from "~/utils/apiRoutes";
import { useLayoutStore } from "~/store/layout";
import genericFeatures from "~/composables/generic";



  
const {
  apiRoute,
  data,
  showFunc,
  storeFunc,
  updateFunc,
  isLoading,
  submitted,
} = genericFunctionality();

import { ref, reactive } from "vue";

import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";

const { router, Toast } = commonCode();
const { showGenericListing } = genericFeatures(),
  { t } = useI18n(),
  job = reactive({
    title: "",
    contractTypeId: "",
    jobLevelId: "",
    coreFunction: "",
    qualification: "",
    description: "",
    skillGroups: [],
  }),
  currentPage = ref(1),
  order = ref("asc"),
  column = ref("id"),
  contractTypes = ref([]),
  skillGroups = ref([]),
  jobLevels = ref([]),
  validationRules = {
    title: { required },
    contractTypeId: { required },
    skillGroups: { required },
    jobLevelId: { required },
    coreFunction: { required },
    qualification: { required },
    description: { required },
  },
  v$ = useVuelidate(validationRules, job);

const props = defineProps({
  jobId: {
    type: String,
    default: "",
  },
  isUpdate: {
    type: Boolean,
    default: false,
  },
});

async function refresh() {
  apiRoute.value = routes.JOB;
  const layout = useLayoutStore();
  layout.changeLoaderValue(true);
  if (router.params.id) {
    let response = await showFunc(props.jobId);
    if (response?.success) {
      const record = data.value;

      const {
        title,
        contractType,
        jobLevel,
        coreFunction,
        qualification,
        description,
        skillGroups,
      } = response?.data;

      job.title = title;
      job.contractTypeId = contractType;
      job.jobLevelId = jobLevel;
      job.coreFunction = coreFunction;
      job.qualification = qualification;
      job.description = description;
      job.skillGroups = skillGroups;
    }
  }

  showGenericListing(routes.FORM_OF_CONTRACT).then((response: any) => {
    contractTypes.value = response?.data?.formOfContracts.map(
      (contract: any) => {
        return {
          text: contract.name,
          value: contract.id,
        };
      }
    );
  });

  showGenericListing(routes.SKILL_GROUPS).then((response: any) => {
    skillGroups.value = response?.data?.skillGroups.map((group: any) => {
      return {
        text: group.name,
        value: group.id,
      };
    });
  });

  showGenericListing(routes.JOB_LEVEL).then((response: any) => {
    jobLevels.value = response?.data?.JobLevels.map((level: any) => {
      
      return {
        text: level.levelName,
        value: level.id,
      };
    })
  }).finally(() => {
      layout.changeLoaderValue(false);
    });
}

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
        updateJob();
      } else {
        createJob();
      }
    } catch (e) {
      Toast.fire({ title: t("Error!"), text: t("Error"), icon: "error" });
      isLoading.value = false;
      submitted.value = false;
    }
  }
};

const updateJob = () => {
  const payLoad = {
    title: job.title,
    contractTypeId: job.contractTypeId,
    jobLevelId: job.jobLevelId,
    coreFunction: job.coreFunction,
    qualification: job.qualification,
    description: job.description,
    skillGroups: job.skillGroups,
  };
  updateFunc(payLoad, props.jobId, "/personal-management/job");
};

const createJob = () => {
  const payLoad = {
    title: job.title,
    contractTypeId: job.contractTypeId,
    jobLevelId: job.jobLevelId,
    coreFunction: job.coreFunction,
    qualification: job.qualification,
    description: job.description,
    skillGroups: job.skillGroups,
  };
  storeFunc(payLoad, "/personal-management/job");
};
</script>
<template>
  <div>
    <div class="card product-type">
      <div class="card-header d-flex align-items-center">
        <h3 class="card-title me-2">{{ $t("Fill Job Details") }}</h3>
        <elements-tooltip />
      </div>

      <div class="card-body">
        <div class="row">
          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <elements-input
                v-model="job.title"
                :label="$t('Name')"
                :required="true"
                id="name"
                :disabled="submitted"
                :class="{ 'is-invalid': v$.title.$error }"
              />
            </div>
            <div v-if="v$.title.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.title.required">{{
                $t("This value is required")
              }}</span
              ><br />
            </div>
          </div>

          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <elements-multiselect
                v-model="job.contractTypeId"
                :options="contractTypes"
                label="text"
                :key="job.contractTypeId"
                track-by="value"
                :textLabel="$t('Contract Type')"
                :required="true"
                :class="{ 'is-invalid': v$.contractTypeId.$error }"
              />
            </div>
            <div v-if="v$.contractTypeId.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.contractTypeId.required">{{
                $t("This value is required")
              }}</span
              ><br />
            </div>
          </div>

          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <elements-multiselect
                v-model="job.skillGroups"
                :options="skillGroups"
                label="text"
                :key="job.skillGroups"
                track-by="value"
                :textLabel="$t('Skill Groups')"
                :required="true"
                :multiple="true"
                :class="{ 'is-invalid': v$.skillGroups.$error }"
              />
            </div>
            <div v-if="v$.skillGroups.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.skillGroups.required">{{
                $t("This value is required")
              }}</span
              ><br />
            </div>
          </div>

          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <elements-multiselect
                v-model="job.jobLevelId"
                :options="jobLevels"
                label="text"
                :key="job.jobLevelId"
                track-by="value"
                :textLabel="$t('Job Level')"
                :required="true"
                :class="{ 'is-invalid': v$.jobLevelId.$error }"
              />
            </div>
            <div v-if="v$.jobLevelId.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.jobLevelId.required">{{
                $t("This value is required")
              }}</span
              ><br />
            </div>
          </div>
          
          <div class="col-lg-6 col-md-6">
            <div class="form-group textarea">
              <label for="" class="input-label">Core Functions<span style="color: red;">*</span></label>
              <textarea
                v-model="job.coreFunction"
                :required="true"
                cols="30"
                rows="10"
                class="form-control"
                placeholder="."
                :class="{ 'is-invalid': v$.coreFunction.$error }"
              ></textarea>
            </div>
            <div v-if="v$.coreFunction.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.coreFunction.required">{{
                $t("This value is required")
              }}</span
              ><br />
            </div>
          </div>

          <div class="col-lg-6 col-md-6">
            <div class="form-group textarea">
              <textarea
                v-model="job.qualification"
                :required="true"
                cols="30"
                rows="10"
                class="form-control"
                placeholder="."
                :class="{ 'is-invalid': v$.qualification.$error }"
              ></textarea>

              <label for="" class="input-label">Qualifications<span style="color: red;">*</span></label>
            </div>
            <div v-if="v$.qualification.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.qualification.required">{{
                $t("This value is required")
              }}</span
              ><br />
            </div>
          </div>

          <div class="col-lg-12 col-md-6">
            <div class="form-group textarea">
              <textarea
                v-model="job.description"
                :required="true"
                cols="30"
                rows="10"
                class="form-control"
                placeholder="."
                :class="{ 'is-invalid': v$.description.$error }"
              ></textarea>

              <label for="" class="input-label">Description<span style="color: red;">*</span></label>
            </div>
            <div v-if="v$.description.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.description.required">{{
                $t("This value is required")
              }}</span
              ><br />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="d-flex align-items-center justify-content-end mt-3">
      <submittal-button
        @click="store()"
        :isLoading="isLoading"
        :icon-name="'saveIcon'"
        :buttonName="$t('Save and Proceed')"
      />
    </div>
  </div>
</template>
