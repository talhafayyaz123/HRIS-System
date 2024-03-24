<script setup lang="ts">
import { ref, reactive } from "vue";
import commonCode from "~/composables/common";
// import Overview from "~/components/ProjectOverview/Overview.vue";
import { routes } from "~/utils/apiRoutes";
import genericFeatures from "~/composables/generic";
 import GanttChart from "@/components/Project/ProjectOverview/Gantt/index.vue";
 import genericFunctionality from "~/composables/genericFunctionality";
const now = new Date();
const { showGenericListing } = genericFeatures();
const { apiRoute, data, listingFunc } = genericFunctionality();
const { $listen } = useNuxtApp()
const { router } = commonCode(),
  { t } = useI18n(),
  props = defineProps({
    tasks: {
      type: Array,
      default: [],
    },
  });

const events = [
  {
    start: new Date(new Date(now).setHours(1, 0, 0)),
    end: new Date(new Date(now).setHours(4, 0, 0)),
    allDay: true,
    title: "Event 1",
    split: 2,
    resourceId: 1,
  },
];

const daySplits = [
    { label: "Tom", color: "green" },
    { label: "Kate", color: "pink" },
  ],
  selectedDate = now,
  view = ref("week"),
  milestoneMinMaxDateTracker = ref({}),
  resources = ref([]),
  projectTasks = ref([]),
  milestones = ref([]);


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

async function refresh() {
  showGenericListing(routes.PROJECT_MILESTONE, {
    projectId: router.params.id,
  }).then((response: any) => {
   
    response?.data?.project_milestones.forEach((milestone:any) => {
        let minStartDate:Date;
        let maxEndDate :Date;
        let minStartDateTask = "";
        let maxEndDateTask = "";
        let counter = 0;
        const tasks =  projectTasks.value
        .filter((task:any) => task.milestone_id == milestone.id)
          .map((task:any) => {
          
            if (counter == 0) {
               minStartDate = new Date(task.planned_start_date);
              maxEndDate = new Date(task.planned_finished_date);
              minStartDateTask = task.id;
              maxEndDateTask = task.id;
              counter++;
            } else {
              if (
                new Date(task.planned_start_date).setHours(0, 0, 0, 0) <
                minStartDate.setHours(0, 0, 0, 0)
              ) {
                minStartDate = new Date(task.planned_start_date);
                minStartDateTask = task.id;
              }
              if (
                new Date(task.planned_finished_date).setHours(0, 0, 0, 0) >
                maxEndDate.setHours(0, 0, 0, 0)
              ) {
                maxEndDate = new Date(task.planned_finished_date);
                maxEndDateTask = task.id;
              } 
            }
            milestoneMinMaxDateTracker.value[milestone.id] = {
              minStartDate: minStartDate,
              minStartDateTask: minStartDateTask,
              maxEndDate: maxEndDate,
              maxEndDateTask: maxEndDateTask,
            }; 
            
            return {
             id: task.id,
              taskId: task.taskId,
              name: task.name,
              startDate: new Date(
                new Date(task.planned_start_date).setHours(0, 0, 0, 0)
              ),
              endDate: new Date(
                new Date(task.planned_finished_date).setHours(0, 0, 0, 0)
              ),
              allDay: true,
              title: "6",
              split: 2,
             resourceId: task.milestone_id,
              milestoneId: task.milestone_id,
              employeeId: task.employeeId,
              estimatedTime: task.estimated_time,
              spentTime: "1",
              neededTime: task.spend_time,
              actualStartDate: task.actual_start_date,
              earliestStartDate: task.earliest_start_date,
              actualFinishedDate: task.actual_finished_date,
              expectedFinishedDate: task.expected_finished_date,
              plannedFinishedDate: task.planned_finished_date,
              plannedStartDate: task.planned_start_date,
              assignee: task.employee_id,
              priority: task.priority,
              status: task.status,
              description: task.description,
              relationships: task.relationships,
              taskHours: (() => {
                const taskHours:any = {};
            
                let startDate = new Date(new Date(task.planned_start_date));
                const endDate = new Date(new Date(task.planned_finished_date));
              
                while (
                  startDate.setHours(0, 0, 0, 0) !=
                    endDate.setHours(0, 0, 0, 0) &&
                  endDate.setHours(0, 0, 0, 0) >= startDate.setHours(0, 0, 0, 0)
                ) {
                   taskHours[startDate?.toLocaleDateString('en-GB', {day : 'numeric',month : 'long',year : 'numeric'})] = {
                    hours: 0,
                  }; 
                
                  startDate = startDate?.addDays(1);
                }
                 taskHours[startDate?.toLocaleDateString('en-GB', {day : 'numeric',month : 'long',year : 'numeric'})] = {
                  hours: 0,
                }; 
                return taskHours;
              })(),
            };
          });

         resources.value.push({
          id: milestone.id,
          name: milestone.name,
          plannedStartDate: milestone?.planned_start_date,
          plannedFinishedDate: milestone?.planned_finished_date,
          value: milestone.id,
          estimatedTime: "0",
          spentTime: "0",
          neededTime: "0",
          rowExpanded: true,
          events: tasks,
        }); 
      });


  });

  
}

$listen("projectBoardBacklogTasks", (id) => {
  apiRoute.value = routes.PROJECT_TASK;
  
   listingFunc({
    project_id: router.params.id,
  }); 
  
});

const { title } = useTitle("Projects");

useHead({
    title: title,
    });
</script>

<template>
  <div>
    <div class="wizard-content">
      
      <GanttChart
      class="ml2 mr1 vuecal--blue-theme"
      :events="events"
      cell-contextmenu="cell-contextmenu"
      today-button="today-button"
      :time-from="7 * 60"
      :time-to="20 * 60"
      :special-hours="{}"
      :selectedDate="selectedDate"
      :resources="resources"
      active-view="week"
      :disable-views="['years', 'day']"
      :employees=[]
    >
    </GanttChart>
    </div>
  </div>
</template>
