<script setup lang="ts">
import { ref, computed, reactive } from "vue";
import commonCode from "~/composables/common";
import genericFunctionality from "~/composables/genericFunctionality";
import { apiKeysRequest, specificPostRequest } from "~/utils/apiRequests";
import Paginate from "vuejs-paginate-next";
import { routes } from "~/utils/apiRoutes";
import genericFeatures from "~/composables/generic";
import { useLayoutStore } from "~/store/layout";

import {
  useTranslatedColumns,
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

const {
    apiRoute,
    currentPerPage,
    currentPage,
    data,
    listingFunc,
    onSortChange,
    handleSearch,
    destroy,
  } = genericFunctionality(),
  { showSpecificGenericListing, showGenericListing } = genericFeatures(),
  { router, Toast, deleteAlert } = commonCode(),
  perPage = ref(10),
  limitStart = ref(1),
  type = ref(0),
  roles = ref([]),
  // row = reactive({
  //     roles: []
  // }),
  isLoading = ref(false),
  { t } = useI18n(),
  breadCrumbsConfig = [
    {
      text: "Global Settings",
      to: "/",
    },
    {
      text: "Administration",
      to: "/",
    },
    {
      text: "Api Keys",
      active: true,
    },
  ],
  optionalItems = {
    searchBar: false,
    isBtnShow: true,
    btnText: "Create Api Key",
    path: "/settings/administration/api-keys/create",
  },
  columnConfig = [
    {
      label: "Name",
      field: "name",
      sortable: false,
    },
    {
      label: "Client ID",
      field: "clientId",
      sortable: false,
    },
    {
      label: "Company",
      field: "company",
      sortable: false,
    },
    {
      label: "Tenant",
      field: "tenant",
      sortable: false,
    },
    {
      label: "Creation Date",
      field: "creationDate",
      sortable: false,
    },
    {
      label: "Status",
      field: "status",
      sortable: false,
    },
    {
      label: "Roles",
      field: "roles",
      sortable: false,
    },
    {
      label: "Actions",
      field: "action",
      sortable: false,
    },
  ],
  { title } = useTitle("Api keys"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  { columns } = useTranslatedColumns(columnConfig),
  
  callBackFunc = async (param: number) => {
    limitStart.value = param * perPage.value;
    await listingFun();
  },
  addRole = async (event: any[], apiKey: any) => {
    try {
      console.log(event);
      const payload = {
        ...apiKey,
        roles: event,
      };
      await specificPostRequest("update-api-token", payload);
      // await this.$store.dispatch("apiKeys/update", {
      //     ...apiKey,
      //     roles: event.map((role) => role.id),
      // });
    } catch (e) {}
  },
  /**
   * triggers when a selected option is removed from multiselect
   * removes the role from the apiKey
   * @param {removedOption} value/object of the removed option
   * @param {id} id of the removed option
   */
  removeRole = async (event: any, apiKey: any) => {
    try {
      console.log(event);
      const payload = {
        ...apiKey,
        roles: event,
      };
      await specificPostRequest("update-api-token", payload);
    } catch (e) {}
  },
  refresh = async () => {
    let rolesListing = await showSpecificGenericListing(routes.LIST_ROLES);
    if (!!rolesListing.data) {
      roles.value = rolesListing.data.map((ts: any) => {
        return { value: ts.id, name: ts.title };
      });
    }
    await listingFun();
  },
  listingFun = async () => {
    const layout = useLayoutStore();
    layout.changeLoaderValue(true);
    await apiKeysRequest({
      limit_start: limitStart.value,
      limit_count: perPage.value,
      type: type.value,
    })
      .then((response) => {
        data.value = response.data;
      })
      .finally(() => {
        layout.changeLoaderValue(false);
      });
  };
// after page load call this function
refresh();

useHead({
  title: title,
});

const pageCount = computed(() => {
  const totalRecord = data.value?.count;
  return Math.floor(totalRecord / perPage.value);
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
    <div class="table-responsive">
      <Table
        class="doc-table"
        :key="data?.length"
        :columns="columns"
        :not-serial-able="true"
        :remove-serial-able="true"
        :isCustomBody="true"
        editPath="/settings/administration/api-keys/edit-"
        @onSortChange="onSortChange"
        @destroy="destroy"
      >
        <tr v-if="data?.length > 0" v-for="row in data" :key="row.id">
          <td
            v-for="col in columns"
            :key="col.field"
            v-show="col.field !== 'action'"
          >
            <span v-if="col.field === 'status'">
              {{ row.status ? $t("Active") : $t("Inactive") }}
            </span>
            <span v-else-if="col.field === 'roles'">
              <div class="api-key-select">
                <elements-multiselect
                  :key="row.roles"
                  v-model="row.roles"
                  :options="roles"
                  label="name"
                  track-by="value"
                  :multiple="true"
                  @select="addRole($event, row)"
                  @deSelect="removeRole($event, row)"
                />
              </div>
            </span>
            <span v-else>
              {{ row[col.field] }}
            </span>
          </td>
          <td>
            <ul class="list-inline table-action m-0">
              <li class="list-inline-item ms-1">
                <NuxtLink
                  :title="'Edit'"
                  :to="'/settings/administration/api-keys/edit-' + row.id"
                >
                  <ElementsIcon v-bind:icon="'editIcon'" />
                </NuxtLink>
              </li>
              <li class="list-inline-item ml-1" @click="destroy(row.id)">
                <ElementsIcon v-bind:icon="'deleteIcon'" />
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
  </div>
  <div
    v-if="data?.count > 0"
    class="mt-3 d-flex align-items-center justify-content-center"
  >
    <div class="page-count mx-3">
      <p><span>Page 1 </span>out of {{ data?.count }}</p>
    </div>
    <paginate
      :page-count="pageCount"
      :container-class="'pagination'"
      :prev-text="'<'"
      :next-text="'>'"
      :click-handler="callBackFunc"
    >
    </paginate>
  </div>
</template>
