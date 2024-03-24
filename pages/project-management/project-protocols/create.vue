<script setup lang="ts">
import { ref, reactive } from "vue";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";


const { router, Toast } = commonCode(),
  { t } = useI18n(),
  state = reactive({
    isLoading: false,
    submitted: false,
    groupName: "",
  }),
  options = [
    { value: 'batman', name: 'Batman' },
    { value: 'robin', name: 'Robin' },
    { value: 'joker', name: 'Joker' },
    { value: 'dc', name: 'dc' },
    { value: 'mcu', name: 'mcu' },
  ],
  breadCrumbsConfig = [
    {
      text: "Admin portal",
      to: "/",
    },
    {
      text: "Project Protocols",
      to: "/project-management/project-protocols",
    },
    {
      text: "Create",
      active: true,
    },
  ],
  validationRules = {
    groupName: { required },
    name: { required },
  },
  v$ = useVuelidate(validationRules, state);

  const { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { title } = useTitle("Project Protocol Create");

useHead({
    title: title,
    });
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">{{ $t("Fill Project Protocols Details") }}</h3>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-lg-4">
            <div class="form-group">
              <elements-multiselect v-model="state.contactReportTemplateId" :options="options" label="name"
                track-by="value" :textLabel="$t('Customer')" :required="true"/>

            </div>
            <div v-if="v$.name.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.name.required">{{ $t('This value is required')
              }}</span><br>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <elements-input v-model="state.groupName" :label="$t('Date')" :required="true" id="group-name"
                :disabled="state.submitted" :class="{ 'is-invalid': v$.groupName.$error }" type="date" />

            </div>
            <div v-if="v$.groupName.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.groupName.required">{{ $t('This value is required') }}</span><br>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <elements-multiselect v-model="state.contactReportTemplateId" :options="options" label="name"
                track-by="value" :textLabel="$t('Protocol Type')" :required="true" multiple />

            </div>
            <div v-if="v$.name.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.name.required">{{ $t('This value is required')
              }}</span><br>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <elements-input v-model="state.groupName" :label="$t('Project')" :required="true" id="group-name"
                :disabled="state.submitted" :class="{ 'is-invalid': v$.groupName.$error }" />

            </div>
            <div v-if="v$.groupName.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.groupName.required">{{ $t('This value is required') }}</span><br>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <elements-multiselect v-model="state.contactReportTemplateId" :options="options" label="name"
                track-by="value" :textLabel="$t('Project status')" :required="true" />

            </div>
            <div v-if="v$.name.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.name.required">{{ $t('This value is required')
              }}</span><br>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <elements-multiselect v-model="state.contactReportTemplateId" :options="options" label="name"
                track-by="value" :textLabel="$t('Distributors')" :required="true" />

            </div>
            <div v-if="v$.name.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.name.required">{{ $t('This value is required')
              }}</span><br>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <elements-multiselect v-model="state.contactReportTemplateId" :options="options" label="name"
                track-by="value" :textLabel="$t('Participants')" :required="true" />

            </div>
            <div v-if="v$.name.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.name.required">{{ $t('This value is required')
              }}</span><br>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <elements-input v-model="state.groupName" :label="$t('Recorder')" :required="true" id="group-name"
                :disabled="state.submitted" :class="{ 'is-invalid': v$.groupName.$error }" />

            </div>
            <div v-if="v$.groupName.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.groupName.required">{{ $t('This value is required') }}</span><br>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-4 d-flex align-items-center justify-content-end">
      <button class="secondary-btn">{{$t("Save and Proceed")}}</button>
    </div>
  </div>
</template>
