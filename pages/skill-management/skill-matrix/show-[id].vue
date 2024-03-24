<script setup lang="ts">
import { ref } from "vue";
import commonCode from "~/composables/common";
import SkillMatrixPreview from "~/pages/skill-management/skill-matrix/component/skill-matrix-preview.vue";
import { routes } from "~/utils/apiRoutes";
import genericFeatures from "~/composables/generic";
import { useLayoutStore } from "~/store/layout";
import genericFunctionality from "~/composables/genericFunctionality";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";


const { showGenericListing } = genericFeatures();
const { apiRoute, showFunc } = genericFunctionality();
const { router, Toast } = commonCode();
const { t } = useI18n();

const matrixData = ref([]);
const matrixGroups = ref([]);
const matrixTeams = ref([]);
const rows = ref([]);
const skillMatrixId = router.params.id;
const breadCrumbsConfig = [
  {
    text: "Admin portal",
    to: "/",
  },
  {
    text: "Skills Matrix",
    to: "/skill-management/skill-matrix",
  },
  {
    text: "Show",
    active: true,
  },
];
const { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { title } = useTitle("Skills Matrix Show");
const refresh = async () => {
  const layout = useLayoutStore();
  layout.changeLoaderValue(true);
  apiRoute.value = routes.SM_MATRIX;
  if (skillMatrixId) {
    const response = await showFunc(skillMatrixId);
    if (response?.success) {
      matrixData.value = response.data;
      await preview();
    }
  }
  layout.changeLoaderValue(false);

};

const populateMatrixGroups = () => {
  matrixGroups.value = matrixData.value.skillGroups.map((group) => ({
    id: group.id,
    name: group.name,
    skills: group.skills ?? [],
    isGroup: true,
  }));
};

const populateMatrixSkills = () => {
  matrixGroups.value.push(
    ...matrixData.value.skills.map((skill) => ({
      id: skill.id,
      name: "",
      skillName: skill.name,
      level: skill.level,
      isGroup: false,
    }))
  );
};

const populateMatrixTeams = () => {
  matrixTeams.value = matrixData.value.teams.map((team) => ({
    id: team.id,
    name: team.name,
    teamMembers: team.teamMembers ?? [],
    isTeam: true,
  }));
};

const populateMatrixTeamMembers = () => {
  matrixTeams.value.push(
    ...matrixData.value.employees.map((member) => ({
      id: member.id,
      name: "",
      employee: member?.name,
      skills: member.skills ?? [],
      isTeam: false,
    }))
  );
};

const preview = async () => {
  matrixGroups.value = [];
  matrixTeams.value = [];

  populateMatrixGroups();
  populateMatrixSkills();
  populateMatrixTeams();
  populateMatrixTeamMembers();
};

refresh();
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <div class="wizard-content">
      <!--=======================================================-->
      <skill-matrix-preview
        :matrixGroups="matrixGroups"
        :matrixTeams="matrixTeams"
      />
      <!--=======================================================-->
    </div>
  </div>
</template>
<style lang="scss" scoped>
// td > :only-child:hover {
//     text-overflow: ellipsis;
//     white-space: nowrap;
//     word-break: break-word;
// }
</style>
