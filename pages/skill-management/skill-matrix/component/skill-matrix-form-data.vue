<script setup lang="ts">
import genericFunctionality from "~/composables/genericFunctionality";
import { routes } from "~/utils/apiRoutes";
import "md-editor-v3/lib/style.css";
import genericFeatures from "~/composables/generic";
import { ref, reactive } from "vue";
import { useLayoutStore } from "~/store/layout";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import SkillMatrixFormData from "~/pages/skill-management/skill-matrix/component/skill-matrix-form-data.vue";
import SkillMatrixPreview from "~/pages/skill-management/skill-matrix/component/skill-matrix-preview.vue";

const {
  apiRoute,
  data,
  showFunc,
  storeFunc,
  updateFunc,
  submitted,
  isLoading,
} = genericFunctionality();

const { showGenericListing } = genericFeatures(),
  { router, Toast } = commonCode(),
  props = defineProps({
    skillMatrixId: {
      type: String,
      default: "",
    },
    isUpdate: {
      type: Boolean,
      default: false,
    },
  }),
  { t } = useI18n(),
  state = reactive({
    name: "",
    skillGroups: [],
    skills: [],
    teams: [],
    employees: [],
  }),
  previewMatrix = ref(false),
  skillGroup = ref([]),
  skillOptions = ref([]),
  defaultSkills = ref([]),
  teams = ref([]),
  teamMembersOptions = ref([]),
  defaultTeamMembers = ref([]),
  matrixGroups = ref([]),
  matrixTeams = ref([]),
  validationRules = {
    name: { required },
    skillGroups: { required },
    skills: { required },
    teams: { required },
    employees: { required },
  },
  v$ = useVuelidate(validationRules, state);

async function refresh() {
  const layout = useLayoutStore();
  layout.changeLoaderValue(true);
  apiRoute.value = routes.SM_MATRIX;
  if (router.params.id) {
    let response = await showFunc(props.skillMatrixId);
    if (response?.success) {
      const { name, skillGroups, skills, employees, teams } = response?.data;
      state.name = name;
      state.skillGroups = skillGroups.map((skillGroup: any) => {
        return {
          text: skillGroup.name,
          value: skillGroup.id,
          skills: skillGroup?.skills,
        };
      });
      state.skills = skills.map((skill: any) => {
        return {
          text: skill.name,
          value: skill.id,
          level: skill.level,
        };
      });
      state.teams = teams.map((team: any) => {
        return {
          text: team.name,
          value: team.id,
          teamMembers: team?.teamMembers,
        };
      });
      state.employees = employees.map((member: any) => {
        return {
          text: member.name,
          value: member.id,
          skills: member?.skills,
        };
      });
    }
  }
  

  await showGenericListing(routes.SKILL_GROUPS).then((response: any) => {
    skillGroup.value = response?.data?.skillGroups.map((skillGroup: any) => {
      return {
        text: skillGroup.name,
        value: skillGroup.id,
        skills: skillGroup?.setOfSkills,
      };
    });
  });

  await showGenericListing(routes.SKILL).then((response: any) => {
    skillOptions.value = response?.data?.skills.map((skill: any) => {
      return {
        text: skill.name,
        value: skill.id,
        level: skill.level,
      };
    });
    defaultSkills.value = skillOptions.value;
  });

  await showGenericListing(routes.EMPLOYEE).then((response: any) => {
    teamMembersOptions.value = response?.data?.employees.map((member: any) => {
      return {
        text: member.name,
        value: member.id,
        skills: member?.skills ?? [],
      };
    });
    defaultTeamMembers.value = teamMembersOptions.value;
  });

  await showGenericListing(routes.TEAM).then((response: any) => {
    teams.value = response?.data?.teams.map((team: any) => {
      return {
        text: team.name,
        value: team.id,
        teamMembers: team?.teamMembers ?? [],
      };
    });
  }).finally(() => {
      layout.changeLoaderValue(false);
    });
  

  if (props.isUpdate === true) {
    await showDefaultOptions();
    preview();
  }
}

