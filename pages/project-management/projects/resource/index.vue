<script setup lang="ts">
import { ref, reactive,nextTick,watch  } from "vue";
import VueCal from "~/components/Project/VueCal/index.vue";
import commonCode from "~/composables/common";
import { routes } from "~/utils/apiRoutes";
import genericFeatures from "~/composables/generic";
import genericFunctionality from "~/composables/genericFunctionality";

const now = new Date();
const { showGenericListing } = genericFeatures();
const { apiRoute, data, listingFunc } = genericFunctionality();
const runtimeConfig = useRuntimeConfig();
const { $listen } = useNuxtApp()
const { router } = commonCode(),
{ t } = useI18n(),
props = defineProps({
    tasks: {
      type: Array,
      default: [],
    }
  });


  type EventInterface = {
    start: Date,
    end: Date,
    allDay: boolean,
    title: string,
    split: number,
    resourceId: number
}[];

const events: EventInterface = [
  {
    start: new Date(new Date(now).setHours(1, 0, 0)),
    end: new Date(new Date(now).setHours(4, 0, 0)),
    allDay: true,
    title: "Event 1",
    split: 2,
    resourceId: 1,
  },
]

 const daySplits=[
    { label: "Tom", color: "green" },
    { label: "Kate", color: "pink" },
],
view = ref("week"),
selectedDate = now,
resources = ref([]),
projectTasks = ref([]),
employees = ref([]);

const updateEvent=(event:any)=>{
  nextTick(() => {

    const eventTemp = { ...event };
    eventTemp.employeeId = eventTemp.resourceId;
    eventTemp.plannedStartDate =
        eventTemp.startDate.format("YYYY-MM-DD");
    eventTemp.plannedFinishedDate =
        eventTemp.endDate.format("YYYY-MM-DD");
    /* try {
        await this.$store.dispatch("tasks/update", {
            id: eventTemp.id,
            data: { ...eventTemp },
        });
        await this.$store.dispatch("tasks/list");
    } */
  });
}

const addEvent=(e:any)=>{

 /*  const newEventDate = e.event.endDate.addDays(1);
            const resourceIndex = this.resources.findIndex(
                (r) => r.id == e.event.resourceId
            );
            const eventIndex = this.resources[resourceIndex].events.findIndex(
                (event) => event.id == e.event.id
            );
            this.resources[resourceIndex].events[eventIndex].endDate =
                newEventDate;
            this.resources[resourceIndex].events[eventIndex].taskHours[
                newEventDate.format("YYYY-MM-DD")
            ] = { hours: 0 };
            this.$nextTick(() => {
                this.updateEvent(
                    this.resources[resourceIndex].events[eventIndex]
                );
            }); */
}


const removeEvent=(e:any)=>{
/*   const newEventDate = e.event.endDate.subtractDays(1);
            const resourceIndex = this.resources.findIndex(
                (r) => r.id == e.event.resourceId
            );
            const eventIndex = this.resources[resourceIndex].events.findIndex(
                (event) => event.id == e.event.id
            );
            this.resources[resourceIndex].events[eventIndex].endDate =
                newEventDate;
            delete this.resources[resourceIndex].events[eventIndex].taskHours[
                e.event.endDate.addDays(1).format("YYYY-MM-DD")
            ];
            this.$nextTick(() => {
                this.updateEvent(
                    this.resources[resourceIndex].events[eventIndex]
                );
            }); */
}


const removeEventReverse=(e:any)=>{
/*   const newEventDate = e.event.startDate.addDays(1);
            const resourceIndex = this.resources.findIndex(
                (r) => r.id == e.event.resourceId
            );
            const eventIndex = this.resources[resourceIndex].events.findIndex(
                (event) => event.id == e.event.id
            );
            this.resources[resourceIndex].events[eventIndex].startDate =
                newEventDate;
            delete this.resources[resourceIndex].events[eventIndex].taskHours[
                e.event.startDate.subtractDays(1).format("YYYY-MM-DD")
            ];
            this.$nextTick(() => {
                this.updateEvent(
                    this.resources[resourceIndex].events[eventIndex]
                );
            }); */
}
const addEventReverse=(e:any)=>{


}


$listen("projectBoardBacklogTasks", (id) => {
   apiRoute.value = routes.PROJECT_TASK;
  
   listingFunc({
    project_id: router.params.id,
  });
  
});


watch(
  () => props.tasks,
  () => {
    projectTasks.value = props.tasks;
    refresh();
  }
);


