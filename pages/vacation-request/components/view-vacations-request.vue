<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import genericFunctionality from "~/composables/genericFunctionality";
const { t } = useI18n();
const props = defineProps(["showModal", "hideModal", "vacationRequestId"]),
    { submitted, isLoading, apiRoute, showFunc } = genericFunctionality(),
    vacationRequest = ref( {}),
    refresh = async() => {
        let response = await showFunc(props.vacationRequestId)
        if (response?.success) {
            vacationRequest.value = response?.data
        }
    }

apiRoute.value = routes.VACATION_REQUEST
refresh()

</script>
<template>
    <div class="row mt-4">
      <div class="col-12 col-lg-6 col-sm-12 mb-2">
        <div class="">
          <h5>{{ $t('Leave Type') }}</h5>
          <p>{{
              vacationRequest.isSpecialLeave
                  ? $t("Special")
                  : vacationRequest.leaveType === "illness"
                      ? $t(vacationRequest.leaveType)
                      : $t("Vacation")
              }}</p>
        </div>
      </div>
      <div class="col-12 col-lg-6 col-sm-12 mb-2">
        <div class="">
          <h5>{{ $t('Start date') }}</h5>
          <p>{{ vacationRequest.startDate }}</p>
        </div>
      </div>
      <div class="col-12 col-lg-6 col-sm-12 mb-2">
        <div class="">
          <h5>{{ $t('End date') }}</h5>
            <p>{{ vacationRequest.endDate }}</p>
        </div>
      </div>
      <div class="col-12 col-lg-6 col-sm-12 mb-2">
        <div class="">
          <h5>{{ $t('Replacements') }}</h5>
          <p v-for="replacement in vacationRequest.replacements">{{
              replacement
              }}</p>
        </div>
      </div>
      <div class="col-12 col-lg-6 col-sm-12 mb-2">
        <div class="">
          <h5>{{ $t('Special Leave Comment') }}</h5>
          <p>{{vacationRequest.comments}}</p>
        </div>
      </div>
    </div>
    <div class="table-responsive mt-3">
      <table class="doc-table table">
        <thead>
          <tr>
            <th>{{ $t('Name') }}</th>
            <th>{{ $t('Email') }}</th>
            <th>{{ $t('Status') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in vacationRequest.approvers">
            <td>{{row.name}}</td>
            <td>{{row.email}}</td>
            <td>{{row.status}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="d-flex align-items-center justify-content-end mt-3">
      <button
        type="button"
        class="primary-btn me-2"
        data-bs-dismiss="modal"
        @click="() => props.hideModal()"
      >
      {{ $t('Close') }}
      </button>
    </div>
</template>
