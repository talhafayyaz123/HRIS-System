<script setup lang="ts">
import { routes } from "~/utils/apiRoutes";
import genericFunctionality from "~/composables/genericFunctionality";
import { ref } from "vue";
import commonCode from "~/composables/common";
import genericFeatures from "~/composables/generic";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";

const { $listen } = useNuxtApp()


const { t } = useI18n();
const {
    apiRoute,
    currentPerPage,
    currentPage,
    orderColumn,
    orderDirection,
    data,
    listingFunc,
    onSortChange,
    handleSearch,
    destroy,
    updateFunc 
  } = genericFunctionality(),
  { router } = commonCode();

  
const {showGenericListing } = genericFeatures();
const runtimeConfig = useRuntimeConfig();
  
const breadCrumbsConfig = [
  {
    text: "Admin portal",
    to: "/",
  },
  {
    text: "Projects",
    active: true,
  },
];


$listen("projectBoardBacklogTasks", (id) => {
  refresh();
});

const managers=ref([]);
function refresh() {
  listingFunc({
    project_id:router.params.id
  });

  showGenericListing(runtimeConfig.public.authBaseUrl+routes.LIST_USERS,{
    limit_start: 0,
    limit_count: 25,
    type: "employee",
  }).then((response) => {

    managers.value = response?.data?.map((manager: any) => {
      return {
        text: manager.first_name+'  '+manager.last_name,
        value: manager.id,
      };
    });

  });
  
}
const store = (task:any) => {
 const payLoad = {
  task_id: task.uuid,
  employee_id : task.employee_id
  };
  updateFunc(payLoad, task.uuid,"/project-management/projects/edit-"+router.params.id); 
  listingFunc({
    project_id:router.params.id
  });


};
apiRoute.value = routes.PROJECT_BACKLOG;
refresh();

const { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { title } = useTitle("Projects");

useHead({
    title: title,
    });
</script>

<template>
  <div>
    
    <div>
        <div class="row mt-3">
            <div class="col-12 col-lg-12 col-sm-12">
                <div class="table-responsive">
                    <table class="doc-table table">
                        <thead>
                          <tr>
                            <th>{{ $t('Name') }}</th>
                            <th>{{ $t('Status') }}</th>
                            <th>{{ $t('Planned Start Date') }}</th>
                            <th>{{ $t('Planned Finish Date') }}</th>
                            <th>{{ $t('Assign User') }}</th>
                            <th>{{ $t('Action') }}</th>
                          </tr>                        
                        </thead>
                        <tbody>

                            <tr v-for="task in data?.projectBacklog">
                                <td>
                                    <div class="">{{task.name}}</div>
                                </td>
                                <td>
                                    <div class="">{{task.status}}</div>
                                </td>
                                <td>
                                    <div class="">{{task?.planned_start_date}}</div>
                                </td>
                                <td>
                                  <div class="">{{task?.planned_finished_date}}</div>
                                </td>
                                <td  style="width: 300px;">
                                
                                    <div class="form-group m-0">
                                        <elements-multiselect v-model="task.employee_id" :options="managers"
                                            label="text" :key="task.uuid" track-by="value"
                                            :textLabel="$t('Select Option')" :required="true"/>
                                    </div>
                                </td>

                                <td  style="width: 300px;">
                                   
                              <submittal-button v-if="task.employee_id"
                              @click="store(task)"
                                :buttonName="$t('Assign')"
                              />
                            
                                </td>

                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    </div>
  </div>
 
</template>
