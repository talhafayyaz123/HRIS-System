<script setup lang="ts">
import commonCode from "~/composables/common";
import { reactive, ref } from "vue";
import { routes } from "~/utils/apiRoutes";
import genericFeatures from "~/composables/generic";
import {genericDeleteRequest, myVacationListRequest} from "~/utils/apiRequests";
import genericFunctionality from "~/composables/genericFunctionality";
import EditVacations from './edit-vacations-request.vue';
import ShowVacations from './view-vacations-request.vue';
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";


const props = defineProps({
    employees : {
        type : Object,
        default: {}
    },
    step : {
        type : Number,
        default: 1
    }
})

const
    { $listen,$event } = useNuxtApp(),
    { showGenericListing } = genericFeatures(),
    { submitted, isLoading, apiRoute } = genericFunctionality(),
    { router, Toast, deleteAlert } = commonCode(),
    { t } = useI18n(),
    isEditCase = ref(false),
    userId = localStorage.getItem('user_id') || null,
    data = ref([]),
    employeeId = ref(""),
    modelTitle = ref(""),
    vacationRequestId = ref(''),
    state = reactive({
        leaveType: "",
        status: "",
        starDate: "",
        endDate: "",
        search: "",
    }),
    statuses = [
        {
            id: 1,
            value: "approved",
            label: "Approved",
        },
        {
            id: 2,
            value: "pending",
            label: "Pending",
        },
        {
            id: 3,
            value: "rejected",
            label: "Rejected",
        },
    ],
    typesOfAbsence = [
        {
            id: 1,
            value: "whole",
            label: "Whole",
        },
        {
            id: 2,
            value: "half",
            label: "Half",
        },
    ],
    columnConfig = [
        {
            label: "Start Date",
            field: "startDate",
            sortable: false,
        },
        {
            label: "End Date",
            field: "endDate",
            sortable: false,
        },
        {
            label: "Required Vacation Days",
            field: "requiredVacationDays",
            sortable: false,
        },
        {
            label: "Leave Type",
            field: "leaveType",
            sortable: false,
        },
        {
            label: "Type",
            field: "type",
            sortable: false,
        },
        {
            label: "Remarks",
            field: "remarks",
            sortable: false,
        },
        {
            label: "Status",
            field: "status",
            sortable: false,
        },
        {
            label: "Action",
            field: "action",
            sortable: false,
        },
    ],
    { columns } = useTranslatedColumns(columnConfig),
    rows = ref([]),
    refresh = async () => {
        rows.value = []
        data.value = []
        myVacationListRequest({
                leaveType: state.leaveType,
                dateFrom: state.starDate,
                dateTo: state.endDate,
                employeeId: employeeId.value,
                status: state.status,
                search: state.search
            }
        ).then((response) => {
            rows.value = response.data?.vacations;
            data.value = response.data;
        });

    },
    destory = async (id: any) => {
        if (!!id) {
            await deleteAlert()
                .then((result: { isConfirmed: any; }) => {
                    if (result.isConfirmed) {
                        genericDeleteRequest(routes.VACATION_REQUEST, id)
                            .then((response) => {
                                Toast.fire({ icon: 'success', title: t('Record deleted successfully!') })
                                refresh();
                                $listen("search", true); // refreshes the calendar data in vacation calendar
                            })
                            .catch((error) => {
                                Toast.fire({ icon: 'error', title: t('Something went wrong') })
                            });
                    }
                })
        }
    }

const usersFilteredWithoutCurrentUser = computed(() =>
    props.employees?.filter(user => user.userId !== userId) ?? props.employees
);
const isModalOpen = ref(false);
function hideModal() {
    isModalOpen.value = false
}

function openModal(module: any, id: any) {

    if(module === 'edit'){
       modelTitle.value = 'Edit Vacation details'
        isEditCase.value = true
    }
    else{
        modelTitle.value = 'Vacation Details'
        isEditCase.value = false
    }

    vacationRequestId.value = id
    isModalOpen.value = true;
}

