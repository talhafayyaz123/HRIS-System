<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import commonCode from "~/composables/common";
import {
  getSingleSlaInfrastructureRequest,
  updateSlaInfrastructureRequest,
} from "~/utils/apiRequests";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { useLayoutStore } from "~/store/layout";
const { router, Toast, deleteAlert } = commonCode();
const { t } = useI18n();

const props = defineProps(["showModal", "hideModal", "recordId"]);
const emits = defineEmits(["refresh"]);
// form states
const state = reactive({
  name: "",
  isAccess: false,
  includedUser: null,
  additionalUser: null,
  isLoading: false,
});

// form validation
const validationRules = {
  name: { required },
  isAccess: { required },
  includedUser: { required },
  additionalUser: { required },
};
const v$ = useVuelidate(validationRules, state);

onMounted(async function () {
  try {
    if (!props.recordId) {
      return;
    }
    const res = await getSingleSlaInfrastructureRequest(props.recordId);
    const { name, isAccess, includedUser, additionalUser } = res.data;
    state.name = name;
    state.isAccess = isAccess;
    state.includedUser = includedUser;
    state.additionalUser = additionalUser;
  } catch (e) {
    console.log(e);
  }
});

async function editSlaInfrastructureHandler() {
  v$.value.$touch();
  if (v$.value.$invalid) {
    return;
  } else {
    try {
      const layout = useLayoutStore();
      layout.changeLoaderValue(true);
      state.isLoading = true;
      const formData = {
        name: state.name,
        isAccess: state.isAccess,
        includedUser: state.includedUser,
        additionalUser: state.additionalUser,
      };
      await updateSlaInfrastructureRequest(formData, props.recordId);
      layout.changeLoaderValue(false);
      Toast.fire({
        title: "Updated",
        icon: "success",
      });
      state.isLoading = false;
      emits("refresh");
      props.hideModal();
    } catch (e) {
      console.log(e);
      Toast.fire({ title: t("Error!"), text: t("Error"), icon: "error" });
      state.isLoading = false;
    }
    // TODO
    // resetState();
  }
}
</script>

<template>
  <Modal :showModal="props.showModal" @hideModal="props.hideModal" :title="`Edit Infrastructure`">
    <div class="row mt-4">
      <div class="col-lg-6 col-md-6 col-sm-12">
        <div class="form-group">
          <elements-input
            v-model="state.name"
            :label="$t('Name')"
            :required="true"
            id="name"
            :disabled="state.isLoading"
            :class="{ 'is-invalid': v$.name.$error }"
          />
          <div v-if="v$.name.$error" class="invalid-feedback">
            <span class="text-danger" v-if="v$.name.required">{{
              $t("This value is required")
            }}</span>
          </div>
        </div>
      </div>
      <div class="col-lg-6">
        <div class="form-group d-flex align-items-center">
          <label for="" class="me-2">Access</label>
          <input type="checkbox" v-model="state.isAccess" />
        </div>
      </div>
      <div class="col-lg-6">
        <div class="form-group">
          <elements-input
            v-model="state.includedUser"
            :label="$t('Included Users')"
            :required="true"
            id="includedUsers"
            :disabled="state.isLoading"
            :class="{ 'is-invalid': v$.includedUser.$error }"
            type="number"
          />
          <div v-if="v$.includedUser.$error" class="invalid-feedback">
            <span class="text-danger" v-if="v$.includedUser.required">{{
              $t("This value is required")
            }}</span>
          </div>
        </div>
      </div>
      <div class="col-lg-6">
        <div class="form-group">
          <div class="input-group">
            <span class="input-group-text"
              ><i class="fas fa-euro-sign"></i
            ></span>
            <elements-input
              v-model="state.additionalUser"
              :label="$t('Additional User')"
              :required="true"
              id="additionalUser"
              :disabled="state.isLoading"
              :class="{ 'is-invalid': v$.additionalUser.$error }"
              type="number"
            />
          </div>

          <div v-if="v$.additionalUser.$error" class="invalid-feedback">
            <span class="text-danger" v-if="v$.additionalUser.required">{{
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
      <submittal-button
        :buttonName="$t('Save')"
        @click="editSlaInfrastructureHandler"
      />
    </div>
  </Modal>
</template>
