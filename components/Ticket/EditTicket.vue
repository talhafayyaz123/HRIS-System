<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import {routes} from "~/utils/apiRoutes";
import genericFunctionality from "~/composables/genericFunctionality";
import genericFeatures from "~/composables/generic";

const
    { router, Toast, deleteAlert } = commonCode(),
    { showGenericListing } = genericFeatures(),
    { submitted, isLoading, apiRoute, updateFunc, showFunc } = genericFunctionality(),
    { t } = useI18n(),
    props = defineProps({
        showModal: {
            type: Boolean,
            default: false
        },
        hideModal: {
            type: Boolean,
            default: false
        },
        isDisabled: {
            type: Boolean,
            default: false
        },
        ticketId: {
            type: [Number, String],
            default: null
        },
        data: {
            type: Object,
            default: {}
        },
        companies: {
            type: Array,
            default: []
        }
    }),
    emits = defineEmits(['updateTicket']),

    state = reactive({
        showAssignee: true,
        title: props?.data?.title,
        priority: props?.data?.priority,
        companyId: props?.data?.customerId,
        contactType: props?.data?.contactType,
        assignee: props?.data?.assignee,
        status: props?.data?.status,
        type: props?.data?.type,
    }),
    validationRules = {
        title: { required },
        companyId: { required },
        priority: { required },
        contactType: { required },
        status: { required },
        type: { required },
    },
    v$ = useVuelidate(validationRules, state),
    update = async () => {
        submitted.value = true;
        //stop here if form is invalid
        v$.value.$touch();
        if (v$.value.$invalid) {
            submitted.value = false;
            return false;
        }else{
            apiRoute.value = routes.TICKETS;
             await updateFunc(state, props.ticketId)
            emits('updateTicket')
        }
    }

</script>

<template>
    <form @submit.prevent="update">
        <Modal :showModal="props.showModal" @hideModal="props.hideModal" :title="`Edit Ticket`" class="">
            <div class="row">
                <div class="col-lg-12">
                    <div class="form-group">
                        <elements-input v-model="state.title" :label="$t('Title')" :required="true" id="group-name"
                            :disabled="submitted || props.isDisabled" :class="{ 'is-invalid': v$.title.$error }" />
                    </div>
                    <div v-if="v$.title.$error" class="invalid-feedback">
                        <span class="text-danger" v-if="v$.title.required">{{ $t('This value is required') }}</span><br>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="form-group">
                        <elements-multiselect v-model="state.companyId" :options="props. companies" label="name" track-by="value"
                            :textLabel="$t('Customer')" :disabled="submitted || props.isDisabled" :class="{ 'is-invalid': v$.companyId.$error }"  :required="true" />
                    </div>
                    <div v-if="v$.companyId.$error" class="invalid-feedback">
                        <span class="text-danger" v-if="v$.companyId.required">{{ $t('This value is required')
                        }}</span><br>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="form-group">
                        <elements-select
                            :required="true"
                            v-model="state.status"
                            :label="$t('Status')"
                            :error="v$.status.$error ? 'is-invalid' : ''"
                            :disabled="submitted || props.isDisabled"
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
                <div class="col-lg-6">
                    <div class="form-group">
                        <elements-multiselect
                            v-model="state.assignee"
                            :disabled="submitted || props.isDisabled"
                            :options="[]"
                            label="name"
                            track-by="value"
                            :textLabel="$t('Assignee')"
                        />

                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="form-group">
                        <elements-select
                            :required="true"
                            v-model="state.type"
                            :label="$t('Type')"
                            :error="v$.type.$error  ? 'is-invalid' : ''"
                            :disabled="submitted || props.isDisabled"
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
                <div class="col-lg-6">
                    <div class="form-group">
                        <elements-select
                            :required="true"
                             :disabled="submitted || props.isDisabled"
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
                <div class="col-lg-6">
                    <div class="form-group">
                        <elements-select
                            :required="true"
                            :disabled="submitted || props.isDisabled"
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
            <div class="d-flex align-items-center justify-content-end mt-3" v-if="!props.isDisabled">
                <button type="button" class="primary-btn me-2" data-bs-dismiss="modal" @click="() => props.hideModal()">
                    Close
                </button>
                <submittal-button :buttonName="$t('Save and Proceed')" />
            </div>
        </Modal>
    </form>
</template>

