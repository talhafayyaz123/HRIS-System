<script setup lang="ts">
import { reactive, onMounted } from "vue";
import {
  docListRequest,
  docSelectedListRequest,
  saveDocRequest,
} from "@/utils/apiRequests";
import commonCode from "~/composables/common";
import { useLayoutStore } from "~/store/layout";

import {
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

const { router, Toast } = commonCode();
const { t } = useI18n();

const state = reactive({
    isLoading: false,
    docListOptions: [],
    invoiceTemplateId: "",
    invoiceCorrectionTemplateId: "",
    invoiceStornoTemplateId: "",
    perfRecordTemplateId: "",
    warningLevelOne: "",
    warningLevelTwo: "",
    warningLevelThree: "",
    contactReportTemplateId: "",
    offerTemplateId: "",
    orderConfirmationTemplateId: "",
    projectProtocolTemplateId: "",
  }),
  breadCrumbsConfig = [
    {
      text: "Global Settings",
      to: "/",
    },
    {
      text: "Global Settings",
      to: "/",
    },
    {
      text: "Document Assignment",
      to: "/settings/global-settings/document-assignment",
    },
  ],
  optionalItems = {
    searchBar: false,
    isBtnShow: false,
    btnText: "",
    path: "",
  },
  { title } = useTitle("Document Assignment"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig);

useHead({
  title: title,
});
function selectedDoc(doc: any) {
  switch (doc.key) {
    case "invoiceTemplateId":
      state.invoiceTemplateId = doc?.value;
      break;
    case "invoiceCorrectionTemplateId":
      state.invoiceCorrectionTemplateId = doc?.value;
      break;
    case "invoiceStornoTemplateId":
      state.invoiceStornoTemplateId = doc?.value;
      break;
    case "perfRecordTemplateId":
      state.perfRecordTemplateId = doc?.value;
      break;
    case "warningLevelOne":
      state.warningLevelOne = doc?.value;
      break;
    case "warningLevelTwo":
      state.warningLevelTwo = doc?.value;
      break;
    case "warningLevelThree":
      state.warningLevelThree = doc?.value;
      break;
    case "contactReportTemplateId":
      state.contactReportTemplateId = doc?.value;
      break;
    case "offerTemplateId":
      state.offerTemplateId = doc?.value;
      break;
    case "orderConfirmationTemplateId":
      state.orderConfirmationTemplateId = doc?.value;
      break;
    case "projectProtocolTemplateId":
      state.projectProtocolTemplateId = doc?.value;
      break;
  }
}

onMounted(async function () {
  try {
    const res = await docListRequest({ start: 0, count: 25 });
    state.docListOptions = res?.data?.map((list: any) => {
      return { value: list?.id, text: list?.name };
    });
    const selectedDocRes = await docSelectedListRequest();
    selectedDocRes.data.map((doc: any) => selectedDoc(doc));
  } catch (e) {
    console.log(e);
  }
});

async function docAssignmentHandler() {
  try {
    const formData = [
      state.invoiceTemplateId && {
        key: "invoiceTemplateId",
        value: state.invoiceTemplateId,
      },
      state.invoiceCorrectionTemplateId && {
        key: "invoiceCorrectionTemplateId",
        value: state.invoiceCorrectionTemplateId,
      },
      state.invoiceStornoTemplateId && {
        key: "invoiceStornoTemplateId",
        value: state.invoiceStornoTemplateId,
      },
      state.perfRecordTemplateId && {
        key: "perfRecordTemplateId",
        value: state.perfRecordTemplateId,
      },
      state.warningLevelOne && {
        key: "warningLevelOne",
        value: state.warningLevelOne,
      },
      state.warningLevelTwo && {
        key: "warningLevelTwo",
        value: state.warningLevelTwo,
      },
      state.warningLevelThree && {
        key: "warningLevelThree",
        value: state.warningLevelThree,
      },
      state.contactReportTemplateId && {
        key: "contactReportTemplateId",
        value: state.contactReportTemplateId,
      },
      state.offerTemplateId && {
        key: "offerTemplateId",
        value: state.offerTemplateId,
      },
      state.orderConfirmationTemplateId && {
        key: "orderConfirmationTemplateId",
        value: state.orderConfirmationTemplateId,
      },
      state.projectProtocolTemplateId && {
        key: "projectProtocolTemplateId",
        value: state.projectProtocolTemplateId,
      },
    ].filter(Boolean);
    // as all values are optional
    if (formData.length === 0) return;
    state.isLoading = true;
    const layout = useLayoutStore();
    layout.changeLoaderValue(true);
    const res = await saveDocRequest(formData);
    Toast.fire({
      title: "Success",
      text: "Document assignment saved successfully",
      icon: "success",
    });
    layout.changeLoaderValue(false);
    state.isLoading = false;
  } catch (e) {
    const layout = useLayoutStore();
    layout.changeLoaderValue(false);
    console.log(e);
    Toast.fire({ title: t("Error!"), text: t("Error"), icon: "error" });
    state.isLoading = false;
  }
}
</script>

<template>
  <div>
    <page-header
      :title="title"
      :items="items"
      :optionalItems="optionalItems"
      @watchEvent="handleSearch"
    />
    <form @submit.prevent="docAssignmentHandler">
      <div class="card my-4">
        <div class="card-header d-flex align-items-center">
          <h3 class="card-title me-2">{{ $t("Finance") }}</h3>
          <elements-tooltip />
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-lg-4">
              <div class="form-group">
                <elements-multiselect
                  v-model="state.invoiceTemplateId"
                  :options="state.docListOptions"
                  :key="state.invoiceTemplateId"
                  label="text"
                  track-by="value"
                  :textLabel="$t('Invoice Template')"
                />
              </div>
            </div>
            <div class="col-lg-4">
              <div class="form-group">
                <elements-multiselect
                  v-model="state.invoiceCorrectionTemplateId"
                  :options="state.docListOptions"
                  :key="state.invoiceCorrectionTemplateId"
                  label="text"
                  track-by="value"
                  :textLabel="$t('Invoice Correction Template')"
                />
              </div>
            </div>
            <div class="col-lg-4">
              <div class="form-group">
                <elements-multiselect
                  v-model="state.invoiceStornoTemplateId"
                  :options="state.docListOptions"
                  :key="state.invoiceStornoTemplateId"
                  label="text"
                  track-by="value"
                  :textLabel="$t('Invoice Storno Template')"
                />
              </div>
            </div>
            <div class="col-lg-4">
              <div class="form-group">
                <elements-multiselect
                  v-model="state.perfRecordTemplateId"
                  :options="state.docListOptions"
                  :key="state.perfRecordTemplateId"
                  label="text"
                  track-by="value"
                  :textLabel="$t('Performance Record Template')"
                />
              </div>
            </div>
            <div class="col-lg-4">
              <div class="form-group">
                <elements-multiselect
                  v-model="state.warningLevelOne"
                  :options="state.docListOptions"
                  :key="state.warningLevelOne"
                  label="text"
                  track-by="value"
                  :textLabel="$t('Warning Level 1')"
                />
              </div>
            </div>
            <div class="col-lg-4">
              <div class="form-group">
                <elements-multiselect
                  v-model="state.warningLevelTwo"
                  :options="state.docListOptions"
                  :key="state.warningLevelTwo"
                  label="text"
                  track-by="value"
                  :textLabel="$t('Warning Level Two')"
                />
              </div>
            </div>
            <div class="col-lg-4">
              <div class="form-group">
                <elements-multiselect
                  v-model="state.warningLevelThree"
                  :options="state.docListOptions"
                  :key="state.warningLevelThree"
                  label="text"
                  track-by="value"
                  :textLabel="$t('Warning Level Three')"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card my-4">
        <div class="card-header d-flex align-items-center">
          <h3 class="card-title me-2">{{ $t("Sales") }}</h3>
          <elements-tooltip />
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-lg-4">
              <div class="form-group">
                <elements-multiselect
                  v-model="state.contactReportTemplateId"
                  :options="state.docListOptions"
                  :key="state.contactReportTemplateId"
                  label="text"
                  track-by="value"
                  :textLabel="$t('Contact Report Template')"
                />
              </div>
            </div>
            <div class="col-lg-4">
              <div class="form-group">
                <elements-multiselect
                  v-model="state.offerTemplateId"
                  :options="state.docListOptions"
                  :key="state.offerTemplateId"
                  label="text"
                  track-by="value"
                  :textLabel="$t('Offer Template')"
                />
              </div>
            </div>
            <div class="col-lg-4">
              <div class="form-group">
                <elements-multiselect
                  v-model="state.orderConfirmationTemplateId"
                  :options="state.docListOptions"
                  :key="state.orderConfirmationTemplateId"
                  label="text"
                  track-by="value"
                  :textLabel="$t('Order Confirmation Template')"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card my-4">
        <div class="card-header d-flex align-items-center">
          <h3 class="card-title me-2">{{ $t("Project Management") }}</h3>
          <elements-tooltip />
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-lg-4">
              <div class="form-group">
                <elements-multiselect
                  v-model="state.projectProtocolTemplateId"
                  :options="state.docListOptions"
                  :key="state.projectProtocolTemplateId"
                  label="text"
                  track-by="value"
                  :textLabel="$t('Project Protocol Template')"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card my-4">
        <div class="card-header d-flex align-items-center">
          <h3 class="card-title me-2">{{ $t("Time Tracker") }}</h3>
          <elements-tooltip />
        </div>
        <div class="card-body">
          <div class="row"></div>
        </div>
      </div>

      <div class="d-flex align-items-center justify-content-end mt-4">
        <submittal-button
          :isLoading="state.isLoading"
          :iconName="'saveIcon'"
          :buttonName="$t('Save and Proceed')"
        />
      </div>
    </form>
  </div>
</template>
