<script setup lang="ts">
import commonCode from "~/composables/common";
import { reactive, ref } from "vue";
import genericFeatures from "~/composables/generic";
import { vacationApprovalListRequest} from "~/utils/apiRequests";
import ShowVacations from "~/pages/vacation-request/components/view-vacations-request.vue";
import RequestStatusChange from "~/pages/vacation-request/components/request-status-change.vue";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";

const props = defineProps({
    employees : {
        type : Object,
        default: {}
    },
    step : {
        type : Number,
        default: 1
    },
    userId : {
        type : String,
        default: ''
    },
    defaultEmployeeId : {
        type : Number,
        default: 1
    }
})
const { $listen,$event } = useNuxtApp()
const
    { showGenericListing } = genericFeatures(),
    { router, Toast } = commonCode(),
    { t } = useI18n(),
    state = reactive({
        employeeId: props.defaultEmployeeId,
        status: ['pending'],
        all: false,
    }),
    modelTitle = ref(''),
    isModalOpen = ref(false),
    isEditCase = ref(false),
    vacationRequestId = ref(''),
    records = ref({}),
    statusOptions = [
        {
            text : "Approved",
            value: "approved"
        },
        {
            text : "Pending",
            value: "pending"
        },
        {
            text : "Rejected",
            value: "rejected"
        }
    ],
    columnConfig = [
        {
            label: "Requester",
            field: "requester",
            sortable: false,
        },
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
    data = ref([]),
    refresh = async () => {
        rows.value = []
        data.value = []
        vacationApprovalListRequest({
            ...state,
            status: state.status?.map(st => st),

        }
        ).then((response) => {
            rows.value = response.data?.vacations;
            data.value = response.data;
        });

    }
function hideModal() {
    isModalOpen.value = false
}
function openModal(module: any, id: any) {

    if(module === 'edit'){
        modelTitle.value = 'Update Status'
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
    () => props.defaultEmployeeId,
    () => {
        state.employeeId = props.defaultEmployeeId
    }
);
watch(
    () => props.step,
    () => {
        if(props.step === 4){
            refresh();
        }
    }
);
watch(
    () => state.status,
    () => {
        refresh();
    }
);
watch(
    () => state.all,
    () => {
       state.employeeId = ''
        refresh()
    }
);

$listen("vacationRequestStatusUpdated", () => {
    refresh();
});
</script>

<template>
    <div>
        <div class="row align-items-center">
            <div class="col-lg-4">
                <div class="form-group">
                    <elements-multiselect
                        :key="state.status"
                        v-model="state.status"
                        :options="statusOptions"
                        @select="refresh"
                        @deSelect="refresh"
                        :multiple="true"
                        label="text"
                        track-by="value"
                        :textLabel="$t('Status')"
                    />
                </div>
            </div>
            <div class="col-lg-4">
                <div class="form-group">
                    <elements-multiselect
                        :key="state.employeeId"
                        v-model="state.employeeId"
                        @select="refresh"
                        @deSelect="refresh"
                        :options="employees"
                        label="text"
                        track-by="value"
                        :textLabel="$t('User')"
                    />
                </div>
            </div>
            <div class="col-lg-4">
                <div class="form-group">
                    <input type="checkbox" class="me-2" v-model="state.all">
                    <label for="">{{$t("All")}}</label>
                </div>
            </div>
        </div>
        <div class="table-responsive mt-3">
            <Table
                class="doc-table"
                :key="rows?.length"
                :columns="columns"
                :isCustomBody= "true"
            >
                <tr v-if="rows?.length > 0" v-for="(row) in rows" :key="row.id">
                    <td>{{ row.requester }}</td>
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
                            <li class="list-inline-item ms-1" @click="records = row; openModal('edit', row.id)">
                                <button
                                    type="button"
                                    class="primary-btn me-2"
                                >
                                    {{ $t('Change Status') }}
                                </button>
                            </li>
                            <li class="list-inline-item ms-1" @click="openModal('show', row.id)">
                                <ElementsIcon v-bind:icon="'visibleIcon'" />
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
        <request-status-change
            v-if="isEditCase"
            :showModal="isModalOpen"
            :hideModal="hideModal"
            :vacationRequestId="vacationRequestId"
            :row="records"

        />
        <show-vacations
            v-else
            :showModal="isModalOpen"
            :hideModal="hideModal"
            :vacationRequestId="vacationRequestId"
        />
    </Modal>
</template>