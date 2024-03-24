<script setup lang="ts">
import { ref, reactive } from "vue";
import {
  departmentUpdateRequest,
  departmentShowRequest,
  teamMembersList,
  availableTeamsShowRequest,
  DepartmentCreateRequest,
  departmentListRequest,
} from "~/utils/apiRequests";
import { useLayoutStore } from "~/store/layout";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";

const { router, Toast } = commonCode(),
  { t } = useI18n(),
  employees = ref([]),
  teams = ref([]),
  departmentalTeams = ref([]),
  departments = ref([]),
  currentPage = ref(1),
  order = ref("asc"),
  column = ref("id"),
  state = reactive({
    isLoading: false,
    submitted: false,
    name: "",
    isTopLevel: false,
    headId: "",
    teams: [],
    employees: [],
    departments: [],
  }),
  emit = defineEmits(["detailsDone"]),
  departmentId = ref(""),
  validationRules = {
    name: { required },
  },
  v$ = useVuelidate(validationRules, state);

const rows = ref([]);
const props = defineProps({
  departmentId: {
    type: String,
    default: "",
  },
  isUpdate: {
    type: Boolean,
    default: false,
  },
});

const showDepartment = () => {
  departmentShowRequest(props.departmentId).then((response) => {
    state.name = response?.data?.name;
    state.isTopLevel = response?.data?.isTopLevel;
    state.headId = response?.data?.headId;

    state.employees = response?.data?.employees;
    state.departments = response?.data?.departments;

    departmentalTeams.value = response?.data?.departmentTeams.map(
      (team: any) => {
        return {
          text: team.name,
          value: team.id,
        };
      }
    );

    setTimeout(() => {
      if (departmentalTeams.value.length > 0) {
        teams.value.push(...departmentalTeams.value);
        state.teams = response?.data?.teams;
      }
    }, 400);
  });
};

const members = () => {
  const layout = useLayoutStore();
  teamMembersList({
    page: currentPage.value,
    perPage: 10,
    sortBy: column.value,
    order: order.value,
    search: "",
  })
    .then((response) => {
      employees.value = response?.data?.employees.map((employee: any) => {
        return {
          text: employee.firstName,
          value: employee.id,
        };
      });
    })
    .finally(() => {
      layout.changeLoaderValue(false);
    });
};



teamMembersList(
  {
page: currentPage.value,
perPage: 10,
sortBy: column.value,
order: order.value,
search: "",
}).then((response) => {
employees.value = response?.data?.employees.map(
  (employee: any) => {
    return {
      text: employee.firstName,
      value: employee.id,
    };
  }
);
}).finally(() => {
      
});

const departmentTeams=()=>{
  availableTeamsShowRequest().then((response) => {
    teams.value = response?.data?.teams.map((team: any) => {
      return {
        text: team.name,
        value: team.id,
      };
    });
  });
};

const departmentList = () => {
  departmentListRequest({
    page: currentPage.value,
    perPage: 10,
    sortBy: column.value,
    order: order.value,
    search: "",
  }).then((response) => {
    departments.value = response?.data?.departments.map((department: any) => {
      if (!department.isTopLevel) {
        if (props.departmentId != department.id) {
          return {
            text: department.name,
            value: department.id,
          };
        }
      }
    });
  });
};

const refresh = () => {
  const layout = useLayoutStore();
  layout.changeLoaderValue(true);
  if (router.params.id) {
    showDepartment();
  }
  members();
  departmentTeams();
  departmentList();
};

refresh();

const store = () => {
  v$.value.$touch();
  if (v$.value.$invalid) {
    state.submitted = false;
    return false;
  } else {
    try {
      state.isLoading = true;
      if (props.isUpdate == true) {
        updateDepartment();
      } else {
        createDepartment();
      }
    } catch (e) {
      Toast.fire({ title: t("Error!"), text: t("Error"), icon: "error" });
      state.isLoading = false;
      state.submitted = false;
    }
  }
};

