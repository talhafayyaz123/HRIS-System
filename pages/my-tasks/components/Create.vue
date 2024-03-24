<script setup lang="ts">
import {
  getMyTasksRequest,
  genericListingRequest,
  createTasksRequest,
  getTasksRequest,
  updateTasksRequest,
} from "@/utils/apiRequests";
import genericFeatures from "~/composables/generic";
import { ref, reactive, onMounted, watch } from "vue";
import { routes } from "~/utils/apiRoutes";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { MdEditor } from "md-editor-v3";
import Multiselect from "@vueform/multiselect";
import "md-editor-v3/lib/style.css";

const runtimeConfig = useRuntimeConfig();
const props = defineProps(["showModal", "hideModal", "recordId"]);
const { showGenericListing } = genericFeatures();
const { router, Toast } = commonCode(),
  { t } = useI18n(),
  state = reactive({
    name: "",
    status: "",
    milestoneId: "",
    description: "",
    plannedStartDate: "",
    plannedFinishedDate: "",
    actualStartDate: "",
    actualFinishedDate: "",
    earliestStartDate: "",
    expectedFinishedDate: "",
    assignee: "",
    estimatedTime: "",
    spendTime: "",
    priority: "",
  }),
  isLoading = ref(false),
  validationRules = {
    name: { required },
    status: { required },
    assignee: { required },
    priority: { required },
  },
  v$ = useVuelidate(validationRules, state);

const statusOptions = [
  { value: "new", name: "New" },
  { value: "done", name: "Done" },
  { value: "in-work", name: "In Work" },
  { value: "in-review", name: "In Review" },
  { value: "blocked", name: "Blocked" },
];
const priorityOptions = [
  { value: "low", name: "Low" },
  { value: "medium", name: "Medium" },
  { value: "high", name: "High" },
];

const assigneeOptions = ref([]);
const milestoneOptions = ref([]);

onMounted(async function () {
  try {
    const resMilestone = await genericListingRequest(routes.PROJECT_MILESTONE, {
      all: true,
    });
    const assigneeRes = await showGenericListing(
      runtimeConfig.public.authBaseUrl + routes.LIST_USERS,
      {
        limit_start: 0,
        limit_count: 25,
        type: "employee",
      }
    );
    assigneeOptions.value = assigneeRes?.data?.map((manager: any) => {
      return {
        name: manager.first_name + "  " + manager.last_name,
        value: manager.id,
        first_name: manager.first_name,
        last_name: manager.last_name,
        email: manager.email,
      };
    });
    milestoneOptions.value = resMilestone?.data?.project_milestones?.map(
      (ms: any) => {
        return { value: ms.id, name: ms.name };
      }
    );

    if (props.recordId) {
      const resGetTasks = await getTasksRequest(props.recordId);
      const {
        actual_finished_date,
        actual_start_date,
        description,
        earliest_start_date,
        employee_id,
        estimated_time,
        expected_finished_date,
        milestone_id,
        name,
        planned_finished_date,
        planned_start_date,
        priority,
        spend_time,
        status,
        uuid,
      } = resGetTasks.data;

      state.name = name;
      state.status = status;
      state.milestoneId = milestone_id;
      state.description = description;
      state.plannedStartDate = planned_start_date;
      state.plannedFinishedDate = planned_finished_date;
      state.actualStartDate = actual_start_date;
      state.actualFinishedDate = actual_finished_date;
      state.earliestStartDate = earliest_start_date;
      state.expectedFinishedDate = expected_finished_date;
      state.assignee = employee_id;
      state.estimatedTime = estimated_time;
      state.spendTime = spend_time;
      state.priority = priority;
    }
  } catch (e) {
    console.log(e);
  }
});

async function createTaskHandler() {
  v$.value.$touch();
  if (v$.value.$invalid) {
    return;
  } else {
    try {
      isLoading.value = true;
      const formData = {
        ...(state.name && { name: state.name }),
        ...(state.status && { status: state.status }),
        ...(state.milestoneId && { milestoneId: state.milestoneId }),
        ...(state.description && { description: state.description }),
        ...(state.plannedStartDate && {
          plannedStartDate: state.plannedStartDate,
        }),
        ...(state.plannedFinishedDate && {
          plannedFinishedDate: state.plannedFinishedDate,
        }),
        ...(state.actualStartDate && {
          actualStartDate: state.actualStartDate,
        }),
        ...(state.actualFinishedDate && {
          actualFinishedDate: state.actualFinishedDate,
        }),
        ...(state.earliestStartDate && {
          earliestStartDate: state.earliestStartDate,
        }),
        ...(state.expectedFinishedDate && {
          expectedFinishedDate: state.expectedFinishedDate,
        }),
        ...(state.assignee && { assignee: state.assignee }),
        ...(state.estimatedTime && { estimatedTime: state.estimatedTime }),
        ...(state.spendTime && { spendTime: state.spendTime }),
        ...(state.priority && { priority: state.priority }),
      };

      const res = props.recordId
        ? await updateTasksRequest(formData, props.recordId)
        : await createTasksRequest(formData);
      Toast.fire({
        title: props.recordId ? "Record updated successfully!" : "Record created successfully!",
        icon: "success",
      });
      isLoading.value = false;
      props.hideModal();
    } catch (e) {
      console.log(e);
      Toast.fire({ title: t("Error!"), text: t("Error"), icon: "error" });
      isLoading.value = false;
    }
  }
}
</script>

