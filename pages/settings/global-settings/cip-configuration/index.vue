<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import {
  docListRequest,
  docSelectedListRequest,
  saveDocRequest,
  saveCipConfigRequest,
  getCipConfigRequest,
  genericListingRequest,
} from "@/utils/apiRequests";
import { routes } from "~/utils/apiRoutes";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
import commonCode from "~/composables/common";
import { useLayoutStore } from "~/store/layout";

import {
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

const { router, Toast } = commonCode();
const { t } = useI18n(),
  breadCrumbsConfig = [
    {
      text: "Global Settings",
      to: "/",
    },
    {
      text: "Global Settings",
      to: "/",
    },
    {
      text: "CIP Configuration",
      to: "/settings/global-settings/cip-configuration",
    },
  ],
  optionalItems = {
    searchBar: false,
    isBtnShow: false,
    btnText: "",
    path: "",
  },
  { title } = useTitle("CIP Configuration"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  state = reactive({
    isLoading: false,
    cipManagerId: "",
    cipQmoId: "",
    boardMembers: [],
  }),
  employeesOptions = ref([]),
  validationRules = {
    cipManagerId: { required },
    cipQmoId: { required },
    boardMembers: { required, minLength: minLength(1) },
  },
  v$ = useVuelidate(validationRules, state);

onMounted(async function () {
  try {
    const layout = useLayoutStore();
    layout.changeLoaderValue(true);
    const res = await genericListingRequest(routes.EMPLOYEE, {
      all: true,
    });
    employeesOptions.value = res?.data?.employees.map((list: any) => {
      return { value: list?.id, text: list?.firstName };
    });
    layout.changeLoaderValue(false);
    const resSelectedCip = await getCipConfigRequest();
    const { cipManagerId, cipQmo, boardMember } = resSelectedCip?.data;
    state.cipManagerId = cipManagerId;
    state.cipQmoId = cipQmo;
    state.boardMembers = boardMember;
  } catch (e) {
    console.log(e);
  }
});

async function cipConfigurationHandler() {
  v$.value.$touch();
  if (v$.value.$invalid) {
    return false;
  } else {
    try {
      const formData = {
        ...(state.cipManagerId && { cipManagerId: state.cipManagerId }),
        ...(state.cipQmoId && { cipQmoId: state.cipQmoId }),
        ...(state.boardMembers && { boardMembers: state.boardMembers }),
      };
      const layout = useLayoutStore();
      layout.changeLoaderValue(true);
      state.isLoading = true;
      await saveCipConfigRequest(formData);
      layout.changeLoaderValue(false);
      Toast.fire({
        title: "Success",
        text: "CIP Configuration record saved",
        icon: "success",
      });
      state.isLoading = false;
    } catch (e) {
      console.log(e);
      Toast.fire({ title: t("Error!"), text: t("Error"), icon: "error" });
      state.isLoading = false;
    }
  }
}

useHead({
  title: title,
});
</script>

<template>
  <div>
    <page-header
      :title="title"
      :items="items"
      :optionalItems="optionalItems"
      @watchEvent="handleSearch"
    />
    <form @submit.prevent="cipConfigurationHandler">
      <div class="card">
        <div class="card-header d-flex align-items-center">
          <h3 class="card-title me-2">{{ $t("CIP Configuration") }}</h3>
          <elements-tooltip />
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-lg-4">
              <div class="form-group">
                <elements-multiselect
                  v-model="state.cipManagerId"
                  :options="employeesOptions"
                  :key="state.cipManagerId"
                  label="text"
                  track-by="value"
                  :textLabel="$t('CIP Manager')"
                  :required="true"
                  :class="{ 'is-invalid': v$.cipManagerId.$error }"
                />

                <div v-if="v$.cipManagerId.$error" class="invalid-feedback">
                  <span class="text-danger" v-if="v$.cipManagerId.required">{{
                    $t("This value is required")
                  }}</span>
                </div>
              </div>
            </div>
            <div class="col-lg-4">
              <div class="form-group">
                <elements-multiselect
                  v-model="state.cipQmoId"
                  :options="employeesOptions"
                  :key="state.cipQmoId"
                  label="text"
                  track-by="value"
                  :textLabel="$t('Quality Management Officer')"
                  :required="true"
                  :class="{ 'is-invalid': v$.cipQmoId.$error }"
                />
              </div>
              <div v-if="v$.cipQmoId.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.cipQmoId.required">{{
                  $t("This value is required")
                }}</span>
              </div>
            </div>
            <div class="col-lg-4">
              <div class="form-group">
                <elements-multiselect
                  v-model="state.boardMembers"
                  :options="employeesOptions"
                  :key="state.boardMembers"
                  label="text"
                  track-by="value"
                  :textLabel="$t('Executive Board')"
                  :multiple="true"
                  :required="true"
                  :class="{ 'is-invalid': v$.boardMembers.$error }"
                />
              </div>
              <div v-if="v$.boardMembers.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.boardMembers.required">{{
                  $t("This value is required")
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex align-items-center justify-content-end mt-4">
        <submittal-button
          :isLoading="state.isLoading"
          :iconName="'saveIcon'"
          :buttonName="$t('Save and Proceed')"
        />
      </div>
    </form>
  </div>
</template>
