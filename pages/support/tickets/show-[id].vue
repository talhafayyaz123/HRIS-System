<script setup lang="ts">
import { ref, reactive } from "vue";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { MdEditor } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import genericFeatures from "~/composables/generic";
import { routes } from "~/utils/apiRoutes";
import { useLayoutStore } from "~/store/layout";
import genericFunctionality from "~/composables/genericFunctionality";
import editTicket from "../../../components/Ticket/EditTicket.vue";
import EditTicket from "~/components/Ticket/EditTicket.vue";
import moment from "moment/moment";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";


const { router, Toast } = commonCode(),
  { showGenericListing } = genericFeatures(),
  { submitted, isLoading, apiRoute, showFunc } = genericFunctionality(),
  { t } = useI18n(),
  companies = ref([]),
  data = ref([]),
  isModalOpen = ref(false),
  ticketId = router.params.id,
  userId = localStorage.getItem("user_id") || null,
  ticketDetails = reactive({
    title: "",
    number: "",
    date: "",
    contactType: "",
    comments: [],
  }),
  state = reactive({
    showAssignee: true,
    title: "",
    status: "new",
    priority: "",
    companyId: "",
    contactType: "",
    assignee: "",
    text: "",
    time: "",
    visibility: "",
    userType: "employee",
    type: "",
  }),
  breadCrumbsConfig = [
    {
      text: "Admin portal",
      to: "/",
    },
    {
      text: "Tickets",
      to: "/support/tickets",
    },
    {
      text: "Show",
      active: true,
    },
  ],
  validationRules = {
    title: { required },
    companyId: { required },
    text: { required },
    status: { required },
    priority: { required },
    type: { required },
    contactType: { required },
  },
  v$ = useVuelidate(validationRules, state);

function formatTime(timestamp: moment.MomentInput) {
  const momentDate = moment(timestamp, "DD/MM/YY");

  if (!momentDate.isValid()) {
    return "Invalid Timestamp"; // Provide a default value or error message
  }

  return momentDate.format("hh:mm A - DD-MM-YYYY");
}
async function refresh() {
  const layout = useLayoutStore();
  layout.changeLoaderValue(true);
  let response = await showFunc(ticketId);
  if (response?.success) {
    data.value = response?.data;
    ticketDetails.title = response?.data?.title;
    ticketDetails.number = response?.data?.ticketNumber;
    ticketDetails.date = response?.data?.createdAt;
    ticketDetails.contactType = response?.data?.contactType;
    ticketDetails.comments = response?.data?.ticketComment;
    state.time = response?.data?.totalAccountedTime ?? "1.00";
    state.visibility = response?.data?.visibility;
    state.userType = response?.data?.userType;
  }

  let companyListing = await showGenericListing(routes.COMPANY);
  if (!!companyListing?.data?.customers) {
    companies.value = companyListing.data.customers.map((ts: any) => {
      return { value: ts.id, name: ts.name };
    });
  }
  layout.changeLoaderValue(false);
}
apiRoute.value = routes.TICKETS;

refresh();
function hideModal() {
  isModalOpen.value = false;
}

function openModal() {
  isModalOpen.value = true;
}

const { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { title } = useTitle("Ticket Edit");

useHead({
    title: title,
    });
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <div
      class="p-0 mb-4 card-header d-flex align-items-center justify-content-between"
    >
      <div class="">
        <h3 class="card-title">{{ ticketDetails?.title }}</h3>
        <p>
          {{ $t('Ticket') }}# {{ ticketDetails?.number ?? "-" }} - {{ $t('Created at') }}
          {{ formatTime(ticketDetails?.date) ?? "-" }}
        </p>
      </div>
      <button class="secondary-btn" @click="openModal()">
        <i class="fe-settings"></i>
      </button>
    </div>
    <ticket-edit-ticket
      v-if="isModalOpen"
      :showModal="isModalOpen"
      :hideModal="hideModal"
      :companies="companies"
      :data="data"
      :ticketId="ticketId"
      :isDisabled="true"
    />
    <div class="row">
      <div class="col-lg-8 mx-auto">
        <div class="card no-header">
          <div class="card-body">
            <div class="row">
              <div class="col-12 mt-4">
                <div
                  class="ticket"
                  :class="
                    userId === comment.userId ? 'ticket-right' : 'ticket-left'
                  "
                  v-for="comment in ticketDetails.comments"
                >
                  <div class="ticket-user">
                    <div class="user-name">User not found ~</div>
                    <div class="user-img">un</div>
                  </div>
                  <div class="ticket-content">
                    <p>{{ comment?.text }}</p>
                  </div>
                  <div class="dropzone-area">
                    <div class="row" v-if="comment?.attachments?.length > 0">
                      <div
                        class="col-lg-4 my-2"
                        v-for="file in comment.attachments"
                      >
                        <div class="card mb-1 shadow-none border">
                          <div class="p-2">
                            <div class="row align-items-center">
                              <div class="col-auto">
                                <div class="avatar-sm">
                                  <span
                                    class="avatar-title bg-soft-primary text-primary rounded"
                                  >
                                    <ElementsIcon v-bind:icon="`imgPrevIcon`" />
                                  </span>
                                </div>
                              </div>
                              <div class="col pl-0">
                                <a
                                  :href="file?.file"
                                  :download="file?.viewableName"
                                  class="text-muted font-weight-semibold"
                                  >{{ file?.viewableName }}</a
                                >
                              </div>
                              <div class="col-auto">
                                <a
                                  :href="file?.file"
                                  :download="file?.viewableName"
                                  class="btn btn-link btn-lg text-muted"
                                >
                                  <ElementsIcon v-bind:icon="`saveIcon`" />
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="ticket-meta">
                    <p>{{ formatTime(comment?.createdAt) }}</p>
                    <p>{{ $t('Accounted Time') }}: {{ comment?.time }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="card">
          <div class="card-header text-center">
            <p>
              {{ $t('Accounted Time') }}: {{ state.time ?? 0 }} hr(s) - {{ $t('Contact Type') }}:
              {{ ticketDetails?.contactType ?? "-" }}
            </p>
          </div>
          <div class="card-body">
            <div class="row mt-4">
              <div class="col-lg-12 col-12">
                <div class="form-group">
                  <elements-select
                    :key="state.visibility"
                    v-model="state.visibility"
                    :disabled="true"
                    :label="$t('Visibility')"
                  >
                    <option value="internal">
                      {{ $t("Internal Only") }}
                    </option>
                    <option value="public">{{ $t("Public") }}</option>
                  </elements-select>
                </div>
              </div>
              <div class="col-lg-12 col-12">
                <div class="form-group">
                  <div class="form-group">
                    <elements-input
                      v-model="state.time"
                      :label="$t('Account Time')"
                      :disabled="true"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