<template>
  <Modal
    :showModal="props.showModal"
    @hideModal="props.hideModal"
    :title="`Add Tasks`"
    class="table-modal"
  >
    <div class="row mt-4 product-table">
      <div class="row">
        <div class="col-lg-4">
          <div class="form-group">
            <elements-input
              v-model="state.name"
              :label="$t('Name')"
              :required="true"
              id="name"
              :class="{ 'is-invalid': v$.name.$error }"
            />
            <div v-if="v$.name.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.name.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="form-group">
            <elements-multiselect
              v-model="state.status"
              :options="statusOptions"
              :key="state.status"
              label="name"
              track-by="value"
              :textLabel="$t('Status')"
              :required="true"
              :class="{ 'is-invalid': v$.status.$error }"
            />
            <div v-if="v$.status.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.status.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="form-group">
            <elements-multiselect
              v-model="state.milestoneId"
              :options="milestoneOptions"
              :key="state.milestoneId"
              label="name"
              track-by="value"
              :textLabel="$t('Milestone')"
            />
          </div>
        </div>

        <div class="col-lg-12">
          <div class="form-group">
            <MdEditor
              :preview="false"
              :style="'height:300px;'"
              :language="'en-US'"
              v-model="state.description"
            />
          </div>
        </div>

        <div class="col-lg-4">
          <div class="form-group">
            <elements-input
              v-model="state.plannedStartDate"
              :label="$t('Planned Start Date')"
              id="planned-start-date"
              type="date"
            />
          </div>
        </div>

        <div class="col-lg-4">
          <div class="form-group">
            <elements-input
              v-model="state.plannedFinishedDate"
              :label="$t('Planned Finish Date')"
              id="planned-finish-date"
              type="date"
            />
          </div>
        </div>

        <div class="col-lg-4">
          <div class="form-group">
            <elements-input
              v-model="state.actualStartDate"
              :label="$t('Actual Start Date')"
              id="actual-start-date"
              type="date"
            />
          </div>
        </div>

        <div class="col-lg-4">
          <div class="form-group">
            <elements-input
              v-model="state.actualFinishedDate"
              :label="$t('Actual Finish Date')"
              id="actual-finish-date"
              type="date"
            />
          </div>
        </div>

        <div class="col-lg-4">
          <div class="form-group">
            <elements-input
              v-model="state.earliestStartDate"
              :label="$t('Earliest Start Date')"
              id="earliest-start-date"
              type="date"
            />
          </div>
        </div>

        <div class="col-lg-4">
          <div class="form-group">
            <elements-input
              v-model="state.expectedFinishedDate"
              :label="$t('Expected Finish Date')"
              id="expected-finish-date"
              type="date"
            />
          </div>
        </div>

        <div class="col-lg-4">
          <div class="form-group">
            <elements-multiselect
              v-model="state.assignee"
              :options="assigneeOptions"
              :key="state.assignee"
              label="name"
              track-by="value"
              :textLabel="$t('Assignee')"
              :required="true"
              :class="{ 'is-invalid': v$.assignee.$error }"
            />
            <div v-if="v$.assignee.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.assignee.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div>
        </div>

        <!-- <div class="col-lg-4">
          <Multiselect
            v-model="state.assignee"
            :key="state.assignee"
            placeholder="Select Options"
            label="name"
            :options="assigneeOptions"
          >
            <template v-slot:beforelist>
              <div>
                <p>First Name</p>
                <p>Last Name</p>
                <p>Email</p>
              </div>
              <hr />
            </template>
            <template v-slot:singlelabel="{ value }">
              <div class="multiselect-single-label">
                <p>{{ value.first_name + " " + value.last_name }}</p>
              </div>
            </template>

            <template v-slot:option="{ option }">
              <div
                class="d-flex justify-content-between"
                :style="' width: 100%'"
              >
                <p>
                  {{ option.first_name }}
                </p>
                <p>
                  {{ option.last_name }}
                </p>
                <p>
                  {{ option.email }}
                </p>
              </div>
            </template>
          </Multiselect>
        </div> -->

        <div class="col-lg-4">
          <div class="form-group">
            <elements-input
              v-model="state.estimatedTime"
              :label="$t('Estimated Time(hrs)')"
              id="estimatedTime"
              type="number"
            />
          </div>
        </div>

        <div class="col-lg-4">
          <div class="form-group">
            <elements-input
              v-model="state.spendTime"
              :label="$t('Spent Time(hrs)')"
              id="spendTime"
              type="number"
            />
          </div>
        </div>

        <div class="col-lg-4">
          <div class="form-group">
            <elements-multiselect
              v-model="state.priority"
              :options="priorityOptions"
              :key="state.priority"
              label="name"
              track-by="value"
              :textLabel="$t('priority')"
              :required="true"
              :class="{ 'is-invalid': v$.priority.$error }"
            />
            <div v-if="v$.priority.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.priority.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-4 d-flex align-items-center justify-content-end">
        <button
          type="button"
          class="primary-btn me-2"
          data-bs-dismiss="modal"
          @click="() => props.hideModal()"
        >
          Close
        </button>
        <submittal-button
          @click="createTaskHandler"
          :isLoading="isLoading"
          :buttonName="$t('Add')"
        />
      </div>
    </div>
  </Modal>
</template>
