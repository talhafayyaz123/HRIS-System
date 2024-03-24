<script setup lang="ts">
import commonCode from "~/composables/common";
import { reactive } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import genericFunctionality from "~/composables/genericFunctionality";
import { routes } from "~/utils/apiRoutes";
import { useLayoutStore } from "~/store/layout";
import { useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";


const { router, Toast } = commonCode(),
  { submitted, isLoading, apiRoute, updateFunc, showFunc } =
    genericFunctionality(),
  { t } = useI18n(),
  groupId = router.params.id,
  state = reactive({
    groupName: "",
  }),
    breadCrumbsConfig = [
      {
        text: "Global Settings",
        to: "/",
      },
      {
        text: "Products",
        to: "/",
      },
      {
        text: "Group",
        to: "/settings/products/groups",
      },
      {
        text: "Edit",
        active: true,
      },
  ],
  { title } = useTitle("Group Edit"),
  validationRules = {
    groupName: { required },
  },
  v$ = useVuelidate(validationRules, state),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  update = () => {
    submitted.value = true;
    //stop here if form is invalid
    v$.value.$touch();
    if (v$.value.$invalid) {
      submitted.value = false;
      return false;
    } else {
      const payload = {
        name: state.groupName,
      };
      apiRoute.value = routes.PRODUCT_GROUP;
      updateFunc(payload, groupId, "/settings/products/groups");
    }
  },
  refresh = async () => {
    const layout = useLayoutStore();
    layout.changeLoaderValue(true);
    let response = await showFunc(groupId);
    if (!!response?.success) {
      state.groupName = response?.data?.name;
    }
    layout.changeLoaderValue(false);
  };
// define api url of this crud that's we define in apiRoutes file.
apiRoute.value = routes.PRODUCT_GROUP;

refresh();
useHead({
  title: title
});
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <form @submit.prevent="update">
      <div class="row">
        <div class="col-lg-6">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">
                {{ $t("Update Product Group Details") }}
              </h3>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-lg-12">
                  <div class="form-group">
                    <elements-input
                      v-model="state.groupName"
                      :label="$t('Group Name')"
                      :required="true"
                      :disabled="submitted"
                      id="group-name"
                      :class="{ 'is-invalid': v$.groupName.$error }"
                    />
                    <div v-if="v$.groupName.$error" class="invalid-feedback">
                      <span class="text-danger" v-if="v$.groupName.required">{{
                        $t("This value is required")
                      }}</span
                      ><br />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-3 d-flex align-items-center justify-content-end">
            <button
              class="primary-btn me-3"
              @click="navigateTo('/settings/products/groups')"
            >
              <elements-icon v-bind:icon="'cancelIcon'" class="me-2" />
              <span>{{ $t("Cancel") }}</span>
            </button>
            <submittal-button
              :isLoading="submitted"
              :iconName="'updateIcon'"
              :buttonName="$t('Update')"
            />
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
