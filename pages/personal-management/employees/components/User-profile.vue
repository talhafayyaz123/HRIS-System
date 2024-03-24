<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { routes } from "~/utils/apiRoutes";
import { rolesRequest } from "~/utils/apiRequests";
import commonCode from "~/composables/common";
import genericFeatures from "~/composables/generic";
import {
  createEmployeeRequest,
  employeeCreateRequest,
  listEmployeesRequest,
  getEmployeeByIdRequest,
  employeeShowRequest,
  employeeUpdateRequest,
} from "~/utils/apiRequests";
import { useLayoutStore } from "~/store/layout";
import { useVuelidate } from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import genericFunctionality from "~/composables/genericFunctionality";

const { router, Toast, deleteAlert } = commonCode();
const { showGenericListing } = genericFeatures(),
  { submitted, isLoading, apiRoute, storeFunc, showFunc } =
    genericFunctionality(),
  { t } = useI18n(),
  state = reactive({
    userId: null,
    isLoading: false,
    submitted: false,
    firstName: "",
    lastName: "",
    mobile: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    roles: [],
    birthName: "",
    dob: "",
    country: "",
    placeOfBirth: "",
    gender: "",
    nationality: "",
    highestSchoolDegree: "",
    highestEducationalLevel: "",
    maritalStatus: "",
    privatePhone: "",
    privateEmail: "",
    street: "",
    address: "",
    zipCode: "",
    city: "",
    state: "",
    addressCountry: "",
    financeDepptNumber: "",
    financeCategory: "",
    religion: "",
    religionOfPartner: "",
    freeAmountChildren: "",
    freeAmountYearly: "",
    freeAmountMonthly: "",
    taxLiability: "",
    accountOwner: "",
    iban: "",
    bic: "",
    bankName: "",
    socialSecurityNumber: "",
    previousHealthInsurance: "",
    healthInsurance: "",
    groupOfPeople: "",
    contributionGroup: "",
    accidentInsurance: "",
    tarrifPoints: "",
    percentageAssociation: "",
  }),
  isEdit = ref(false),
  passwordsMatch = ref(false),
  genders = [
    {
      value: "male",
      text: "Male",
    },
    {
      value: "female",
      text: "Female",
    },
    {
      value: "other",
      text: "Other",
    },
  ],
  maritalStatuses = [
    {
      value: "married",
      text: "Married",
    },
    {
      value: "single",
      text: "Single",
    },
    {
      value: "divorced",
      text: "Divorced",
    },
    {
      value: "widowed",
      text: "Widowed",
    },
  ],
  store = () => {
    state.submitted = true;
    state.isLoading = true;
    //stop here if form is invalid
    v$.value.$touch();
    if (v$.value.$invalid) {
      state.isLoading = false;
      state.submitted = false;
      return false;
    } else {
      if (props.isUpdate == true) {
        updateUserProfile();
      } else {
        if (state.password == "") {
          state.isLoading = false;
          state.submitted = false;
          return false;
        }
        if (state.userId == null) {
          createUser();
        } else {
          createUserProfile();
        }
      }
    }
  },
  emit = defineEmits(["userProfileDone", "userProfileData", "userProfileImage"]),
  roles = ref([]),
  employees = ref([]),
  highestEducationalLevels = ref([]),
  highestSchoolDegrees = ref([]),
  countries = ref([]),
  children = reactive({
    isLoading: false,
    submitted: false,
    name: "",
    gender: "",
    dateOfBirth: "",
  }),
  validationRules = {
    firstName: { required },
    lastName: { required },
    email: { required, email },
    dob: { required },
    country: { required },
    placeOfBirth: { required },
    gender: { required },
    nationality: { required },
    maritalStatus: { required },
    street: { required },
    state: { required },
    addressCountry: { required },
  },
  childrenRules = {
    name: { required },
    gender: { required },
    dateOfBirth: { required },
  },
  v$ = useVuelidate(validationRules, state),
  v2$ = useVuelidate(childrenRules, children);
const rows = ref([]);
const props = defineProps({
  userProfileId: {
    type: String,
    default: "",
  },
  isUpdate: {
    type: Boolean,
    default: false,
  },
});

watch(
  () => state.password,
  (password) => {
    passwordsMatch.value = false;
    if (password == state.confirmPassword) passwordsMatch.value = true;
  }
);

watch(
  () => state.confirmPassword,
  (password) => {
    passwordsMatch.value = false;
    if (password == state.password) passwordsMatch.value = true;
  }
);

