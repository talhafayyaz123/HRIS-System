<script setup lang="ts">
import genericFunctionality from "~/composables/genericFunctionality";
import { routes } from "~/utils/apiRoutes";
import { MdEditor } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import { useLayoutStore } from "~/store/layout";
import genericFeatures from "~/composables/generic";

const { apiRoute, data, showFunc, storeFunc, updateFunc, submitted, isLoading } =
  genericFunctionality();

import { ref, reactive } from "vue";

import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";

const { router, Toast } = commonCode(),

  { t } = useI18n(),
  skill = reactive({
    name: "",
    description: "",
    level: "",
    isRequired: false,
  }),
  currentPage = ref(1),
  order = ref("asc"),
  column = ref("id"),

  validationRules = {
    name: { required },
    description: { required },
    level: { required },
  },
  options = [
    { value: '1' },
    { value: '2' },
    { value: '3' },
    { value: '4' },
  ],
  v$ = useVuelidate(validationRules, skill);

const props = defineProps({
  skilId: {
    type: String,
    default: "",
  },
  isUpdate: {
    type: Boolean,
    default: false,
  },
});


async function refresh() {
  
  const layout = useLayoutStore();
  layout.changeLoaderValue(true);
  apiRoute.value = routes.SKILL;
  if (router.params.id) {
    let response = await showFunc(props.skilId)
    if (response?.success) {
      const { name, description, level, isRequired } = response?.data;
      skill.name = name;
      skill.description = description;
      skill.level = level;
      skill.isRequired = isRequired;
    }
  }
  layout.changeLoaderValue(false);
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
        updateSkill();
      } else {
        createSkill();
      }
    } catch (e) {
      Toast.fire({ title: t("Error!"), text: t("Error"), icon: "error" });
      isLoading.value = false;
      submitted.value = false;
    }
  }
};

const updateSkill = () => {
  const payLoad = {
    name: skill.name,
    description: skill.description,
    level: skill.level,
    isRequired: skill.isRequired,
  };

  updateFunc(payLoad, props.skilId, "/skill-management/skill");
};

const createSkill = () => {
  const payLoad = {
    name: skill.name,
    description: skill.description,
    level: skill.level,
    isRequired: skill.isRequired,
  };
  storeFunc(payLoad, "/skill-management/skill");
};
</script>
<template>
  <div>
    <div class="card product-type">
      <div class="card-header d-flex align-items-center">
        <h3 class="card-title me-2">{{ $t("Fill Skill Details") }}</h3>
        <ElementsTooltip />
      </div>


      <div class="card-body">
        <div class="row">
          <div class="col-lg-12 col-md-12">
            <div class="form-group">
              
              <elements-input v-model="skill.name" :label="$t('Name')" :required="true" id="name" :disabled="submitted"
                :class="{ 'is-invalid': v$.name.$error }" />

            </div>
            <div v-if="v$.name.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.name.required">{{
                $t("This value is required")
              }}</span><br />
            </div>
          </div>
          <div class="col-lg-12">
            <div class="form-group">
              <MdEditor :preview="false" :style="'height:300px;'" :language="'en-US'" v-model="skill.description"
                :class="{ 'is-invalid': v$.description.$error }" placeholder="Description" />

            </div>
            <div v-if="v$.description.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.description.required">{{
                $t("This value is required")
              }}</span><br />
            </div>
          </div>
          

          

        </div>
        <div class="row align-items-center">
          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <elements-multiselect v-model="skill.level" :options="options" label="value" :key="skill.level"
                track-by="value" :textLabel="$t('Level')" :required="true" :class="{ 'is-invalid': v$.level.$error }" />
              <div v-if="v$.level.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.level.required">{{
                  $t("This value is required")
                }}</span><br />
              </div>
            </div>
          </div>
          <div class="col-lg-6 col-md-6">
              <div class="form-group checkbox-group">
                <input class="checkbox-input" type="checkbox" id="check" v-model="skill.isRequired" />
                <label class="checkbox-label" for="check">Is Required</label>
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