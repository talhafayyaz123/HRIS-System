<script setup lang="ts">
import { reactive, onMounted, ref } from "vue";
import {
  mailServiceRequest,
  saveMailTemplateAssignmentRequest,
  getMailTemplateAssignmentRequest,
} from "@/utils/apiRequests";
import { routes } from "~/utils/apiRoutes";
import commonCode from "~/composables/common";
import { useLayoutStore } from "~/store/layout";

import {
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

const { router, Toast } = commonCode();
const { t } = useI18n();

const state = reactive({
    invoiceTemplate: {
      moduleName: "invoiceTemplate",
      mailTemplateId: "",
      cc: "",
      bcc: "",
      senderMail: "",
    },
    invoiceCorrectionTemplate: {
      moduleName: "invoiceCorrectionTemplate",
      mailTemplateId: "",
      cc: "",
      bcc: "",
      senderMail: "",
    },
    invoiceStornoTemplate: {
      moduleName: "invoiceStornoTemplate",
      mailTemplateId: "",
      cc: "",
      bcc: "",
      senderMail: "",
    },
    perfRecordTemplate: {
      moduleName: "perfRecordTemplate",
      mailTemplateId: "",
      cc: "",
      bcc: "",
      senderMail: "",
    },

    warningLevel1: {
      moduleName: "warning level 1",
      mailTemplateId: "",
      cc: "",
      bcc: "",
      senderMail: "",
    },
    warningLevel2: {
      moduleName: "warning level 2",
      mailTemplateId: "",
      cc: "",
      bcc: "",
      senderMail: "",
    },
    warningLevel3: {
      moduleName: "warning level 3",
      mailTemplateId: "",
      cc: "",
      bcc: "",
      senderMail: "",
    },
    contactReportTemplate: {
      moduleName: "contactReportTemplate",
      mailTemplateId: "",
      cc: "",
      bcc: "",
      senderMail: "",
    },
    offerTemplate: {
      moduleName: "offerTemplate",
      mailTemplateId: "",
      cc: "",
      bcc: "",
      senderMail: "",
    },
    orderConfirmationTemplate: {
      moduleName: "orderConfirmationTemplate",
      mailTemplateId: "",
      cc: "",
      bcc: "",
      senderMail: "",
    },
    projectProtocolTemplate: {
      moduleName: "projectProtocolTemplate",
      mailTemplateId: "",
      cc: "",
      bcc: "",
      senderMail: "",
    },
  }),
  mailTemplateOptions = ref([]),
  isLoading = ref(false),
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
      text: "Mail Template Assignment",
      to: "/settings/global-settings/mail-template-assignment",
    },
  ],
  optionalItems = {
    searchBar: false,
    isBtnShow: false,
    btnText: "",
    path: "",
  },
  { title } = useTitle("Mail Template Assignment"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig);

useHead({
  title: title,
});

// TODO
onMounted(async function () {
  try {
    const resOptions = await mailServiceRequest(routes.LIST_MAIL_TEMPLATE, {
      limit_start: 1,
      limit_count: 50,
      type: 0,
    });
    const resAll = await getMailTemplateAssignmentRequest();
    resAll.data.map((mt: any) => {
      if (mt.moduleName === "invoiceTemplate") {
        state.invoiceTemplate = { ...mt };
      } else if (mt.moduleName === "invoiceCorrectionTemplate") {
        state.invoiceCorrectionTemplate = { ...mt };
      } else if (mt.moduleName === "invoiceStornoTemplate") {
        state.invoiceStornoTemplate = { ...mt };
      } else if (mt.moduleName === "perfRecordTemplate") {
        state.perfRecordTemplate = { ...mt };
      } else if (mt.moduleName === "warning level 1") {
        state.warningLevel1 = { ...mt };
      } else if (mt.moduleName === "warning level 2") {
        state.warningLevel2 = { ...mt };
      } else if (mt.moduleName === "warning level 3") {
        state.warningLevel3 = { ...mt };
      } else if (mt.moduleName === "contactReportTemplate") {
        state.contactReportTemplate = { ...mt };
      } else if (mt.moduleName === "offerTemplate") {
        state.offerTemplate = { ...mt };
      } else if (mt.moduleName === "orderConfirmationTemplate") {
        state.orderConfirmationTemplate = { ...mt };
      } else if (mt.moduleName === "projectProtocolTemplate") {
        state.projectProtocolTemplate = { ...mt };
      }
    });
    mailTemplateOptions.value = resOptions?.map((list: any) => {
      return { value: list?.id, text: list?.subject };
    });
  } catch (e) {
    console.log(e);
  }
});