watch(
  () => state.userId,
  (val) => {
    if (val == null) {
      state.firstName = "";
      state.lastName = "";
      state.email = "";
      state.mobile = "";
      state.city = "";
      state.street = "";
      state.zipCode = "";
    } else {
      getUserById(val);
    }
  }
);

const getUserById = (id) => {
  getEmployeeByIdRequest({
    id: id,
  })
    .then((response) => {
      state.firstName = response?.first_name;
      state.lastName = response?.last_name;
      state.email = response?.email;
      state.mobile = response?.mobile;
      state.city = response?.city;
      state.street = response?.street;
      state.zipCode = response?.zip;
    })
    .catch((error) => {
      Toast.fire({ icon: "error", title: t("Something went wrong") });
    });
};

const popRow = (index) => {
  rows.value.splice(index, 1);
};

const rolesList = () => {
  rolesRequest().then((response) => {
    roles.value = response?.data?.map((role: any) => {
      return {
        text: role.title,
        value: role.id,
      };
    });
  });
};

const countryList = () => {
  showGenericListing(routes.COUNTRY,  {all: true, sortBy: 'name', order: 'asc'}).then((response: any) => {
    countries.value = response?.data?.map((country: any) => {
      return {
        text: country.name,
        value: country.id,
      };
    });
  });
};

const createUser = () => {
  createEmployeeRequest({
    first_name: state.firstName,
    last_name: state.lastName,
    mail: state.email,
    mobile: state.mobile,
    password: state.password,
    confirmPassword: state.confirmPassword,
    city: state.city,
    roles: state.roles,
    street: state.street,
    zip: state.zipCode,
    types: ["employee"],
  })
    .then((response) => {
      state.userId = response?.id;
      createUserProfile();
    })
    .catch((error) => {
      state.isLoading = false;
      state.submitted = false;
      Toast.fire({ icon: "error", title: t("User with mail already exists") });
    });
};

const createUserProfile = () => {
  employeeCreateRequest({
    userId: state.userId,
    firstName: state.firstName,
    lastName: state.lastName,
    email: state.email,
    phoneNo: state.phone,
    mobileNo: state.mobile,
    birthName: state.birthName,
    dateOfBirth: state.dob,
    birthCountryId: state.country,
    placeOfBirth: state.placeOfBirth,
    gender: state.gender,
    nationality: state.nationality,
    highestSchoolDegreeId: state.highestSchoolDegree,
    highestEducationLevelId: state.highestEducationalLevel,
    maritalStatus: state.maritalStatus,
    privateDetail: {
      privatePhone: state.privatePhone,
      privateEmail: state.privateEmail,
    },
    privateAddress: {
      street: state.street,
      address: state.address,
      zipCode: state.zipCode,
      city: state.city,
      state: state.state,
      countryId: state.addressCountry,
    },
    children: rows.value,
    taxDetail: {
      financeDepptNumber: state.financeDepptNumber,
      financeCategory: state.financeCategory,
      religion: state.religion,
      religionOfPartner: state.religionOfPartner,
      freeAmountChildren: state.freeAmountChildren,
      freeAmountYearly: state.freeAmountYearly,
      freeAmountMonthly: state.freeAmountMonthly,
      taxLiability: state.taxLiability,
    },
    bankDetail: {
      accountOwner: state.accountOwner,
      iban: state.iban,
      bic: state.bic,
      bankName: state.bankName,
    },
    socialSecurityDetail: {
      socialSecurityNumber: state.socialSecurityNumber,
      previousHealthInsurance: state.previousHealthInsurance,
      healthInsurance: state.healthInsurance,
      groupOfPeople: state.groupOfPeople,
      contributionGroup: state.contributionGroup,
    },
    insuranceDetail: {
      accidentInsurance: state.accidentInsurance,
      tarrifPoints: state.tarrifPoints,
      percentageAssociation: state.percentageAssociation,
    },
  })
    .then((response) => {
      state.isLoading = false;
      state.submitted = false;
      Toast.fire({
        icon: "success",
        title: t("Record created successfully!"),
      });
      emit("userProfileDone", { userProfileId: response?.data?.id, userId: state.userId });
      emit("userProfileData", {
        name: state.firstName + " " + state.lastName,
        email: state.email,
        mobile: state.mobile,
        phone: state.phone,
      });
    })
    .catch((error) => {
      state.isLoading = false;
      state.submitted = false;
      Toast.fire({ icon: "error", title: t("something went wrong!") });
    });
};