watch(
    () => props.step,
    () => {
        if(props.step === 3){
            refresh();
        }
    }
);
</script>

<template>
    <div>
        <div class="row align-items-center">
            <div class="col-lg-4">
                <div class="form-group">
                    <elements-input v-model="state.search" :label="$t('Search Term')" />
                </div>
            </div>
            <div class="col-lg-4">
                <div class="form-group">
                    <elements-multiselect v-model="state.status" :options="statuses" label="label" track-by="value"
                        :textLabel="$t('Status')" />
                </div>
            </div>
            <div class="col-lg-4">
                <div class="form-group">
                    <elements-multiselect v-model="state.leaveType" :options="typesOfAbsence" label="label" track-by="value"
                        :textLabel="$t('Terms of Absence')" />
                </div>
            </div>
            <div class="col-lg-4">
                <div class="form-group">
                    <elements-input v-model="state.starDate" :label="$t('Date From')" type="date" />
                </div>
            </div>
            <div class="col-lg-4">
                <div class="form-group">
                    <elements-input v-model="state.endDate" :label="$t('Date To')" type="date" />
                </div>
            </div>

            <div class="col-lg-4">
                <div class="form-group">
                    <elements-multiselect
                        v-model="employeeId"
                        :options="usersFilteredWithoutCurrentUser"
                        @select="refresh"
                        @deSelect="refresh"
                        label="text"
                        track-by="value"
                        :textLabel="$t('User')"
                    />
                </div>
            </div>
            <div class="col-lg-12 mt-3">
                <button class="secondary-btn" @click="refresh">{{$t("Search")}}</button>
            </div>
        </div>
        <div class="table-responsive mt-4">
            <Table
                class="doc-table"
                :key="rows?.length"
                :columns="columns"
                :isCustomBody= "true"
                >
                <tr v-if="rows?.length > 0" v-for="(row) in rows" :key="row.id">
                    <td>{{ row.startDate }}</td>
                    <td>{{ row.endDate }}</td>
                    <td>{{ row.requiredVacationDays }}</td>
                    <td>
                        {{
                            row.isSpecialLeave
                                ? $t("Special")
                                : row.leaveType === "illness"
                                    ? $t(row.leaveType)
                                    : $t("Vacation")
                        }}
                    </td>
                    <td>
                        {{
                            row.isPaid
                                ? "Paid"
                                : "Unpaid"
                        }}
                    </td>
                    <td>{{ row.remarks }}</td>
                    <td>{{ row.status }}</td>
                    <td>
                        <ul class="list-inline table-action m-0">
                            <li class="list-inline-item ms-1" @click="openModal('show', row.id)">
                                <ElementsIcon v-bind:icon="'visibleIcon'" />
                            </li>
                            <li class="list-inline-item ml-1" @click="openModal('edit', row.id)">
                                <i class="mdi mdi-pencil edit-icon"></i>
                            </li>
                            <li class="list-inline-item ml-1" @click="destory(row.id)">
                                <i class="mdi mdi-delete edit-icon"></i>
                            </li>
                        </ul>
                    </td>
                </tr>
                <tr v-else>
                    <td :colspan="columns?.length" class="text-sm text-center">
                        {{ $t("No Records Added") }}
                    </td>
                </tr>
            </Table>
        </div>
        <div class="mt-3">
            <Pagination @change="refresh" :data="data" />
        </div>
    </div>
    <Modal :showModal="isModalOpen" @hideModal="hideModal" :title="modelTitle" class="">
        <edit-vacations
            v-if="isEditCase"
            :showModal="isModalOpen"
            :hideModal="hideModal"
            :employees="employees"
            :vacationRequestId="vacationRequestId"
        />
        <show-vacations
            v-else
            :showModal="isModalOpen"
            :hideModal="hideModal"
            :vacationRequestId="vacationRequestId"
        />
    </Modal>


</template>