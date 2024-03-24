<script setup lang="ts">
import commonCode from "~/composables/common";
import {reactive, ref} from "vue";
import {required} from "@vuelidate/validators/dist/index";
import {useVuelidate} from "@vuelidate/core/dist/index";
import {routes} from "~/utils/apiRoutes";
import genericFeatures from "~/composables/generic";
import genericFunctionality from "~/composables/genericFunctionality";
import {genericShowRequest} from "~/utils/apiRequests";
import {useAuthStore} from "~/store/auth";

function addDays(date: string | number | Date, days: number) {
    const d = new Date(date.valueOf());
    d.setDate(d.getDate() + days);
    return d;
}
Date.prototype.addDays = function (days) {
    return addDays(this, days);
};

const props = defineProps({
    employees : {
        type : Object,
        default: {}
    },
    step : {
        type : Number,
        default: 1
    },
    userId : {
        type : String,
        default: ''
    },
    defaultEmployeeId : {
        type : Number,
        default: ''
    }
})

const
    { submitted, isLoading, apiRoute, storeFunc } = genericFunctionality(),
    { router, Toast } = commonCode(),
    auth = useAuthStore(),
    { t } = useI18n(),
    differenceInDays = ref(0), // difference between the startDate and endDate
    additionalLeaves = ref(0),
    expiryMonth = ref(0),
    dateOfExpiry = ref(0),
    daysOffAtATime = ref(0),
    requiredVacationDays = ref(0),
    profileData = ref({}),
    teamLeads = ref([]),
    jobData = ref({}),
    state = reactive({
        employeeId: props.defaultEmployeeId,
        leaveType: "whole",
        startDate: new Date().toISOString().substring(0, 10),
        endDate: "",
        requiredVacationDays: "",
        isSpecialLeave: "0",
        specialLeaveType: "",
        comments: "",
        replacements: [],
    }),
    weekDays = {
        0: "sun",
        1: "mon",
        2: "tue",
        3: "wed",
        4: "thu",
        5: "fri",
        6: "sat",
    },
    validationRules = {
        startDate: { required },
        replacements: { required },
    },
    v$ = useVuelidate(validationRules, state),

    fetchProfileData = async (id: string | null) => {
        await genericShowRequest(routes.USER_PROFILE, id)
            .then((response) => {
                if (!!response?.success) {
                    profileData.value = response?.data
                    state.employeeId = response?.data?.id
                }
            })
    },

    store = async () => {
        submitted.value = true;
        //stop here if form is invalid
        v$.value.$touch();
        if (v$.value.$invalid) {
            submitted.value = false;
            return false;
        }else{
            apiRoute.value = routes.VACATION_REQUEST;
            const payload = {
                ...state,
                employeeId:  state.employeeId,
                endDate:
                    state.leaveType === "half"
                        ? state.startDate
                        : state.endDate,
                requiredVacationDays: requiredVacationDays.value,

            }
            await storeFunc(payload)
            //await fetchProfileData(props.userId)
        }
    },
    /**
     * upon 'specialLeaveType' selection the end date must be set based on the selected special leave type
     */
    specialLeaveSelected = () => {
        if (state.specialLeaveType === "death-of-relative") {
            const startDate = new Date(state.startDate); // Create a Date instance
            const newEndDate = addDays(startDate, 2);    // Add days to the start date
            // Format the newEndDate as "YYYY-MM-DD" format
            // Update state.endDate with the formatted date
            state.endDate = newEndDate.toISOString().substring(0, 10);

            daysOffAtATime.value = requiredVacationDays.value = 3;

        } else if (state.specialLeaveType === "own-wedding") {
            state.endDate = state.startDate; // No need to add days
            daysOffAtATime.value = requiredVacationDays.value = 1;
        } else if (state.specialLeaveType === "birth-of-child") {
            state.endDate = state.startDate; // No need to add days
            daysOffAtATime.value = requiredVacationDays.value = 1;
        }
    },

    changeDaysOffAtAtime = async () => {
        await nextTick();
        daysOffAtATime.value = requiredVacationDays.value;
    },

    matchDates = (date1, date2) => {
        return (
            date1.getDate() == date2.getDate() &&
            date1.getMonth() == date2.getMonth() &&
            date1.getFullYear() == date2.getFullYear()
        );
    },

     calculateDaysOffAtATime= async () => {
        await nextTick();
             let date1 = new Date(state.startDate);
             let date2 = new Date(
                 state.leaveType === "half"
                ? state.startDate
                : state.endDate
        );

        let weekEndDaysCount = 0;

        if (date1 && date2) {
            let startDate = date1;
            let endDate = date2;
            if (startDate.getDay() == 0 || startDate.getDay() == 6) {
                weekEndDaysCount += 1;
                startDate = startDate.addDays(1);
                if (matchDates(startDate, endDate)) {
                    if (startDate.getDay() == 0 || startDate.getDay() == 6) {
                        weekEndDaysCount += 1;
                    }
                }
            }
            if (startDate <= endDate) {
                let wentInsideTheLoop = false;
                while (!matchDates(startDate, endDate)) {
                    wentInsideTheLoop = true;
                    if (startDate.getDay() == 0 || startDate.getDay() == 6) {
                        weekEndDaysCount += 1;
                    }
                    startDate = startDate.addDays(1);
                }
                if (matchDates(startDate, endDate) && wentInsideTheLoop) {
                    if (startDate.getDay() == 0 || startDate.getDay() == 6) {
                        weekEndDaysCount += 1;
                    }
                }
            }
        }

        if (state.leaveType === "half") {
            date1.setHours(
                state.startTime?.split(":")?.[0] ?? "00",
                state.startTime?.split(":")?.[1] ?? "00",
                "00"
            );
            date2.setHours(
                state.endTime?.split(":")?.[0] ?? "00",
                state.endTime?.split(":")?.[1] ?? "00",
                "00"
            );
        }

        // To calculate the time difference of two dates
        let differenceInTime = date2.getTime() - date1.getTime();

        const workDay = jobData.value?.workHours?.find((day) => {
            return day.days?.[0] === this.weekDays[date1.getDay()];
        });

        // To calculate the no. of days between two dates
        differenceInDays.value = 0;
        if (state.leaveType === "whole") {
            differenceInDays.value = differenceInTime / (1000 * 3600 * 24);
            differenceInDays.value += 1; // since we are calculating the difference between start and end date, there is always a difference of 1, this offsets that
        } else {
            differenceInDays.value = 0.5;
        }
             differenceInDays.value -= weekEndDaysCount;
        daysOffAtATime.value =
            isNaN(differenceInDays.value) || differenceInDays.value < 0
                ? 0
                : differenceInDays.value.toFixed(2);
        requiredVacationDays.value = daysOffAtATime.value;
         // if the leave is special then recalculate the requiredVacationDays, daysOffAtTheTime
         if (state.isSpecialLeave && state.specialLeaveType) {
             specialLeaveSelected();
         }
    },
    getManagers = async () => {
        await genericShowRequest(routes.VACATION_APP_MANAGER, state.employeeId)
            .then((response) => {
                if (!!response?.success) {
                    teamLeads.value = response?.data
                }
            })
    }

