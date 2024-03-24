<script setup lang="ts">
import {routes} from "~/utils/apiRoutes";
import commonCode from "~/composables/common";
import genericFunctionality from "~/composables/genericFunctionality";
import {ref} from "vue";
import {getEmployeeByIdRequest} from "~/utils/apiRequests";
import Table from "~/components/Table/Table.vue";
import { useLayoutStore } from "~/store/layout";
import genericFeatures from "~/composables/generic";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";

const {router, Toast} = commonCode();
const {apiRoute, showFunc} = genericFunctionality();
const {showGenericListing} = genericFeatures();
const runtimeConfig = useRuntimeConfig();
const {t} = useI18n();
const breadCrumbsConfig = [
  {
    text: "Admin portal",
    to: "/",
  },
  {
    text: "Driver License Check",
    to: "/fleet-management/driver-licence-check",
  },
  {
    text: "Show",
    active: true,
  },
],{ items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { title } = useTitle("Driver License Show");

const driverLicenseCheckId = router.params.id;
const driverLicenseCheckData = ref([]);
const driverName = ref('');
const lastCheck = ref('');
const status = ref('');
const driverCheckListData = ref([]);
const managers = ref([]);

const refresh = async () => {
  const layout = useLayoutStore();
  layout.changeLoaderValue(true);
  apiRoute.value = routes.DRIVER_LICENSE_CHECK;
  if (driverLicenseCheckId) {
    const response = await showFunc(driverLicenseCheckId);
    if (response?.success) {
      driverLicenseCheckData.value = response.data;
      await preview();
    }
  }
  layout.changeLoaderValue(false);

};

const preview = async () => {
  driverCheckListData.value = [];
  populateDriverLicenseCheckData();
  populateDriverCheckListData();
  getEmployee(driverLicenseCheckData.value.userId);
  getAllEmployeesListing();
};

const populateDriverLicenseCheckData = () => {
  lastCheck.value = driverLicenseCheckData.value.lastCheck;
  status.value = driverLicenseCheckData.value.status;
};

const populateDriverCheckListData = () => {
  driverCheckListData.value = driverLicenseCheckData.value.driverCheckList;
};

const getEmployeeNameFromListing = (id) => {
  const manager = managers.value.find(manager => manager.id == id)
  return manager?.name ?? ''
};

const getAllEmployeesListing = () => {
  showGenericListing(runtimeConfig.public.authServiceBaseUrl + routes.LIST_USERS, {
    limit_start: 0,
    limit_count: 100,
    type: "employee",
  }).then((response) => {
    managers.value = response?.data?.map((manager: any) => {
      return {
        id: manager.id,
        name: manager.first_name + '  ' + manager.last_name,
      };
    });
  });
};

const getEmployee = (id) => {
  getEmployeeByIdRequest({
    id: id,
  }).then((response) => {
    driverName.value = response?.first_name + ' ' + response?.last_name;
  }).catch((error) => {
    Toast.fire({icon: "error", title: t("Something went wrong")});
  });
};

refresh();
</script>
<template>
  <div>
    <page-header :title="title" :items="items"/>
    <div class="card mt-3">
      <div class="card-header">
        <h3 class="card-title">{{ $t('Driver License Check Details') }}</h3>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-input
                  v-model="driverName"
                  :label="$t('Driver')"
                  :disabled="true"
              />
            </div>
          </div>
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-input
                  v-model="lastCheck"
                  :label="$t('Last Checkup')"
                  :disabled="true"
              />
            </div>
          </div>
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-input
                  v-model="status"
                  :label="$t('Status')"
                  :disabled="true"
              />
            </div>
          </div>
        </div>
        <div class="mt-3 overflow-auto" v-if="driverCheckListData?.length">
          <table class="driver-check-list-table w-100">
            <tr class="text-left font-bold heading-row">
              <th>{{ $t('ID') }}</th>
              <th>{{ $t('Check Type') }}</th>
              <th>{{ $t('Licence Valid Until') }}</th>
              <th>{{ $t('Manager') }}</th>
              <th>{{ $t('Created At') }}</th>
            </tr>
            <tr v-for="driverCheckList in driverCheckListData">
              <td>{{ driverCheckList.id }}</td>
              <td>{{ driverCheckList.checkType }}</td>
              <td>{{ driverCheckList.licenceValid }}</td>
              <td>{{ getEmployeeNameFromListing(driverCheckList.managerId) }}</td>
              <td>{{ driverCheckList.createdAt }}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.driver-check-list-table td, .driver-check-list-table th {
  padding: 20px 10px;
}
</style>
