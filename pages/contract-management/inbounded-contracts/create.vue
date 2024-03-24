<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { routes } from "~/utils/apiRoutes";
import genericFeatures from "~/composables/generic";
import genericFunctionality from "~/composables/genericFunctionality";

import {
    useTranslatedBreadCrumbs,
    useTitle,
} from "~/composables/useTranslated";

const 
    { showSpecificGenericListing, showGenericListing } = genericFeatures(),
    { submitted, isLoading, apiRoute, storeFunc } = genericFunctionality(),
    { router, Toast } = commonCode(),
    { t } = useI18n(),
    state = reactive({
        company_id: "",
    }),
    breadCrumbsConfig = [
        {
            text: "Admin Portal",
            to: "/",
        },
        {
            text: "Inbounded Contracts",
            to: "/contract-management/inbounded-contracts",
        },
        {
            text: "Create",
            active: true,
        },
    ],
    { title } = useTitle("Create Inbounded Contracts"),
    { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    companies = ref([]),
    validationRules = {
        company_id: { required },
    },
    v$ = useVuelidate(validationRules, state);

useHead({
    title: title,
});
</script>

<template>
    <div>
        <page-header :title="title" :items="items" />
        <form @submit.prevent="store">
            <div class="card">
                <div class="card-header d-flex align-items-center">
                    <h3 class="card-title me-2">{{ $t("Configuration") }}</h3>
                    <elements-Tooltip :label="''" />
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-lg-4">
                            <div class="form-group">
                                <elements-multiselect v-model="state.company_id" :options="companies" label="name"
                                    track-by="value" :textLabel="$t('Reciever Type')" />
                            </div>
                            <div v-if="v$.company_id.$error" class="invalid-feedback">
                                <span class="text-danger" v-if="v$.company_id.required">{{
                                    $t("This value is required")
                                }}</span><br />
                            </div>
                        </div>
                        <div class="col-lg-4">
                            <div class="form-group">
                                <elements-multiselect v-model="state.company_id" :options="companies" label="name"
                                    track-by="value" :textLabel="$t('Reciever')" />
                            </div>
                            <div v-if="v$.company_id.$error" class="invalid-feedback">
                                <span class="text-danger" v-if="v$.company_id.required">{{
                                    $t("This value is required")
                                }}</span><br />
                            </div>
                        </div>
                        <div class="col-lg-4">
                            <label for="">Attachments:</label>
                            <div class="form-group m-0 checkbox-group">
                                <input class="checkbox-input" type="checkbox" id="attach1">
                                <label for="attach1" class="checkbox-label">Attachment 1. Test</label>
                            </div>
                            <div class="form-group mt-2 checkbox-group">
                                <input class="checkbox-input" type="checkbox" id="attach1">
                                <label for="attach1" class="checkbox-label">Attachment 1. Test</label>
                            </div>
                        </div>
                        <div class="col-lg-4">
                            <div class="form-group">
                                <elements-multiselect v-model="state.company_id" :options="companies" label="name"
                                    track-by="value" :textLabel="$t('Contract Type')" />
                            </div>
                            <div v-if="v$.company_id.$error" class="invalid-feedback">
                                <span class="text-danger" v-if="v$.company_id.required">{{
                                    $t("This value is required")
                                }}</span><br />
                            </div>
                        </div>
                        <div class="col-lg-4">
                            <div class="form-group">
                                <elements-multiselect v-model="state.company_id" :options="companies" label="name"
                                    track-by="value" :textLabel="$t('Person in charge')" />
                            </div>
                            <div v-if="v$.company_id.$error" class="invalid-feedback">
                                <span class="text-danger" v-if="v$.company_id.required">{{
                                    $t("This value is required")
                                }}</span><br />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card mt-3">
                <div class="card-header d-flex align-items-center">
                    <h3 class="card-title me-2">{{ $t("Company Details") }}</h3>
                </div>
                <div class="card-body">
                    <div class="row mt-2">
                        <div class="col-lg-6">
                            <p>ALTUS AG</p>
                            <p>Kleinoberfeld 55</p>
                            <p>76135 Karlsruhe</p>
                            <p>Baden-Württemberg</p>
                            <p>Deutschland</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-3 d-flex align-items-center justify-content-end">
                <button class="primary-btn me-3" @click="navigateTo('/contract-management/inbounded-contracts')">
                    <elements-icon v-bind:icon="'cancelIcon'" class="me-2" />
                    <span>{{ $t("Cancel") }}</span>
                </button>
                <submittal-button :isLoading="submitted" :iconName="'saveIcon'" :buttonName="$t('Save and Proceed')" />
            </div>
        </form>
    </div>
</template>
