<script setup lang="ts">
import { routes } from "~/utils/apiRoutes";
import { ref } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import commonCode from "~/composables/common";
import {useLayoutStore} from "~/store/layout";
import genericFeatures from "~/composables/generic";
import genericFunctionality from "~/composables/genericFunctionality";
import {genericShowRequest} from "~/utils/apiRequests";

import {
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

const
    { showGenericListing } = genericFeatures(),
    { submitted, isLoading, apiRoute, storeFunc, showFunc } =
        genericFunctionality(),
  { router, Toast, deleteAlert } = commonCode(),
  { t } = useI18n(),
    teamsOptions = ref([]),
  state = reactive({
      teamIds: [],
  }),
  breadCrumbsConfig = [
    {
      text: "Global Settings",
      to: "/",
    },
    {
      text: "Dashboard",
      to: "/",
    },
    {
      text: "Consulting Teams",
      active: true,
    },
  ],
  { title } = useTitle("Consulting Teams"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),

  optionalItems = {
    searchBar: false,
    isBtnShow: false,
    btnText: "",
    path: "",
  },
    store = () => {
        submitted.value = true;
        //stop here if form is invalid
        apiRoute.value = routes.CONSULTING_TEAM;
        storeFunc(state);
    },
    refresh = async () => {
        const layout = useLayoutStore();
        layout.changeLoaderValue(true);
        // show software licnces
        let teams = await showGenericListing(routes.TEAM);

        if (!!teams.data?.teams) {
            teamsOptions.value = teams.data?.teams.map((ts: any) => {
                return { value: ts.id, label: ts.name };
            });
        }

        //get response by id
        let response = await genericShowRequest(routes.CONSULTING_TEAM);
        if (!!response?.success) {
            state.teamIds = response.data?.teamsIds;
        }
        layout.changeLoaderValue(false);
    };


refresh();
  useHead({
  title: title,
});

</script>

<template>
  <div>
    <page-header :title="title" :items="items" :optionalItems="optionalItems" />

    <form @submit.prevent="store">
      <div class="row">
        <div class="col-lg-6">
          <div class="card h-auto">
            <div class="card-header d-flex align-items-center">
              <h3 class="card-title me-2">
                {{ $t("Fill Consulting Teams Details") }}
              </h3>
              <elements-tooltip />
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-lg-12">
                  <div class="form-group">
                    <elements-multiselect
                        :key="state.teamIds"
                        v-model="state.teamIds"
                        :options="teamsOptions"
                        :multiple="true"
                        label="label"
                        track-by="value"
                        :textLabel="$t('Teams')"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-3 d-flex align-items-center justify-content-end">
            <submittal-button :isLoading="state.isLoading" :iconName="'saveIcon'" :buttonName="$t('Save and Proceed')" />
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