//computed Props

const currentYear = computed(() => new Date().getFullYear());

const expiryDate = computed(() => {
    const formattedMonth = expiryMonth.value < 10 ? `0${expiryMonth.value}` : expiryMonth.value;
    return `01-${formattedMonth}-${new Date().getFullYear()}`;
});

const doesErrorExist = computed(() => this.errors['endTime']?.length);

// Assuming mapGetters and other values are imported and accessible

const expiryShouldCount = computed(() => {
    const currentMonth = new Date().getMonth() + 1;
    return currentMonth < expiryMonth.value;
});

const remainingHolidays = computed(() => {
    let totalHolidays =
        (+profileData.value?.leaveInformation?.totalRemainingLeaves ?? 0) -
        +daysOffAtATime.value;
    if (expiryShouldCount.value) {
        totalHolidays += profileData.value?.totalLeavesTaken ?? 0;
    }
    if (totalHolidays < 0) {
        additionalLeaves.value = totalHolidays;
        return 0;
    }
    return totalHolidays.toFixed(2);
});
//
const usersFilteredWithoutCurrentUser = computed(() =>
    props.employees?.filter(user => user.userId !== props.userId) ?? props.employees
);

const chartOptions = computed(() => {
    const remaining = +remainingHolidays.value;
    const pending = +profileData.value?.leaveInformation?.pending;
    const approved = +profileData.value?.leaveInformation?.totalLeavesTaken;

    return {
        series: [
            remaining < 0 ? 0 : remaining,
            pending,
            approved,
        ],
        chartOptions: {
            chart: {
                width: 300,
                type: 'pie',
            },
            labels: ['Remaining', 'Planned', 'Consumed'],
            legend: {
                position: 'top',
            },
            fill: {
                colors: ['#008000', '#FFA500', '#FF0000']
            },
            colors:['#008000', '#FFA500', '#FF0000'],
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200,
                        },
                        legend: {
                            position: 'bottom',
                        },
                    },
                },
            ],
        },

    };
});

