<script setup lang="ts">
/* eslint-disable no-duplicate-attributes */

import genericFunctionality from "~/composables/genericFunctionality";
import "md-editor-v3/lib/style.css";
import genericFeatures from "~/composables/generic";
import { ref, reactive } from "vue";
import { routes } from "~/utils/apiRoutes";
import commonCode from "~/composables/common";
import draggable from "vuedraggable";
const { $event, $listen } = useNuxtApp();


const { showGenericListing } = genericFeatures();

const { apiRoute, updateFunc, data, listingFunc } = genericFunctionality();

import { dateFormatter, capitalize } from "~/utils/helperFunctions";
const { router, Toast } = commonCode();
const runtimeConfig = useRuntimeConfig();
const props = defineProps({
    tasks: {
      type: Array,
      default: [],
    },
  }),
  { t } = useI18n(),
  boardFilter = reactive({
    status: "all",
    milestoneId: "",
    employeeId: "",
  }),
  employees = ref([]),
  milestones = ref([]),
  drag = ref(false),
  taskUUid = ref(""),
  taskStatus = ref(""),
  tasks = ref([]),
  statusOptions = [
    { value: "all", text: "All" },
    { value: "new", text: "New" },
    { value: "done", text: "Done" },
    { value: "in-work", text: "In Work" },
    { value: "in-review", text: "In Review" },
    { value: "blocked", text: "Blocked" },
  ];

function refresh() {
  showGenericListing(
    runtimeConfig.public.authBaseUrl + routes.LIST_USERS,
    {
      limit_start: 0,
      limit_count: 25,
      type: "employee",
    }
  ).then((response) => {
    employees.value = response?.data?.map((manager: any) => {
      return {
        text: manager.first_name + "  " + manager.last_name,
        value: manager.id,
      };
    });
  });

  showGenericListing(routes.PROJECT_MILESTONE, {
    projectId: router.params.id,
  }).then((response: any) => {
    milestones.value = response?.data?.project_milestones.map(
      (milestone: any) => {
        return {
          text: milestone.name,
          value: milestone.id,
        };
      }
    );
  });
}

const Username = (id: string) =>
  computed(() =>
    employees.value.map((ts: any) => {
      
      if (id === ts.value) {
        return ts.text;
      }
    })
  );

watch(
  () => props.tasks,
  () => {
    tasks.value = props.tasks;
  }
);

watch(
  () => data.value,
  () => {
    tasks.value = data.value?.project_tasks;
  }
);

const search = () => {
  setTimeout(() => {
    const payLoad = {
      status: boardFilter.status,
      employee_id: boardFilter.employeeId,
      milestone_id: boardFilter.milestoneId,
    };

    showGenericListing(routes.PROJECT_BOARD, payLoad).then((response: any) => {
      tasks.value = response?.data?.projectBacklog;
    });
  }, 1000);
};

const log = (evt) => {
  if (evt?.added !== undefined) {
    let result = evt?.added?.element;
    taskUUid.value = result?.uuid;
    taskStatus.value = result?.status;
  }
};

const clone = (params, status) => {
  /*  console.log('params')
  console.log(params)
  console.log('status')
  console.log(status)
return params; */
};
const move = (evt, originalEvent) => {
  /*  console.log("move", evt.to.firstElementChild
.dataset.status, originalEvent)
console.log(evt.dragged._underlying_vm_.uuid)
console.log(evt.dragged._underlying_vm_.status) */
};

const finish = (evt: any) => {
  if (taskUUid.value) {
    if (taskStatus.value !== evt.to.firstElementChild.dataset.status) {
      apiRoute.value = routes.PROJECT_TASK_STATUS_UPDATE;
      const payLoad = {
        task_id: taskUUid.value,
        status: evt.to.firstElementChild.dataset.status,
      };

      updateFunc(
        payLoad,
        taskUUid.value,
        "/project-management/projects/edit-" + router.params.id
      );
      apiRoute.value = routes.PROJECT_TASK;

      listingFunc({
        project_id: router.params.id,
      });

      taskUUid.value = "";
      taskStatus.value = "";
      $event("updateProjectTasks", 1);
    }
  }
};

$listen("projectBoardBacklogTasks", (id) => {
  apiRoute.value = routes.PROJECT_TASK;

  listingFunc({
    project_id: router.params.id,
  });
});

refresh();
</script>