const updateDepartment = () => {
  const layout = useLayoutStore();
  layout.changeLoaderValue(true);
  departmentUpdateRequest(
    {
      name: state.name,
      isTopLevel: state.isTopLevel,
      headId: state.headId,
      teams: state.teams,
      employees: state.employees,
      departments: state.departments,
    },
    props.departmentId
  )
    .then((response) => {
      layout.changeLoaderValue(false);
      Toast.fire({
        icon: "success",
        title: t("Record updated successfully!"),
      });
      state.isLoading = false;
      state.submitted = false;
      emit("departmentDone");
    })
    .catch((error) => {
      state.isLoading = false;
      state.submitted = false;
      Toast.fire({ icon: "error", title: error.response.data.errors });
    })
    .finally(() => {
      layout.changeLoaderValue(false);
    });
};

const createDepartment = () => {
  const layout = useLayoutStore();
  layout.changeLoaderValue(true);
  DepartmentCreateRequest({
    name: state.name,
    isTopLevel: state.isTopLevel,
    headId: state.headId,
    teams: state.teams,
    employees: state.employees,
    departments: state.departments,
  })
    .then((response) => {
      layout.changeLoaderValue(false);
      Toast.fire({
        icon: "success",
        title: t("Record created successfully!"),
      });
      emit("departmentDone");
      state.isLoading = false;
      state.submitted = false;
    })
    .catch((error) => {
      state.isLoading = false;
      state.submitted = false;
      Toast.fire({ icon: "error", title: error.response.data.errors });
    })
    .finally(() => {
      layout.changeLoaderValue(false);
    });
};
</script>
<template>
  <div>
    <div class="card product-type">
      <div class="card-header d-flex align-items-center">
        <h3 class="card-title me-2">{{ $t("Fill Department Details") }}</h3>
        <elements-tooltip />
      </div>

      <div class="card-body">
        <div class="row">
          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"
                    ><elements-icon v-bind:icon="'userIcon'"
                  /></span>
                </div>
                <elements-input
                  v-model="state.name"
                  :label="$t('Name')"
                  :required="true"
                  id="name"
                  :disabled="state.submitted"
                  :class="{ 'is-invalid': v$.name.$error }"
                />
              </div>
            </div>
            <div v-if="v$.name.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.name.required">{{
                $t("This value is required")
              }}</span
              ><br />
            </div>
          </div>

          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <div class="form-group d-flex align-items-center">
                <label class="me-2" for="">Is Top Level:</label>
                <input
                  type="checkbox"
                  id="checkbox"
                  v-model="state.isTopLevel"
                />
              </div>
            </div>
          </div>

          <div class="col-lg-6 col-md-6" v-if="!state.isTopLevel">
            <div class="form-group">
              <elements-multiselect
                v-model="state.headId"
                :options="employees"
                label="text"
                :key="state.headId"
                track-by="value"
                :textLabel="$t('Department Head')"
                :required="false"
              />
            </div>
          </div>

          <div class="col-lg-6 col-md-6" v-if="state.isTopLevel">
            <div class="form-group">
              <elements-multiselect
                v-model="state.employees"
                :options="employees"
                label="text"
                track-by="value"
                :textLabel="$t('Employees')"
                :required="false"
                :multiple="true"
              />
            </div>
          </div>

          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <elements-multiselect
                v-model="state.teams"
                :options="teams"
                :key="state.teams"
                label="text"
                track-by="value"
                :textLabel="$t('Department Teams')"
                :required="false"
                :multiple="true"
              />
            </div>
          </div>

          <div class="col-lg-6 col-md-6" v-if="state.isTopLevel">
            <div class="form-group">
              <elements-multiselect
                v-model="state.departments"
                :options="departments"
                label="text"
                track-by="value"
                :textLabel="$t('Departments')"
                :required="false"
                :multiple="true"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="d-flex align-items-center justify-content-end mt-3">
      <button class="primary-btn me-3">
        <ElementsIcon v-bind:icon="'cancelIcon'" />
        {{ $t("Cancel") }}
      </button>
      <submittal-button
        @click="store()"
        :isLoading="state.isLoading"
        :icon-name="'saveIcon'"
        :buttonName="$t('Save and Proceed')"
      />
    </div>
  </div>
</template>