const updateUserProfile = () => {
  employeeUpdateRequest(
    {
      userId: state.userId,
      firstName: state.firstName,
      lastName: state.lastName,
      email: state.email,
      phoneNo: state.phone,
      mobileNo: state.mobile,
      birthName: state.birthName,
      dateOfBirth: state.dob,
      birthCountryId: state.country,
      placeOfBirth: state.placeOfBirth,
      gender: state.gender,
      nationality: state.nationality,
      highestSchoolDegreeId: state.highestSchoolDegree,
      highestEducationLevelId: state.highestEducationalLevel,
      maritalStatus: state.maritalStatus,
      privateDetail: {
        privatePhone: state.privatePhone,
        privateEmail: state.privateEmail,
      },
      privateAddress: {
        street: state.street,
        address: state.address,
        zipCode: state.zipCode,
        city: state.city,
        state: state.state,
        countryId: state.addressCountry,
      },
      children: rows.value,
      taxDetail: {
        financeDepptNumber: state.financeDepptNumber,
        financeCategory: state.financeCategory,
        religion: state.religion,
        religionOfPartner: state.religionOfPartner,
        freeAmountChildren: state.freeAmountChildren,
        freeAmountYearly: state.freeAmountYearly,
        freeAmountMonthly: state.freeAmountMonthly,
        taxLiability: state.taxLiability,
      },
      bankDetail: {
        accountOwner: state.accountOwner,
        iban: state.iban,
        bic: state.bic,
        bankName: state.bankName,
      },
      socialSecurityDetail: {
        socialSecurityNumber: state.socialSecurityNumber,
        previousHealthInsurance: state.previousHealthInsurance,
        healthInsurance: state.healthInsurance,
        groupOfPeople: state.groupOfPeople,
        contributionGroup: state.contributionGroup,
      },
      insuranceDetail: {
        accidentInsurance: state.accidentInsurance,
        tarrifPoints: state.tarrifPoints,
        percentageAssociation: state.percentageAssociation,
      },
    },
    props.userProfileId
  )
    .then((response) => {
      state.isLoading = false;
      state.submitted = false;
      Toast.fire({
        icon: "success",
        title: t("Record updated successfully!"),
      });
      emit("userProfileDone", { userProfileId: response?.data?.id, userId: state.userId });
      emit("userProfileData", {
        name: state.firstName + " " + state.lastName,
        email: state.email,
        mobile: state.mobile,
        phone: state.phone,
      });
    })
    .catch((error) => {
      state.isLoading = false;
      state.submitted = false;
      Toast.fire({ icon: "error", title: t("something went wrong!") });
    });
};

const employeesList = () => {
  listEmployeesRequest({
    limit_start: 0,
    limit_count: 225,
    type: "employee",
    company_id: "",
  }).then((response) => {
    employees.value = response?.data.map((employee: any) => {
      return {
        text: employee.first_name + " " + employee.last_name,
        value: employee.id,
      };
    });
  }).finally(() => {
    // const layout = useLayoutStore();
    // layout.changeLoaderValue(false);
  });
};

const educationalLevelList = () => {
  showGenericListing(routes.EDUCATION_LEVEL).then((response: any) => {
    highestEducationalLevels.value = response?.data?.educationLevels.map(
      (country: any) => {
        return {
          text: country.name,
          value: country.id,
        };
      }
    );
  });
};

const educationalDegreeList = () => {
  showGenericListing(routes.DEGREE_DEGREE).then((response: any) => {
    highestSchoolDegrees.value = response?.data?.schoolDegrees.map(
      (country: any) => {
        return {
          text: country.name,
          value: country.id,
        };
      }
    );
  });
};