<template>
  <div class="row">
    <div class="col-lg-4">
      <div class="form-group">
        <elements-multiselect
          v-model="boardFilter.status"
          :options="statusOptions"
          label="text"
          :key="boardFilter.status"
          :onSelect="search"
          track-by="value"
          :textLabel="$t('Status')"
          :required="false"
        />
      </div>
    </div>
    <div class="col-lg-4">
      <div class="form-group">
        <elements-multiselect
          v-model="boardFilter.milestoneId"
          :options="milestones"
          label="text"
          :key="boardFilter.milestoneId"
          :onSelect="search"
          track-by="value"
          :textLabel="$t('Milstone')"
          :required="false"
        />
      </div>
    </div>
    <div class="col-lg-4">
      <div class="form-group">
        <elements-multiselect
          v-model="boardFilter.employeeId"
          :options="employees"
          label="text"
          :key="boardFilter.employeeId"
          :onSelect="search"
          track-by="value"
          :textLabel="$t('Assignee')"
          :required="false"
        />
      </div>
    </div>
  </div>

  <div class="row mt-4 board">
    <div class="col-md-3">
      <div class="new-board">
        <div class="d-flex align-items-center mb-2">
          <div class="icon"></div>
          <h4>{{ $t("New") }}</h4>
        </div>
        <div class="card board-card">
          <draggable
            v-model="tasks"
            group="people"
            :clone="clone($event, 'new')"
            item-key="id"
            @change="log"
            @move="move"
            @end="finish($event)"
          >
            <template #item="{ element }">
              <div
                class="card inner-card"
                v-if="element?.status === 'new'"
                data-status="new"
              >
                <div class="title">
                  <h4>{{ element?.name }}</h4>
                </div>
                <div class="priority">
                  <p>
                    <span>{{ $t('MileStone') }} :</span>
                    {{ capitalize(element?.milestone) }}
                  </p>
                </div>
                <div class="date">
                  <small
                    >{{ dateFormatter(element?.planned_start_date) }} -
                    {{ dateFormatter(element?.planned_finished_date) }}</small
                  >
                </div>
                <div class="priority">
                  <p>
                    <span>{{ $t('Priority') }} :</span> {{ capitalize(element?.priority) }}
                  </p>
                </div>
                <div class="user">
                  <img src="@/assets/images/user.png" class="me-2" />
                  <!-- <span v-if="Username( element?.employee_id) ">{{ Username( element?.employee_id) }}</span> -->
                 
                </div>
              </div>
            </template>
          </draggable>
        </div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="in-work-board">
        <div class="d-flex align-items-center mb-2">
          <div class="icon"></div>
          <h4>{{ $t("In Work") }}</h4>
        </div>
        <div class="card board-card">
          <draggable
            v-model="tasks"
            group="people"
            @change="log"
            :clone="clone($event, 'in-work')"
            @move="move"
            @end="finish($event)"
            item-key="id"
          >
            <template #item="{ element }">
              <div
                class="card inner-card"
                v-if="element?.status === 'in-work'"
                data-status="in-work"
              >
                <div class="title">
                  <h4>{{ element?.name }}</h4>
                </div>
                <div class="priority">
                  <p>
                    <span>{{ $t('MileStone') }} :</span>
                    {{ capitalize(element?.milestone) }}
                  </p>
                </div>
                <div class="date">
                  <small
                    >{{ dateFormatter(element?.planned_start_date) }} -
                    {{ dateFormatter(element?.planned_finished_date) }}</small
                  >
                </div>
                <div class="priority">
                  <p>
                    <span>{{ $t('Priority') }} :</span> {{ capitalize(element?.priority) }}
                  </p>
                </div>
                <div class="user">
                  <img src="@/assets/images/user.png" class="me-2" />
                </div>
              </div>
            </template>
          </draggable>
        </div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="in-review-board">
        <div class="d-flex align-items-center mb-2">
          <div class="icon"></div>
          <h4>{{ $t("In Review") }}</h4>
        </div>
        <div class="card board-card">
          <draggable
            v-model="tasks"
            group="people"
            :clone="clone($event, 'in-review')"
            item-key="id"
            @change="log"
            @move="move"
            @end="finish($event)"
          >
            <template #item="{ element }">
              <div
                class="card inner-card"
                v-if="element?.status === 'in-review'"
                data-status="in-review"
              >
                <div class="title">
                  <h4>{{ element?.name }}</h4>
                </div>
                <div class="priority">
                  <p>
                    <span>{{ $t('MileStone') }} :</span>
                    {{ capitalize(element?.milestone) }}
                  </p>
                </div>
                <div class="date">
                  <small
                    >{{ dateFormatter(element?.planned_start_date) }} -
                    {{ dateFormatter(element?.planned_finished_date) }}</small
                  >
                </div>
                <div class="priority">
                  <p>
                    <span>{{ $t('Priority') }} :</span> {{ capitalize(element?.priority) }}
                  </p>
                </div>
                <div class="user">
                  <img src="@/assets/images/user.png" class="me-2" />
                </div>
              </div>
            </template>
          </draggable>
        </div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="done-board">
        <div class="d-flex align-items-center mb-2">
          <div class="icon"></div>
          <h4>{{ $t("Done") }}</h4>
        </div>
        <div class="card board-card">
          <draggable
            v-model="tasks"
            group="people"
            :clone="clone($event, 'done')"
            @end="finish($event)"
            item-key="id"
            @change="log"
            @move="move"
          >
            <template #item="{ element }">
              <div
                class="card inner-card"
                v-if="element?.status === 'done'"
                data-status="done"
              >
                <div class="title">
                  <h4>{{ element?.name }}</h4>
                </div>
                <div class="priority">
                  <p>
                    <span>{{ $t('MileStone') }} :</span>
                    {{ capitalize(element?.milestone) }}
                  </p>
                </div>
                <div class="date">
                  <small
                    >{{ dateFormatter(element?.planned_start_date) }} -
                    {{ dateFormatter(element?.planned_finished_date) }}</small
                  >
                </div>
                <div class="priority">
                  <p>
                    <span>{{ $t('Priority') }} :</span> {{ capitalize(element?.priority) }}
                  </p>
                </div>
                <div class="user">
                  <img src="@/assets/images/user.png" class="me-2" />
                </div>
              </div>
            </template>
          </draggable>
        </div>
      </div>
    </div>
  </div>
</template>