refresh();
const store = () => {
    v$.value.$touch();
    if (v$.value.$invalid) {
      submitted.value = false;
      return false;
    } else {
      isLoading.value = true;
      const payload = {
        ...state,
        teams:
          state?.teams.map((team) => {
            return team.value;
          }) ?? [],
        employees:
          state?.employees.map((member) => {
            return member.value;
          }) ?? [],
        skillGroups:
          state.skillGroups.map((group) => {
            return group.value;
          }) ?? [],
        skills:
          state.skills.map((skill) => {
            return skill.value;
          }) ?? [],
      };
      if (props.isUpdate == true) {
        updateFunc(
          payload,
          props.skillMatrixId,
          "/skill-management/skill-matrix"
        );
      } else {
        storeFunc(payload, "/skill-management/skill-matrix");
      }
    }
  },
  removeSkills = async (values: { skills: any[] }) => {
    values?.skills.map((row: { id: any }) => {
      skillOptions.value = skillOptions.value.filter(
        (option) => option?.value !== row.id
      );
    });
  },
  addSkills = (removed: { skills: { id: any }[] }) => {
    let obj = [];
    let alreadyExistOrNot = [];
    removed?.skills.map((row: { id: any }) => {
      obj = defaultSkills.value.filter((option) => option.value === row.id);
      if (!!obj) {
        alreadyExistOrNot = skillOptions.value.filter(
          (option) => option.value === obj[0].id
        );
        if (!alreadyExistOrNot.length) skillOptions.value.push(...obj);
      }
    });
  },
  removeTeams = async (team: { teamMembers: any[] }) => {
    team?.teamMembers.map((row) => {
      teamMembersOptions.value = teamMembersOptions.value.filter(
        (option) => option.value !== row.id
      );
    });
  },
  addTeams = async (removedTeam: { teamMembers: any[] }) => {
    let obj = [];
    let alreadyExistOrNot = [];
    removedTeam?.teamMembers.map((row) => {
      obj = defaultTeamMembers.value.filter(
        (option) => option.value === row.id
      );
      console.log(obj);
      if (!!obj) {
        alreadyExistOrNot = teamMembersOptions.value.filter(
          (option) => option.value === obj[0].id
        );
        if (!alreadyExistOrNot.length) teamMembersOptions.value.push(...obj);
      }
    });
  },
  showDefaultOptions = () => {
    if (Array.isArray(state.skillGroups)) {
      state.skillGroups.map((group) => {
        let obj = skillGroup.value.find(
          (option) => option.value === group.value
        );
        if (!!obj) {
          removeSkills(obj);
        }
      });
    }

    if (Array.isArray(state.teams)) {
      state.teams.map((team) => {
        let obj = teams.value.find((option) => option.value === team.value);
        if (!!obj) {
          removeTeams(obj);
        }
      });
    }
  },
  preview = async () => {
    matrixGroups.value = [];
    matrixTeams.value = [];
    previewMatrix.value = !previewMatrix.value;

    if (previewMatrix.value) {
      //groups view of the matrix array create
      matrixGroups.value.push(
        ...state.skillGroups.map((group) => {
          return {
            id: group.vaue,
            name: group.text,
            skills: group?.skills ?? [],
            isGroup: true,
          };
        })
      );

      //individual skills add
      matrixGroups.value.push(
        ...state.skills.map((skill) => {
          return {
            id: skill.value,
            name: "",
            skillName: skill.text,
            level: skill.level,
            isGroup: false,
          };
        })
      );

      //Teams view of the matrix array create
      matrixTeams.value.push(
        ...state.teams.map((team) => {
          return {
            id: team.value,
            name: team.text,
            teamMembers: team.teamMembers ?? [],
            isTeam: true,
          };
        })
      );

      //individual teamMembers add
      matrixTeams.value.push(
        ...state.employees.map((member) => {
          return {
            id: member.value,
            name: "",
            employee: member?.text,
            skills: member.skills ?? [],
            isTeam: false,
          };
        })
      );
    }
  };
