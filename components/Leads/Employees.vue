<script setup lang="ts">
import { ref, reactive } from "vue";
import {
  createEmployeeRequest,
  deleteEmployeeRequest,
  getEmployeeByIdRequest,
  updateEmployeeRequest,
  listEmployeesRequest,
} from "~/utils/apiRequests";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";

const { router, Toast, deleteAlert } = commonCode(),
  { t } = useI18n(),
  employee = reactive({
    isLoading: false,
    submitted: false,
    companyId: "",
    title: "",
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    phone: "",
    fax: "",
    position: "",
    department: "",
    location_id: "",
    password: "",
  }),
  employeeTemp = reactive({
    isLoading: false,
    submitted: false,
    id: "",
    companyId: "",
    title: "",
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    phone: "",
    fax: "",
    position: "",
    department: "",
    location_id: "",
    password: "",
  }),
  employees = ref([]),
  options = ref([]),
  showModal = ref(false),
  validationRules = {
    email: { required },
  },
  emit = defineEmits(["employeesDone", "backToLocations"]),
  v$ = useVuelidate(validationRules, employee),
  v2$ = useVuelidate(validationRules, employeeTemp);

const isModalOpen = ref(false);
const props = defineProps({
  leadId: {
    type: String,
    default: false,
  },
  locations: {
    type: Array,
    default: [],
  },
});

const prev = () => {
  emit("backToLocations");
};

const next = () => {
  emit("employeesDone");
};

const resetEmployee = () => {
  employee.title = "";
  employee.first_name = "";
  employee.last_name = "";
  employee.email = "";
  employee.mobile = "";
  employee.fax = "";
  employee.phone = "";
  employee.position = "";
  employee.department = "";
  employee.password = "";
};

const getEmployee = (id) => {
  getEmployeeByIdRequest({
    id: id,
  })
    .then((response) => {
      showModal.value = true;
      employeeTemp.email = response?.email;
      employeeTemp.id = response?.id;
      employeeTemp.first_name = response?.first_name;
      employeeTemp.last_name = response?.last_name;
      employeeTemp.title = response?.title;
      employeeTemp.department = response?.department;
      employeeTemp.position = response?.position;
      employeeTemp.location_id = response?.location_id;
      employeeTemp.phone = response?.phone;
      employeeTemp.fax = response?.fax;
      employeeTemp.mobile = response?.mobile;
    })
    .catch((error) => {
      Toast.fire({ icon: "error", title: t("Something went wrong") });
    });
};

const editEmployee = () => {
  v2$.value.$touch();
  if (v2$.value.$invalid) {
    return false;
  } else {
    updateEmployeeRequest({
      id: employeeTemp.id,
      title: employeeTemp.title,
      first_name: employeeTemp.first_name,
      last_name: employeeTemp.last_name,
      mobile: employeeTemp.mobile,
      phone: employeeTemp.phone,
      fax: employeeTemp.fax,
      position: employeeTemp.position,
      department: employeeTemp.department,
      location_id: employeeTemp.location_id,
      types: ["customer"],
      set_company_id: props.leadId,
    })
      .then((response) => {
        showModal.value = false;
        Toast.fire({
          icon: "success",
          title: t("Record updated successfully!"),
        });
        showCustomer();

        employee.isLoading = false;
        employee.submitted = false;
      })
      .catch((error) => {
        employee.isLoading = false;
        employee.submitted = false;
        Toast.fire({ icon: "error", title: t("something went wrong!") });
      });
  }
};

const showCustomer = () => {
  listEmployeesRequest({
    limit_start: 0,
    limit_count: 25,
    type: "customer",
    company_id: props.leadId,
  }).then((response) => {
    employees.value = response?.data;
  });
};
const refresh = () => {
  if (router.params.id) {
    showCustomer();
  }
};

refresh();

const addEmployee = () => {
  employee.submitted = true;
  v$.value.$touch();
  if (v$.value.$invalid) {
    return false;
  } else {
    createEmployeeRequest({
      ...employee,
      types: ["customer"],
      set_company_id: props.leadId,
      set_tenant_id: props.leadId,
      mail: employee.email,
    })
      .then((response) => {
        Toast.fire({
          icon: "success",
          title: t("Record created successfully!"),
        });
        showCustomer();
        resetEmployee();
        employee.isLoading = false;
        employee.submitted = false;
      })
      .catch((error) => {
        employee.isLoading = false;
        employee.submitted = false;
        Toast.fire({ icon: "error", title: t("something went wrong!") });
      });
  }
};

