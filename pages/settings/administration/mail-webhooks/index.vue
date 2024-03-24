<script setup lang="ts">
import { ref } from "vue";
import commonCode from "~/composables/common";
import genericFunctionality from "~/composables/genericFunctionality";
import { routes } from "~/utils/apiRoutes";
import { useLayoutStore } from "~/store/layout";
import {
  genericDeleteRequest,
  mailServiceDeleteRequest,
} from "~/utils/apiRequests";

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
    startPerPage,
    mailService,
    onSortChange,
    handleSearch,
  } = genericFunctionality(),
  { router, Toast, deleteAlert } = commonCode(),
  perPage = ref(10),
  limitStart = ref(1),
  type = ref(0),
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
      text: "Mail Webhooks",
      active: true,
    },
  ],
  columnConfig = [
    {
      label: "Name",
      field: "name",
      sortable: false,
    },
    {
      label: "Regex Content",
      field: "reg_ex_content",
      sortable: false,
    },
    {
      label: "Regex Subject",
      field: "reg_ex_subject",
      sortable: false,
    },
    {
      label: "Regex From Mail",
      field: "reg_ex_from_mail",
      sortable: false,
    },
    {
      label: "Data Eval",
      field: "data_eval",
      sortable: false,
    },
    {
      label: "Active",
      field: "active",
      sortable: false,
    },
    {
      label: "Url",
      field: "url",
      sortable: false,
    },
    {
      label: "Action",
      field: "action",
      sortable: false,
    },
  ],
  optionalItems = {
    searchBar: false,
    isBtnShow: true,
    btnText: "Create Mail Webhooks",
    path: "/settings/administration/mail-webhooks/create",
  },

  { title } = useTitle("Mail Webhooks"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  { columns } = useTranslatedColumns(columnConfig),


  callBackFunc = (param: number) => {
    limitStart.value = param * perPage.value;
    mailService({
      limit_start: limitStart.value,
      limit_count: perPage.value,
      type: type.value,
    });
  },
  destroy = async (id: string) => {
    if (id) {
      await deleteAlert().then((result: { isConfirmed: any }) => {
        if (result.isConfirmed) {
          mailServiceDeleteRequest("/delete-webhook", {
            id: id,
          })
            .then((response) => {
              Toast.fire({
                icon: "success",
                title: "Record deleted successfully!",
              });
              mailService({
                limit_start: limitStart.value,
                limit_count: perPage.value,
                type: type.value,
              });
            })
            .catch((error) => {
              Toast.fire({ icon: "error", title: "Something went wrong" });
            });
        }
      });
    }
  },
  refresh = (
    limit_start = startPerPage.value,
    perPage = currentPerPage.value,
    type = ""
  ) => {
    mailService({ limit_start: limit_start, limit_count: perPage, type: type });
  };
// define api url of this crud that's we define in apiRoutes file.
apiRoute.value = routes.LIST_WEBHOOKS;
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
      >
        <tr v-if="data?.length > 0" v-for="row in data" :key="row.id">
          <td
            v-for="col in columns"
            :key="col.field"
            v-show="col.field !== 'action'"
          >
            <span v-if="col.field === 'active'">
              {{ row.active ? $t("Active") : $t("Inactive") }}
            </span>
            <span v-else>
              {{ row[col.field] }}
            </span>
          </td>
          <td style="width: 130px">
            <ul class="list-inline table-action m-0">
              <li class="list-inline-item ms-1">
                <NuxtLink
                  :title="'Edit'"
                  :to="'/settings/administration/mail-webhooks/edit-' + row.id"
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
            {{ $t("No mail webhooks found.") }}
          </td>
        </tr>
      </Table>
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
        :prev-text="'prev'"
        :next-text="'next'"
        :click-handler="callBackFunc"
      >
      </paginate>
    </div>
  </div>
</template>
