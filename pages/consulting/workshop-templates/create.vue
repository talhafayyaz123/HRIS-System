<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";
import commonCode from "~/composables/common";
import {
  getEmployeeByIdRequest,
  workshopTemplateCreateRequest,
  workshopTemplateUpdateRequest,
} from "~/utils/apiRequests";
import addProduct from "./components/add-product.vue";
import FileUpload from "./components/FileUpload.vue";
import { useLayoutStore } from "~/store/layout";
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
    files: []
  }),
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
      text: "Create",
      active: true,
    },
  ],
  validationRules = {
    templateName: { required },
    templateVersion: { required },
  },
  v$ = useVuelidate(validationRules, state),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { title } = useTitle("Workshop Templates Create");

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

const fileUpload = (event: any) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.readAsText(file, "UTF-8");
  reader.onload = async (event) => {
    try {
      // read the content of the file as text
      const json = JSON.parse(event.target.result);
      state.templateName = json?.templateName ?? "";
      state.templateVersion = json?.templateVersion ?? "";
      state.cards = json?.cards ?? [];
      store();
    } catch (e) {
      console.log(e);
    }
  };
  reader.onerror = function (error) {
    console.log(error);
  };
};

const store = () => {
  v$.value.$touch();
  if (v$.value.$invalid) {
    return false;
  } else {
    try {
      if (!state.id) {
        createWorkshop();
      } else {
        isGetCards.value = true;
      }
    } catch (e) {
      Toast.fire({
        title: t("Something went wrong!"),
        text: t("Error"),
        icon: "error",
      });
    }
  }
};

const createWorkshop = () => {
  const layout = useLayoutStore();
  layout.changeLoaderValue(true);
  workshopTemplateCreateRequest({
    name: state.templateName,
    version: state.templateVersion,
    consultantId: state.consultant,
    productIds: state.products,
    cards: state.cards
  })
    .then((response) => {
      layout.changeLoaderValue(false);
      Toast.fire({
        icon: "success",
        title: "Workshop Template Created Successfully!",
      });
      state.id = response?.data?.id;
      // navigateTo("/settings/products/price-list");
    })
    .catch((error) => {
      layout.changeLoaderValue(false);
      Toast.fire({ icon: "error", title: t("something went wrong!") });
    });
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
      status: "draft",
      cards: state.cards
    },
    state.id
  )
    .then((response) => {
      layout.changeLoaderValue(false);
      Toast.fire({
        icon: "success",
        title: "Record updated successfully!",
      });
      state.id = response?.data?.id;
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

const refresh = () => {
  var id = localStorage.getItem("user_id");
  state.consultant = id;
  getEmployeeByIdRequest({
    id: id,
  })
    .then((response) => {
      state.userName = response?.first_name + " " + response?.last_name;
    })
    .catch((error) => {
      Toast.fire({ icon: "error", title: t("Something went wrong") });
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

function popProduct(id, productIndex) {
  if (state.products.includes(id)) {
    var index = state.products.indexOf(id);
    if (index !== -1) {
      state.products.splice(index, 1);
    }
  }
  productNames.value.splice(productIndex, 1)
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
      <div class="card-header d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center">
          <h3 class="card-title me-2">{{ $t("Configuration") }}</h3>
          <ElementsTooltip />
        </div>
        <button v-if="!state.id" @click="$refs.file.click()" class="secondary-btn">
          <ElementsIcon v-bind:icon="'addIcon'" class="me-2" />
          {{ $t("Import") }}
        </button>
        <button @click="exportTemplate" v-else class="secondary-btn">
          <ElementsIcon v-bind:icon="'saveIcon'" class="me-2" />
          {{ $t("Export") }}
        </button>
        <input id="hidden-input" type="file" ref="file" @change="fileUpload" name="file" class="hidden t-none"
          style="display: none" />
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-lg-4">
            <div class="form-group">
              <elements-input v-model="state.templateName" :label="$t('Template Name')" :required="true" id="templateName"
                :class="{ 'is-invalid': v$.templateName.$error }" />
            </div>
            <div v-if="v$.templateName.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.templateName.required">{{
                $t("This value is required")
              }}</span><br />
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <elements-input v-model="state.templateVersion" :label="$t('Template Version')" :required="true"
                id="templateVersion" :class="{ 'is-invalid': v$.templateVersion.$error }" />
            </div>
            <div v-if="v$.templateVersion.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.templateVersion.required">{{
                $t("This value is required")
              }}</span><br />
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <elements-input v-model="state.userName" readonly :label="$t('Consultant')" id="subject" />
            </div>
          </div>

        </div>
      </div>
    </div>
    <div class="card mt-3">
      <div class="card-header">
          <button class="secondary-btn" @click="openModal()">
            <ElementsIcon v-bind:icon="'addIcon'" class="me-2" />{{
              $t("Select Product")
            }}
          </button>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-lg-12">
            <div class="form-group">
              <div class="form-control p-2 product-modal-btn">
                <div v-if="productNames.length > 0" v-for="(product, index) in productNames" :key="index" class="w-100">
                  <elements-icon @click="popProduct(product?.id, index)" v-bind:icon="'xIcon'" class="me-1" />
                  <span>{{ product.name }}</span>
                </div>
                <div class="" v-else>
                  {{$t("No Product Selected")}}
                </div>
              </div>
            </div>
           
            <addProduct @productAdded="productAdded" :showModal="isModalOpen" :hideModal="hideModal" />
          </div>

        </div>
      </div>
    </div>
    <div class="mt-4 d-flex align-items-center justify-content-end">
      <button class="primary-btn me-3">
        <ElementsIcon v-bind:icon="'cancelIcon'" class="me-2" />
        <span>{{$t("Cancel")}}</span>
      </button>
      <submittal-button @click="store()" :iconName="'saveIcon'" :buttonName="$t('Save and Proceed')" />
    </div>

    <FileUpload :files="state?.files ?? []" :id="state.id" v-if="state.id" />

    <div class="">
      <TemplateEditor v-if="state.id" :isGetCards="isGetCards" @getCards="getCards" :cardsFromAPI="state?.cards ?? []"
        :workshopTemplateId="state.id" />
    </div>
  </div>
</template>
