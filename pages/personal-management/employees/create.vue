<script setup lang="ts">
import { ref, reactive } from "vue";
import commonCode from "~/composables/common";
import {
  uploadUserProfileRequest
} from "~/utils/apiRequests";
import userProfile from "./components/User-profile.vue";
import job from "./components/job.vue";
import { routes } from "~/utils/apiRoutes";
import CompensationAndBenefits from "./components/Compensation-and-benefits.vue";
import assets from "./components/assets.vue";
import DocumentsAndContracts from "./components/Documents-and-contracts.vue";
import calendar from "./components/calendar.vue";
import skills from "./components/skills.vue";
import { useLayoutStore } from "~/store/layout";
import genericFunctionality from "~/composables/genericFunctionality";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";


const {
  apiRoute,
  data,
  showFunc,
  storeFunc,
  updateFunc,
  isLoading,
  submitted
} = genericFunctionality();

const { router, Toast } = commonCode(),
  { t } = useI18n(),
  userProfileId = ref(""),
  state = reactive({
    isLoading: false,
    submitted: false, file: null,
    name: "",
    personalNumber: "",
    jobTitle: "",
    departments: [],
    teams: [],
    zip: "",
    city: "",
    email: "",
    phone: "",
    mobile: "",
    userId: ""
  }),
  src = ref("/_nuxt/assets/images/user.png"),
  isUpdateUserProfile = ref(false),
  breadCrumbsConfig = [
    {
      text: "Admin portal",
      to: "/",
    },
    {
      text: "Employee",
      to: "/personal-management/employees",
    },
    {
      text: "Create",
      active: true,
    },
  ],
  step = ref(1);

const userProfileDone = (data) => {
  step.value = 2;
  state.userId= data?.userId;
  userProfileId.value = data?.userProfileId;
  isUpdateUserProfile.value = true;
};

const fileUpload = (e: any) => {
  state.file = e.target.files[0];
  if (state.file) {
    createProfilePicture();
  }
};
const userProfileData = (data) => {
  state.name = data.name;
  state.email = data.email;
  state.mobile = data.mobile;
  state.phone = data.phone;
};

const jobData = (data) => {
  if (data.locationId)
    findLocation(data.locationId)
  state.personalNumber = data.personalNumber;
  state.jobTitle = data.jobTitle;
  state.departments = data.depttNames;
  state.teams = data.teamNames;
};

async function findLocation(id) {
  apiRoute.value = routes.LOCATION;
  if (router.params.id) {
    let response = await showFunc(id)
    if (response?.success) {
      const { zipCode, city } = response?.data;
      state.zip = zipCode;
      state.city = city;
    }
  }
};

const createProfilePicture = () => {
  const formData = new FormData(); // pass data as a form

  formData.append("profilePicture", state.file);

  formData.append("employeeId", userProfileId.value);
  uploadUserProfileRequest(formData)
    .then((response) => {
      Toast.fire({
        icon: "success",
        title: t("Profile Picture uploaded successfully!"),
      });
      src.value = response?.data?.image
      state.file = null;
    })
    .catch((error) => {
      Toast.fire({ icon: "error", title: t("something went wrong!") });
    });
};

