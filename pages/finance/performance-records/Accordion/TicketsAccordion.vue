<template>
    <div class="mt-4">
      <div class="accordion">
        <div class="accordion-item mb-3">
          <h2 class="accordion-header" id="headingTwo">
            <button
              class="accordion-button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseTwo"
              aria-expanded="true"
              aria-controls="collapseTwo"
            >
              {{ $t("Tickets") }}
            </button>
          </h2>
          <div
            id="collapseTwo"
            class="accordion-collapse collapse show"
            aria-labelledby="headingTwo"
            data-bs-parent="#accordionExample"
          >
            <div class="accordion-body">
              <div class="row">
                <div class="col-md-12">
                  <table class="w-full whitespace-nowrap">
                    <tr class="text-left font-bold">
                      <th class="pb-4 pt-6 px-6 compact-cell">
                        {{ $t("Date") }}
                      </th>
                      <th class="pb-4 pt-6 px-6">
                        {{ $t("Person/Reference") }}
                      </th>
                      <th class="pb-4 pt-6 px-6">
                        {{ $t("Quantity") }} / {{ $t("Unit") }}
                      </th>
  
                    
                      <th class="pb-4 pt-6 px-6 compact-cell">
                        {{ $t("Goodwill") }}
                      </th>
                      <th class="pb-4 pt-6 px-6 compact-cell">
                        {{ $t("Action") }}
                      </th>
                    </tr>
                    <draggable
                :list="ticketComments"
                group="ticketAccordion"
                @change="recordOrderChanged"
                item-key="id"
                tag="tbody"
            >
                <template
                    v-for="comment in ticketComments"
                    v-slot:item="{ element: comment }"
                >
                    <tr
                        :class="
                            comment.timeCheckingStatus !== null
                                ? comment.timeCheckingStatus == 1
                                    ? 'text-green-700'
                                    : 'text-red-700'
                                : ''
                        "
                        :key="comment.id"
                    >
                        <!-- Ticket content here -->
                        <td>
                            {{ (comment.date) }}
                        </td>
                        <td class="description-cell">
                            {{ comment.person }} / {{ $t("Ticket") }}
                            {{ comment?.ticketNumber }}
                        </td>
                        <td class="description-cell">
                            {{ $t(comment.description) }}
                        </td>
                        <td>
                            {{ (comment.quantity) }} {{ $t("Hours") }}
                        </td>
                        <td>
                            {{ comment.isGoodwill == 0 ? $t("No") : $t("Yes") }}
                        </td>
                        <td>
                            <ul class="list-inline table-action m-0">
                            <li
                              class="list-inline-item ml-1"
                              @click="$emit('edit-entry', comment)"
                            >
                              <i class="mdi mdi-pencil edit-icon"></i>
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
    </div>
  </template>


<script setup lang="ts">
import draggable from "vuedraggable";
import { routes } from "~/utils/apiRoutes";
import genericFunctionality from "~/composables/genericFunctionality";
import commonCode from "~/composables/common";

const { router, Toast } = commonCode();

const { apiRoute, storeFunc, data } = genericFunctionality();
const props = defineProps(["comments"]);
const emits = defineEmits([ "edit-entry"]);
const ticketComments = ref([]);
ticketComments.value =props.comments;


/* 
let amsentry = [];
amsentry.push(props.entry[0]);

amsentry.push({ ...props.entry[0] });
newEntryRecord.value = amsentry; */


var movedEntry = "";

watch(
  () => data.value,
  () => {
    movedEntry.order = data.value?.order;
  }
);


watch(
  () => props.comments,
  () => {
    ticketComments.value =props.comments;
  }
);


const recordOrderChanged = async (event: any) => {
  apiRoute.value = routes.PERFORMANCE_RECORD_ORDER_CHANGE;
  if (event.moved) {
    const movedIndex = event.moved.newIndex;
    movedEntry = ticketComments.value[movedIndex];
    const previousEntry = ticketComments.value[movedIndex - 1];
    const nextEntry = ticketComments.value[movedIndex + 1];

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
