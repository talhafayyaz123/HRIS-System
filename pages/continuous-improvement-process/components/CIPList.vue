<script setup lang="ts">
import { routes } from "~/utils/apiRoutes";
import { ref } from "vue";
import commonCode from "~/composables/common";
import genericFunctionality from "~/composables/genericFunctionality";
import EditCipForm from "~/pages/continuous-improvement-process/components/edit-cip-form.vue";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";

const
    { $listen } = useNuxtApp(),
    {
        apiRoute, currentPerPage, currentPage, data,
        listingFunc, onSortChange, handleSearch, destroy
    } = genericFunctionality(),
    { router, Toast, deleteAlert } = commonCode(),
    { t } = useI18n(),
    cIPId = ref(null),
    isModalOpen = ref(false),
    columnConfig = ref([
        {
            label: "Request Number",
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
    ]),
    props = defineProps({
        affectedGroups : {
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
        }
    }),
    { columns } = useTranslatedColumns(columnConfig),
    { title } = useTitle("Groups"),
    refresh = (page = currentPage.value, perPage = currentPerPage.value, column = 'id', order = 'desc', search = '') => {

        listingFunc({page: page, perPage: perPage, sortBy: column, sortOrder: order, search: search})
    }
// define api url of this crud that's we define in apiRoutes file.
apiRoute.value =  routes.CIP
// after page load call this function
$listen("cIPListRefresh", () => {
    refresh();
});

function hideModal() {
    isModalOpen.value = false
}
function openModal(id: any) {
    cIPId.value = id
    isModalOpen.value = true;
}
refresh();

useHead({
    title: title,
})
</script>
<template>
    <div>
        <Table
            class="doc-table"
            :key="data?.cips?.length"
            :columns="columns"
            :remove-serial-able="true"
            :is-custom-body="true"
        >
            <tr v-if="data?.cips?.length > 0" v-for="row in data?.cips" :key="row.id">
                <td
                    v-for="col in columns"
                    :key="col.field"
                    v-show="col.field !== 'action'"
                >
                    <span>
                      {{row[col.field]}}
                  </span>

                </td>
                <td>
                    <ul class="list-inline table-action m-0">
                        <li class="list-inline-item ml-1" @click="openModal(row.id)">
                            <i class="mdi mdi-pencil edit-icon"></i>
                        </li>
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
        <edit-cip-form
            :showModal="isModalOpen"
            :hideModal="hideModal"
            :affectedGroups="affectedGroups"
            :userId="userId"
            :cIPId="cIPId"
        />
    </Modal>
</template>