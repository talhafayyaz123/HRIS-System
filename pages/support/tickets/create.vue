<script setup lang="ts">
import { ref, reactive } from "vue";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { MdEditor } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import genericFeatures from "~/composables/generic";
import { routes } from "~/utils/apiRoutes";
import { useLayoutStore } from "~/store/layout";
import genericFunctionality from "~/composables/genericFunctionality";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";


const { router, Toast } = commonCode(),
  { showGenericListing } = genericFeatures(),
  { submitted, isLoading, apiRoute, storeFunc } = genericFunctionality(),
  { t } = useI18n(),
  companies = ref([]),
  state = reactive({
    showAssignee: true,
    title: "",
    status: "new",
    priority: "",
    companyId: "",
    contactType: "",
    assignee: "",
    text: "",
    time: "",
    visibility: "",
    userType: "employee",
    type: "",
  }),
  breadCrumbsConfig = [
    {
      text: "Admin portal",
      to: "/",
    },
    {
      text: "Tickets",
      to: "/support/tickets",
    },
    {
      text: "Create",
      active: true,
    },
  ],
  validationRules = {
    title: { required },
    companyId: { required },
    text: { required },
    status: { required },
    priority: { required },
    type: { required },
    contactType: { required },
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
      apiRoute.value = routes.TICKETS;
      storeFunc(state, "/support/tickets");
    }
  },
  refresh = async () => {
    const layout = useLayoutStore();
    layout.changeLoaderValue(true);
    let companyListing = await showGenericListing(routes.COMPANY);
    if (!!companyListing?.data?.customers) {
      companies.value = companyListing.data.customers.map((ts: any) => {
        return { value: ts.id, name: ts.name };
      });
    }
    layout.changeLoaderValue(false);
  };
  const { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { title } = useTitle("Ticket Create");

useHead({
    title: title,
    });
refresh();
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <form @submit.prevent="store">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">{{ $t("Fill Ticket Details") }}</h3>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-lg-4">
              <div class="form-group">
                <elements-input
                  v-model="state.title"
                  :label="$t('Title')"
                  :required="true"
                  id="group-name"
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
            <div class="col-lg-4">
              <div class="form-group">
                <elements-multiselect
                  v-model="state.companyId"
                  :options="companies"
                  label="name"
                  track-by="value"
                  :textLabel="$t('Customer')"
                  :class="{ 'is-invalid': v$.companyId.$error }"
                  :required="true"
                />
              </div>
              <div v-if="v$.companyId.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.companyId.required">{{
                  $t("This value is required")
                }}</span
                ><br />
              </div>
            </div>
            <div class="col-lg-4">
              <div class="form-group">
                <elements-multiselect
                  v-model="state.assignee"
                  :options="[]"
                  label="name"
                  track-by="value"
                  :textLabel="$t('Assignee')"
                />
              </div>
            </div>
            <div class="col-lg-12">
              <div class="form-group">
                <MdEditor
                  :preview="false"
                  :style="'height:300px;'"
                  :language="'en-US'"
                  v-model="state.text"
                  :class="{ 'is-invalid': v$.text.$error }"
                  required="true"
                />
                <div v-if="v$.text.$error" class="invalid-feedback">
                  <span class="text-danger" v-if="v$.text.required">{{
                    $t("This value is required")
                  }}</span
                  ><br />
                </div>
              </div>
            </div>
            <div class="col-lg-4">
              <div class="form-group">
                <elements-select
                  :required="true"
                  v-model="state.status"
                  :label="$t('Status')"
                  :error="v$.status.$error ? 'is-invalid' : ''"
                >
                  <option value="new">{{ $t("New") }}</option>
                  <option value="open">{{ $t("Open") }}</option>
                  <option value="pending-closed">
                    {{ $t("Pending closed") }}
                  </option>
                  <option value="pending-reminder">
                    {{ $t("Pending reminder") }}
                  </option>
                </elements-select>
              </div>
            </div>
            <div class="col-lg-4">
              <div class="form-group">
                <elements-select
                  :required="true"
                  v-model="state.priority"
                  :label="$t('Priority')"
                  :error="v$.priority.$error ? 'is-invalid' : ''"
                >
                  <option value="low">1 {{ $t("Low") }}</option>
                  <option value="normal">2 {{ $t("Normal") }}</option>
                  <option value="high">3 {{ $t("High") }}</option>
                </elements-select>
              </div>
            </div>
            <div class="col-lg-4">
              <div class="form-group">
                <elements-select
                  v-model="state.visibility"
                  :label="$t('Visibility')"
                >
                  <option value="internal">
                    {{ $t("Internal Only") }}
                  </option>
                  <option value="public">{{ $t("Public") }}</option>
                </elements-select>
              </div>
            </div>
            <div class="col-lg-4">
              <div class="form-group">
                <elements-select
                  :required="true"
                  v-model="state.type"
                  :label="$t('Type')"
                  :error="v$.type.$error ? 'is-invalid' : ''"
                >
                  <option value="incident">{{ $t("Incident") }}</option>
                  <option value="change">{{ $t("Change") }}</option>
                  <option value="problem">{{ $t("Problem") }}</option>
                  <option value="service-request">
                    {{ $t("Service Request") }}
                  </option>
                </elements-select>
              </div>
            </div>
            <div class="col-lg-4">
              <div class="form-group">
                <elements-select
                  :required="true"
                  v-model="state.contactType"
                  :label="$t('Contact Type')"
                  :error="v$.contactType.$error ? 'is-invalid' : ''"
                >
                  <option value="mail">{{ $t("Mail") }}</option>
                  <option value="phone">{{ $t("Phone") }}</option>
                  <option value="direct">
                    {{ $t("Direct Contact") }}
                  </option>
                </elements-select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-4 d-flex align-items-center justify-content-end">
        <submittal-button
          :isLoading="submitted"
          :buttonName="$t('Save and Proceed')"
        />
      </div>
    </form>
  </div>
</template>
