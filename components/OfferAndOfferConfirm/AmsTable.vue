<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue";
import { routes } from "~/utils/apiRoutes";
import {
  genericListingRequest,
  listSlaInfrastructureRequest,
  listSlaServiceTimesRequest,
  listSlaLevelRequest,
} from "~/utils/apiRequests";
import { formatter } from "~/utils/helperFunctions";

const { t } = useI18n();

const props = defineProps([
  "amsTableData",
  "optionalAmsTableData",
  "globalPeriodAMS",
  "amsSummery",
  "optionalProductType"
]);
const emits = defineEmits([
  "addProduct",
  "additiontalDescToggle",
  "addSlaToggle",
  "changeGlobalPeriodState",
  "updatePeriodOfAllProducts",
  "calculateProductValue",
]);

const optionalProduct = reactive({
  ams: props.optionalProductType?.includes("application") ? true : false,
});
const paymentPeriodOptions = ref([]);
const slaInfrastructureOptions = ref([]);
const slaServiceTimeOptions = ref([]);
const slaLevelIncidentOptions = ref([]);
const slaLevelChangeOptions = ref([]);
const amsGlobalPaymentPeriod = ref("");

watch(
  () => amsGlobalPaymentPeriod.value,
  (amsGlobalPeriod) => {
    emits("updatePeriodOfAllProducts", amsGlobalPeriod, "ams");
  }
);

onMounted(async function () {
  try {
    const paymentPeriodRes = await genericListingRequest(
      routes.PRODUCT_PAYMENT_PERIOD,
      {
        all: true,
      }
    );
    const slaInfastructureRes = await listSlaInfrastructureRequest();
    const slaTimesRes = await listSlaServiceTimesRequest();
    const slaLevelRes = await listSlaLevelRequest();
    paymentPeriodOptions.value = paymentPeriodRes?.data?.map((pp: any) => {
      return { value: pp.id, name: pp.name };
    });

    slaInfrastructureOptions.value = slaInfastructureRes?.data?.map(
      (sla: any) => {
        return {
          value: sla.id,
          name: sla.name,
          includedUser: sla.includedUser,
          additionalUser: sla.additionalUser,
        };
      }
    );

    slaServiceTimeOptions.value = slaTimesRes?.data?.map((sla: any) => {
      return {
        value: sla.id,
        name: sla.name,
        days: sla.days,
        from: sla.from,
        to: sla.to,
      };
    });

    slaLevelIncidentOptions.value = slaLevelRes?.data?.incident.map(
      (pp: any) => {
        return {
          value: pp.id,
          name: pp.name,
          showPriority: pp.showPriority,
          incident: pp.incident,
        };
      }
    );
    slaLevelChangeOptions.value = slaLevelRes?.data?.change.map((pp: any) => {
      return {
        value: pp.id,
        name: pp.name,
        showPriority: pp.showPriority,
        change: pp.change,
      };
    });
  } catch (e) {
    console.log(e);
  }
});

// helper function, converts the days array to string separated by commas
function daysString(days: any) {
  return days?.map((day: any) => day).join(", ") ?? "";
}
</script>

