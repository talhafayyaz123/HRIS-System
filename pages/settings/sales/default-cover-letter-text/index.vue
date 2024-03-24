<script setup lang="ts">
import { reactive } from "vue";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import genericFunctionality from "~/composables/genericFunctionality";
import { routes } from "~/utils/apiRoutes";
import { useLayoutStore } from "~/store/layout";

import {
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

const { router, Toast } = commonCode(),
  { submitted, isLoading, apiRoute, storeFunc, showFunc } =
    genericFunctionality(),
  { t } = useI18n(),
  state = reactive({
    commentText: "",
  }),
  breadCrumbsConfig = [
    {
      text: "Global Settings",
      to: "/",
    },
    {
      text: "Sales",
      to: "/",
    },
    {
      text: "Default Cover Letter Text",
      to: "/settings/sales/default-cover-letter-text",
    },
    {
      text: t("Create"),
      active: true,
    },
  ],
  { title } = useTitle("Default Cover Letter Text"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  validationRules = {
    commentText: { required },
  },
  v$ = useVuelidate(validationRules, state),
  store = () => {
    submitted.value = true;
    //stop here if form is invalid
    v$.value.$touch();
    if (v$.value.$invalid) {
      submitted.value = false;
      return false;
    } else {
      apiRoute.value = routes.COVER_LETTER_TEXT;
      const payload = {
        text: state.commentText,
      };
      storeFunc(payload);
    }
  },
  refresh = async () => {
    let response = await showFunc();
    if (!!response?.success) {
      state.commentText = response.data?.value;
    }
  };

apiRoute.value = routes.COVER_LETTER_TEXT;
refresh();

useHead({
  title: title,
});
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <form @submit.prevent="store">
      <div class="row">
        <div class="col-lg-12">
          <div class="card h-auto">
            <div class="card-header d-flex align-items-center">
              <h3 class="card-title me-2">
                {{ $t("Fill Default Cover Letter Text Detail") }}
              </h3>
              <elements-tooltip />
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-lg-12 col-md-12 col-sm-12">
                  <div class="form-group textarea">
                    <elements-text-area
                      v-model="state.commentText"
                      :label="$t('Typing')"
                      :required="true"
                      id="name"
                      :disabled="submitted"
                      :class="{ 'is-invalid': v$.commentText.$error }"
                    />
                  </div>
                </div>
                <div v-if="v$.commentText.$error" class="invalid-feedback">
                  <span class="text-danger" v-if="v$.commentText.required">{{
                    $t("This value is required")
                  }}</span
                  ><br />
                </div>
              </div>
            </div>
          </div>
          <div class="mt-3 d-flex align-items-center justify-content-end">
            <!-- <button class="primary-btn me-3"  @click="navigateTo('/settings/sales/default-cover-letter-text')">
                                <elements-icon v-bind:icon="'cancelIcon'" class="me-2"/>
                                <span>{{ $t("Cancel") }}</span>
                            </button> -->
            <submittal-button
              :isLoading="submitted"
              :iconName="'saveIcon'"
              :buttonName="$t('Save and Proceed')"
            />
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