</script>
<template>
  <div>
    <div class="card product-type">
      <div class="card-header d-flex align-items-center">
        <h3 class="card-title me-2">{{ $t("Fill Skill Matrix Details") }}</h3>
        <elements-tooltip />
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-lg-4 col-md-6">
            <div class="form-group">
              <elements-input
                v-model="state.name"
                :label="$t('Name')"
                :required="true"
                id="name"
                :disabled="submitted"
                :class="{ 'is-invalid': v$.name.$error }"
              />
            </div>
            <div v-if="v$.name.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.name.required">
                {{ $t("This value is required") }}</span
              >
              <br />
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="form-group">
              <elements-multiselect
                v-model="state.skillGroups"
                :options="skillGroup"
                label="text"
                :key="state.skillGroups"
                track-by="value"
                :textLabel="$t('Skill Group')"
                :required="true"
                :multiple="true"
                :objectType="true"
                @select="removeSkills"
                @deSelect="addSkills"
                :class="{ 'is-invalid': v$.skillGroups.$error }"
              />
            </div>
            <div v-if="v$.skillGroups.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.skillGroups.required">
                {{ $t("This value is required") }}
              </span>
              <br />
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="form-group">
              <elements-multiselect
                v-model="state.skills"
                :options="skillOptions"
                label="text"
                :key="state.skills"
                track-by="value"
                :textLabel="$t('Skills')"
                :required="true"
                :multiple="true"
                :objectType="true"
                :class="{ 'is-invalid': v$.skills.$error }"
              />
            </div>
            <div v-if="v$.skills.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.skills.required">
                {{ $t("This value is required") }}
              </span>
              <br />
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="form-group">
              <elements-multiselect
                v-model="state.teams"
                :options="teams"
                label="text"
                :key="state.teams"
                track-by="value"
                :textLabel="$t('Teams')"
                :required="true"
                :multiple="true"
                :objectType="true"
                @select="removeTeams"
                @deSelect="addTeams"
                :class="{ 'is-invalid': v$.teams.$error }"
              />
            </div>
            <div v-if="v$.teams.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.teams.required">
                {{ $t("This value is required") }}
              </span>
              <br />
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="form-group">
              <elements-multiselect
                v-model="state.employees"
                :options="teamMembersOptions"
                label="text"
                :key="state.employees"
                track-by="value"
                :textLabel="$t('Team Members')"
                :required="true"
                :multiple="true"
                :objectType="true"
                :class="{ 'is-invalid': v$.employees.$error }"
              />
            </div>
            <div v-if="v$.employees.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.employees.required">
                {{ $t("This value is required") }}
              </span>
              <br />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-3 d-flex align-items-center justify-content-end">
      <button class="primary-btn me-3">
        <elements-icon v-bind:icon="'cancelIcon'" class="me-2" />
        <span>{{ $t("Cancel") }}</span>
      </button>
      <submittal-button
        @click="store()"
        :isLoading="isLoading"
        :icon-name="'saveIcon'"
        :buttonName="$t('Save and Proceed')"
      />
    </div>
  </div>
  <button
    v-show="
      !!matrixGroups.length ||
      !!matrixTeams.length ||
      (!!state.skillGroups.length && !!state.teams.length)
    "
    type="button"
    @click="preview"
    class="btn btn-sm btn-success mt-4 p-2"
  >
    Preview Matrix
  </button>
  <div v-if="previewMatrix" class="bg-white rounded shadow mb-5">
    <skill-matrix-preview
      :matrixGroups="matrixGroups"
      :matrixTeams="matrixTeams"
    />
  </div>
</template>