<template>
  <div class="mt-3">
    <div class="page-header">
      <div class="page-title">
        <div class="page-title-right">
          <ol class="breadcrumb m-0">
            <li class="breadcrumb-item">
              <span>{{ $t("Application Management Service") }}</span>
            </li>
          </ol>
        </div>
      </div>
      <div class="other-items d-flex justify-center">
        <div class="right-side">
          <div class="form-group m-0 me-2">
            <elements-multiselect v-model="amsGlobalPaymentPeriod" placeholder="Payment Period"
              :options="paymentPeriodOptions" label="name" track-by="value" :textLabel="$t('')" />
          </div>
          <NuxtLink class="primary-btn cursor-pointer" @click="$emit('addProduct', { componentType: 'ams' })">
            <elements-icon v-bind:icon="'addIcon'" class="me-2" />
            {{ $t("Add Product") }}
          </NuxtLink>
        </div>
      </div>
    </div>
    <div class="table-responsive">
      <table class="doc-table table">
        <thead>
          <tr class="">
            <th class="">{{ $t("POS") }}</th>
            <th class="">{{ $t("Article Number") }}</th>
            <th class="">{{ $t("NAME") }}</th>
            <th class="">{{ $t("SOFTWARE") }}</th>
            <th class="">{{ $t("Quantity/UNIT") }}</th>
            <th class="">{{ $t("HOURLY RATE") }}</th>
            <th class="">{{ $t("Discount(%)") }}</th>
            <th class="">{{ $t("PERIOD") }}</th>
            <th class="">{{ $t("Netto Total") }}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(ams, index) in amsTableData" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ ams?.articleNumber }}</td>
            <td>
              <div>
                {{ ams?.name }}

                <div>
                  <button class="mb-2" @click="
                    $emit('additiontalDescToggle', {
                      index,
                      componentType: `ams`,
                    })
                    ">
                    {{
                      ams.descriptionToggle
                      ? `Remove Additional Description`
                      : `Add Additional Description`
                    }}
                  </button>
                  <div v-if="ams.descriptionToggle">
                    <div class="form-group textarea">
                      <textarea v-model="ams.additionDescription" class="form-control" placeholder="."></textarea>
                      <label for="" class="input-label">Additional Description</label>
                    </div>
                  </div>
                </div>

                <div>
                  <button @click="
                    $emit('addSlaToggle', {
                      index,
                      componentType: `ams`,
                    })
                    ">
                    {{ ams.slaToggle ? `Remove SLA` : `Add SLA` }}
                  </button>
                  <div v-if="ams.slaToggle">
                    <div class="d-flex">
                      <div class="form-group">
                        <elements-multiselect :style="{ width: '220px' }" v-model="ams.slaInfrastructureId"
                          :options="slaInfrastructureOptions" :key="ams.slaInfrastructureId" label="name" track-by="value"
                          :textLabel="$t('SLA Infrastructure')" />
                      </div>

                      <div v-if="ams.slaInfrastructureId" class="p-3 text-blue-500" style="overflow: visible !important">
                        <div v-for="(
                            slaInfraOption, index
                          ) in slaInfrastructureOptions" :key="index">
                          <div v-if="slaInfraOption.value ==
                            ams.slaInfrastructureId
                            ">
                            <p>
                              {{ slaInfraOption.name }}/{{
                                slaInfraOption.includedUsers
                              }}
                              User(s)
                            </p>
                            <p>
                              Additional User
                              {{
                                formatter(
                                  slaInfraOption.additionalUser,
                                  "de"
                                )
                              }}/Month
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="d-flex">
                      <div class="form-group">
                        <elements-multiselect :style="{ width: '220px' }" v-model="ams.slaServiceTimeId"
                          :options="slaServiceTimeOptions" :key="ams.slaServiceTimeId" label="name" track-by="value"
                          :textLabel="$t('SLA Service Time')" />
                      </div>

                      <div style="overflow: visible !important" v-if="ams.slaServiceTimeId" class="p-3 text-blue-500">
                        <div v-for="(
                            slaTimeOption, index
                          ) in slaServiceTimeOptions" :key="index">
                          <div v-if="slaTimeOption.value == ams.slaServiceTimeId
                            ">
                            <p>
                              {{ slaTimeOption.name }}
                              on
                              {{ daysString(slaTimeOption?.days) }}
                              from
                              {{ slaTimeOption.from }}
                              to
                              {{ slaTimeOption.to }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="d-flex">
                      <div class="form-group">
                        <elements-multiselect :style="{ width: '220px' }" v-model="ams.slaLevelIncidentId"
                          :options="slaLevelIncidentOptions" :key="ams.slaLevelIncidentId" label="name" track-by="value"
                          :textLabel="$t('SLA Level Incident')" />
                      </div>

                      <div v-if="ams.slaLevelIncidentId" class="p-3 gap-2 text-blue-500" style="
                          display: grid !important;
                          grid-template-columns: 1fr 1fr 2fr;
                          overflow: visible !important;
                        ">
                        <div v-for="(
                            slaIncidentOption, index
                          ) in slaLevelIncidentOptions" :key="index">
                          <div class="d-flex" v-if="slaIncidentOption.value ==
                            ams.slaLevelIncidentId
                            ">
                            <p>
                              {{ slaIncidentOption.name }}
                            </p>
                            <p class="ml-5">
                              {{ slaIncidentOption.showPriority }}
                            </p>
                            <p class="ml-5">
                              {{ slaIncidentOption.incident }}
                              Hour(s)
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="d-flex">
                      <div class="form-group">
                        <elements-multiselect :style="{ width: '220px' }" v-model="ams.slaLevelChangeId"
                          :options="slaLevelChangeOptions" :key="ams.slaLevelChangeId" label="name" track-by="value"
                          :textLabel="$t('SLA Level Change')" />
                      </div>
                      <div v-if="ams.slaLevelChangeId" class="p-3 gap-2 text-blue-500" style="
                          display: grid !important;
                          grid-template-columns: 1fr 1fr 2fr;
                          overflow: visible !important;
                        ">
                        <div v-for="(
                            slaChangeOption, index
                          ) in slaLevelChangeOptions" :key="index">
                          <div class="d-flex" v-if="slaChangeOption.value ==
                            ams.slaLevelChangeId
                            ">
                            <p>
                              {{ slaChangeOption.name }}
                            </p>
                            <p class="ml-5">
                              {{ slaChangeOption?.showPriority }}
                            </p>
                            <p class="ml-5">
                              {{ slaChangeOption?.change }}
                              Hour(s)
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </td>

            <td>
              {{ ams?.productSoftware }}
            </td>

            <td>
              <div class="d-flex" :style="{ width: '120px' }">
                <elements-input v-model="ams.quantity" @input="
                  $emit(
                    'calculateProductValue',
                    $event,
                    index,
                    'ams',
                    'quantity'
                  )
                  " type="number" />
                {{ ams?.productUnit?.name }}
              </div>
            </td>

            <td>
              <elements-input v-model="ams.hourlyRate" @input="
                $emit(
                  'calculateProductValue',
                  $event,
                  index,
                  'ams',
                  'hourlyRate'
                )
                " type="number" />
            </td>

            <td>
              <elements-input v-model="ams.discount" @input="
                $emit(
                  'calculateProductValue',
                  $event,
                  index,
                  'ams',
                  'discount'
                )
                " type="number" />
            </td>
            <td>
              <div :style="{ width: '160px' }">
                <elements-multiselect v-model="ams.paymentPeriodId" :key="ams.paymentPeriodId"
                  :options="paymentPeriodOptions" label="name" track-by="value" />
              </div>
            </td>
            <td>
              <elements-input v-model="ams.totalNetto" type="number" />
            </td>
            <td>
              <i class="mdi mdi-delete edit-icon" @click="() => {
                amsTableData.splice(index, 1);
              }
                "></i>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="amsTableData?.length > 0" class="d-flex align-items-start justify-content-end">
      <div class="offer-table-totals">
        <ul>
          <li class="">
            <h3>{{ $t("Netto") }}:</h3>
            <p>{{ amsSummery.netto }}</p>
          </li>
          <li v-for="(tax, index) in amsSummery.tax" :key="index" class="">
            <h3>{{ Number(tax) }}% {{ $t("Tax") }} :</h3>
            <p>
              {{
                (
                  Math.round((tax / 100) * amsSummery.netto * 100) / 100
                ).toFixed(2)
              }}
            </p>
          </li>
          <li class="total">
            <h3>{{ $t("Total") }}:</h3>
            <p>
              {{ amsSummery.total }}
            </p>
          </li>
        </ul>

      </div>
    </div>
    <div class="form-group checkbox-group">
      <input class="checkbox-input" id="optionalAms" type="checkbox" v-model="optionalProduct.ams" />
      <label class="checkbox-label" for="optionalAms">{{ $t("Optional Products") }}</label>
    </div>
    <div class="mt-3" v-if="optionalProduct.ams">
      <div class="page-header">
        <div class="page-title">
          <div class="page-title-right">
            <ol class="breadcrumb m-0">
              <li class="breadcrumb-item">
                <span>{{ $t("Application Management Service") }}</span>
              </li>
            </ol>
          </div>
        </div>
        <div class="other-items d-flex justify-center">
          <div class="right-side">
            <NuxtLink class="primary-btn cursor-pointer" @click="$emit('addProduct', { componentType: 'amsOptional' })">
              <elements-icon v-bind:icon="'addIcon'" class="me-2" />
              {{ $t("Add Product") }}
            </NuxtLink>
          </div>
        </div>
      </div>
      <div class="table-responsive">
        <table class="doc-table table">
          <thead>
            <tr class="">
              <th class="">{{ $t("POS") }}</th>
              <th class="">{{ $t("Article Number") }}</th>
              <th class="">{{ $t("NAME") }}</th>
              <th class="">{{ $t("SOFTWARE") }}</th>
              <th class="">{{ $t("Quantity/UNIT") }}</th>
              <th class="">{{ $t("HOURLY RATE") }}</th>
              <th class="">{{ $t("Discount(%)") }}</th>
              <th class="">{{ $t("PERIOD") }}</th>
              <th class="">{{ $t("Netto Total") }}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(ams, index) in optionalAmsTableData" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ ams?.articleNumber }}</td>
              <td>
                <div>
                  {{ ams?.name }}

                  <div>
                    <button @click="
                      $emit('addSlaToggle', {
                        index,
                        componentType: `amsOptional`,
                      })
                      ">
                      {{ ams.slaToggle ? `Remove SLA` : `Add SLA` }}
                    </button>

                    <div v-if="ams.slaToggle">
                      <div class="d-flex">
                        <div class="form-group">
                          <elements-multiselect :style="{ width: '220px' }" v-model="ams.slaInfrastructureId"
                            :options="slaInfrastructureOptions" :key="ams.slaInfrastructureId" label="name"
                            track-by="value" :textLabel="$t('SLA Infrastructure')" />
                        </div>

                        <div v-if="ams.slaInfrastructureId" class="p-3 text-blue-500"
                          style="overflow: visible !important">
                          <div v-for="(
                                  slaInfraOption, index
                                ) in slaInfrastructureOptions" :key="index">
                            <div v-if="slaInfraOption.value ==
                              ams.slaInfrastructureId
                              ">
                              <p>
                                {{ slaInfraOption.name }}/{{
                                  slaInfraOption.includedUsers
                                }}
                                User(s)
                              </p>
                              <p>
                                Additional User
                                {{
                                  formatter(
                                    slaInfraOption.additionalUser,
                                    "de"
                                  )
                                }}/Month
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="d-flex">
                        <div class="form-group">
                          <elements-multiselect :style="{ width: '220px' }" v-model="ams.slaServiceTimeId"
                            :options="slaServiceTimeOptions" :key="ams.slaServiceTimeId" label="name" track-by="value"
                            :textLabel="$t('SLA Service Time')" />
                        </div>

                        <div style="overflow: visible !important" v-if="ams.slaServiceTimeId" class="p-3 text-blue-500">
                          <div v-for="(
                                  slaTimeOption, index
                                ) in slaServiceTimeOptions" :key="index">
                            <div v-if="slaTimeOption.value == ams.slaServiceTimeId
                              ">
                              <p>
                                {{ slaTimeOption.name }}
                                on
                                {{ daysString(slaTimeOption?.days) }}
                                from
                                {{ slaTimeOption.from }}
                                to
                                {{ slaTimeOption.to }}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="d-flex">
                        <div class="form-group">
                          <elements-multiselect :style="{ width: '220px' }" v-model="ams.slaLevelIncidentId"
                            :options="slaLevelIncidentOptions" :key="ams.slaLevelIncidentId" label="name" track-by="value"
                            :textLabel="$t('SLA Level Incident')" />
                        </div>

                        <div v-if="ams.slaLevelIncidentId" class="p-3 gap-2 text-blue-500" style="
                                display: grid !important;
                                grid-template-columns: 1fr 1fr 2fr;
                                overflow: visible !important;
                              ">
                          <div v-for="(
                                  slaIncidentOption, index
                                ) in slaLevelIncidentOptions" :key="index">
                            <div class="d-flex" v-if="slaIncidentOption.value ==
                              ams.slaLevelIncidentId
                              ">
                              <p>
                                {{ slaIncidentOption.name }}
                              </p>
                              <p class="ml-5">
                                {{ slaIncidentOption.showPriority }}
                              </p>
                              <p class="ml-5">
                                {{ slaIncidentOption.incident }}
                                Hour(s)
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="d-flex">
                        <div class="form-group">
                          <elements-multiselect :style="{ width: '220px' }" v-model="ams.slaLevelChangeId"
                            :options="slaLevelChangeOptions" :key="ams.slaLevelChangeId" label="name" track-by="value"
                            :textLabel="$t('SLA Level Change')" />
                        </div>
                        <div v-if="ams.slaLevelChangeId" class="p-3 gap-2 text-blue-500" style="
                                display: grid !important;
                                grid-template-columns: 1fr 1fr 2fr;
                                overflow: visible !important;
                              ">
                          <div v-for="(
                                  slaChangeOption, index
                                ) in slaLevelChangeOptions" :key="index">
                            <div class="d-flex" v-if="slaChangeOption.value ==
                              ams.slaLevelChangeId
                              ">
                              <p>
                                {{ slaChangeOption.name }}
                              </p>
                              <p class="ml-5">
                                {{ slaChangeOption?.showPriority }}
                              </p>
                              <p class="ml-5">
                                {{ slaChangeOption?.change }}
                                Hour(s)
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </td>

              <td>
                {{ ams?.productSoftware }}
              </td>

              <td>
                <div class="d-flex" :style="{ width: '120px' }">
                  <elements-input v-model="ams.quantity" @input="
                    $emit(
                      'calculateProductValue',
                      $event,
                      index,
                      'amsOptional',
                      'quantity'
                    )
                    " type="number" />
                  {{ ams?.productUnit?.name }}
                </div>
              </td>

              <td>
                <elements-input v-model="ams.hourlyRate" @input="
                  $emit(
                    'calculateProductValue',
                    $event,
                    index,
                    'amsOptional',
                    'hourlyRate'
                  )
                  " type="number" />
              </td>

              <td>
                <elements-input v-model="ams.discount" @input="
                  $emit(
                    'calculateProductValue',
                    $event,
                    index,
                    'amsOptional',
                    'discount'
                  )
                  " type="number" />
              </td>
              <td>
                <div :style="{ width: '160px' }">
                  <elements-multiselect v-model="ams.paymentPeriodId" :key="ams.paymentPeriodId"
                    :options="paymentPeriodOptions" label="name" track-by="value" />
                </div>
              </td>
              <td>
                <elements-input v-model="ams.totalNetto" type="number" />
              </td>
              <td>
                <i class="mdi mdi-delete edit-icon" @click="() => {
                  optionalAmsTableData.splice(index, 1);
                }
                  "></i>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
