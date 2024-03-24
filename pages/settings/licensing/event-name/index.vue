<script setup lang="ts">
import { useLayoutStore } from "@/store/layout";
import {
  eventNameListRequest,
  eventNameDeleteRequest,
} from "~/utils/apiRequests";
import { routes } from "~/utils/apiRoutes";
import { ref, computed } from "vue";
import genericFunctionality from "~/composables/genericFunctionality";
import commonCode from "~/composables/common";
import genericFeatures from "~/composables/generic";

import {
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

const { t } = useI18n();

const { showGenericListing } = genericFeatures();
const { handleSearch } = genericFunctionality(),
  { router, Toast, deleteAlert } = commonCode();
const customers = ref([]);
const breadCrumbsConfig = [
    {
      text: "Global Settings",
      to: "/",
    },
    {
      text: "Licensing",
      to: "/",
    },
    {
      text: "Event Name",
      active: true,
    },
  ],
  { title } = useTitle("Event Name"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig);

const optionalItems = {
  searchBar: false,
  isBtnShow: true,
  btnText: "Create Event Name",
  path: "/settings/licensing/event-name/create",
};
const rows = ref([]);
function refresh() {
  const layout = useLayoutStore();
  layout.changeLoaderValue(true);
  showGenericListing(routes.COMPANY)
    .then((response: any) => {
      layout.changeLoaderValue(false);
      customers.value = response?.data?.customers.map((customer: any) => {
        return {
          text: customer.name,
          id: customer.id,
        };
      });
    })
    .catch((error: any) => {
      layout.changeLoaderValue(false);
    });

  eventNameListRequest().then((response) => {
    rows.value = response;
  });
}

function companyName(id) {
  if (id) {
    const matchingCustomer = customers.value.find(
      (customer) => customer.id === id
    );

    if (matchingCustomer) {
      return matchingCustomer?.text;
    }
  }
}

async function deleteEventName(id) {
  if (!!id) {
    await deleteAlert().then((result: { isConfirmed: any }) => {
      if (result.isConfirmed) {
        eventNameDeleteRequest({
          id: id,
        })
          .then((response) => {
            Toast.fire({
              icon: "success",
              title: t("Record deleted successfully!"),
            });
            refresh();
          })
          .catch((error) => {
            Toast.fire({ icon: "error", title: t("Something went wrong") });
          });
      }
    });
  }
}

refresh();

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

    <div class="table-responsive">
      <table class="doc-table table">
        <thead>
          <tr>
            <th>{{ $t("User Name") }}</th>
            <th>{{ $t("Company") }}</th>
            <th>{{ $t("Creation Date") }}</th>
            <th>{{ $t("Actions") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in rows" :key="index">
            <td>{{ item?.name }}</td>
            <td>
              {{ companyName(item?.company_id) }}
            </td>
            <td>
              {{
                new Date((item?.creation_time ?? 0) * 1000)
                  ?.toISOString()
                  ?.slice(0, 10)
              }}
            </td>
            <td>
              <ul class="list-inline table-action m-0">
                <li class="list-inline-item ml-1">
                  <nuxt-link
                    :to="`/settings/licensing/event-name/edit-${item?.id}`"
                    ><ElementsIcon v-bind:icon="'editIcon'"
                  /></nuxt-link>
                </li>
                <li class="list-inline-item ml-1">
                  <ElementsIcon
                    v-bind:icon="'deleteIcon'"
                    class="cursor-pointer"
                    @click.prevent="deleteEventName(item?.id)"
                  />
                </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
