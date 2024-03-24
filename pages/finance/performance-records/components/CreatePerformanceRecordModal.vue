<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { getApiResponse, MethodType } from "~/utils/axiosFunctions";
import { routes } from "~/utils/apiRoutes";
import commonCode from "~/composables/common";


const { t } = useI18n();
const emit = defineEmits(["refreshEvent"]);
const props = defineProps(["showModal", "hideModal"]);
const { router, Toast, deleteAlert } = commonCode();

const formObj = {
    startDate: "",
    endDate: ""
},
    form = reactive({ ...formObj }),
    rules = {
        startDate: { required },
        endDate: { required },
    },
    v$ = useVuelidate(rules, form);

const refresh = () => {
    emit('refreshEvent')
}

const create = async () => {
    v$.value.$touch();
    if (v$.value.$invalid) {
        submitted.value = false;
        return false;
    }

    const payLoad =
    {
        startDate: form.startDate,
        endDate: form.endDate,
        advisor: localStorage.getItem('user_id') ?? null,
    }
    const url = `${routes.PERFORMANCE_RECORD}`;
    try {
        let res = await getApiResponse(url, true, MethodType.post, {}, payLoad)
        if (res) {
            props.hideModal();
            Toast.fire({ title: t("Success!"), text: res?.message, icon: "success" });
            refresh();
            //   let responseData = [];
            //   responseData = res?.data?.data ?? {};
            //   for (let index = 0; index < responseData?.length; index++) {
            //     let item = responseData[index];
            //   }
            //   refresh();
        }
    } catch (error) {
        Toast.fire({ title: t("Error!"), text: error?.response?.data?.message, icon: "error" });
        return false;
    }
}
</script>

<template>
    <Modal :showModal="props.showModal" @hideModal="props.hideModal" :title="$t('Create Performance Record')" class="">
        <div class="row mt-4 product-table">
            <div class="col-lg-12">
                <div class="form-group">
                    <elements-input v-model="form.startDate" @change="refresh" :label="$t('Start Date')" :required="true"
                        :class="{ 'is-invalid': v$.startDate.$error }" type="date" />
                </div>
                <div v-if="v$.startDate.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="v$.startDate.required">{{ $t('This value is required')
                    }}</span><br>
                </div>
            </div>
            <div class="col-lg-12">
                <div class="form-group">
                    <elements-input v-model="form.endDate" @change="refresh" :label="$t('End Date')" :required="true"
                        :class="{ 'is-invalid': v$.endDate.$error }" type="date" />
                </div>
                <div v-if="v$.endDate.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="v$.endDate.required">{{ $t('This value is required')
                    }}</span><br>
                </div>
            </div>
        </div>
        <div class="d-flex align-items-center justify-content-end mt-3">
            <button type="button" class="primary-btn me-2" data-bs-dismiss="modal" @click="() => props.hideModal()">
                Close
            </button>
            <submittal-button :buttonName="$t('Create')" @click="create" />
        </div>
    </Modal>
</template>