const showCustomer = () => {
  const layout = useLayoutStore();
  layout.changeLoaderValue(true);
  employeeShowRequest(props.userProfileId).then((response) => {
    const {
      userId,
      firstName,
      lastName,
      email,
      mobileNo,
      phoneNo,
      birthName,
      dateOfBirth,
      placeOfBirth,
      gender,
      nationality,
      highestSchoolDegree,
      highestEducationLevel,
      maritalStatus,
    } = response?.data;
    emit("userProfileImage", {
      profilePicture: response?.data?.profilePicture
    });
    state.firstName = firstName;
    state.lastName = lastName;
    state.email = email;
    state.mobile = mobileNo;
    state.phone = phoneNo;
    state.birthName = birthName;
    state.dob = dateOfBirth;
    state.placeOfBirth = placeOfBirth;
    state.gender = gender;
    state.nationality = nationality;
    state.highestSchoolDegree = highestSchoolDegree;
    state.highestEducationalLevel = highestEducationLevel;
    state.maritalStatus = maritalStatus;
    rows.value = response?.data?.children;
    state.country = response?.data?.birthCountry?.id;
    state.privatePhone = response?.data?.privateDetail?.privatePhone;
    state.privateEmail = response?.data?.privateDetail?.privateEmail;
    state.addressCountry = response?.data?.privateAddress?.countryId;
    state.zipCode = response?.data?.privateAddress?.zipCode;
    state.city = response?.data?.privateAddress?.city;
    state.state = response?.data?.privateAddress?.state;
    state.street = response?.data?.privateAddress?.street;
    state.address = response?.data?.privateAddress?.address;
    state.financeDepptNumber = response?.data?.taxDetail?.financeDepptNumber;
    state.financeCategory = response?.data?.taxDetail?.financeCategory;
    state.religion = response?.data?.taxDetail?.religion;
    state.religionOfPartner = response?.data?.taxDetail?.religionOfPartner;
    state.freeAmountChildren = response?.data?.taxDetail?.freeAmountChildren;
    state.freeAmountYearly = response?.data?.taxDetail?.freeAmountYearly;
    state.freeAmountMonthly = response?.data?.taxDetail?.freeAmountMonthly;
    state.taxLiability = response?.data?.taxDetail?.taxLiability;
    state.accountOwner = response?.data?.bankDetail?.accountOwner;
    state.iban = response?.data?.bankDetail?.iban;
    state.bic = response?.data?.bankDetail?.bic;
    state.bankName = response?.data?.bankDetail?.bankName;
    state.socialSecurityNumber =
      response?.data?.socialSecurityDetail?.socialSecurityNumber;
    state.previousHealthInsurance =
      response?.data?.socialSecurityDetail?.previousHealthInsurance;
    state.healthInsurance =
      response?.data?.socialSecurityDetail?.healthInsurance;
    state.groupOfPeople = response?.data?.socialSecurityDetail?.groupOfPeople;
    state.contributionGroup =
      response?.data?.socialSecurityDetail?.contributionGroup;
    state.accidentInsurance =
      response?.data?.insuranceDetail?.accidentInsurance;
    state.tarrifPoints = response?.data?.insuranceDetail?.tarrifPoints;
    state.percentageAssociation =
      response?.data?.insuranceDetail?.percentageAssociation;
    emit("userProfileData", {
      name: state.firstName + " " + state.lastName,
      email: state.email,
      mobile: state.mobile,
      phone: state.phone,
      userId: userId
    });
    
  }).finally(() => {
    layout.changeLoaderValue(false);
  });
};

const refresh = () => {
  
  // const layout = useLayoutStore();
  // layout.changeLoaderValue(true);
  rolesList();
  countryList();
  educationalDegreeList();
  educationalLevelList();
  employeesList();
  if (router.params.id) {
    const layout = useLayoutStore();
    layout.changeLoaderValue(true);
    isEdit.value = true;
    showCustomer();
  }
};

refresh();