async function mailTemplateAssignmentHandler() {
  try {
    isLoading.value = true;
    const layout = useLayoutStore();
    layout.changeLoaderValue(true);
    const res = await saveMailTemplateAssignmentRequest({
      modules: Object.values(state),
    });
    layout.changeLoaderValue(false);
    Toast.fire({
      title: "Success",
      text: "Mail Template Assignment saved successfully",
      icon: "success",
    });
    isLoading.value = false;
  } catch (e) {
    const layout = useLayoutStore();
    layout.changeLoaderValue(false);
    Toast.fire({ title: t("Error!"), text: t("Error"), icon: "error" });
    isLoading.value = false;
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
    <div class="card my-4">
      <div class="card-header d-flex align-items-center">
        <h3 class="card-title me-2">{{ $t("Finance") }}</h3>
        <elements-tooltip />
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-lg-3">
            <div class="form-group">
              <elements-multiselect
                v-model="state.invoiceTemplate.mailTemplateId"
                :options="mailTemplateOptions"
                :key="state.invoiceTemplate.mailTemplateId"
                label="text"
                track-by="value"
                :textLabel="$t('Invoice Template')"
              />
            </div>
          </div>
          <div class="col-lg-3">
            <div class="form-group">
              <elements-input
                v-model="state.invoiceTemplate.cc"
                :label="$t('CC')"
                id="name"
              />
            </div>
          </div>
          <div class="col-lg-3">
            <div class="form-group">
              <elements-input
                v-model="state.invoiceTemplate.bcc"
                :label="$t('BCC')"
                id="name"
              />
            </div>
          </div>
          <div class="col-lg-3">
            <div class="form-group">
              <elements-input
                v-model="state.invoiceTemplate.senderMail"
                :label="$t('Sender Mail')"
                id="name"
              />
            </div>
          </div>

          <div class="col-lg-3">
            <div class="form-group">
              <elements-multiselect
                v-model="state.invoiceCorrectionTemplate.mailTemplateId"
                :options="mailTemplateOptions"
                :key="state.invoiceCorrectionTemplate.mailTemplateId"
                label="text"
                track-by="value"
                :textLabel="$t('Invoice Correction Template')"
              />
            </div>
          </div>
          <div class="col-lg-3">
            <div class="form-group">
              <elements-input
                v-model="state.invoiceCorrectionTemplate.cc"
                :label="$t('CC')"
                id="name"
              />
            </div>
          </div>
          <div class="col-lg-3">
            <div class="form-group">
              <elements-input
                v-model="state.invoiceCorrectionTemplate.bcc"
                :label="$t('BCC')"
                id="name"
              />
            </div>
          </div>
          <div class="col-lg-3">
            <div class="form-group">
              <elements-input
                v-model="state.invoiceCorrectionTemplate.senderMail"
                :label="$t('Sender Mail')"
                id="name"
              />
            </div>
          </div>

          <div class="col-lg-3">
            <div class="form-group">
              <elements-multiselect
                v-model="state.invoiceStornoTemplate.mailTemplateId"
                :options="mailTemplateOptions"
                :key="state.invoiceStornoTemplate.mailTemplateId"
                label="text"
                track-by="value"
                :textLabel="$t('Invoice Storno Template')"
              />
            </div>
          </div>
          <div class="col-lg-3">
            <div class="form-group">
              <elements-input
                v-model="state.invoiceStornoTemplate.cc"
                :label="$t('CC')"
                id="name"
              />
            </div>
          </div>
          <div class="col-lg-3">
            <div class="form-group">
              <elements-input
                v-model="state.invoiceStornoTemplate.bcc"
                :label="$t('BCC')"
                id="name"
              />
            </div>
          </div>
          <div class="col-lg-3">
            <div class="form-group">
              <elements-input
                v-model="state.invoiceStornoTemplate.senderMail"
                :label="$t('Sender Mail')"
                id="name"
              />
            </div>
          </div>

          <div class="col-lg-3">
            <div class="form-group">
              <elements-multiselect
                v-model="state.perfRecordTemplate.mailTemplateId"
                :options="mailTemplateOptions"
                :key="state.perfRecordTemplate.mailTemplateId"
                label="text"
                track-by="value"
                :textLabel="$t('Performance Record Template')"
              />
            </div>
          </div>
          <div class="col-lg-3">
            <div class="form-group">
              <elements-input
                v-model="state.perfRecordTemplate.cc"
                :label="$t('CC')"
                id="name"
              />
            </div>
          </div>
          <div class="col-lg-3">
            <div class="form-group">
              <elements-input
                v-model="state.perfRecordTemplate.bcc"
                :label="$t('BCC')"
                id="name"
              />
            </div>
          </div>
          <div class="col-lg-3">
            <div class="form-group">
              <elements-input
                v-model="state.perfRecordTemplate.senderMail"
                :label="$t('Sender Mail')"
                id="name"
              />
            </div>
          </div>

          <div class="col-lg-3">
            <div class="form-group">
              <elements-multiselect
                v-model="state.warningLevel1.mailTemplateId"
                :options="mailTemplateOptions"
                :key="state.warningLevel1.mailTemplateId"
                label="text"
                track-by="value"
                :textLabel="$t('Warning Level 1')"
              />
            </div>
          </div>
          <div class="col-lg-3">
            <div class="form-group">
              <elements-input
                v-model="state.warningLevel1.cc"
                :label="$t('CC')"
                id="name"
              />
            </div>
          </div>
          <div class="col-lg-3">
            <div class="form-group">
              <elements-input
                v-model="state.warningLevel1.bcc"
                :label="$t('BCC')"
                id="name"
              />
            </div>
          </div>
          <div class="col-lg-3">
            <div class="form-group">
              <elements-input
                v-model="state.warningLevel1.senderMail"
                :label="$t('Sender Mail')"
                id="name"
              />
            </div>
          </div>

          <div class="col-lg-3">
            <div class="form-group">
              <elements-multiselect
                v-model="state.warningLevel2.mailTemplateId"
                :options="mailTemplateOptions"
                :key="state.warningLevel2.mailTemplateId"
                label="text"
                track-by="value"
                :textLabel="$t('Warning Level 2')"
              />
            </div>
          </div>
          <div class="col-lg-3">
            <div class="form-group">
              <elements-input
                v-model="state.warningLevel2.cc"
                :label="$t('CC')"
                id="name"
              />
            </div>
          </div>
          <div class="col-lg-3">
            <div class="form-group">
              <elements-input
                v-model="state.warningLevel2.bcc"
                :label="$t('BCC')"
                id="name"
              />
            </div>
          </div>
          <div class="col-lg-3">
            <div class="form-group">
              <elements-input
                v-model="state.warningLevel2.senderMail"
                :label="$t('Sender Mail')"
                id="name"
              />
            </div>
          </div>

          <div class="col-lg-3">
            <div class="form-group">
              <elements-multiselect
                v-model="state.warningLevel3.mailTemplateId"
                :options="mailTemplateOptions"
                :key="state.warningLevel3.mailTemplateId"
                label="text"
                track-by="value"
                :textLabel="$t('Warning Level 3')"
              />
            </div>
          </div>
          <div class="col-lg-3">
            <div class="form-group">
              <elements-input
                v-model="state.warningLevel3.cc"
                :label="$t('CC')"
                id="name"
              />
            </div>
          </div>
          <div class="col-lg-3">
            <div class="form-group">
              <elements-input
                v-model="state.warningLevel3.bcc"
                :label="$t('BCC')"
                id="name"
              />
            </div>
          </div>
          <div class="col-lg-3">
            <div class="form-group">
              <elements-input
                v-model="state.warningLevel3.senderMail"
                :label="$t('Sender Mail')"
                id="name"
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
          <div class="col-lg-3">
            <div class="form-group">
              <elements-multiselect
                v-model="state.contactReportTemplate.mailTemplateId"
                :options="mailTemplateOptions"
                :key="state.contactReportTemplate.mailTemplateId"
                label="text"
                track-by="value"
                :textLabel="$t('Contact Report Template')"
              />
            </div>
          </div>
          <div class="col-lg-3">
            <div class="form-group">
              <elements-input
                v-model="state.contactReportTemplate.cc"
                :label="$t('CC')"
                id="name"
              />
            </div>
          </div>
          <div class="col-lg-3">
            <div class="form-group">
              <elements-input
                v-model="state.contactReportTemplate.bcc"
                :label="$t('BCC')"
                id="name"
              />
            </div>
          </div>
          <div class="col-lg-3">
            <div class="form-group">
              <elements-input
                v-model="state.contactReportTemplate.senderMail"
                :label="$t('Sender Mail')"
                id="name"
              />
            </div>
          </div>

          <div class="col-lg-3">
            <div class="form-group">
              <elements-multiselect
                v-model="state.offerTemplate.mailTemplateId"
                :options="mailTemplateOptions"
                :key="state.offerTemplate.mailTemplateId"
                label="text"
                track-by="value"
                :textLabel="$t('Offer Template')"
              />
            </div>
          </div>
          <div class="col-lg-3">
            <div class="form-group">
              <elements-input
                v-model="state.offerTemplate.cc"
                :label="$t('CC')"
                id="name"
              />
            </div>
          </div>
          <div class="col-lg-3">
            <div class="form-group">
              <elements-input
                v-model="state.offerTemplate.bcc"
                :label="$t('BCC')"
                id="name"
              />
            </div>
          </div>
          <div class="col-lg-3">
            <div class="form-group">
              <elements-input
                v-model="state.offerTemplate.senderMail"
                :label="$t('Sender Mail')"
                id="name"
              />
            </div>
          </div>

          <div class="col-lg-3">
            <div class="form-group">
              <elements-multiselect
                v-model="state.orderConfirmationTemplate.mailTemplateId"
                :options="mailTemplateOptions"
                :key="state.orderConfirmationTemplate.mailTemplateId"
                label="text"
                track-by="value"
                :textLabel="$t('Order Confirmation Template')"
              />
            </div>
          </div>
          <div class="col-lg-3">
            <div class="form-group">
              <elements-input
                v-model="state.orderConfirmationTemplate.cc"
                :label="$t('CC')"
                id="name"
              />
            </div>
          </div>
          <div class="col-lg-3">
            <div class="form-group">
              <elements-input
                v-model="state.orderConfirmationTemplate.bcc"
                :label="$t('BCC')"
                id="name"
              />
            </div>
          </div>
          <div class="col-lg-3">
            <div class="form-group">
              <elements-input
                v-model="state.orderConfirmationTemplate.senderMail"
                :label="$t('Sender Mail')"
                id="name"
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
          <div class="col-lg-3">
            <div class="form-group">
              <elements-multiselect
                v-model="state.projectProtocolTemplate.mailTemplateId"
                :options="mailTemplateOptions"
                :key="state.projectProtocolTemplate.mailTemplateId"
                label="text"
                track-by="value"
                :textLabel="$t('Project Protocol Template')"
              />
            </div>
          </div>
          <div class="col-lg-3">
            <div class="form-group">
              <elements-input
                v-model="state.projectProtocolTemplate.cc"
                :label="$t('CC')"
                id="name"
              />
            </div>
          </div>
          <div class="col-lg-3">
            <div class="form-group">
              <elements-input
                v-model="state.projectProtocolTemplate.bcc"
                :label="$t('BCC')"
                id="name"
              />
            </div>
          </div>
          <div class="col-lg-3">
            <div class="form-group">
              <elements-input
                v-model="state.projectProtocolTemplate.senderMail"
                :label="$t('Sender Mail')"
                id="name"
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
      <div class="card-body"></div>
    </div>

    <div class="d-flex align-items-center justify-content-end mt-4">
      <button class="primary-btn me-3">
        <elements-icon v-bind:icon="'cancelIcon'" class="me-2" />
        <span>{{ $t("Cancel") }}</span>
      </button>
      <submittal-button
        @click="mailTemplateAssignmentHandler"
        :isLoading="state.isLoading"
        :iconName="'saveIcon'"
        :buttonName="$t('Save and Proceed')"
      />
    </div>
  </div>
</template>
