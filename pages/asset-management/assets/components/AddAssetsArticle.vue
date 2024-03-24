<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, requiredIf, minLength } from "@vuelidate/validators";
import { ValidateEach } from "@vuelidate/components";

import commonCode from "~/composables/common";
import { useLayoutStore } from "~/store/layout";
import { routes } from "~/utils/apiRoutes";
const layout = useLayoutStore(),
    { router, Toast } = commonCode(),
    { t } = useI18n(),
    state = reactive({
        assetName: "",
        storageLocation: "",
        model: "",
        serialNo: "",
        status: "",
        assetList: "",
    }),
    typesOptions = [
        { value: "customer_employee", name: "Customer Employee" },
        { value: "employee", name: "Employee" },
        { value: "partner", name: "Partner" },
    ],
    validationState = {
        assetName: { required },
        storageLocation: { required },
        model: { required },
        serialNo: { required },
    },
    v$ = useVuelidate(validationState, state),
    props = defineProps(["showModal", "hideModal"]),
    addAssets = () => {
        props.hideModal();
    };
</script>

<template>

    <div class="row mt-4">
        <div class="col-12">
            <div class="form-group">
                <elements-input v-model="state.assetName" :label="$t('Asset Name')" :required="true" id="asset-name"
                    :class="{ 'is-invalid': v$.assetName.$error }" />
            </div>
            <div v-if="v$.assetName.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.assetName.required">{{
                    $t("This value is required")
                }}</span>
            </div>
        </div>
        <div class="col-12">
            <div class="form-group">
                <elements-input v-model="state.model" :label="$t('Model')" :required="true" id="model"
                    :class="{ 'is-invalid': v$.model.$error }" />
            </div>
            <div v-if="v$.model.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.model.required">{{
                    $t("This value is required")
                }}</span>
            </div>
        </div>
        <div class="col-12">
            <div class="form-group">
                <elements-input v-model="state.serialNo" :label="$t('Serial No')" :required="true" id="serial-no"
                    :class="{ 'is-invalid': v$.serialNo.$error }" />
            </div>
            <div v-if="v$.serialNo.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.serialNo.required">{{
                    $t("This value is required")
                }}</span>
            </div>
        </div>
        <div class="col-12">
            <div class="form-group">
                <elements-input v-model="state.storageLocation" :label="$t('Storage Location')" :required="true"
                    id="storage-location" :class="{ 'is-invalid': v$.storageLocation.$error }" />
            </div>
            <div v-if="v$.storageLocation.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.storageLocation.required">{{
                    $t("This value is required")
                }}</span>
            </div>
        </div>
        <div class="col-12">
            <div class="form-group">
                <elements-multiselect v-model="state.status" :options="typesOptions" label="name" track-by="value"
                    :multiple="true" :textLabel="$t('Status')" />
            </div>
        </div>
        <div class="col-12">
            <div class="form-group">
                <elements-multiselect v-model="state.assetList" :options="typesOptions" label="name" track-by="value"
                    :multiple="true" :textLabel="$t('Asset List')" />
            </div>
        </div>
        <div class="col-12">
            <div class="form-group">
                <elements-input v-model="state.assetName" :label="$t('Delivery Date')" type="date" />
            </div>
        </div>

    </div>
    <div class="d-flex align-items-center justify-content-end mt-3">
        <button type="button" class="primary-btn me-2" data-bs-dismiss="modal" @click="() => props.hideModal()">
            Close
        </button>
        <submittal-button :buttonName="$t('Add Assets Article')" @click="addAssets()" />
    </div>
</template>