const employeeDone = () => {
  Toast.fire({
    icon: "success",
    title: t("Employee created successfully!"),
  });
  navigateTo("/personal-management/employees");
};
const { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { title } = useTitle("Create User Profile");

useHead({
    title: title,
    });
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <div class="wizard-tab">
      <ul class="">
        <li class="nav-item" role="presentation">
          <button class="nav-link" :class="{ active: step === 1, 'step-done': step > 1 }">
            {{ $t('User Profile') }}
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" :class="{ active: step === 2, 'step-done': step > 2 }">
            {{ $t('Job') }}
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" :class="{ active: step === 3, 'step-done': step > 3 }">
            {{ $t('Compensation And Benefits') }}
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" :class="{ active: step === 4, 'step-done': step > 4 }">
            {{ $t('Assets') }}
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" :class="{ active: step === 5, 'step-done': step > 5 }">
            {{ $t('Documents And Contracts') }}
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" :class="{ active: step === 6, 'step-done': step > 6 }">
            {{ $t('Calendars') }}
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" :class="{ active: step === 7, 'step-done': step > 7 }">
            {{ $t('Skills') }}
          </button>
        </li>
      </ul>
    </div>
    <div v-if="isUpdateUserProfile" class="row mt-4 mb-4 employee-profile">
      <div class="col-lg-3">
        <div class="employe-img">
          <img :src="src" alt="" />
          <div class="add-img">
            <input accept="image/*" id="hidden-input" type="file" ref="file" @change="fileUpload" name="file"
              class="hidden t-none" style="display: none" />
            <!-- <button
                      @click="$refs.file.click()"
                      id="button"
                      type="button"
                      class="primary-btn"
                    >
                      <i class="fe-upload me-2"></i>
                      {{ $t("SELECT FILE") }}
                    </button> -->
            <!-- <input type="file" ref="fileInput" style="display: none;"> -->
            <button @click="$refs.file.click()">
              <i class="fas fa-camera"></i>
            </button>
          </div>
        </div>
      </div>
      <div class="col-lg-3">
        <h5>PN: {{ state.personalNumber }}</h5>
        <p>{{ state.name }}</p>
        <p>{{ state.jobTitle }}</p>
      </div>
      <div class="col-lg-6">
        <div class="card p-3">
          <ul>
            <li>
              <div v-if="state.departments.length > 0" class="icon"><i class="fas fa-building"></i></div>
              <p v-if="state.departments.length > 0">
              <p v-for="(department, index) in state.departments" :key="index">{{ department }}</p>
              </p>
            </li>
            <li>
              <div v-if="state.teams.length > 0" class="icon"><i class="fas fa-users"></i></div>
              <p v-if="state.teams.length > 0">
              <p v-for="(team, index) in state.teams" :key="index">{{ team }}</p>
              </p>
            </li>
            <li>
              <div class="icon"><i class="fas fa-map-pin"></i></div>
              <p>{{ state.zip }} {{ state.city }}</p>
            </li>
            <li>
              <div class="icon"><i class="ri-mail-line"></i></div>
              <p>{{ state.email }}</p>
            </li>
            <li>
              <div class="icon"><i class="fas fa-phone-alt"></i></div>
              <p>{{ state.phone }}</p>
            </li>
            <li>
              <div class="icon"><i class="fas fa-mobile"></i></div>
              <p>{{ state.mobile }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="wizard-content">
      <!--=======================================================-->
      <!--=======================================================-->
      <div class="" v-show="step === 1">
        <user-profile :userProfileId="userProfileId" @userProfileDone="userProfileDone" :isUpdate="isUpdateUserProfile"
          @userProfileData="userProfileData" />
      </div>
      <!--=======================================================-->
      <!--=======================================================-->
      <div class="" v-show="step === 2">
        <job :userProfileId="userProfileId" @backToDetails="step = 1" @jobDone="step = 3" @jobData="jobData" />
      </div>
      <!--=======================================================-->
      <!--=======================================================-->
      <div class="" v-show="step === 3">
        <compensation-and-benefits :userProfileId="userProfileId" @backToJob="step = 2" @compensationDone="step = 4" />
      </div>
      <!--=======================================================-->
      <!--=======================================================-->
      <div class="" v-show="step === 4">
        <assets :userProfileId="state.userId" @backTocompensation="step = 3" @assetDone="step = 5" />
      </div>

      <div class="" v-show="step === 5">
        <documents-and-contracts :userProfileId="userProfileId" @backToAssets="step = 4" @documentDone="step = 6" />
      </div>
      <div class="" v-show="step === 6">
        <calendar @backTodocuments="step = 5" @calendarDone="step = 7" />
      </div>
      <div class="" v-show="step === 7">
        <skills @backTocalendar="step = 6" @employeeDone="employeeDone" />
      </div>
    </div>
  </div>
</template>