watch(
  () => data.value,
  () => {
    projectTasks.value = data.value?.project_tasks;
    resources.value=[];
    refresh(); 
  }
)

const resourcesChanged=(resources:any)=>{
  // this.resources = [...resources];
}
async function refresh() {

  showGenericListing(runtimeConfig.public.authBaseUrl+routes.LIST_USERS,{
    limit_start: 0,
    limit_count: 25,
    type: "employee",
  }).then((response) => {

    response?.data.forEach((employee:any) => {

            let totalEstimatedTime = 0
            let totalSpentTime = 0
            const tasks = projectTasks.value
                .filter((task:any) => task.employee_id == employee.id)
                .map((task:any) => {
                 
                    totalEstimatedTime += +task.estimated_time ?? 0
                    totalSpentTime += +task.spend_time ?? 0
                    return {
                        id: task.id,
                        taskId: task.id,
                        name: task.name,
                        startDate: new Date(
                            new Date(task.planned_start_date).setHours(0, 0, 0, 0)
                        ),
                        endDate: new Date(
                            new Date(task.planned_finished_date).setHours(
                                0,
                                0,
                                0,
                                0
                            )
                        ),
                        allDay: true,
                        title: "6",
                        split: 2,
                        resourceId: task.employee_id,
                        employeeId: task.employee_id,
                        milestoneId: task.milestone_id,
                        estimatedTime: task.estimated_time ?? 0,
                        spentTime: task.spend_time ?? 0,
                        remainingTime: (+task.estimated_time ?? 0) - (+task.spend_time ?? 0),
                        actualStartDate: task.actual_start_date,
                        earliestStartDate: task.earliest_start_date,
                        actualFinishedDate: task.actualFinishedDate,
                        expectedFinishedDate: task.actual_finished_date,
                        plannedFinishedDate: task.planned_finished_date,
                        priority: task.priority,
                        status: task.status,
                        description: task.description,
                        taskHours: task?.taskHours,
                        relationships: task?.relationships,
                    };
                });
                resources.value.push({
                id: employee.id,
                label: employee.first_name + " " + employee.last_name,
                value: employee.id,
                estimatedTime: totalEstimatedTime,
                spentTime: totalSpentTime,
                remainingTime: +totalEstimatedTime - +totalSpentTime,
                rowExpanded: false,
                events: tasks,
            }); 
        });


        if (resources.value.length < 10) {
            const resourcesLength = resources.value.length;
            for (let i = 0; i < 10 - resourcesLength; i++) {
              resources.value.push({
                    id: 0,
                    label: "",
                    value: "0",
                    estimatedTime: "0",
                    spentTime: "0",
                    remainingTime: "0",
                    rowExpanded: false,
                    events: [],
                });
            }
        }

  });

}

const { title } = useTitle("Projects");

useHead({
    title: title,
    });
</script>


<template>
    <div>
      <div class="wizard-content">
        
          <vue-cal
            @resourcesChanged="resourcesChanged"
            :events="events"
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
            active-view="week"
            :disable-views="['years', 'day']"
        ></vue-cal>  
      </div>
    </div>
  </template>
  

  <style lang="scss">
  .test-view {
      height: 100vh;
      overflow: auto;
      display: flex;
      flex-direction: column;
  
      .vuecal {
          height: 400px;
      }
      .vuecal__event {
          background-color: rgba(160, 220, 255, 0.5);
          border: 1px solid rgba(0, 100, 150, 0.15);
      }
  }
  
  // Global.
  .w-app {
      margin: 0;
      padding: 0;
  }
  .top-bar,
  footer {
      display: none !important;
  }
  
  .vuecal__special-hours {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 4px;
  
      em {
          font-size: 0.9em;
          color: #999;
      }
  }
  .doctor-1 {
      background-color: hsl(127, 100%, 97%);
      color: hsl(127, 50%, 67%);
  }
  .doctor-2 {
      background-color: hsl(217, 100%, 97%);
      color: hsl(217, 80%, 67%);
  }
  .doctor-3 {
      background-color: hsl(287, 100%, 97%);
      color: hsl(287, 80%, 67%);
  }
  .closed {
      background: hsl(27, 100%, 97%)
          repeating-linear-gradient(
              -45deg,
              hsla(27, 100%, 67%, 0.25),
              hsla(27, 100%, 67%, 0.25) 5px,
              rgba(255, 255, 255, 0) 5px,
              rgba(255, 255, 255, 0) 15px
          );
      color: hsl(27, 90%, 63%);
  }
  </style>
  