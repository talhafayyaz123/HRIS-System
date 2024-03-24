<script setup lang="ts">
import commonCode from "~/composables/common";
import {reactive, ref} from "vue";
import {required} from "@vuelidate/validators/dist/index";
import {useVuelidate} from "@vuelidate/core/dist/index";
import {routes} from "~/utils/apiRoutes";
import genericFeatures from "~/composables/generic";
import genericFunctionality from "~/composables/genericFunctionality";
import {genericShowRequest, genericUpdateRequest} from "~/utils/apiRequests";
import {useAuthStore} from "~/store/auth";

function addDays(date: string | number | Date, days: number) {
    const d = new Date(date.valueOf());
    d.setDate(d.getDate() + days);
    return d;
}
Date.prototype.addDays = function (days) {
    return addDays(this, days);
};
const props = defineProps(["showModal", "hideModal", "employees", "vacationRequestId"]);
let
    { submitted, isLoading, apiRoute, updateFunc, showFunc } = genericFunctionality(),
    { showGenericListing } = genericFeatures(),
    { router, Toast } = commonCode(),
    auth = useAuthStore(),
    userId = localStorage.getItem('user_id') || null ,
    { t } = useI18n(),
    series =  ref([44, 55, 13, 43, 22]),
    differenceInDays = ref(0), // difference between the startDate and endDate
    additionalLeaves = ref(0),
    expiryMonth = ref(0),
    dateOfExpiry = ref(0),
    daysOffAtATime = ref(0),
    requiredVacationDays = ref(0),
    profileData = ref({}),
    jobData = ref({}),
    state = reactive({
        employeeId: "",
        leaveType: "whole",
        startDate: new Date().toISOString().substring(0, 10),
        endDate: "",
        requiredVacationDays: "",
        isSpecialLeave: "0",
        specialLeaveType: "",
        comments: "",
        replacements: [],
    }),
    options = [
        { value: 'batman', name: 'Batman' },
        { value: 'robin', name: 'Robin' },
        { value: 'joker', name: 'Joker' },
    ],
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

     usersFilteredWithoutCurrentUser = computed(() =>
        props.employees?.filter(user => user.userId !== userId) ?? props.employees
    ),

    fetchProfileData = async (id: string | null) => {
        await genericShowRequest(routes.USER_PROFILE, id)
            .then((response) => {
                if (!!response?.success) {
                    profileData.value = response?.data
                }
            })
    },

    update = async () => {
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
                employeeId:  state.employeeId ?? userId,
                endDate:
                    state.leaveType === "half"
                        ? state.startDate
                        : state.endDate,
                requiredVacationDays: requiredVacationDays.value,

            }
            genericUpdateRequest(apiRoute.value, props.vacationRequestId, payload)
                .then((response) => {
                    Toast.fire({icon: 'success', title: 'Record updated successfully!'})
                    props.hideModal()
                })
                .catch((error) => {
                    Toast.fire({icon: 'error', title: 'Something went wrong'})
                }).finally(() =>{
                isLoading.value = false;
                submitted.value = false;
            });

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

    refresh = async() => {
        let response = await showFunc(props.vacationRequestId)
        if (response?.success) {
            const requestData = response?.data
            state.employeeId = requestData?.employeeId,
            state.leaveType = requestData?.leaveType ?? 'whole',
            state.startDate = requestData?.startDate ?? new Date().toISOString().substring(0, 10),
            state.endDate = requestData?.endDate,
            state.requiredVacationDays =  requestData?.requiredVacationDays,
            daysOffAtATime.value = requiredVacationDays.value =  requestData?.requiredVacationDays,
            state.isSpecialLeave = requestData?.isSpecialLeave ? '1' : '0',
            state.specialLeaveType = requestData?.specialLeaveType ?? "",
            state.comments = requestData?.comments ?? "",
            state.replacements = requestData?.replacementIds ??[]
        }
    }

apiRoute.value = routes.VACATION_REQUEST
refresh()
fetchProfileData(userId);


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


watch(
    () => state.startDate,
    (val) => {
        if (val > state.endDate) {
            state.endDate = val;
        }
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
</script>

<template>
    <form @submit.prevent="update">
      <div class=" d-flex align-items-center">
        <div class="form-group me-3">
          <input :checked="state.leaveType === 'whole' ? 'checked' : ''" v-model="state.leaveType" type="radio"
            class="me-2" name="leaveType" value="whole" id="full-day">
          <label for="">{{ $t('Full Day') }}</label>
        </div>
        <div class="form-group">
          <input v-model="state.leaveType" type="radio" class="me-2" name="leaveType" id="half-day" value="half">
          <label for="">{{ $t('Half Day') }}</label>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-12">
          <div class="form-group">
            <elements-input @input="calculateDaysOffAtATime" v-model="state.startDate" :label="$t('Start Date')"
              :required="true" :disabled="submitted" :class="{ 'is-invalid': v$.startDate.$error }" type="date" />
          </div>
          <div v-if="v$.startDate.$error" class="invalid-feedback">
            <span class="text-danger" v-if="v$.startDate.required">{{ $t('This value is required')
            }}</span><br>
          </div>
        </div>
        <div class="col-lg-12" v-show="state.leaveType === 'whole'">
          <div class="form-group">
            <elements-input @input="calculateDaysOffAtATime" v-model="state.endDate" :label="$t('End Date')"
              :required="true" :disabled="state.isSpecialLeave == 1 || submitted" type="date" />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-12">
          <div class="form-group">
            <elements-multiselect
                    :key="state.replacements"
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
          <label for="">{{ $t('Special Leave') }}:</label>
        </div>
        <div class="d-flex align-items-center mt-1">
          <div class="form-group me-3 mt-0">
            <input v-model="state.isSpecialLeave" name="specialLeave" id="yes" class="me-2" type="radio" value="1" />
            <label for="yes">{{ $t('Yes') }}</label>
          </div>
          <div class="form-group mt-0">
            <input v-model="state.isSpecialLeave" name="specialLeave" class="me-2" id="no" type="radio" value="0" />
            <label for="no">{{ $t('No') }}</label>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-12 col-md-12">
            <div class="form-group">
              <elements-select v-if="state.isSpecialLeave == '1'" v-model="state.specialLeaveType" :required="true"
                :label="$t('Special Leave Type')" @update:model-value="specialLeaveSelected">
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
            <elements-text-area v-model="state.comments" :label="$t('Comments')" />
          </div>
        </div>
      </div>
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
      <div class="d-flex align-items-center justify-content-end mt-3">
          <button type="button" class="primary-btn me-2" data-bs-dismiss="modal" @click="() => props.hideModal()">
              Close
          </button>
          <submittal-button
                :isLoading="submitted"
                :iconName="('trueIcon')"
                :buttonName="$t('Update')"
          />
      </div>
    </form>



</template>
