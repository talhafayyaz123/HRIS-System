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
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import TemplateEditor from "./components/TemplateEditor.vue";
useHead({
  title: `Workshop Templates Create`,
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
    files: []
  }),
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
      text: "Create",
      active: true,
    },
  ],
  title = t("Workshop Templates Create"),
  validationRules = {
    templateName: { required },
    templateVersion: { required },
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
    state.submitted = false;
    return false;
  } else {
    try {
      state.isLoading = true;
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
      state.isLoading = false;
      state.submitted = false;
    }
  }
};

const createWorkshop = () => {
  workshopTemplateCreateRequest({
    name: state.templateName,
    version: state.templateVersion,
    consultantId: state.consultant,
    productIds: state.products,
  })
    .then((response) => {
      Toast.fire({
        icon: "success",
        title: "Record created successfully!",
      });
      state.isLoading = false;
      state.id = response?.data?.id;
      // navigateTo("/settings/products/price-list");
    })
    .catch((error) => {
      Toast.fire({ icon: "error", title: t("something went wrong!") });
      state.isLoading = false;
    });
};

const updateWorkshop = () => {

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
      Toast.fire({
        icon: "success",
        title: "Record updated successfully!",
      });
      state.isLoading = false;
      state.id = response?.data?.id;
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
        <button
          v-if="!state.id"
          @click="$refs.file.click()"
          class="secondary-btn"
        >
          <ElementsIcon v-bind:icon="'addIcon'" class="me-2" />
          {{ $t("Import") }}
        </button>
        <button @click="exportTemplate" v-else class="secondary-btn">
          <ElementsIcon v-bind:icon="'saveIcon'" class="me-2" />
          {{ $t("Export") }}
        </button>
        <input
          id="hidden-input"
          type="file"
          ref="file"
          @change="fileUpload"
          name="file"
          class="hidden t-none"
          style="display: none"
        />
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

    <FileUpload :files="state?.files ?? []" :id="state.id" v-if="state.id" />

    <!-- <div v-if="state.id" class="card -mt4">
      <div
        class="card-header d-flex align-items-center justify-content-between"
      >
        <h3 class="card-title">Config Files</h3>
        <button type="button" class="secondary-btn" @click="OpenRightbar">
          <i class="fe-settings"></i>
        </button>
      </div>
      <div class="card-body mt-4">
        <div
          class="dropzone"
          @drop="dropHandler"
          @dragover="(event) => event.preventDefault()"
        >
          <div class="dropzone-select">
            <div class="dropzone-icon">
              <i class="fe-upload-cloud"></i>
            </div>
            <div class="dropzone-text">
              <h4>{{ $t("Select a file or drag and drop here") }}</h4>
              <p>
                {{ $t("JPG, PNG or PDF, file size no more than 10MB") }}
              </p>
            </div>
            <div class="dropzone-btn">
              <input
                id="hidden-input"
                type="file"
                ref="fileUpload"
                @change="setFiles"
                name="files[]"
                multiple
                class="hidden"
              />
              <button
                @click="$refs.fileUpload.click()"
                id="button"
                type="button"
                class="primary-btn"
              >
                <i class="fe-upload me-2"></i>
                {{ $t("SELECT FILE") }}
              </button>
            </div>
          </div>
        </div>
        <div class="image-previews mt-3">
          <div
            v-for="file in ticketFilesState.files"
            :key="file.name"
            class="image-preview"
          >
            <img
              v-if="file.type === 'image/jpeg'"
              :src="file.preview"
              width="150"
              height="100"
              alt="Preview"
            />
          </div>
        </div>
      </div>
    </div> -->
    <div class="card mt-4">
      <TemplateEditor
        v-if="state.id"
        :isGetCards="isGetCards"
        @getCards="getCards"
        :cardsFromAPI="state?.cards ?? []"
        :workshopTemplateId="state.id"
      />
    </div>
  </div>
</template>