async function popEmployee(id) {
  if (!!id) {
    await deleteAlert().then((result: { isConfirmed: any }) => {
      if (result.isConfirmed) {
        deleteEmployeeRequest({
          id: id,
        })
          .then((response) => {
            Toast.fire({
              icon: "success",
              title: t("Record deleted successfully!"),
            });
            showCustomer();
          })
          .catch((error) => {
            Toast.fire({ icon: "error", title: t("Something went wrong") });
          });
      }
    });
  }
}
</script>
<template>
  <div>
    <div class="card">
      <div class="card-header d-flex align-items-center">
        <h3 class="card-title me-2">{{ $t("Add Employee Details") }}</h3>
        <elements-tooltip :label="'Enter Employee Details'" />

      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-lg-4"></div>
          <div class="col-lg-4"></div>
          <div class="col-lg-4">
            <div class="form-group">
              <elements-multiselect :options="options" label="name" track-by="value"
                :textLabel="$t('Select an Existing Employee')" />
            </div>
            <Modal :showModal="showModal" @hideModal="showModal = false" :title="`Edit Employee`" class="product-modal">
              <div class="row">
                <div class="col-lg-6 col-md-6">
                  <div class="form-group">
                    <elements-input v-model="employeeTemp.title" :label="$t('Title')" id="title"
                      :disabled="employeeTemp.submitted" />
                  </div>
                </div>
                <div class="col-lg-6 col-md-6">
                  <div class="form-group">
                    <elements-input v-model="employeeTemp.first_name" :label="$t('First Name')" id="first_name"
                      :disabled="employeeTemp.submitted" />
                  </div>
                </div>
                <div class="col-lg-6 col-md-6">
                  <div class="form-group">
                    <elements-input v-model="employeeTemp.last_name" :label="$t('Last Name')" id="last_name"
                      :disabled="employeeTemp.submitted" />
                  </div>
                </div>
                <div class="col-lg-6 col-md-6">
                  <div class="form-group">
                    <elements-input v-model="employeeTemp.email" :label="$t('Email')" :required="true" id="email"
                      :disabled="employeeTemp.submitted" :class="{ 'is-invalid': v2$.email.$error }" />
                    <div v-if="v2$.email.$error" class="invalid-feedback">
                      <span class="text-danger" v-if="v2$.email.required">{{
                        $t("This value is required")
                      }}</span><br />
                    </div>
                  </div>
                </div>
                <div class="col-lg-6 col-md-6">
                  <div class="form-group">
                    <elements-input v-model="employeeTemp.mobile" :label="$t('Mobile')" id="mobile"
                      :disabled="employeeTemp.submitted" />
                  </div>
                </div>
                <div class="col-lg-6 col-md-6">
                  <div class="form-group">
                    <elements-input v-model="employeeTemp.phone" :label="$t('Phone Number')" id="phone"
                      :disabled="employeeTemp.submitted" />
                  </div>
                </div>
                <div class="col-lg-6 col-md-6">
                  <div class="form-group">
                    <elements-input v-model="employeeTemp.fax" :label="$t('Fax')" id="addressLine1"
                      :disabled="employeeTemp.submitted" />
                  </div>
                </div>
                <div class="col-lg-6 col-md-6">
                  <div class="form-group">
                    <elements-input v-model="employeeTemp.position" :label="$t('Position')" id="addressLine1"
                      :disabled="employeeTemp.submitted" />
                  </div>
                </div>
                <div class="col-lg-6 col-md-6">
                  <div class="form-group">
                    <elements-input v-model="employeeTemp.department" :label="$t('Department')" id="addressLine1"
                      :disabled="employeeTemp.submitted" />
                  </div>
                </div>
                <div class="col-lg-6 col-md-6">
                  <div class="form-group">
                    <elements-multiselect v-model="employeeTemp.location_id" :options="locations" :key="locations.length"
                      label="text" track-by="value" :textLabel="$t('Location')" />
                  </div>
                </div>
              </div>
              <div class="d-flex align-items-center justify-content-end mt-3">
                <button type="button" class="primary-btn me-2" data-bs-dismiss="modal" @click="() => (showModal = false)">
                  {{ $t("Close") }}
                </button>
                <submittal-button :buttonName="$t('Edit Employee')" @click="editEmployee()" />
              </div>
            </Modal>
          </div>
          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <elements-input v-model="employee.title" :label="$t('Title')" id="title" :disabled="employee.submitted" />
            </div>
          </div>
          <div class="col-lg-6"></div>
          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"><elements-icon v-bind:icon="`userIcon`" /></span>
                </div>
                <elements-input v-model="employee.first_name" :label="$t('First Name')" id="first_name"
                  :disabled="employee.submitted" />
              </div>
            </div>
          </div>
          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"><elements-icon v-bind:icon="`userIcon`" /></span>
                </div>
                <elements-input v-model="employee.last_name" :label="$t('Last Name')" id="last_name"
                  :disabled="employee.submitted" />
              </div>
            </div>
          </div>
          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <elements-input v-model="employee.position" :label="$t('Position')" id="addressLine1"
                :disabled="employee.submitted" />
            </div>
          </div>
          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <elements-input v-model="employee.department" :label="$t('Department')" id="addressLine1"
                :disabled="employee.submitted" />
            </div>
          </div>
          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"><elements-icon v-bind:icon="`emailIcon`" /></span>
                </div>
                <elements-input v-model="employee.email" :label="$t('Email')" :required="true" id="email"
                  :disabled="employee.submitted" :class="{ 'is-invalid': v$.email.$error && employee.submitted }" />
              </div>

            </div>
            <div v-if="v$.email.$error && employee.submitted" class="invalid-feedback">
              <span class="text-danger" v-if="v$.email.required && employee.submitted">{{ $t("This value is required")
              }}</span><br />
            </div>
          </div>
          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"><elements-icon v-bind:icon="`eyeIcon`" /></span>
                </div>
                <elements-input v-model="employee.password" :label="$t('Password')" id="password"
                  :disabled="employee.submitted" />
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"><elements-icon v-bind:icon="`phoneIcon`" /></span>
                </div>
                <elements-input v-model="employee.phone" :label="$t('Phone')" id="phone"
                  :disabled="employee.submitted" />
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"><elements-icon v-bind:icon="`mobileIcon`" /></span>
                </div>
                <elements-input v-model="employee.mobile" :label="$t('Mobile')" id="mobile"
                  :disabled="employee.submitted" />
              </div>
            </div>
          </div>
          
          <div class="col-lg-4 col-md-6">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"><elements-icon v-bind:icon="`faxIcon`" /></span>
                </div>
                <elements-input v-model="employee.fax" :label="$t('Fax')" id="addressLine1"
                  :disabled="employee.submitted" />
              </div>
            </div>
          </div>
          
          <div class="col-lg-12 col-md-6">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"><elements-icon v-bind:icon="`locationIcon`" /></span>
                </div>
              <elements-multiselect v-model="employee.location_id" :options="locations" :key="locations.length"
                label="text" track-by="value" :textLabel="$t('Location')" />
                </div>
            </div>
          </div>

        </div>
      </div>
    </div>
    <div class="mt-3 d-flex align-items-center justify-content-end">
      <submittal-button @click="addEmployee()" :isLoading="employee.isLoading" :iconName="('addIcon')" :buttonName="$t('Add Employee')" />
    </div>
    <div class="row">
      <div class="col-12">
        <div class="table-responsive mt-3">
          <table class="doc-table table">
            <thead>
              <tr>
                <th>{{ $t("Name") }}</th>
                <th>{{ $t("Position") }}</th>
                <th>{{ $t("Phone") }}</th>
                <th>{{ $t("Mobile") }}</th>
                <th>{{ $t("Email") }}</th>
                <th>{{ $t("Actions") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="locations.length === 0">
                <td colspan="6">No Employee found</td>
              </tr>
              <tr v-else v-for="(item, index) in employees" :key="index">
                <td>{{ item?.first_name }} {{ item?.last_name }}</td>
                <td>{{ item?.position }}</td>
                <td>{{ item?.phone }}</td>
                <td>{{ item?.mobile }}</td>
                <td>{{ item?.email }}</td>
                <td>
                  <i class="mdi mdi-pencil edit-icon" @click.prevent="getEmployee(item?.id)"></i>
                  <i class="mdi mdi-delete edit-icon" @click.prevent="popEmployee(item?.id)"></i>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="form-group text-right mt-4 d-flex align-items-center justify-content-end">
      <button class="primary-btn me-3" @click.prevent="prev()">
        <elements-icon v-bind:icon="`backIcon`" class="me-2"/>
        {{$t("Previous")}}</button>
      <submittal-button @click="next()" :isLoading="employee.submitted" :iconName="('finishIcon')" :buttonName="$t('Finish')" />
    </div>
  </div>
</template>
