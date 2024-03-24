<template>
  <div class="mt-4">
    <div class="accordion">
      <div class="accordion-item mb-3">
        <h2 class="accordion-header" id="headingOne">
          <button
            class="accordion-button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseOne"
            aria-expanded="true"
            aria-controls="collapseOne"
          >
            {{ $t('Tasks') }}
          </button>
        </h2>
        <div
          id="collapseOne"
          class="accordion-collapse collapse show"
          aria-labelledby="headinginner"
          data-bs-parent="#accordionExample"
        >
          <div class="accordion-body">
            <div class="row">
              <div class="col-md-12">
                <div class="accordion-item mb-3">
                  <table class="whitespace-nowrap w-100">
                    <tbody>
                      <tr v-for="project in tasksData" :key="project.projectId">
                        <td>
                          <h2 class="accordion-header" id="headinginner">
                            <button
                              class="accordion-button"
                              data-bs-toggle="collapse"
                              data-bs-target="#collapseinner"
                              aria-expanded="true"
                              aria-controls="collapseinner"
                            >
                              {{ $t(project.name) }}
                            </button>
                          </h2>
                          <div
                            id="collapseinner"
                            class="accordion-collapse collapse show"
                            aria-labelledby="headingOne"
                            data-bs-parent="#accordionExample"
                          >
                            <div class="accordion-body">
                              <table class="w-full w-100">
                                <tbody
                                  v-for="milestone in project.milestones"
                                  :key="milestone.milestoneId"
                                >
                                  <tr>
                                    <td>
                                      <div class="accordion-item mb-3">
                                        <div class="row">
                                          <div class="col-md-12">
                                            <h2
                                              class="accordion-header"
                                              id="headinginner"
                                            >
                                              <button
                                                class="accordion-button"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#collapseinner"
                                                aria-expanded="true"
                                                aria-controls="collapseinner"
                                              >
                                                {{ $t(milestone.name) }}
                                              </button>
                                            </h2>

                                            <div class="accordion-item mb-3">
                                              <div class="row">
                                                <div class="col-md-12">
                                                  <table
                                                    class="w-full whitespace-nowrap"
                                                  >
                                                    <tr
                                                      class="text-left font-bold"
                                                    >
                                                      <th
                                                        class="pb-4 pt-6 px-6 compact-cell"
                                                      >
                                                        {{ $t("Date") }}
                                                      </th>
                                                      <th
                                                        class="pb-4 pt-6 px-6"
                                                      >
                                                        {{
                                                          $t("Person/Reference")
                                                        }}
                                                      </th>
                                                      <th
                                                        class="pb-4 pt-6 px-6"
                                                      >
                                                        {{
                                                          $t(
                                                            "Activity Description"
                                                          )
                                                        }}
                                                      </th>
                                                      <th
                                                        class="pb-4 pt-6 px-6 compact-cell"
                                                      >
                                                        <p>
                                                          {{ $t("Quantity") }}
                                                          /
                                                          {{ $t("Unit") }}
                                                        </p>
                                                      </th>
                                                      <th
                                                        class="pb-4 pt-6 px-6 compact-cell"
                                                      >
                                                        {{ $t("Goodwill") }}
                                                      </th>
                                                      <th
                                                        class="pb-4 pt-6 px-6 compact-cell"
                                                      >
                                                        {{ $t("Action") }}
                                                      </th>
                                                    </tr>
                                                    <draggable
                                                      :list="milestone.tasks"
                                                      :group="`taskAccordion${milestone.milestoneId}`"
                                                      @change="
                                                        recordOrderChanged(
                                                          $event,
                                                          milestone.tasks ?? []
                                                        )
                                                      "
                                                      item-key="id"
                                                      tag="tbody"
                                                    >
                                                      <template
                                                        v-for="task in milestone.tasks"
                                                        v-slot:item="{
                                                          element: task,
                                                        }"
                                                      >
                                                        <tr
                                                          :class="
                                                            task.timeCheckingStatus !==
                                                            null
                                                              ? task.timeCheckingStatus ==
                                                                1
                                                                ? 'text-green-700'
                                                                : 'text-red-700'
                                                              : ''
                                                          "
                                                          :key="task.taskId"
                                                        >
                                                          <!-- Task Record Content -->
                                                          <td>
                                                            {{ task.date }}
                                                          </td>
                                                          <td>
                                                            {{ task.person }}
                                                          </td>
                                                          <td
                                                            class="description-cell"
                                                          >
                                                            {{
                                                              $t(
                                                                task.description
                                                              )
                                                            }}
                                                          </td>
                                                          <td>
                                                            {{ task.quantity }}
                                                            {{ $t("Hours") }}
                                                          </td>
                                                          <td>
                                                            {{
                                                              task.isGoodwill ==
                                                              0
                                                                ? $t("No")
                                                                : $t("Yes")
                                                            }}
                                                          </td>
                                                          <td>
                                                            <ul
                                                              class="list-inline table-action m-0"
                                                            >
                                                              <li
                                                                class="list-inline-item ml-1"
                                                                @click="
                                                                  $emit(
                                                                    'edit-entry',
                                                                    task
                                                                  )
                                                                "
                                                              >
                                                                <i
                                                                  class="mdi mdi-pencil edit-icon"
                                                                ></i>
                                                              </li>
                                                            </ul>
                                                          </td>
                                                        </tr>
                                                      </template>
                                                    </draggable>
                                                  </table>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>




<script setup lang="ts">
import draggable from "vuedraggable";
import { routes } from "~/utils/apiRoutes";
import genericFunctionality from "~/composables/genericFunctionality";
import commonCode from "~/composables/common";

const { router, Toast } = commonCode();

const { apiRoute, storeFunc, data } = genericFunctionality();
const props = defineProps(["tasks"]);
const emits = defineEmits(["edit-entry"]);
const tasksData = ref([]);
tasksData.value = props.tasks;


/* let amsentry = [];
amsentry.push(props.tasks[0]['milestones'][0]['tasks']);

amsentry.push({ ...props.tasks[0]['milestones'][0]['tasks'] });
tasksData.value = amsentry; */

var movedEntry = "";

watch(
  () => data.value,
  () => {
    movedEntry.order = data.value?.order;
  }
);


watch(
  () => props.tasks,
  () => {
    tasksData.value = props.tasks;
  }
);


const recordOrderChanged = async (event: any) => {
  apiRoute.value = routes.PERFORMANCE_RECORD_ORDER_CHANGE;
  if (event.moved) {
    const movedIndex = event.moved.newIndex;
    movedEntry = tasksData.value[movedIndex];
    const previousEntry = tasksData.value[movedIndex - 1];
    const nextEntry = tasksData.value[movedIndex + 1];

    const payLoad = {
      id: event.moved.element.id,
      data: {
        lowerOrder: previousEntry?.order,
        upperOrder: nextEntry?.order,
      },
    };

    if (movedIndex === 0) {
      delete payLoad.data.lowerOrder;
    } else if (!nextEntry) {
      delete payLoad.data.upperOrder;
    }

    await storeFunc(payLoad);
  }
};
</script>