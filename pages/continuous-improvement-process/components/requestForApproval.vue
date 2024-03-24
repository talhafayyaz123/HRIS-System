<script setup lang="ts">
import { routes } from "~/utils/apiRoutes";
import { ref, reactive } from "vue";
import commonCode from "~/composables/common";
import genericFunctionality from "~/composables/genericFunctionality";
import {genericStoreRequest, specificPostRequest} from "~/utils/apiRequests";
import {required} from "@vuelidate/validators";
import {useVuelidate} from "@vuelidate/core";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";

const
    { $listen } = useNuxtApp(),
    {
        apiRoute, currentPerPage, currentPage, data, submitted,
        listingFunc, onSortChange, handleSearch, destroy, isLoading
    } = genericFunctionality(),
    { router, Toast, deleteAlert } = commonCode(),
    { t } = useI18n(),
    isModalOpen = ref(false),
    state = reactive({
        status: '',
        id: ''
    }),
    columnConfig = [
        {
            label: "Request Number",
            field: "requestNumber",
            sortable: false,
        },
        {
            label: "Process Number",
            field: "requestNumber",
            sortable: false,
        },
        {
            label: "Date",
            field: "date",
            sortable: false,
        },
        {
            label: "Title",
            field: "title",
            sortable: false,
        },
        {
            label: "Status",
            field: "status",
            sortable: false,
        },
        {
            label: "Actions",
            field: "action",
            sortable: false,
        },
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
    props = defineProps({
        step : {
            type : Number,
            default: 1
        },
        userId : {
            type : String,
            default: ''
        }
    }),
    validationRules = {
        status: { required },
    },
    v$ = useVuelidate(validationRules, state),
    { columns } = useTranslatedColumns(columnConfig),
    { title } = useTitle("Groups");
    store = () => {
        submitted.value = true;
        //stop here if form is invalid
        v$.value.$touch();
        if (v$.value.$invalid) {
            submitted.value = false;
            return false;
        }else{
            genericStoreRequest( routes.CIP+'/update-status', state)
                .then((response) => {
                    Toast.fire({icon: 'success', title: 'Record updated successfully!'})
                    isModalOpen.value = false
                    refresh()
                })
                .catch((error) => {
                    Toast.fire({ icon: "error", title: t("Something went wrong") });
                }).finally(()=>{
                isLoading.value = false;
                submitted.value = false;

            });

        }
    },
    refresh = (page = currentPage.value, perPage = currentPerPage.value, column = 'id', order = 'desc', search = '') => {

        listingFunc({page: page, perPage: perPage, sortBy: column, sortOrder: order, search: search})
    }
// define api url of this crud that's we define in apiRoutes file.
apiRoute.value =  routes.CIP+'/request-for-approval'
// after page load call this function

refresh();

function hideModal() {
    isModalOpen.value = false
}
function openModal(row: any) {
    state.id = row?.id
    state.status = row?.status
    isModalOpen.value = true;
}

useHead({
    title: title,
})
</script>
<template>
    <div>
        <Table
            class="doc-table"
            :key="data?.cipApprovers?.length"
            :columns="columns"
            :is-custom-body="true"
            :remove-serial-able="true"
        >
            <tr v-if="data?.cipApprovers?.length > 0" v-for="(row, index) in data?.cipApprovers" :key="row.id">
                <td
                    v-for="col in columns"
                    :key="col.field"
                    v-show="col.field !== 'action'"
                >
                    <span v-if="col.field === 'status'">
                        <p
                            class="text-uppercase"
                            v-if="
                                row[col.field] === 'approved' ||
                                row[col.field] === 'rejected'
                            "
                        >
                            {{ row[col.field] }}
                        </p>
                        <button
                            @click="openModal(row)"
                            v-else
                            class="docsHeroColorBlue py-2 px-3 rounded"
                        >
                            {{ $t('Change Status') }}
                        </button>

                    </span>
                    <span v-else>
                      {{row[col.field]}}
                  </span>

                </td>
                <td>
                    <ul class="list-inline table-action m-0">

                        <li class="list-inline-item ml-1" @click="destroy(row.id)">
                            <i class="mdi mdi-delete edit-icon"></i>
                        </li>
                    </ul>
                </td>
                <td></td>
            </tr>
            <tr v-else>
                <td :colspan="columns?.length" class="text-sm text-center">
                    {{ $t("No Records Added") }}
                </td>
            </tr>

        </Table>
    </div>
    <div class="mt-3">
        <Pagination :data="data" @change="refresh" />
    </div>
    <Modal :showModal="isModalOpen" @hideModal="hideModal" :title="$t('Update Status')">
        <form @submit.prevent="store">
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
                    </div>
                </div>
            </div>
            <div class="d-flex align-items-center justify-content-end mt-3">
                <submittal-button
                    :isLoading="submitted"
                    :iconName="('trueIcon')"
                    :buttonName="$t('Update')"
                />
            </div>
        </form>
    </Modal>
</template>