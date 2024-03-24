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
            {{ $t("New Entry") }}
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
                      {{ $t("Activity Description") }}
                    </th>

                    <th class="pb-4 pt-6 px-6">
                      {{ $t("Internal Note") }}
                    </th>

                    <th class="pb-4 pt-6 px-6 compact-cell">
                      <p>{{ $t("Quantity") }} / {{ $t("Unit") }}</p>
                    </th>
                    <th class="pb-4 pt-6 px-6 compact-cell">
                      {{ $t("Goodwill") }}
                    </th>
                    <th class="pb-4 pt-6 px-6 compact-cell">
                      {{ $t("Action") }}
                    </th>
                  </tr>
                  <draggable
                    :list="newEntryRecord"
                    group="newEntryAccordion"
                    @change="recordOrderChanged"
                    item-key="entryId"
                    tag="tbody"
                  >
                    <template
                      v-for="entry in newEntryRecord"
                      v-slot:item="{ element: entry }"
                    >
                   
                      <tr
                        :class="
                          entry.timeCheckingStatus !== null
                            ? entry.timeCheckingStatus == 1
                              ? 'text-green-700'
                              : 'text-red-700'
                            : ''
                        "
                        :key="entry.entryId"
                      >
                    
                        <!-- New Entry Record Content -->
                        <td>
                          {{ entry.date }}
                        </td>
                        <td>{{ entry.person }}</td>
                        <td class="description-cell">
                          {{ $t(entry.description) }}
                        </td>
                        <td class="description-cell">
                          {{ entry.internalNote }}
                        </td>
                        <td>
                          {{ parseFloat(entry.quantity).toFixed(2) }}
                          {{ $t("Hours") }}
                        </td>
                        <td>
                          {{   entry.isGoodwill == 0 ? $t("No") : $t("Yes") }}
                        </td>
                        <td>
                          <ul class="list-inline table-action m-0">
                            <li
                              class="list-inline-item ml-1"
                              @click="$emit('edit-entry', entry)"
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
const props = defineProps(["entry"]);
const emits = defineEmits(["toggle-accordion", "edit-entry"]);
const newEntryRecord = ref([]);
newEntryRecord.value = props.entry;

var movedEntry = "";

watch(
  () => data.value,
  () => {
    movedEntry.order = data.value?.order;
  }
);

watch(
  () => props.entry,
  () => {
    newEntryRecord.value = props.entry;
  }
);

const recordOrderChanged = async (event: any) => {
  apiRoute.value = routes.PERFORMANCE_RECORD_ORDER_CHANGE;
  if (event.moved) {
    const movedIndex = event.moved.newIndex;
    movedEntry = newEntryRecord.value[movedIndex];
    const previousEntry = newEntryRecord.value[movedIndex - 1];
    const nextEntry = newEntryRecord.value[movedIndex + 1];

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
