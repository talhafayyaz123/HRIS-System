<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { routes } from "~/utils/apiRoutes";
import commonCode from "~/composables/common";
import genericFeatures from "~/composables/generic";
import { compensationAndBenefitsCreateRequest } from "~/utils/apiRequests";
import genericFunctionality from "~/composables/genericFunctionality";

const { router, Toast, deleteAlert } = commonCode();
const { showGenericListing } = genericFeatures(),
  { submitted, isLoading, apiRoute, storeFunc } = genericFunctionality(),
  { t } = useI18n(),
  state = reactive({
    userId: "",
    isLoading: false,
    submitted: false,
  }),
  emit = defineEmits(["employeeDone", "backTocalendar"]),
  store = () => {
    emit("employeeDone");
  };

const prev = () => {
  emit("backTocalendar");
};

</script>
<template>
  <div>
    <div class="card">
      <div class="card-header d-flex align-items-center">
        <h3 class="card-title me-2">{{ $t('Skill Details') }}</h3>
        <elements-tooltip/>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-8"></div>
          <div class="col-md-4">
            <div class="form-group">
              <elements-multiselect v-model="state.userId" :options="employees" label="text" :key="state.userId"
                track-by="value" :textLabel="$t('Attach User')" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="form-group text-right mt-3 d-flex align-items-center justify-content-end"
    >
      <button class="link_text primary-btn me-3" @click.prevent="prev()">
        <elements-icon v-bind:icon="`backIcon`" class="me-2" />
        {{ $t("Previous") }}
      </button>
      <submittal-button
        @click.prevent="store()"
        :buttonName="$t('Save and Proceed')"
        :iconName="'saveIcon'"
      />
    </div>
  </div>
</template>
