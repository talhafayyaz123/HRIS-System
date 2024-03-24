<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from "vue";
import commonCode from "~/composables/common";
import {
  genericListingRequest,
  getEmployeeByIdRequest,
  workshopTemplateUpdateRequest,
  workshopTemplateShowRequest
} from "~/utils/apiRequests";
import { routes } from "~/utils/apiRoutes";
import addProduct from "./components/add-product.vue";
import FileUpload from "./components/FileUpload.vue";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import TemplateEditor from "./components/TemplateEditor.vue";
useHead({
  title: `Workshop Templates Edit`,
});
const { router, Toast } = commonCode(),
  { t } = useI18n(),
  state = reactive({
    isLoading: false,
    submitted: false,
    id: "",
    templateName: "",
    templateVersion: "",
    consultant: "",
    userName: "",
    products: [],
    cards: [],
    files: [],
    status: "",
    createdAt: ""
  }),
  statusOptions = [
    { value: "draft", name: "Draft" },
    { value: "stable", name: "Stable" },
  ],
  workshopTemplateId = router.params.id,
  products = ref([]),
  productNames = ref([]),
  items = [
    {
      text: "Admin portal",
      to: "/",
    },
    {
      text: "Workshop Templates",
      to: "/consulting/workshop-templates",
    },
    {
      text: "Edit",
      active: true,
    },
  ],
  title = t("Workshop Templates Edit"),
  validationRules = {
    templateName: { required },
    templateVersion: { required },
    status: { required }
  },
  v$ = useVuelidate(validationRules, state);

const isModalOpen = ref(false);
const isGetCards = ref(false);
const isRightbarOpen = ref(false);

const exportTemplate = (event: any) => {
  let fileContents = JSON.stringify(state);
  let fileName = `${state.templateName}.json`;
  let blob = new Blob([fileContents], {
    type: "text/plain",
  });
  let url = URL.createObjectURL(blob);
  let link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
};

const store = () => {
  v$.value.$touch();
  if (v$.value.$invalid) {
    state.submitted = false;
    return false;
  } else {
    try {
      state.isLoading = true;
      isGetCards.value = true;
    } catch (e) {
      Toast.fire({
        title: t("Something went wrong!"),
        text: t("Error"),
        icon: "error",
      });
      state.isLoading = false;
      state.submitted = false;
    }
  }
};


const updateWorkshop = () => {
  workshopTemplateUpdateRequest(
    {
      name: state.templateName,
      version: state.templateVersion,
      consultantId: state.consultant,
      productIds: state.products,
      status: state.status,
      cards: state.cards
    },
    workshopTemplateId
  )
    .then((response) => {
      Toast.fire({
        icon: "success",
        title: "Record updated successfully!",
      });
      state.isLoading = false;
      isGetCards.value = false;
      navigateTo("/consulting/workshop-templates");
    })
    .catch((error) => {
      console.log(error)
      Toast.fire({ icon: "error", title: t("something went wrong!") });
      state.isLoading = false;
      isGetCards.value = false;
    });
};
onMounted(async function () {
    products.value = await genericListingRequest(routes.PRODUCT, {
      all: true,
      type: "software"
    });
});

const refresh = () => { 
  workshopTemplateShowRequest(workshopTemplateId).then((response) => {
    state.templateName = response?.data?.name
    state.templateVersion = response?.data?.version
    state.createdAt = new Date(response?.data?.createAt).toLocaleDateString()
    state.cards = response?.data?.cards
    state.files = response?.data?.files
    state.consultant = response?.data?.consultantId
    state.status = response?.data?.status
    state.products = response?.data?.productIds
    for (const item of response?.data?.products) {
      productNames.value.push(item?.name);
      }

    
    getEmployeeByIdRequest({
      id: state.consultant,
    })
      .then((response) => {
        state.userName = response?.first_name + " " + response?.last_name;
      })
      .catch((error) => {
        Toast.fire({ icon: "error", title: t("Something went wrong") });
      });
  });
};

refresh();

function hideModal() {
  isModalOpen.value = false;
}

function getCards(data) {
  state.cards = data
  updateWorkshop()
}


function productAdded(data) {
  if (data.length > 0) {
    data.map((product: any) => {
      state.products.push(product.productId);
      productNames.value.push(product.productName);
    });
  }
}

function openModal() {
  isModalOpen.value = true;
}
function OpenRightbar() {
  isRightbarOpen.value = true;
}
function CloseRightbar() {
  isRightbarOpen.value = false;
}
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <div class="card">
      <div
        class="card-header d-flex align-items-center justify-content-between"
      >
        <h3 class="card-title">{{ $t("Configuration") }}</h3>
        <button @click="exportTemplate" class="secondary-btn">
          <ElementsIcon v-bind:icon="'saveIcon'" class="me-2" />
          {{ $t("Export") }}
        </button>

      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-lg-4">
            <div class="form-group">
              <elements-input
                v-model="state.templateName"
                :label="$t('Template Name')"
                :required="true"
                id="templateName"
                :disabled="state.submitted"
                :class="{ 'is-invalid': v$.templateName.$error }"
              />
            </div>
            <div v-if="v$.templateName.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.templateName.required">{{
                $t("This value is required")
              }}</span
              ><br />
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <elements-input
                v-model="state.templateVersion"
                :label="$t('Template Version')"
                :required="true"
                id="templateVersion"
                :disabled="state.submitted"
                :class="{ 'is-invalid': v$.templateVersion.$error }"
              />
            </div>
            <div v-if="v$.templateVersion.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.templateVersion.required">{{
                $t("This value is required")
              }}</span
              ><br />
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <elements-input
                v-model="state.userName"
                readonly
                :label="$t('Consultant')"
                id="subject"
                :disabled="state.submitted"
              />
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <elements-input
                v-model="state.createdAt"
                readonly
                :label="$t('Created At')"
                id="subject"
                :disabled="state.submitted"
              />
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <elements-multiselect v-model="state.status" :key="state.status" :options="statusOptions" label="name" track-by="value"
                :textLabel="$t('Status')" :required="true"
                :class="{ 'is-invalid': v$.status.$error }" />
            </div>
            <div v-if="v$.status.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.status.required">{{
                $t("This value is required")
              }}</span><br />
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <div class="form-control p-2 product-modal-btn">
                <div v-for="product in productNames" class="w-100">
                  {{ product }}
                </div>
              </div>
            </div>
            <addProduct
              @productAdded="productAdded"
              :showModal="isModalOpen"
              :hideModal="hideModal"
            />
          </div>
          <div class="col-lg-3">
            <div class="form-group">
              <button class="secondary-btn" @click="openModal()">
                <ElementsIcon v-bind:icon="'addIcon'" class="me-2" />{{
                  $t("Select Product")
                }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-4 d-flex align-items-center justify-content-end">
      <submittal-button
        @click="store()"
        :iconName="'saveIcon'"
        :isLoading="state.isLoading"
        :buttonName="$t('Save and Proceed')"
      />
    </div>

    <FileUpload :files="state?.files ?? []" :id="workshopTemplateId"/>
    <div class="card mt-4">
      <TemplateEditor
        :isGetCards="isGetCards"
        @getCards="getCards"
        :cardsFromAPI="state?.cards ?? []"
        :workshopTemplateId="workshopTemplateId"
      />
    </div>
  </div>
</template>
