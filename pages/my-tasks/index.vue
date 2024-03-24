<script setup lang="ts">
import {
  getMyTasksRequest,
  genericListingRequest,
  changeTasksStatusRequest,
} from "@/utils/apiRequests";
import { VueDraggableNext } from "vue-draggable-next";
import BaseTicket from "./components/BaseTicket.vue";

import genericFunctionality from "~/composables/genericFunctionality";
import Create from "./components/Create.vue";
import "md-editor-v3/lib/style.css";
import genericFeatures from "~/composables/generic";
import { ref, reactive, onMounted, watch } from "vue";
import { routes } from "~/utils/apiRoutes";
import commonCode from "~/composables/common";
import { capitalize } from "~/utils/helperFunctions";

const runtimeConfig = useRuntimeConfig();
const { $event, $listen } = useNuxtApp();
const { showGenericListing } = genericFeatures();
const { apiRoute, updateFunc, data, listingFunc } = genericFunctionality();
import { useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";

const { router, Toast } = commonCode(),
  { t } = useI18n();
const myTaskFilters = reactive({
  status: "",
  milestoneId: "",
  projectId: "",
  authUserId: "",
});
const editRecordId = ref("");
const isModalOpen = ref(false);
const taskUUid = ref("");
const taskStatus = ref("");
const isLoading = ref(false);
const statusOptions = ref([
  { value: "", name: "All" },
  { value: "new", name: "New" },
  { value: "done", name: "Done" },
  { value: "in-work", name: "In Work" },
  { value: "in-review", name: "In Review" },
  { value: "blocked", name: "Blocked" },
]);

const list = ref([
  { name: "aamir l1", id: 1, tasks: [] },
  { name: "ali l1", id: 2, tasks: [] },
  { name: "shan l1", id: 3, tasks: [] },
  { name: "haider l1", id: 4, tasks: [] },
]);
const list2 = ref([
  { name: "aamir l2", id: 1, tasks: [] },
  { name: "ali l2", id: 2, tasks: [] },
  { name: "shan l2", id: 3, tasks: [] },
  { name: "haider l2", id: 4, tasks: [] },
]);
const list3 = ref([
  { name: "aamir l3", id: 1, tasks: [] },
  { name: "ali l3", id: 2, tasks: [] },
  { name: "shan l3", id: 3, tasks: [] },
  { name: "haider l3", id: 4, tasks: [] },
]);

const milestoneOptions = ref([]);
const projectOptions = ref([]);
const userOptions = ref([]);
const myTaskData = ref([]);

const newTask = ref([]);
const inWorkTask = ref([]);
const inReviewTask = ref([]);
const doneTask = ref([]);
const blockedTask = ref([]);
const taskId = ref()
const changedStatus = ref();

const breadCrumbsConfig = [
  {
    text: "Admin portal",
    to: "/",
  },
  {
    text: "My task",
    active: true,
  },
],

  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  { title } = useTitle("My task");

const optionalItems = {
  searchBar: false,
  isBtnShow: false,
  btnText: "Add",
  path: "/settings/administration/users/create",
};
function hideModal() {
  isModalOpen.value = false;
}
function showModal() {
  isModalOpen.value = true;
}

onMounted(async function () {
  try {
    const resMilestone = await genericListingRequest(routes.PROJECT_MILESTONE, {
      all: true,
    });
    const resProject = await genericListingRequest(routes.PROJECT_DETAIL, {
      all: true,
    });
    const resUser = await showGenericListing(
      runtimeConfig.public.authBaseUrl + routes.LIST_USERS,
      {
        limit_start: 0,
        limit_count: 25,
        type: "employee",
      }
    );
    milestoneOptions.value = resMilestone?.data?.project_milestones?.map(
      (ms: any) => {
        return { value: ms.id, name: ms.name };
      }
    );
    projectOptions.value = resProject?.data?.projects?.map((ms: any) => {
      return { value: ms.id, name: ms.name };
    });
    userOptions.value = resUser?.data?.map((ms: any) => {
      return { name: ms.first_name + "  " + ms.last_name, value: ms.id };
    });
  } catch (e) {
    console.log(e);
  }
});

async function fetchMyTasks() {
  try {
    isLoading.value = true;
    const logeinUserId = localStorage.getItem("user_id");
    const res = await getMyTasksRequest({
      authUserId: myTaskFilters.authUserId
        ? myTaskFilters.authUserId
        : logeinUserId,
      status: myTaskFilters.status,
      projectId: myTaskFilters.projectId,
      milestoneId: myTaskFilters.milestoneId,
    });
    newTask.value = res.data
      .map((el: any) => {
        if (el?.status === "new") return el;
      })
      .filter(Boolean);
    inWorkTask.value = res.data
      .map((el: any) => {
        if (el?.status === "in-work") return el;
      })
      .filter(Boolean);
    inReviewTask.value = res.data
      .map((el: any) => {
        if (el?.status === "in-review") return el;
      })
      .filter(Boolean);
    doneTask.value = res.data
      .map((el: any) => {
        if (el?.status === "done") return el;
      })
      .filter(Boolean);
    blockedTask.value = res.data
      .map((el: any) => {
        if (el?.status === "blocked") return el;
      })
      .filter(Boolean);
    isLoading.value = false;
  } catch (e) {
    console.log(e);
    isLoading.value = false;
  }
}
fetchMyTasks();

watch(
  [
    () => myTaskFilters.status,
    () => myTaskFilters.milestoneId,
    () => myTaskFilters.projectId,
    () => myTaskFilters.authUserId,
  ],
  (
    [status, milestoneId, projectId, authUserId],
    [] // array containing previous values
  ) => {
    if (status || milestoneId || projectId || authUserId) {
      fetchMyTasks();
    }
  }
);

function createTask() {
  editRecordId.value = "";
  showModal();
}
function editTask(id: any) {
  editRecordId.value = id;
  showModal();
}

function log(event: any) {
  if (event.added) {
    taskId.value = event?.added?.element?.id;
  }
}

async function itemDropped(event: any) {
  const targetColumnStatus = event.to.getAttribute('status');
  changedStatus.value = targetColumnStatus;
  if (!taskId.value) {
    return
  }
  try {
    const formData = {
      taskId: taskId.value,
      status: changedStatus.value
    };
    await changeTasksStatusRequest(formData);
    Toast.fire({
      title: "Status Updated",
      icon: "success",
    });
    taskId.value = "";
  } catch (e) {
    Toast.fire({ title: t("Error!"), text: t("Error"), icon: "error" });
  }
};

useHead({
  title: title,
})
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <div class="d-flex justify-content-end">
      <submittal-button @click="createTask" :icon-name="'addIcon'" :buttonName="$t('Add')" />
    </div>

    <div class="row">
      <div class="col-lg-3">
        <div class="form-group">
          <elements-multiselect v-model="myTaskFilters.status" :key="myTaskFilters.status" :options="statusOptions"
            label="name" track-by="value" :textLabel="$t('Status')" />
        </div>
      </div>
      <div class="col-lg-3">
        <div class="form-group">
          <elements-multiselect v-model="myTaskFilters.milestoneId" :key="myTaskFilters.milestoneId"
            :options="milestoneOptions" label="name" track-by="value" :textLabel="$t('Milstone')" />
        </div>
      </div>
      <div class="col-lg-3">
        <div class="form-group">
          <elements-multiselect v-model="myTaskFilters.projectId" :key="myTaskFilters.projectId" :options="projectOptions"
            label="name" track-by="value" :textLabel="$t('Project')" />
        </div>
      </div>
      <div class="col-lg-3">
        <div class="form-group">
          <elements-multiselect v-model="myTaskFilters.authUserId" :key="myTaskFilters.authUserId" :options="userOptions"
            label="name" track-by="value" :textLabel="$t('User')" />
        </div>
      </div>
    </div>

    <div class="">
      <div class="task-row mt-4 board">
        <div class="task-col">
          <div class="new-board">
            <div class="d-flex align-items-center mb-2">
              <div class="icon"></div>
              <h4>{{ $t("New") }}</h4>
            </div>

            <div class="card board-card">
              <VueDraggableNext :list="newTask" group="people" :status="'new'" ghostClass="ghost-cls"
                chosenClass="chosen-cls" dragClass="drag-cls" class="dragArea list-group w-full h-full" @change="log"
                @end="itemDropped">
                <div class="card inner-card" v-for="element in newTask" :key="element.name">
                  <div class="title" @click="editTask(element?.uuid)">
                    <h4>{{ element?.name }}</h4>
                  </div>
                  <div class="priority">
                    <p>
                      <span>Priority :</span>
                      {{ capitalize(element?.priority) }}
                    </p>
                  </div>
                  <div class="user">
                    <img src="@/assets/images/user.png" class="me-2" />
                    <p>
                      {{ capitalize(element?.employeeName) }}
                    </p>
                  </div>
                </div>
              </VueDraggableNext>
            </div>
          </div>
        </div>
        <div class="task-col">
          <div class="new-board">
            <div class="d-flex align-items-center mb-2">
              <div class="icon"></div>
              <h4>{{ $t("In Work") }}</h4>
            </div>

            <div class="card board-card">
              <VueDraggableNext :list="inWorkTask" group="people" :status="'in-work'" ghostClass="ghost-cls"
                chosenClass="chosen-cls" dragClass="drag-cls" class="dragArea" @change="log" @end="itemDropped">
                <div class="card inner-card" v-for="element in inWorkTask" :key="element.name">
                  <div class="title" @click="editTask(element?.uuid)">
                    <h4>{{ element?.name }}</h4>
                  </div>
                  <div class="priority">
                    <p>
                      <span>Priority :</span>
                      {{ capitalize(element?.priority) }}
                    </p>
                  </div>
                  <div class="user">
                    <img src="@/assets/images/user.png" class="me-2" />
                    <p>
                      {{ capitalize(element?.employeeName) }}
                    </p>
                  </div>
                </div>
              </VueDraggableNext>
            </div>
          </div>
        </div>
        <div class="task-col">
          <div class="new-board">
            <div class="d-flex align-items-center mb-2">
              <div class="icon"></div>
              <h4>{{ $t("In Review") }}</h4>
            </div>

            <div class="card board-card">
              <VueDraggableNext :list="inReviewTask" :status="'in-review'" group="people" ghostClass="ghost-cls"
                chosenClass="chosen-cls" dragClass="drag-cls" class="dragArea" @change="log" @end="itemDropped">
                <div class="card inner-card" v-for="element in inReviewTask" :key="element.name">
                  <div class="title" @click="editTask(element?.uuid)">
                    <h4>{{ element?.name }}</h4>
                  </div>
                  <div class="priority">
                    <p>
                      <span>Priority :</span>
                      {{ capitalize(element?.priority) }}
                    </p>
                  </div>
                  <div class="user">
                    <img src="@/assets/images/user.png" class="me-2" />
                    <p>
                      {{ capitalize(element?.employeeName) }}
                    </p>
                  </div>
                </div>
              </VueDraggableNext>
            </div>
          </div>
        </div>
        <div class="task-col">
          <div class="new-board">
            <div class="d-flex align-items-center mb-2">
              <div class="icon"></div>
              <h4>{{ $t("Done") }}</h4>
            </div>

            <div class="card board-card">
              <VueDraggableNext :list="doneTask" :status="'done'" group="people" ghostClass="ghost-cls"
                chosenClass="chosen-cls" dragClass="drag-cls" class="dragArea" @change="log" @end="itemDropped">
                <div class="card inner-card" v-for="element in doneTask" :key="element.name">
                  <div class="title" @click="editTask(element?.uuid)">
                    <h4>{{ element?.name }}</h4>
                  </div>
                  <div class="priority">
                    <p>
                      <span>MileStone :</span>
                      {{ capitalize(element?.milestone) }}
                    </p>
                  </div>
                  <div class="user">
                    <img src="@/assets/images/user.png" class="me-2" />
                    <p>
                      {{ capitalize(element?.employeeName) }}
                    </p>
                  </div>
                </div>
              </VueDraggableNext>
            </div>
          </div>
        </div>
        <div class="task-col">
          <div class="new-board">
            <div class="d-flex align-items-center mb-2">
              <div class="icon"></div>
              <h4>{{ $t("Blocked") }}</h4>
            </div>

            <div class="card board-card">
              <VueDraggableNext :list="blockedTask" group="people" :status="'blocked'" ghostClass="ghost-cls"
                chosenClass="chosen-cls" dragClass="drag-cls" class="dragArea" @change="log" @end="itemDropped">
                <div class="card inner-card" v-for="element in blockedTask" :key="element.name">
                  <div class="title" @click="editTask(element?.uuid)">
                    <h4>{{ element?.name }}</h4>
                  </div>
                  <div class="priority">
                    <p>
                      <span>Priority :</span>
                      {{ capitalize(element?.priority) }}
                    </p>
                  </div>
                  <div class="user">
                    <img src="@/assets/images/user.png" class="me-2" />
                    <p>
                      {{ capitalize(element?.employeeName) }}
                    </p>
                  </div>
                </div>
              </VueDraggableNext>
            </div>
          </div>
        </div>
      </div>
    </div>
    <create v-if="isModalOpen" :recordId="editRecordId" :showModal="isModalOpen" :hideModal="hideModal" />
  </div>
</template>

<style scoped>
.ticket {
  resize: vertical;
}

.wrapper {
  height: 100vh;

  display: grid;
  grid-gap: 5px;

  grid-template-rows: 30px auto;
  grid-template-columns: auto auto auto;
  grid-template-areas:
    "todo-caption wip-caption done-caption"
    "todo wip done";
}

.table-todo {
  grid-area: todo;
  height: 90%;
  border-right: 1px solid black;
  border-left: 1px solid black;
}

.table-wip {
  grid-area: wip;
  height: 90%;
  border-right: 1px solid black;
  border-left: 1px solid black;
}

.table-done {
  grid-area: done;
  height: 90%;
  border-right: 1px solid black;
  border-left: 1px solid black;
}

.ghost-cls {
  opacity: 0.3;
  background: rgb(248, 187, 187);
  border-radius: 4px;
  padding: 1rem;
  margin: 0.5rem auto;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.35);
}

.chosen-cls {
  opacity: 0.6;
  color: rgb(75, 73, 73);
  background: rgb(248, 221, 171);
  border-radius: 4px;
  padding: 1rem;
  margin: 0.5rem auto;
  box-shadow: 2px 2px 8px rgba(50, 50, 50, 0.35);
}

.drag-cls {
  opacity: 0.7;
  background: rgb(190, 252, 190);
  color: rgb(20, 20, 20);
  border-radius: 12px;
  padding: 1rem;
  margin: 0.5rem auto;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.35);
}

.dragArea {
  min-height: 100vh;
  height: 100%;
  outline: 1px dashed;
}
</style>
