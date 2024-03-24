<script setup lang="ts">
import {useLayoutStore} from "@/store/layout";
import {routes} from "~/utils/apiRoutes";
import genericFunctionality from "~/composables/genericFunctionality";
import {ref} from "vue";
import commonCode from "~/composables/common";
import {useTranslatedColumns, useTranslatedBreadCrumbs, useTitle} from "~/composables/useTranslated";
import {affectedGroupCreateRequest, travelExpenseStatusUpdateRequest} from "~/utils/apiRequests";

const
    store = useLayoutStore(),
    {t} = useI18n(),
    {
      apiRoute,
      currentPerPage,
      currentPage,
      data,
      listingFunc,
      onSortChange,
      handleSearch,
      destroy,
    } = genericFunctionality(),
    {router, Toast, deleteAlert} = commonCode(),
    breadCrumbsConfig = [
      {
        text: "Request For Approval List",
        active: true,
      },
    ],
    optionalItems = {
      searchBar: true
    },

    columns = ref([
      {
        label: "Requester",
        field: "requesterName",
        sortable: true,
      },
      {
        label: "Start Date",
        field: "fromDate",
        sortable: true,
      },
      {
        label: "End Date",
        field: "toDate",
        sortable: true,
      },
      {
        label: "Request Type",
        field: "request_type",
        sortable: true,
      },
      {
        label: "Status",
        field: "status",
        sortable: true,
      },
    ]),
    rows = ref([]),
    // { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    // { columns } = useTranslatedColumns(columnConfig),
    {title} = useTitle("Request For Approval");
useHead({
  title: `Request For Approval`,
});

function setApprovalStatus(item) {
  try {
    travelExpenseStatusUpdateRequest({
      id: item.id,
      status: item.status,
    }).then((response) => {
          Toast.fire({
            icon: "success",
            title: t("Status Updated successfully!"),
          });
        })
        .catch((error) => {
          Toast.fire({ icon: "error", title: t("something went wrong!") });
        });
  } catch (error) {
    if (error && error.response && error.response.data) {
      Toast.fire({
        icon: "error",
        title: error.response.data.message,
      });
    }
  }
}

function refresh(
    page = 1,
    perPage = 10,
    column = "id",
    order = "asc",
    search = ""
) {
  listingFunc({
    page: page,
    perPage: perPage,
    sortBy: column,
    sortOrder: order,
    search: search,
  });
}

apiRoute.value = routes.TRAVEL_EXPENSE_REQUESTS;
refresh();
</script>

<template>
  <div>
    <page-header
        :title="title"
        :items="items"
        :optionalItems="optionalItems"
        @watchEvent="handleSearch"
    />
    <Table
        class="doc-table"
        :key="data?.length"
        :columns="columns"
        :isCustomBody="true"
        @onSortChange="onSortChange"
    >
      <tr v-if="data?.length > 0" v-for="row in data" :key="row.id">
        <td v-if="row.id"> {{ row.id }}</td> <!-- to show serial no -->
        <td
            v-for="col in columns"
            :key="col.field"
            v-show="col.field !== 'action'"
        >
          <span v-if="col.field === 'request_type'">
            Travel Expense
          </span>
          <span v-else-if="col.field === 'status'">
            <SelectInput
                class="w-1/2"
                :required="true"
                v-model="row[col.field]"
                @update:model-value="setApprovalStatus(row)"
            >
              <option value="approved">
                {{ $t("Approved") }}
              </option>
              <option value="rejected">
                {{ $t("Rejected") }}
              </option>
              <option value="pending">{{ $t("Pending") }}</option>
            </SelectInput>
          </span>
          <span v-else>
              {{ row[col.field] }}
          </span>
        </td>
        <td></td>
      </tr>
      <tr v-else>
        <td :colspan="columns ? (columns.length + 2) : 1" class="text-sm text-center">
          {{ $t("No Records Added") }}
        </td>
      </tr>
    </Table>

  </div>
  <div class="mt-3">
    <Pagination
        :data="data"
        @change="refresh"
    />
  </div>
</template>
