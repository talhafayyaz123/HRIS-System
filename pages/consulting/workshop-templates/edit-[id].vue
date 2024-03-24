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
import { useLayoutStore } from "~/store/layout";
import addProduct from "./components/add-product.vue";
import FileUpload from "./components/FileUpload.vue";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import TemplateEditor from "./components/TemplateEditor.vue";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";

const { router, Toast } = commonCode(),
  { t } = useI18n(),
  state = reactive({
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
  breadCrumbsConfig = [
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
  validationRules = {
    templateName: { required },
    templateVersion: { required },
    status: { required }
  },
  v$ = useVuelidate(validationRules, state),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { title } = useTitle("Workshop Templates Edit");

const isModalOpen = ref(false);
const isGetCards = ref(false);
const isRightbarOpen = ref(false);

const exportTemplate = (event: any) => {
  isGetCards.value = true;
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
  isGetCards.value = false;
};

const store = () => {
  v$.value.$touch();
  if (v$.value.$invalid) {
    return false;
  } else {
    try {
      isGetCards.value = true;
    } catch (e) {
      Toast.fire({
        title: t("Something went wrong!"),
        text: t("Error"),
        icon: "error",
      });
    }
  }
};


const updateWorkshop = () => {
  const layout = useLayoutStore();
  layout.changeLoaderValue(true);
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
      layout.changeLoaderValue(false);
      Toast.fire({
        icon: "success",
        title: "Record updated successfully!",
      });
      isGetCards.value = false;
      navigateTo("/consulting/workshop-templates");
    })
    .catch((error) => {
      layout.changeLoaderValue(false);
      console.log(error)
      Toast.fire({ icon: "error", title: t("something went wrong!") });
      isGetCards.value = false;
    });
};
onMounted(async function () {
    products.value = await genericListingRequest(routes.PRODUCT, {
      all: true,
      type: "software"
    });
});

function popProduct(id, productIndex) {
  if(state.products.includes(id)){
    var index = state.products.indexOf(id);
    if (index !== -1) {
      state.products.splice(index, 1);
    }
  }
  productNames.value.splice(productIndex, 1)
}

const refresh = () => { 
  const layout = useLayoutStore();
  layout.changeLoaderValue(true);
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
        productNames.value.push(item);
    }

    
    getEmployeeByIdRequest({
      id: state.consultant,
    })
      .then((response) => {
        layout.changeLoaderValue(false);

        state.userName = response?.first_name + " " + response?.last_name;
      })
      .catch((error) => {
        Toast.fire({ icon: "error", title: t("Something went wrong") });
      }).finally(() => {
            layout.changeLoaderValue(false);
           
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
      state.products.push(product.id);
      productNames.value.push(product);
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

useHead({
  title: title,
});
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
                <div v-for="(product, index) in productNames" :key="index" class="w-100">
                  <elements-icon @click="popProduct(product?.id, index)" v-bind:icon="'xIcon'" class="me-1" /> {{ product.name }} 
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
