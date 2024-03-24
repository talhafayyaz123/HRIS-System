<script setup lang="ts">
import { useLayoutStore } from "@/store/layout";
import { routes } from "~/utils/apiRoutes";
import genericFunctionality from "~/composables/genericFunctionality";
import { ref } from "vue";
import commonCode from "~/composables/common";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";

const
  store = useLayoutStore(),
  { t } = useI18n(),
   {
      apiRoute,
      currentPerPage,
      currentPage,
       orderDirection,
       orderColumn,
      data,
      listingFunc,
      onSortChange,
      handleSearch,
      destroy,
    } = genericFunctionality(),
    { router, Toast, deleteAlert } = commonCode(),
    breadCrumbsConfig = [
    {
      text: "Admin portal",
      to: "/",
    },
    {
      text: "Tickets",
      active: true,
    },
  ],
   optionalItems = {
    searchBar: true,
    isBtnShow: true,
    btnText: "Create Ticket",
    path: "/support/tickets/create",
  },

  columnConfig = [
    {
      label: "Ticket Number",
      field: "ticketNumber",
      sortable: true,
    },
    {
      label: "Title",
      field: "title",
      sortable: true,
    },
    {
      label: "Status",
      field: "status",
      sortable: true,
    },
    {
      label: "Priority",
      field: "priority",
      sortable: true,
    },
    {
      label: "Type",
      field: "type",
      sortable: true,
    },
    {
      label: "Visibility",
      field: "visibility",
      sortable: true,
    },
    {
      label: "Actions",
      field: "action",
      sortable: false,
    },
  ],
  rows = ref([]);
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

apiRoute.value = routes.TICKETS;
refresh();

const { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { columns } = useTranslatedColumns(columnConfig),
    { title } = useTitle("Tickets");

useHead({
    title: title,
    });
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
      :key="data?.tickets?.length"
      :columns="columns"
      :orderColumn="orderColumn"
      :orderDirection="orderDirection"
      :is-custom-body="true"
      :remove-serial-able="true"
      @onSortChange="onSortChange"
    >
        <tr v-if="data?.tickets?.length > 0" v-for="row in data?.tickets" :key="row.id">
            <td
                    v-for="col in columns"
                    :key="col.field"
                    v-show="col.field !== 'action'"
            >
                  <span :class="{'text-capitalize' : col.field !== 'title'}">
                      {{row[col.field]}}
                  </span>

            </td>
            <td>
                <ul class="list-inline table-action m-0">
                    <li class="list-inline-item ms-1">
                        <NuxtLink :title="'Edit'" :to="'/support/tickets/edit-' + row.id">
                            <ElementsIcon v-bind:icon="'editIcon'" />
                        </NuxtLink>
                    </li>
                    <li class="list-inline-item ms-1">
                        <NuxtLink :title="'View'" :to="'/support/tickets/show-' + row.id">
                            <ElementsIcon v-bind:icon="'visibleIcon'" />
                        </NuxtLink>
                    </li>
                    <li v-if="!row.isArchived" class="list-inline-item ml-1" @click="destroy(row.id)">
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
    <Pagination
      :data="data"
      @change="refresh"
    />
  </div>
</template>
