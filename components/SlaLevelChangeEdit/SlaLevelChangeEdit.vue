<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import commonCode from "~/composables/common";
import {
  getSingleSlaLevelRequest,
  updateSlaLevelRequest,
} from "~/utils/apiRequests";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
const { router, Toast, deleteAlert } = commonCode();
const { t } = useI18n();

const props = defineProps(["showModal", "hideModal", "recordId"]);
const emits = defineEmits(["refresh"]);
// form states
const stateChange = reactive({
  isLoading: false,
  name: "",
  priority: "",
  reactionTime: null,
  factor: null,
});

const priorityOption = [
  { value: "0", text: "Urgent" },
  { value: "1", text: "High" },
  { value: "2", text: "Middle" },
];

const validationRules = {
  name: { required },
  priority: { required },
  reactionTime: { required },
  factor: { required },
};
const v$ = useVuelidate(validationRules, stateChange);

onMounted(async function () {
  try {
    if (!props.recordId) {
      return;
    }
    const res = await getSingleSlaLevelRequest(props.recordId);
    const { name, priority, reactionTime, factor } = res.data;
    stateChange.name = name;
    stateChange.priority = priority;
    stateChange.reactionTime = reactionTime;
    stateChange.factor = factor;
  } catch (e) {
    console.log(e);
  }
});

async function editSlaLevelHandler() {
  v$.value.$touch();
  if (v$.value.$invalid) {
    return;
  } else {
    try {
      stateChange.isLoading = true;
      const formData = {
        name: stateChange.name,
        priority: stateChange.priority,
        reactionTime: stateChange.reactionTime,
        factor: stateChange.factor,
        type: "change",
      };
      await updateSlaLevelRequest(formData, props.recordId);

      Toast.fire({
        title: "Record updated successfully!",
        icon: "success",
      });
      stateChange.isLoading = false;
      emits("refresh");
      props.hideModal();
    } catch (e) {
      Toast.fire({ title: t("Error!"), text: t("Error"), icon: "error" });
      stateChange.isLoading = false;
    }
  }
}
</script>

<template>
  <Modal
    :showModal="props.showModal"
    @hideModal="props.hideModal"
    :title="`Edit Change`"
  >
    <div class="row mt-4">
      <div class="col-lg-6 col-md-6 col-sm-12">
        <div class="form-group">
          <elements-input
            v-model="stateChange.name"
            :label="$t('Name')"
            :required="true"
            id="name"
            :disabled="stateChange.isLoading"
            :class="{ 'is-invalid': v$.name.$error }"
          />
          <div v-if="v$.name.$error" class="invalid-feedback">
            <span class="text-danger" v-if="v$.name.required">{{
              $t("This value is required")
            }}</span>
          </div>
        </div>
      </div>
      <div class="col-lg-6 col-md-6 col-sm-12">
        <div class="form-group">
          <elements-multiselect
            v-model="stateChange.priority"
            :options="priorityOption"
            :key="stateChange.priority"
            label="text"
            track-by="value"
            :textLabel="$t('Priority')"
            :required="true"
            :class="{ 'is-invalid': v$.priority.$error }"
          />
          <div v-if="v$.priority.$error" class="invalid-feedback">
            <span class="text-danger" v-if="v$.priority.required">{{
              $t("This value is required")
            }}</span
            ><br />
          </div>
        </div>
      </div>
      <div class="col-lg-6 col-md-6 col-sm-12">
        <div class="form-group">
          <elements-input
            v-model="stateChange.reactionTime"
            :label="$t('Reaction Time')"
            :required="true"
            id="reactionTime"
            :disabled="stateChange.isLoading"
            :class="{ 'is-invalid': v$.reactionTime.$error }"
            type="number"
          />
          <div v-if="v$.reactionTime.$error" class="invalid-feedback">
            <span class="text-danger" v-if="v$.reactionTime.required">{{
              $t("This value is required")
            }}</span>
          </div>
        </div>
      </div>

      <div class="col-lg-6 col-md-6 col-sm-12">
        <div class="form-group">
          <elements-input
            v-model="stateChange.factor"
            :label="$t('Factor')"
            :required="true"
            id="factor"
            :disabled="stateChange.isLoading"
            :class="{ 'is-invalid': v$.factor.$error }"
            type="number"
          />
          <div v-if="v$.factor.$error" class="invalid-feedback">
            <span class="text-danger" v-if="v$.factor.required">{{
              $t("This value is required")
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="d-flex align-items-center justify-content-end">
      <button
        type="button"
        class="primary-btn me-2"
        data-bs-dismiss="modal"
        @click="() => props.hideModal()"
      >
        Close
      </button>
      <submittal-button :buttonName="$t('Save')" @click="editSlaLevelHandler" />
    </div>
  </Modal>
</template>