const addChildren = () => {
  children.submitted = true;
  v2$.value.$touch();
  if (v2$.value.$invalid) {
    return false;
  } else {
    children.submitted = false;
    const obj = {
      name: children.name,
      gender: children.gender,
      dateOfBirth: children.dateOfBirth,
    };
    rows.value.push(obj);
    children.name = "";
    children.gender = "";
    children.dateOfBirth = "";
  }
};
</script>
<template>
  <div>
    <div class="card product-type">
      <div class="card-header d-flex align-items-center">
        <h3 class="card-title me-2">{{$t("Fill User Details")}}</h3>
        <elements-tooltip :label="'Enter User Details'"/>
      </div>
      <div class="card-body">
        <div v-if="isEdit == false" class="row">
          <div class="col-md-8"></div>
          <div class="col-md-4">
            <div class="form-group">
              <elements-multiselect
                v-model="state.userId"
                :options="employees"
                label="text"
                :key="state.userId"
                track-by="value"
                :textLabel="$t('Attach User')"
              />
            </div>
          </div>
        </div>
        <div class="row align-items-center">
          <div class="col-lg-2">
            <div class="upload-image">
              <img class="Userimage" src="@/assets/images/users/avatar-4.jpg" alt="">
              <label for="uploadImage" class="cam-icon" >
                <elements-icon v-bind:icon="'cameraIcon'" />
              </label>
              <input type="file" class="d-none" id="uploadImage">
            </div>
          </div>
          <div class="col-lg-5">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text"><elements-icon v-bind:icon="'userIcon'"/></span>
                </div>
              <elements-input
                v-model="state.firstName"
                :label="$t('First Name')"
                :required="true"
                id="firstName"
                :disabled="state.submitted"
                :class="{ 'is-invalid': v$.firstName.$error }"
              />
              </div>
            </div>
            <div v-if="v$.firstName.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.firstName.required">{{
                  $t("This value is required")
                }}</span
                ><br />
              </div>
          </div>
          <div class="col-lg-5">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text"><elements-icon v-bind:icon="'userIcon'"/></span>
                </div>
              <elements-input
                v-model="state.lastName"
                :label="$t('Last Name')"
                :required="true"
                id="lastName"
                :disabled="state.submitted"
                :class="{ 'is-invalid': v$.lastName.$error }"
              />
              </div>
            </div>
            <div v-if="v$.lastName.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.lastName.required">{{
                  $t("This value is required")
                }}</span
                ><br />
              </div>
          </div>
        </div>
        <div class="row">
          
          
          <div class="col-lg-4 col-md-4">
            
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text"><elements-icon v-bind:icon="'phoneIcon'"/></span>
                </div>
              <elements-input
                v-model="state.phone"
                :label="$t('Phone')"
                :required="true"
                id="zip"
                :disabled="state.submitted"
                type="tel"
              />
              </div>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text"><elements-icon v-bind:icon="'mobileIcon'"/></span>
                </div>
              <elements-input
                v-model="state.mobile"
                :label="$t('Mobile')"
                id="mobile"
                :disabled="state.submitted"
                type="tel"
              />
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text"><elements-icon v-bind:icon="'emailIcon'"/></span>
                </div>
              <elements-input
                v-model="state.email"
                :label="$t('Email')"
                :required="true"
                id="email"
                :disabled="state.submitted"
                :class="{ 'is-invalid': v$.email.$error }"
              />
              </div>
              
            </div>
            <div v-if="v$.email.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.email.required">{{
                  $t("This value is required")
                }}</span
                ><br />
                <span class="text-danger" v-if="v$.email.email"
                  >{{ $t('Please enter valid email') }}.</span
                >
              </div>
          </div>
          <div v-if="isEdit == false" class="col-lg-6">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text"><elements-icon v-bind:icon="'eyeIcon'"/></span>
                </div>
              <elements-input
                v-model="state.password"
                :label="$t('Password')"
                :required="true"
                id="email"
                type="password"
                :disabled="state.submitted"
                :class="{ 'is-invalid': state.password == '' }"
              />
              </div>
              
            </div>
            <div v-if="state.password == ''" class="invalid-feedback">
                <span class="text-danger" v-if="state.password == ''">{{
                  $t("This value is required")
                }}</span
                ><br />
              </div>
          </div>
          <div v-if="isEdit == false" class="col-lg-6">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text"><elements-icon v-bind:icon="'eyeIcon'"/></span>
                </div>
              <elements-input
                v-model="state.confirmPassword"
                :label="$t('Confirm Password')"
                :required="true"
                id="confirmPassword"
                type="password"
                :disabled="state.submitted"
                :class="{
                  'is-invalid': !passwordsMatch && state.password != '',
                }"
              />
              </div>
              
            </div>
            <span
                class="text-danger"
                v-if="!passwordsMatch && state.password != ''"
                >{{ $t("Both passwords should match") }}</span
              ><br />
            </div>

          </div>
          <div v-if="isEdit == false" class="col-lg-12">
            <div class="form-group">
              <elements-multiselect
                v-model="state.roles"
                :options="roles"
                label="text"
                :key="state.roles"
                track-by="value"
                :textLabel="$t('Roles')"
                :multiple="true"
              />
            </div>
          </div>
        </div>
    </div>
    <div class="card mt-4">
      <div class="card-header d-flex align-items-center">
        <h3 class="card-title me-2">{{$t("Fill Personal Details")}}</h3>
        <elements-tooltip/>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text"><elements-icon v-bind:icon="'userIcon'"/></span>
                </div>
              <elements-input
                v-model="state.birthName"
                :label="$t('Birth Name')"
                id="birthName"
                :disabled="state.submitted"
              />
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text"><elements-icon v-bind:icon="'dateIcon'"/></span>
                </div>
              <elements-input
                v-model="state.dob"
                :label="$t('Date Of Birth')"
                :required="true"
                id="dob"
                type="date"
                :disabled="state.submitted"
                :class="{ 'is-invalid': v$.dob.$error }"
              />
              </div>
              
            </div>
            <div v-if="v$.dob.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.dob.required">{{
                  $t("This value is required")
                }}</span
                ><br />
              </div>
          </div>
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-multiselect
                v-model="state.country"
                :options="countries"
                label="text"
                :key="state.country"
                track-by="value"
                :textLabel="$t('Country Of Birth')"
                :required="true"
                :class="{ 'is-invalid': v$.country.$error }"
              />
              
            </div>
            <div v-if="v$.country.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.country.required">{{
                  $t("This value is required")
                }}</span
                ><br />
              </div>
          </div>
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-input
                v-model="state.placeOfBirth"
                :label="$t('Place Of Birth')"
                :required="true"
                id="zip"
                :disabled="state.submitted"
                :class="{ 'is-invalid': v$.placeOfBirth.$error }"
              />
              
            </div>
            <div v-if="v$.placeOfBirth.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.placeOfBirth.required">{{
                  $t("This value is required")
                }}</span
                >
              </div>
          </div>
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-multiselect
                v-model="state.gender"
                :options="genders"
                label="text"
                :key="state.gender"
                track-by="value"
                :textLabel="$t('Gender')"
                :required="true"
                :class="{ 'is-invalid': v$.gender.$error }"
              />
              
            </div>
            <div v-if="v$.gender.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.gender.required">{{
                  $t("This value is required")
                }}</span
                ><br />
              </div>
          </div>
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-input
                v-model="state.nationality"
                :label="$t('Nationality')"
                :required="true"
                id="nationality"
                :disabled="state.submitted"
                :class="{ 'is-invalid': v$.nationality.$error }"
              />
              
            </div>
            <div v-if="v$.nationality.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.nationality.required">{{
                  $t("This value is required")
                }}</span
                ><br />
              </div>
          </div>
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-multiselect
                v-model="state.highestSchoolDegree"
                :options="highestSchoolDegrees"
                label="text"
                :key="state.highestSchoolDegree"
                track-by="value"
                :textLabel="$t('Highest School Degree')"
              />
            </div>
          </div>
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-multiselect
                v-model="state.highestEducationalLevel"
                :options="highestEducationalLevels"
                label="text"
                :key="state.highestEducationalLevel"
                track-by="value"
                :textLabel="$t('Highest Educational Level')"
              />
            </div>
          </div>
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-multiselect
                v-model="state.maritalStatus"
                :options="maritalStatuses"
                label="text"
                :key="state.maritalStatus"
                track-by="value"
                :textLabel="$t('Marital Status')"
                :required="true"
                :class="{ 'is-invalid': v$.maritalStatus.$error }"
              />
              
            </div>
            <div v-if="v$.maritalStatus.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.maritalStatus.required">{{
                  $t("This value is required")
                }}</span
                ><br />
              </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card mt-4">
      <div class="card-header d-flex align-items-center">
        <h3 class="card-title me-2">{{$t("Fill Private Details")}}</h3>
        <elements-tooltip/>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text"><elements-icon v-bind:icon="'phoneIcon'"/></span>
                </div>
              <elements-input
                v-model="state.privatePhone"
                :label="$t('Phone')"
                id="birthName"
                :disabled="state.submitted"
              />
              </div>
            </div>
          </div>
          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text"><elements-icon v-bind:icon="'emailIcon'"/></span>
                </div>
              <elements-input
                v-model="state.privateEmail"
                :label="$t('Private Email')"
                id="dob"
                :disabled="state.submitted"
              />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card mt-4">
      <div class="card-header d-flex align-items-center">
        <h3 class="card-title me-2">{{$t("Private Address")}}</h3>
        <elements-tooltip/>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-input
                v-model="state.street"
                :label="$t('Street')"
                :required="true"
                id="street"
                :disabled="state.submitted"
                :class="{ 'is-invalid': v$.street.$error }"
              />
              
            </div>
            <div v-if="v$.street.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.street.required">{{
                  $t("This value is required")
                }}</span
                ><br />
              </div>
          </div>
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text"><elements-icon v-bind:icon="'locationIcon'"/></span>
                </div>
              <elements-input
                v-model="state.address"
                :label="$t('Address')"
                id="zip"
                :disabled="state.submitted"
              />
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-input
                v-model="state.zipCode"
                :label="$t('Zip Code')"
                id="zip"
                :disabled="state.submitted"
              />
            </div>
          </div>
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-input
                v-model="state.city"
                :label="$t('City')"
                id="zip"
                :disabled="state.submitted"
              />
            </div>
          </div>
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-input
                v-model="state.state"
                :label="$t('State')"
                id="state"
                :required="true"
                :disabled="state.submitted"
                :class="{ 'is-invalid': v$.state.$error }"
              />
              
            </div>
            <div v-if="v$.state.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.state.required">{{
                  $t("This value is required")
                }}</span
                ><br />
              </div>
          </div>
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-multiselect
                v-model="state.addressCountry"
                :options="countries"
                label="text"
                :key="state.addressCountry"
                track-by="value"
                :textLabel="$t('Country')"
                :required="true"
                :class="{ 'is-invalid': v$.addressCountry.$error }"
              />
              
            </div>
            <div v-if="v$.addressCountry.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.addressCountry.required">{{
                  $t("This value is required")
                }}</span
                ><br />
              </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card mt-4">
      <div class="card-header d-flex align-items-center">
        <h3 class="card-title me-2">{{$t("Children")}}</h3>
        <elements-tooltip/>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-4">
                    <div class="form-group mb-lg-0">
                      <elements-input
                        v-model="children.name"
                        :label="$t('Name')"
                        :required="true"
                        id="name"
                        :class="{
                          'is-invalid': v2$.name.$error && children.submitted,
                        }"
                      />
                      
                    </div>
                    <div
                        v-if="v2$.name.$error && children.submitted"
                        class="invalid-feedback"
                      >
                        <span
                          class="text-danger"
                          v-if="v2$.name.required && children.submitted"
                          >{{ $t("This value is required") }}</span
                        ><br />
                      </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group mb-lg-0">
                      <elements-multiselect
                        v-model="children.gender"
                        :options="genders"
                        label="text"
                        :key="children.gender"
                        track-by="value"
                        :textLabel="$t('Gender')"
                        :required="true"
                        :class="{
                          'is-invalid': v2$.gender.$error && children.submitted,
                        }"
                      />
                      
                    </div>
                    <div
                        v-if="v2$.gender.$error && children.submitted"
                        class="invalid-feedback"
                      >
                        <span
                          class="text-danger"
                          v-if="v2$.gender.required && children.submitted"
                          >{{ $t("This value is required") }}</span
                        ><br />
                      </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group mb-lg-0">
                      <elements-input
                        v-model="children.dateOfBirth"
                        :label="$t('Date Of Birth')"
                        :required="true"
                        type="date"
                        :max="
                          new Date().toLocaleDateString('fr-ca', {
                            timeZone: 'Europe/Berlin',
                          })
                        "
                        id="dob"
                        :class="{
                          'is-invalid':
                            v2$.dateOfBirth.$error && children.submitted,
                        }"
                      />
                      
                    </div>
                    <div
                        v-if="v2$.dateOfBirth.$error && children.submitted"
                        class="invalid-feedback"
                      >
                        <span
                          class="text-danger"
                          v-if="v2$.dateOfBirth.required && children.submitted"
                          >{{ $t("This value is required") }}</span
                        ><br />
                      </div>
                  </div>
          
        </div>
      </div>
    </div>
    
    <div v-if="rows.length > 0" class="row mt-2">
          <div class="col-12">
            <div class="table-responsive mt-3">
              <table class="doc-table table">
                <thead>
                  <tr>
                    <th>{{ $t("Name") }}</th>
                    <th>{{ $t("Gender") }}</th>
                    <th>{{ $t("Date Of Birth") }}</th>
                    <th style="width:140px">{{ $t("Actions") }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in rows" :key="index">
                    <td>{{ item?.name }}</td>
                    <td>{{ item?.gender }}</td>
                    <td>{{ item?.dateOfBirth }}</td>
                    <td>
                      <div class="cursor-pointer" @click.prevent="popRow(index)">
                        <elements-icon v-bind:icon="'deleteIcon'"/>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="mt-3 d-flex align-items-center justify-content-end">
      <button @click.prevent="addChildren()" class="secondary-btn">
        <elements-icon v-bind:icon="'addIcon'" class="me-2" />
        {{ $t("Add Child") }}
      </button>
    </div>
    <div class="card mt-4">
      <div class="card-header d-flex align-items-center">
        <h3 class="card-title me-2">{{$t("Tax")}}</h3>
        <elements-tooltip/>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-input
                v-model="state.financeDepptNumber"
                :label="$t('Finance Department Number')"
                type="financeDepptNumber"
                id="financeDepptNumber"
                :disabled="state.submitted"
              />
            </div>
          </div>
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-input
                v-model="state.financeCategory"
                :label="$t('Finance Category')"
                id="financeCategory"
                type="number"
                :disabled="state.submitted"
              />
            </div>
          </div>
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-input
                v-model="state.religion"
                :label="$t('Religion')"
                id="religion"
                :disabled="state.submitted"
              />
            </div>
          </div>
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-input
                v-model="state.religionOfPartner"
                :label="$t('Religion Of Partner')"
                id="religionOfPartner"
                :disabled="state.submitted"
              />
            </div>
          </div>
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-input
                v-model="state.freeAmountChildren"
                :label="$t('Free Amount Children')"
                id="freeAmountChildren"
                type="number"
                :disabled="state.submitted"
              />
            </div>
          </div>
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-input
                v-model="state.freeAmountYearly"
                :label="$t('Free Amount Yearly')"
                id="freeAmountYearly"
                type="number"
                :disabled="state.submitted"
              />
            </div>
          </div>
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-input
                v-model="state.freeAmountMonthly"
                :label="$t('Free Amount Monthly')"
                id="freeAmountMonthly"
                type="number"
                :disabled="state.submitted"
              />
            </div>
          </div>
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-input
                v-model="state.taxLiability"
                :label="$t('Tax Liability')"
                id="taxLiability"
                :disabled="state.submitted"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card mt-4">
      <div class="card-header d-flex align-items-center">
        <h3 class="card-title me-2">{{$t("Bank")}}</h3>
        <elements-tooltip/>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-input
                v-model="state.accountOwner"
                :label="$t('Account Owner')"
                id="accountOwner"
                :disabled="state.submitted"
              />
            </div>
          </div>
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-input
                v-model="state.iban"
                :label="$t('IBAN')"
                id="iban"
                :disabled="state.submitted"
              />
            </div>
          </div>
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-input
                v-model="state.bic"
                :label="$t('BIC')"
                id="bic"
                :disabled="state.submitted"
              />
            </div>
          </div>
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-input
                v-model="state.bankName"
                :label="$t('Bank Name')"
                id="bankName"
                :disabled="state.submitted"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card mt-4">
      <div class="card-header d-flex align-items-center">
        <h3 class="card-title me-2">{{$t("Social Security")}}</h3>
        <elements-tooltip/>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-input
                v-model="state.socialSecurityNumber"
                :label="$t('Social Security Number')"
                type="socialSecurityNumber"
                id="socialSecurityNumber"
                :disabled="state.submitted"
              />
            </div>
          </div>
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-input
                v-model="state.previousHealthInsurance"
                :label="$t('Previous Health Insurance')"
                id="iban"
                :disabled="state.submitted"
              />
            </div>
          </div>
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-input
                v-model="state.healthInsurance"
                :label="$t('Health Insurance')"
                id="bic"
                :disabled="state.submitted"
              />
            </div>
          </div>
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-input
                v-model="state.groupOfPeople"
                :label="$t('Group Of People')"
                id="groupOfPeople"
                type="number"
                :disabled="state.submitted"
              />
            </div>
          </div>
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-input
                v-model="state.contributionGroup"
                :label="$t('Contribution People')"
                id="contributionGroup"
                type="number"
                :disabled="state.submitted"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card mt-4">
      <div class="card-header d-flex align-items-center">
        <h3 class="card-title me-2">{{$t("Insurance")}}</h3>
        <elements-tooltip/>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-input
                v-model="state.accidentInsurance"
                :label="$t('Accident Insurance')"
                type="accountOwner"
                id="accountOwner"
                :disabled="state.submitted"
              />
            </div>
          </div>
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-input
                v-model="state.tarrifPoints"
                :label="$t('Tarrif Points')"
                id="tarrifPoints"
                :disabled="state.submitted"
              />
            </div>
          </div>
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-input
                v-model="state.percentageAssociation"
                :label="$t('Percentage Association')"
                id="percentageAssociation"
                :disabled="state.submitted"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="d-flex align-items-center justify-content-end mt-4">
      <button class="primary-btn me-3"  @click="navigateTo('/personal-management/employees')">
        <elements-icon v-bind:icon="'cancelIcon'" />
        {{ $t("Cancel") }}</button>
      <submittal-button
        @click="store()"
        :isLoading="state.isLoading"
        :iconName="'saveIcon'"
        :buttonName="$t('Save and Proceed')"
      />
    </div>
  </div>
</template>
