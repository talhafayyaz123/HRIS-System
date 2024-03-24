<script setup lang="ts">
import { ref, reactive } from "vue";
import { customerRequest, eventNameCreateRequest } from "~/utils/apiRequests";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { useLayoutStore } from "~/store/layout";

import {
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

const { router, Toast } = commonCode(),
  { t } = useI18n(),
  breadCrumbsConfig = [
    {
      text: "Global Settings",
      to: "/",
    },
    {
      text: "Licensing",
      to: "/",
    },
    {
      text: "Event Name",
      to: "/settings/licensing/event-name",
    },
    {
      text: "Create",
      active: true,
    },
  ],

  { title } = useTitle("Create Event Name"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),

  currentPage = ref(1),
  order = ref("asc"),
  column = ref("id"),
  customers = ref([]),
  state = reactive({
    isLoading: false,
    submitted: false,
    name: "",
    customerId: "",
    tenantId: "",
  }),
  validationRules = {
    name: { required },
    customerId: { required },
  },
  v$ = useVuelidate(validationRules, state);

const store = () => {
  v$.value.$touch();
  if (v$.value.$invalid) {
    state.submitted = false;
    return false;
  } else {
    try {
      state.isLoading = true;
      createOnPremise();
    } catch (e) {
      Toast.fire({ title: t("Error!"), text: t("Error"), icon: "error" });
      state.isLoading = false;
      state.submitted = false;
    }
  }
};

const createOnPremise = () => {
  const layout = useLayoutStore();
  layout.changeLoaderValue(true);
  eventNameCreateRequest({
    name: state.name,
    company_id: state.customerId,
    tenant_id: state.tenantId,
  })
    .then((response) => {
      Toast.fire({
        icon: "success",
        title: t("Record created successfully!"),
      });
      layout.changeLoaderValue(false);

      state.isLoading = false;
      state.submitted = false;
      navigateTo("/settings/licensing/event-name");
    })
    .catch((error) => {
      layout.changeLoaderValue(false);

      state.isLoading = false;
      state.submitted = false;
      Toast.fire({ icon: "error", title: t("something went wrong!") });
    });
};

function refresh() {
  customerRequest({
    page: currentPage.value,
    perPage: 100,
    sortBy: column.value,
    order: order.value,
    search: "",
  }).then((response) => {
    customers.value = response?.data?.customers?.map((company: any) => {
      return {
        text: company.name,
        value: company.id,
      };
    });
  });
}

refresh();

useHead({
  title: title,
});
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />

    <div>
      <div id="supplier">
        <div class="card">
          <div class="card-header d-flex align-items-center">
            <h3 class="card-title me-2">{{ $t("Fill Event Name Details") }}</h3>
            <elements-tooltip />
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-4">
                <div class="form-group">
                  <elements-input
                    v-model="state.name"
                    :label="$t('Name')"
                    :required="true"
                    id="name"
                    :disabled="state.submitted"
                    :class="{ 'is-invalid': v$.name.$error }"
                  />
                </div>
                <div v-if="v$.name.$error" class="invalid-feedback">
                  <span class="text-danger" v-if="v$.name.required">{{
                    $t("This value is required")
                  }}</span
                  ><br />
                </div>
              </div>
              <div class="col-lg-4 col-md-6">
                <div class="form-group">
                  <elements-multiselect
                    v-model="state.customerId"
                    :options="customers"
                    label="text"
                    track-by="value"
                    :textLabel="$t('Company')"
                    :required="true"
                    :class="{ 'is-invalid': v$.customerId.$error }"
                  />
                </div>
                <div v-if="v$.customerId.$error" class="invalid-feedback">
                  <span class="text-danger" v-if="v$.customerId.required">{{
                    $t("This value is required")
                  }}</span
                  ><br />
                </div>
              </div>
              <div class="col-lg-4 col-md-6">
                <div class="form-group">
                  <elements-multiselect
                    v-model="state.tenantId"
                    :options="customers"
                    label="text"
                    track-by="value"
                    :textLabel="$t('Tenant')"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-3 d-flex align-items-center justify-content-end">
          <button
            class="primary-btn me-3"
            @click="navigateTo('/settings/licensing/event-name')"
          >
            <elements-icon v-bind:icon="'cancelIcon'" class="me-2" />
            <span>{{ $t("Cancel") }}</span>
          </button>
          <submittal-button
            @click="store()"
            :isLoading="state.isLoading"
            :iconName="'saveIcon'"
            :buttonName="$t('Save and Proceed')"
          />
        </div>
      </div>
    </div>
  </div>
</template>