watch(
    () => state.startDate,
    (val) => {
        if (val > state.endDate) {
            state.endDate = val;
        }
    }
);
watch(
    () => state.employeeId,
    () => {
        let obj = props.employees?.filter(user => user.value === state.employeeId)
        if(!!obj){
            fetchProfileData(obj[0].userId)
        }
        getManagers()
    }
);
watch(
    () => state.leaveType,
    () => {
        daysOffAtATime.value = 0;
        requiredVacationDays.value = 0;
        calculateDaysOffAtATime();
    }
);
watch(
    () => props.defaultEmployeeId,
    () => {
        state.employeeId = props.defaultEmployeeId
    }
);
</script>

<template>
<div>
  <div class="">
      <div class="row">
          <div class="col-lg-4">
              <div class="form-group">
                  <elements-multiselect
                      :key="state.employeeId"
                      v-model="state.employeeId"
                      :options="employees"
                      label="text"
                      track-by="value"
                      :textLabel="$t('User')"
                  />
              </div>
          </div>
      </div>
      <div class="row mt-4">
          <div class="col-lg-8">
              <div class="card h-auto">
                  <div class="card-header">
                      <h3 class="card-title">{{ $t('Application Data')}}</h3>
                  </div>
                  <div class="card-body">
                      <form @submit.prevent="store">
                        <div class=" d-flex align-items-center">
                              <div class="form-group me-3">
                                  <input
                                      :checked="state.leaveType === 'whole' ? 'checked' : ''"
                                        v-model="state.leaveType"
                                        type="radio"
                                        class="me-2"
                                        name="leaveType"
                                        value="whole"
                                        id="full-day"
                                  >
                                  <label for="">{{ $t('Full Day')}}</label>
                              </div>
                              <div class="form-group">
                                  <input
                                        v-model="state.leaveType"
                                        type="radio"
                                        class="me-2"
                                        name="leaveType"
                                        id="half-day"
                                        value="half"
                                  >
                                  <label for="">{{ $t('Half Day')}}</label>
                              </div>
                        </div>
                          <div class="row">
                              <div class="col-lg-6">
                                  <div class="form-group">
                                      <elements-input
                                          @input="calculateDaysOffAtATime"
                                          v-model="state.startDate"
                                          :label="$t('Start Date')"
                                          :required="true"
                                          :disabled="submitted"
                                          :class="{ 'is-invalid': v$.startDate.$error }"
                                          type="date"
                                      />
                                  </div>
                                  <div v-if="v$.startDate.$error" class="invalid-feedback">
                                        <span class="text-danger" v-if="v$.startDate.required">{{ $t('This value is required') }}</span><br>
                                  </div>
                              </div>
                              <div class="col-lg-6" v-show="state.leaveType === 'whole'">
                                  <div class="form-group">
                                      <elements-input
                                          @input="calculateDaysOffAtATime"
                                          v-model="state.endDate"
                                          :label="$t('End Date')"
                                          :required="true"
                                          :disabled="state.isSpecialLeave == 1 || submitted"
                                          type="date"
                                      />
                                  </div>
                              </div>
                          </div>
                          <div class="row">
                              <div class="col-lg-6">
                                  <div class="form-group">
                                      <elements-multiselect
                                          v-model="state.replacements"
                                          :options="usersFilteredWithoutCurrentUser"
                                          :multiple="true"
                                          label="text"
                                          track-by="value"
                                          :textLabel="$t('Stand in')"
                                          :required="true"
                                      />
                                      <div v-if="v$.replacements.$error" class="invalid-feedback">
                                          <span class="text-danger" v-if="v$.replacements.required">{{ $t('This value is required') }}</span><br>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <span v-show="state.leaveType === 'whole'">
                              <div class="mt-2">
                               <label for="">{{ $t('Special Leave')}}:</label>
                              </div>
                              <div class="d-flex align-items-center mt-1">
                                  <div class="form-group me-3 mt-0">
                                      <input
                                          v-model="state.isSpecialLeave"
                                          name="specialLeave"
                                          id="yes"
                                          class="me-2"
                                          type="radio"
                                          value="1"
                                      />
                                      <label for="yes">{{ $t('Yes')}}</label>
                                  </div>
                                  <div class="form-group mt-0">
                                      <input
                                          v-model="state.isSpecialLeave"
                                          name="specialLeave"
                                          class="me-2"
                                          id="no"
                                          type="radio"
                                          value="0"
                                      />
                                      <label for="no">{{ $t('No')}}</label>
                                  </div>
                              </div>
                              <div class="row">
                                  <div class="col-lg-6 col-md-12">
                                      <div class="form-group">
                                          <elements-select
                                              v-if="state.isSpecialLeave == '1'"
                                              v-model="state.specialLeaveType"
                                              :required="true"
                                              :label="$t('Special Leave Type')"
                                              @update:model-value="specialLeaveSelected"
                                          >
                                              <option value="injury">{{ $t("Injury") }}</option>
                                              <option value="death-of-relative">
                                                  {{ $t("Death of a close relative (3 Days)") }}
                                              </option>
                                              <option value="own-wedding">
                                                  {{ $t("(own) wedding (1 Day)") }}
                                              </option>
                                              <option value="birth-of-child">
                                                  {{ $t("Birth of one's own child (1 Day)") }}
                                              </option>
                                          </elements-select>
                                      </div>
                                  </div>
                              </div>
                          </span>

                          <div class="row">
                              <div class="col-lg-12">
                                  <div class="form-group textarea">
                                      <elements-text-area
                                          v-model="state.comments"
                                          :label="$t('Comments')"
                                      />
                                  </div>
                              </div>
                              <div class="col-12 mt-3">
                                  <submittal-button
                                      :isLoading="submitted"
                                      :iconName="('trueIcon')"
                                      :buttonName="$t('Apply for leave')"
                                  />
                              </div>
                          </div>
                     </form>
                      <div class="mt-3 d-flex justify-content-around bg-light grid grid-cols-3 gap-2 p-2">
                          <div class="flex flex-column justify-content-center align-items-center border-end">
                              <p>{{ $t("Days Off At A Time") }}</p>
                              <p class="text-muted font-weight-bold">{{ daysOffAtATime ?? 0 }} {{ $t("Day(s)") }}</p>
                          </div>
                          <div class="flex flex-column justify-content-center align-items-center border-end">
                              <p>{{ $t("Required Vacation Days") }}</p>
                              <div class="d-flex">
                                  <input
                                      @input="changeDaysOffAtAtime"
                                      type="number"
                                      :min="state.leaveType === 'whole' ? 1 : 0.5"
                                      :max="differenceInDays" v-model="requiredVacationDays"
                                      style="max-width: 4rem"
                                      :class="{'border-0' : state.leaveType === 'half' || state.isSpecialLeave == 1}"
                                      :disabled="
                                        state.leaveType === 'half' ||
                                        state.isSpecialLeave == 1
                                    "
                                  />
                                  <p class="text-muted font-weight-bold ms-2">{{ $t("Day(s)") }}</p>
                              </div>
                          </div>
                          <div class="flex flex-column justify-content-center align-items-center">
                              <p>{{ $t("Remaining Holidays") }} ({{ currentYear }})</p>
                              <p class="text-muted font-weight-bold">{{ remainingHolidays ?? 0 }} {{ $t("Day(s)") }}</p>
                          </div>
                      </div>

                  </div>
              </div>
              <div class="card mt-4 h-auto">
                  <div class="card-header">
                      <h3 class="card-title">{{ $t('Application Manager (one must agree)')}}</h3>
                  </div>
                  <div class="card-body mt-3 " >
                      <ul class="app-managers">
                          <li v-for="manager in teamLeads">
                              <div class="img">
                                  <img src="@/assets/images/user.png" alt="">
                              </div>
                              <div>
                                  <h4>{{manager?.name ?? '-'}}</h4>
                                  <p>{{manager?.jobTitle ?? '-'}}</p>
                              </div>

                          </li>
                      </ul>
                  </div>
              </div>
          </div>
          <div class="col-lg-4">
              <div class="card  rounded shadow p-2">
                  <p class="fw-bold">{{ $t("My Profile") }}</p>
                  <div class="user-details">
                      <div class="d-flex justify-content-center align-items-center mt-3">
                          <div class="profile user">
                              <img v-if="!!profileData?.profilePicture" class="" :src="profileData?.profilePicture" >
                              <img v-else class="" src="@/assets/images/user.png">
                          </div>

                          <div id="chart">
                              <apexchart
                                  type="pie"
                                  :key="chartOptions.series"
                                  :options="chartOptions.chartOptions"
                                  :series="chartOptions.series"
                                  />
                          </div>
                      </div>
                      <div class="d-flex flex-column justify-content-center align-items-center mt-2">
                          <p class="text-muted" style="font-size: 1.2rem">
                              {{ profileData?.name ?? '-' }}
                          </p>
                          <p>{{ jobData?.locationId?.name ?? "" }}</p>
                          <p>{{ jobData?.departmentId?.name ?? "" }}</p>
                          <p>{{ $t("Personalnr:") }} {{ jobData?.personalNumber ?? "" }}</p>
                      </div>
                      <div class="mt-3 row">
                          <div class="col d-flex flex-column justify-content-center align-items-center">
                              <p class="mb-3">{{ $t("Hourly Account:") }}</p>
                              <p>{{ $t("Remaining Holidays:") }}</p>
                              <p>{{ $t("Planned Holidays:") }}</p>
                              <p>{{ $t("Taken From It:") }}</p>
                              <p>{{ $t("Already Expired:") }}</p>
                              <p>{{ $t("Expires on") + " " + dateOfExpiry + ":" }}</p>
                              <p>{{ $t("Holidays") + " " + currentYear + ":" }}</p>
                              <p>{{ $t("Additional Leaves:") }}</p>
                              <p>{{ $t("Vacation Entered:") }}</p>
                              <p>{{ $t("Of Which Requested:") }}</p>
                              <p>{{ $t("Released From It:") }}</p>
                              <p>{{ $t("Started From It:") }}</p>
                              <p>{{ $t("Remaining Holidays") + " " + currentYear + ":" }}</p>
                              <p>{{ $t("Illness") + " " + currentYear + ":" }}</p>
                              <p>{{ $t("Special Leave") + " " + currentYear + ":" }}</p>
                          </div>
                          <div class="col d-flex flex-column justify-content-center align-items-center">
                              <p class="mb-3">{{ profileData?.leaveInformation?.totalWorkedHours ?? 0 }} Hr(s)</p>
                              <p>{{ remainingHolidays }} {{ $t("Day(s)") }}.</p>
                              <p>{{ +profileData?.leaveInformation?.pending }} {{ $t("Day(s)") }}.</p>
                              <p>{{ profileData?.leaveInformation?.totalHolidaysTakenCurrent ?? 0 }} {{ $t("Day(s)") }}.</p>
                              <p>{{ profileData.leaveInformation?.expiresLeaves ?? 0 }} {{ $t("Day(s)") }}.</p>
                              <p>{{ profileData?.leaveInformation?.previousYearRemainingLeaves ?? 0 }} {{ $t("Day(s)") }}</p>
                              <p>{{ profileData?.leaveInformation?.annualLeaves ?? 0 }} {{ $t("Day(s)") }}.</p>
                              <p>{{ profileData?.leaveInformation?.additionalLeaves ?? 0 }} {{ $t("Day(s)") }}.</p>
                              <p>0,0 {{ $t("Day(s)") }}.</p>
                              <p>0,0 {{ $t("Day(s)") }}.</p>
                              <p>0,0 {{ $t("Day(s)") }}.</p>
                              <p>0,0 {{ $t("Day(s)") }}.</p>
                              <p>{{ profileData?.leaveInformation?.currentYearRemaining ?? 0 }} {{ $t("Day(s)") }}.</p>
                              <p>{{ profileData?.leaveInformation?.illnessLeaves ?? 0 }} {{ $t("Day(s)") }}.</p>
                              <p>{{ profileData?.leaveInformation?.specialLeaves ?? 0 }} {{ $t("Day(s)") }}.</p>
                          </div>
                      </div>
                  </div>
              </div>

          </div>
      </div>
  </div>
</div>
</template>