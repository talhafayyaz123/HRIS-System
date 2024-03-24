<script setup lang="ts">
import { ref, reactive } from "vue";
import commonCode from "~/composables/common";
import {routes} from "~/utils/apiRoutes";
import genericFeatures from "~/composables/generic";
import { vacationCalendarListing} from "~/utils/apiRequests";
import { nextTick } from 'vue';
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";



const props = defineProps({
    employees : {
        type : Object,
        default: {}
    },
    userId : {
        type : String,
        default: ''
    },
    defaultEmployeeId : {
        type : Number,
        default: 1
    },
    tasks: {
        default: () => [],
    },
    milestones: {
        default: () => [],
    },
})
const now = new Date();

const
    { $listen, $event } = useNuxtApp(),
    { router, Toast } = commonCode(),
    { showGenericListing } = genericFeatures(),
    userId = localStorage.getItem('user_id') || null ,
    { t } = useI18n(),
    loading = ref(false),
    userPerPage = ref(0),
    perPage = ref(25),
    vacationCalendar = ref([]),
    departments = ref([]),
    locations = ref([]),
    selectedDate = now,
    currentMonth = ref(""),
    currentYear = ref(""),
    weekViewBoundary = ref({}),
    teams = ref([]),
    resources = ref([]),
    cleared = ref(true),
    show = ref(false),
    activeView = ref('week'),
    view = ref('week'),
    activeTab = ref('daily'),
    page = ref(1),
    events = ref( [
        {
            start: new Date(new Date(now).setHours(1, 0, 0)),
            end: new Date(new Date(now).setHours(4, 0, 0)),
            allDay: true,
            title: "Event 1",
            split: 2,
            resourceId: 1,
        },
    ]),
    daySplits =  ref([
        { label: "Tom", color: "green" },
        { label: "Kate", color: "pink" },
    ]),
    vacationTypes= ref(["Requested", "Approved"]),
    state = reactive({
        search: "",
        status: null,
        departmentId: null,
        locationId: null,
        teamId: null,
        showBalance: true,
        leaveType: null,
        sortBy: "employees",
        groupBy: "employees"
    }),
    statuses = [
        {
            id: 1,
            value: "approved",
            label: "Approved",
        },
        {
            id: 2,
            value: "pending",
            label: "Pending",
        },
        {
            id: 3,
            value: "rejected",
            label: "Rejected",
        },
    ],
    typesOfAbsence = [
        {
            id: 1,
            value: "whole",
            label: "Whole",
        },
        {
            id: 2,
            value: "half",
            label: "Half",
        },
    ],
    monthsData = [
        "january",
        "february",
        "march",
        "april",
        "may",
        "june",
        "july",
        "august",
        "september",
        "october",
        "november",
        "december",
    ],
    breadCrumbsConfig = [
        {
            text: "Admin portal",
            to: "/",
        },
        {
            text: "Vacation Calendar",
            active: true,
        },
    ],
    step = ref(1),
    { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { title } = useTitle("Vacation Calendar"),
    myVacations = (payload: any) =>{
        vacationCalendarListing({
                leaveType: state.leaveType,
                teamId: state.teamId,
                departmentId: state.departmentId,
                locationId: state.locationId,
                status: state.status,
                sortBy: state.sortBy,
                groupBy: state.sortBy,
                userPerPage: perPage.value,
                search: state.search
            },
            payload
        ).then((response) => {
            vacationCalendar.value = response?.data
        }).finally(() =>  {
            createGroups()
        })
    },
    createGroups = () => {
        if (state.groupBy === "departments" || state.groupBy === "teams") {
            let resources = {};

            (vacationCalendar?.value ?? []).forEach((item, index) => {
                let groups = [];
                if (state.groupBy === "departments") {
                    groups = item.departments;
                } else if (state.groupBy === "teams") {
                    groups = item.teams;
                }
                groups.forEach((departmentOrTeam: any) => {
                    if (!resources[departmentOrTeam.id]) {
                        resources[departmentOrTeam.id] = {
                            id: departmentOrTeam.id,
                            label: departmentOrTeam.name,
                            group: true,
                            events: [
                                {
                                    id: index + 1,
                                    profilePic: item?.profilePictureUrl,
                                    label: item?.name,
                                    value: "0",
                                    estimatedTime: "0",
                                    spentTime: "0",
                                    neededTime: "0",
                                    rowExpanded: false,
                                    employeeJobDetails:
                                        item?.employeeJobDetails ?? null,
                                    timeTrackerDetails:
                                        item?.timeTrackerDetails ?? null,
                                    weeklyWorkedDetails:
                                        item?.weeklyWorkedDetails ?? null,
                                    events: item?.vacationDetails ?? [],
                                },
                            ],
                        };
                    } else {
                        resources[departmentOrTeam.id].events = [
                            ...resources[departmentOrTeam.id].events,
                            {
                                id: index + 1,
                                profilePic: item?.profilePictureUrl,
                                label: item?.name,
                                value: "0",
                                estimatedTime: "0",
                                spentTime: "0",
                                neededTime: "0",
                                rowExpanded: false,
                                employeeJobDetails:
                                    item?.employeeJobDetails ?? null,
                                timeTrackerDetails:
                                    item?.timeTrackerDetails ?? null,
                                weeklyWorkedDetails:
                                    item?.weeklyWorkedDetails ?? null,
                                events: item?.vacationDetails ?? [],
                            },
                        ];
                    }
                });
            })
        }
        else {
            let resourcesArray = [];
            (vacationCalendar.value ?? []).map((item, index) => {
                resourcesArray.push({
                    id: index + 1,
                    profilePic: item?.profilePictureUrl,
                    group: false,
                    label: item?.name,
                    value: "0",
                    estimatedTime: "0",
                    spentTime: "0",
                    neededTime: "0",
                    rowExpanded: false,
                    employeeJobDetails: item?.employeeJobDetails ?? null,
                    timeTrackerDetails: item?.timeTrackerDetails ?? null,
                    weeklyWorkedDetails: item?.weeklyWorkedDetails ?? null,
                    events: item?.vacationDetails ?? [],
                });
            });
            resources.value = [...resourcesArray];
        }
    },
    loadMore = () => {
        //this.$store.commit("vacationCalendarLoader", true);
        perPage.value += 10;
        search();
    },

    weekViewBoundaryChanged = (event: {})  =>{
        weekViewBoundary.value = event;
    },
    search = async () => {
        try {
            const clonedResources = JSON.parse(JSON.stringify(resources.value));
            await nextTick();
            clonedResources.splice(0, clonedResources.length);

            const payload = {
                calendarType: activeTab.value,
                startDate: '2023-08-01',
                endDate: '2023-08-31',
                // startDate: weekViewBoundary.value?.startDate,
                // endDate: weekViewBoundary.value?.endDate,
                //calendarDay: `${currentYear.value}-${monthsData.indexOf(currentMonth.value) + 1}-01`,
            };

            myVacations(payload); // Call myVacations function
        } catch (e) {
            console.log(e);
        } finally {
            await nextTick(() => {
                $event("recomputeWorkHours", true);
            });
        }
    },
    fetchTeamsByDepartment = async() => {
        try {
            await nextTick();
            // if (state?.departmentId?.id) {
            //     const response = await this.$store.dispatch(
            //         "userTeams/getTeamsByDepartment",
            //         this.form?.departmentId?.id
            //     );
            //     teams.value = response?.data?.data ?? [];
            //     resetDataForDependents();
            // }
        } catch (e) {
            console.log(e);
        }
    },
    updateEvent = (event) => {
        nextTick(async () => {
            const eventTemp = { ...event };
            eventTemp.employeeId = eventTemp.resourceId;
            eventTemp.plannedStartDate =
                eventTemp.startDate.format("YYYY-MM-DD");
            eventTemp.plannedFinishedDate =
                eventTemp.endDate.format("YYYY-MM-DD");
            try {
                // await this.$store.dispatch("tasks/update", {
                //     id: eventTemp.id,
                //     data: { ...eventTemp },
                // });
                // await this.$store.dispatch("tasks/list");
            } catch (e) {}
        });
    },
    addEventReverse = (e) => {
        const newEventDate = e.event.startDate.subtractDays(1);
        const resourceIndex = resources.value.findIndex(
            (r) => r.id == e.event.resourceId
        );
        const eventIndex = resources.value[resourceIndex].events.findIndex(
            (event) => event.id == e.event.id
        );
        resources.value[resourceIndex].events[eventIndex].startDate =
            newEventDate;
        resources.value[resourceIndex].events[eventIndex].taskHours[
            newEventDate.format("YYYY-MM-DD")
            ] = { hours: 0 };
        nextTick(() => {
            updateEvent(
                resources.value[resourceIndex].events[eventIndex]
            );
        });
    },
    addEvent = (e) => {
        const newEventDate = e.event.endDate.addDays(1);
        const resourceIndex = resources.value.findIndex(
            (r) => r.id == e.event.resourceId
        );
        const eventIndex = resources.value[resourceIndex].events.findIndex(
            (event) => event.id == e.event.id
        );
        resources.value[resourceIndex].events[eventIndex].endDate =
            newEventDate;
        resources.value[resourceIndex].events[eventIndex].taskHours[
            newEventDate.format("YYYY-MM-DD")
            ] = { hours: 0 };
        nextTick(() => {
            updateEvent(
                resources.value[resourceIndex].events[eventIndex]
            );
        });
    },
    removeEvent = (e) => {
        const newEventDate = e.event.endDate.subtractDays(1);
        const resourceIndex = resources.value.findIndex(
            (r) => r.id == e.event.resourceId
        );
        const eventIndex = this.resources[resourceIndex].events.findIndex(
            (event) => event.id == e.event.id
        );
        resources.value[resourceIndex].events[eventIndex].endDate =
            newEventDate;
        delete resources.value[resourceIndex].events[eventIndex].taskHours[
            e.event.endDate.addDays(1).format("YYYY-MM-DD")
            ];
        nextTick(() => {
            updateEvent(
                resources[resourceIndex].events[eventIndex]
            );
        });
    },
    removeEventReverse = (e)  => {
        const newEventDate = e.event.startDate.addDays(1);
        const resourceIndex = resources.value.findIndex(
            (r) => r.id == e.event.resourceId
        );
        const eventIndex = resources.value[resourceIndex].events.findIndex(
            (event) => event.id == e.event.id
        );
        resources.value[resourceIndex].events[eventIndex].startDate =
            newEventDate;
        delete resources.value[resourceIndex].events[eventIndex].taskHours[
            e.event.startDate.subtractDays(1).format("YYYY-MM-DD")
            ];
        nextTick(() => {
            updateEvent(
                resources.value[resourceIndex].events[eventIndex]
            );
        });
    },
    resourcesChanged = async (resources) => {
        resources.value = [...resources];
    },
    resetDataForDependents = async()  => {
        cleared.value = false;
        state.teamId = null;
        await nextTick();
        cleared.value = true;
    },
    locationList = () => {
        showGenericListing(routes.LOCATION).then((response: any) => {
            locations.value = response?.data?.locations.map((location: any) => {
                return {
                    label: location.name,
                    value: location.id,
                };
            });
        });
    },

    departmentList = () => {
        showGenericListing(routes.DEPARTMENT).then((response: any) => {
            departments.value = response?.data?.departments.map((department: any) => {
                return {
                    label: department.name,
                    value: department.id,
                };
            });
        });
    },

    teamList = () => {
        showGenericListing(routes.TEAM).then((response: any) => {
            teams.value = response?.data?.teams.map((team: any) => {
                return {
                    label: team.name,
                    value: team.id,
                };
            });
        });
    },

    // refresh = async () => {
    //     locationList()
    //     departmentList()
    //     teamList()
    // },

    log = (...params: any[]) => {
        // eslint-disable-next-line
        console.log(...params);
    }

watch(
    () => state.groupBy,
    () => {
        createGroups()
    }
)

onMounted(async () => {
    $listen('search', search);

    setTimeout(async () => {
        show.value = true;
        await nextTick();
        await search();
    }, 1000);

    await locationList();
    await departmentList();
});
useHead({
    title: title,
});
</script>

<template>
    <div>
        <div class="wizard-tab">
            <ul class="">
                <li class="nav-item" role="presentation">
                    <button class="nav-link step-done" @click="step = 1; activeTab = 'daily';  activeView = 'week';" :class="{ active: step === 1 }">
                        {{ $t("Daily Calendar") }}
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link step-done" @click="step = 2; activeTab = 'monthly'; activeView = 'month';" :class="{ active: step === 2 }">
                        {{ $t("Monthly Calendar") }}
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link step-done" @click="step = 3;  activeTab = 'yearly';  activeView = 'year';" :class="{ active: step === 3 }">
                        {{ $t("Annual Calendar") }}
                    </button>
                </li>
            </ul>
        </div>
        <div class="wizard-content vacation-request">
            <div class="row align-items-center">
                <div class="col-lg-4">
                    <div class="form-group">
                        <elements-input v-model="state.search" :label="$t('Search Term')" />
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="form-group">
                        <elements-multiselect
                            v-model="state.status"
                            :options="statuses"
                            label="label"
                            track-by="value"
                            :textLabel="$t('Status')"
                        />
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="form-group">
                        <elements-multiselect
                            v-model="state.leaveType"
                            :options="typesOfAbsence"
                            label="label"
                            track-by="value"
                            :textLabel="$t('Terms of Absence')"
                        />
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="form-group">
                        <elements-multiselect
                                v-model="state.locationId"
                                :options="locations"
                                label="label"
                                track-by="value"
                                :textLabel="$t('Location')"
                        />
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="form-group">
                        <elements-multiselect
                                v-model="state.locationId"
                                :options="departments"
                                label="label"
                                track-by="value"
                                :textLabel="$t('Department')"
                        />
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="form-group">
                        <elements-multiselect
                            v-if="cleared"
                            v-model="state.teamId"
                            :options="teams"
                            label="label"
                            track-by="value"
                            :textLabel="$t('Teams')"
                        />
                    </div>
                </div>
                <div class="d-flex justify-content-end mt-4">
                    <button @click="search" class="btn secondary-btn py-2 px-5">{{ $t("Search") }}</button>
                </div>
                <div class="d-flex align-items-center mt-5">
                    <p >{{ $t("Sort By:") }}</p>
                    <div class="ml-5">
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" v-model="state.sortBy" name="sort" id="employees" value="employees">
                            <label class="form-check-label ml-1" for="employees">{{ $t("Employees") }}</label>
                        </div>
                    </div>
                    <div class="ml-3">
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" v-model="state.sortBy" name="sort" id="departments" value="departments">
                            <label class="form-check-label ml-1" for="departments">{{ $t("Departments") }}</label>
                        </div>
                    </div>
                    <div class="ml-3">
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" v-model="state.sortBy" name="sort" id="teams" value="teams">
                            <label class="form-check-label ml-1" for="teams">{{ $t("Teams") }}</label>
                        </div>
                    </div>
                    <div class="d-flex">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" v-model="state.showBalance" id="show-daily-balance">
                            <label class="form-check-label ms-2 align-self-center" for="show-daily-balance">{{ $t("Show Daily Balance") }}</label>
                        </div>
                    </div>
                </div>


                <div class="d-flex mt-2">
                    <p class="align-self-center">{{ $t("Group By:") }}</p>
                    <div class="ms-3">
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" v-model="state.groupBy" name="order" id="employees" value="employees">
                            <label class="form-check-label ms-1" for="employees">{{ $t("Employees") }}</label>
                        </div>
                    </div>
                    <div class="ms-3">
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" v-model="state.groupBy" name="order" id="departments" value="departments">
                            <label class="form-check-label ms-1" for="departments">{{ $t("Departments") }}</label>
                        </div>
                    </div>
                    <div class="ms-3">
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" v-model="state.groupBy" name="order" id="teams" value="teams">
                            <label class="form-check-label ms-1" for="teams">{{ $t("Teams") }}</label>
                        </div>
                    </div>
                </div>

            </div>

        </div>
        <div class="mt-3 relative">
            <p>vacationCalendarSearch</p>
            <VacationCalendar
                @currentYear="currentYear = $event"
                @currentMonth="currentMonth = $event"
                @viewChanged="search"
                :events="events"
                @weekViewBoundary="weekViewBoundaryChanged"
                @resourcesChanged="resourcesChanged"
                @addEvent="addEvent"
                @addEventReverse="addEventReverse"
                @removeEvent="removeEvent"
                @removeEventReverse="removeEventReverse"
                editable-events="editable-events"
                cell-contextmenu="cell-contextmenu"
                today-button="today-button"
                :time-from="7 * 60"
                :time-to="20 * 60"
                :special-hours="{}"
                v-model:selectedDate="selectedDate"
                @cell-contextmenu="log"
                :resources="resources"
                :active-view="activeView"
                :disable-views="['years', 'day']"
                :showBalance="state.showBalance"
                :loading="loading"
            />
            <div
                v-if="userPerPage > perPage"
                @click="loadMore()"
                class="flex justify-center mt-3"
            >
                <button class="px-3 py-2 rounded bg-gray-200 cursor-pointer">
                    {{ $t("Load more") }}
                </button>
            </div>
        </div>
    </div>

</template>
