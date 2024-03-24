<script setup lang="ts">
import { useLayoutStore } from "@/store/layout";
import { ruleListRequest, ruleDeleteRequest } from "~/utils/apiRequests";
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
      text: "Rules",
      active: true,
    },
  ],
  { title } = useTitle("Rules"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig);

const optionalItems = {
  searchBar: false,
  isBtnShow: true,
  btnText: "Create Rules",
  path: "/settings/licensing/rules/create",
};
const rows = ref([]);
function refresh() {
  const layout = useLayoutStore();
  layout.changeLoaderValue(true);
  ruleListRequest()
    .then((response) => {
      layout.changeLoaderValue(false);
      rows.value = response;
    })
    .catch((error: any) => {
      layout.changeLoaderValue(false);
    });
}

async function deleteRule(id) {
  if (!!id) {
    await deleteAlert().then((result: { isConfirmed: any }) => {
      if (result.isConfirmed) {
        ruleDeleteRequest({
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
            <th>{{ $t("Name") }}</th>
            <th>{{ $t("Product") }}</th>
            <th>{{ $t("Deny If") }}</th>
            <th>{{ $t("Reset Pattern") }}</th>
            <th>{{ $t("Next Reset") }}</th>
            <th>{{ $t("Reset Type") }}</th>
            <th>{{ $t("Reset Value") }}</th>
            <th>{{ $t("Allow Overusage") }}</th>
            <th>{{ $t("Status") }}</th>
            <th>{{ $t("Actions") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in rows" :key="index">
            <td>{{ item?.rule_name }}</td>
            <td>{{ item?.product }}</td>
            <td>{{ item?.deny_if_op }} {{ item?.deny_if_value }}</td>
            <td>
              {{ item?.reset_pattern }}
            </td>
            <td>
              {{ item?.next_reset }}
            </td>
            <td>
              {{ item?.reset_type }}
            </td>
            <td>
              {{ item?.reset_value }}
            </td>
            <td>
              {{ item?.allow_overusage }}
            </td>
            <td>
              <p v-if="item?.status == 1">Active</p>
              <p v-else>Inactive</p>
            </td>
            <td>
              <nuxt-link :to="`/settings/licensing/rules/edit-${item?.id}`">
                <elements-icon v-bind:icon="'editIcon'" class="me-2" />
              </nuxt-link>
              <elements-icon
                v-bind:icon="'deleteIcon'"
                class="cursor-pointer"
                @click.prevent="deleteRule(item?.id)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
