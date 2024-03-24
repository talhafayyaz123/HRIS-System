<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
const { t } = useI18n(),
    state = reactive({
        isLoading: false,
        submitted: false,
        groupName: "",
        name: "",
    }),
    options = [
        { value: 'batman', name: 'Batman' },
        { value: 'robin', name: 'Robin' },
        { value: 'joker', name: 'Joker' },
    ];
const props = defineProps(["showModal", "hideModal"]),
    validationRules = {
        groupName: { required },
        name: { required },
    },
    v$ = useVuelidate(validationRules, state);

</script>

<template>
    <Modal :showModal="props.showModal" @hideModal="props.hideModal" :title="`Government`" class="">
        <div class="row mt-4">
            <div class="col-12 col-lg-12 col-sm-12">
                <div class="form-group">
                    <elements-multiselect v-model="state.contactReportTemplateId" :options="options" label="name"
                        track-by="value" :textLabel="$t('Type')" :required="true" />

                </div>
                <div v-if="v$.name.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="v$.name.required">{{ $t('This value is required')
                    }}</span><br>
                </div>
            </div>
            <div class="col-12">
                <div class="form-group textarea">
                    <textarea name="" id="" cols="30" rows="10" class="form-control"></textarea>
                    <label for="" class="input-label">{{ $t('Description') }}</label>
                </div>
            </div>
            <div class="col-12 col-lg-12 col-sm-12">
                <div class="form-group">
                    <elements-input v-model="state.groupName" :label="$t('Start Time')" :required="true" id="group-name"
                        :disabled="state.submitted" :class="{ 'is-invalid': v$.groupName.$error }" type="time"/>

                </div>
                <div v-if="v$.groupName.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="v$.groupName.required">{{ $t('This value is required')
                    }}</span><br>
                </div>
            </div>
            <div class="col-12 col-lg-12 col-sm-12">
                <div class="form-group">
                    <elements-input v-model="state.groupName" :label="$t('Hours Taken')" :required="true" id="group-name"
                        :disabled="state.submitted" :class="{ 'is-invalid': v$.groupName.$error }" type="number"/>

                </div>
                <div v-if="v$.groupName.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="v$.groupName.required">{{ $t('This value is required')
                    }}</span><br>
                </div>
            </div>
            <div class="col-12 col-lg-12 col-sm-12">
                <div class="form-group">
                    <elements-input v-model="state.groupName" :label="$t('End Time')" :required="true" id="group-name"
                        :disabled="state.submitted" :class="{ 'is-invalid': v$.groupName.$error }" type="time"/>

                </div>
                <div v-if="v$.groupName.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="v$.groupName.required">{{ $t('This value is required')
                    }}</span><br>
                </div>
            </div>
        </div>
        <div class="d-flex align-items-center justify-content-end mt-3">
            <button type="button" class="primary-btn me-2" data-bs-dismiss="modal" @click="() => props.hideModal()">
                {{ $t('Close') }}
            </button>
            <submittal-button :buttonName="$t('Create')" />
        </div>
    </Modal>
</template>
