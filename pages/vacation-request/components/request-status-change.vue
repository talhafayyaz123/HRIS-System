<script setup lang="ts">
import commonCode from "~/composables/common";
import {reactive, ref} from "vue";
import {required} from "@vuelidate/validators/dist/index";
import {useVuelidate} from "@vuelidate/core/dist/index";
import {routes} from "~/utils/apiRoutes";
import genericFeatures from "~/composables/generic";
import genericFunctionality from "~/composables/genericFunctionality";
import { genericStoreRequest } from "~/utils/apiRequests";
import {useAuthStore} from "~/store/auth";

function addDays(date: string | number | Date, days: number) {
    const d = new Date(date.valueOf());
    d.setDate(d.getDate() + days);
    return d;
}
Date.prototype.addDays = function (days) {
    return addDays(this, days);
};
const { $listen,$event } = useNuxtApp()
const props = defineProps(["showModal", "hideModal", "vacationRequestId", "row"]);
let
    { submitted, isLoading, apiRoute, updateFunc, showFunc } = genericFunctionality(),
    { showGenericListing } = genericFeatures(),
    { router, Toast } = commonCode(),
    auth = useAuthStore(),
    userId = localStorage.getItem('user_id') || null ,
    { t } = useI18n(),
    state = reactive({
        status: props.row.status ?? 'pending',
        remarks: props.row.remarks ?? '',
    }),
    options = [
        { value: 'batman', name: 'Batman' },
        { value: 'robin', name: 'Robin' },
        { value: 'joker', name: 'Joker' },
    ],
    statuses = [
        {
            value: "approved",
            label: "Approved",
        },
        {
            value: "pending",
            label: "Pending",
        },
        {
            value: "rejected",
            label: "Rejected",
        },
    ],
    validationRules = {
        status: { required },
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
            apiRoute.value = routes.VACATION_APPROVAL_STATUS;
            const payload = {
                ...state,
                id : props.vacationRequestId,
            }
            genericStoreRequest(apiRoute.value, payload)
                .then((response) => {
                    Toast.fire({icon: 'success', title: 'Record updated successfully!'})
                    $event('vacationRequestStatusUpdated')
                    props.hideModal()
                })
                .catch((error) => {
                    Toast.fire({icon: 'error', title: 'Something went wrong'})
                }).finally(() =>{
                isLoading.value = false;
                submitted.value = false;
            });

        }
    }

watch(
    () => props.row,
    () => {
        state.status = props.row.status ?? 'pending'
        state.remarks = props.row.remarks ?? ''
    }
);
</script>

<template>
    <form @submit.prevent="update">
      <div class="row">
          <div class="col-lg-6">
              <div class="form-group">
                  <elements-multiselect
                      :key="state.status"
                      v-model="state.status"
                      :options="statuses"
                      label="label"
                      track-by="value"
                      :required="true"
                      :textLabel="$t('Status')"
                  />
                  <div v-if="v$.status.$error" class="invalid-feedback">
                      <span class="text-danger" v-if="v$.status.required">{{ $t('This value is required') }}</span><br>
                  </div>
              </div>
          </div>
      </div>

      <div class="row">
        <div class="col-lg-12">
          <div class="form-group textarea">
            <elements-text-area v-model="state.remarks" :label="$t('Remarks')" />
          </div>
        </div>
      </div>
      <div class="d-flex align-items-center justify-content-end mt-3">
          <button type="button" class="primary-btn me-2" data-bs-dismiss="modal" @click="() => props.hideModal()">
            {{ $t('Close') }}
          </button>
          <submittal-button
                :isLoading="submitted"
                :iconName="('trueIcon')"
                :buttonName="$t('Update')"
          />
      </div>
    </form>

</template>
