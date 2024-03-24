<script setup lang="ts">
import moment from "moment";
import { reactive, ref } from "vue";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { MdEditor } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import genericFeatures from "~/composables/generic";
import { routes } from "~/utils/apiRoutes";
import { useLayoutStore } from "~/store/layout";
import genericFunctionality from "~/composables/genericFunctionality";
import { useAuthStore } from "~/store/auth";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";


const { router, Toast } = commonCode(),
  { showGenericListing } = genericFeatures(),
  { submitted, isLoading, apiRoute, storeFunc, showFunc } =
    genericFunctionality(),
  { t } = useI18n(),
  auth = useAuthStore(),
  companies = ref([]),
  data = ref([]),
  isModalOpen = ref(false),
  showDrop = ref(false),
  ticketId = router.params.id,
  ticketFilesState = reactive({
    files: [],
  }),
  userId = localStorage.getItem("user_id") || null,
  ticketDetails = reactive({
    title: "",
    number: "",
    date: "",
    contactType: "",
    comments: [],
  }),
  state = reactive({
    text: "",
    time: "",
    visibility: "",
    userType: "employee",
    ticketId: router.params.id,
    userId: userId,
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
      text: "Edit",
      active: true,
    },
  ],
  validationRules = {
    text: { required },
  },
  v$ = useVuelidate(validationRules, state);
function formatTime(timestamp: moment.MomentInput) {
  const momentDate = moment(timestamp, "DD/MM/YY");

  if (!momentDate.isValid()) {
    return "Invalid Timestamp"; // Provide a default value or error message
  }

  return momentDate.format("hh:mm A - DD-MM-YYYY");
}
function store() {
  submitted.value = true;
  //stop here if form is invalid
  v$.value.$touch();
  if (v$.value.$invalid) {
    submitted.value = false;
    return false;
  } else {
    const formData = new FormData();
    console.log(state.text);
    formData.append("text", state.text);
    formData.append("time", state.time);
    formData.append("visibility", state.visibility);
    formData.append("userType", state.userType);
    formData.append("ticketId", state.ticketId);
    formData.append("userId", state.userId);

    ticketFilesState.files.forEach((file) => {
      formData.append("attachments[]", file ?? null);
    });

    console.log(formData.get("text"));
    apiRoute.value = routes.TICKET_COMMENT;
    storeFunc(formData);
    refresh();
  }
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

  if (!companies.value.length) {
    let companyListing = await showGenericListing(routes.COMPANY);
    if (!!companyListing?.data?.customers) {
      companies.value = companyListing.data.customers.map((ts: any) => {
        return { value: ts.id, name: ts.name };
      });
    }
  }
  layout.changeLoaderValue(false);
}
apiRoute.value = routes.TICKETS;

function setFiles(event: { target: { files: any } }) {
  const file = event.target.files;
  if (file.length === 0) {
    return false;
  }
  for (let i = 0; i < file.length; i++) {
    //check if array already has the file so no duplication occurs
    if (
      ticketFilesState.files.filter((e) => e.name === file[i].name).length > 0
    ) {
      continue;
    }
    let getFile = file[i];

    getFile.preview = URL.createObjectURL(getFile);
    ticketFilesState.files.push(getFile);

    if (ticketFilesState.files.length > 0) {
      // to handle error state
      console.log("no file exist");
      //productFilesError.value = false;
    }
  }
}
function dropHandler(event: {
  preventDefault: () => void;
  dataTransfer: { items: string | any[] };
}) {
  event.preventDefault();
  if (event.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)
    for (var i = 0; i < event.dataTransfer.items.length; i++) {
      const item = event.dataTransfer.items[i];
      // If dropped items aren't files, reject them
      if (item.kind === "file") {
        const file = item.getAsFile();
        //check if array already has the file so no duplication occurs
        if (
          ticketFilesState.files.filter((e) => e.name === file.name).length > 0
        ) {
          continue;
        }
        let getFile = file[i];
        getFile.preview = URL.createObjectURL(getFile);
        ticketFilesState.files.push(file);
      }
    }
  }
}
function hideModal() {
  isModalOpen.value = false;
}

function openModal() {
  isModalOpen.value = true;
}
function showDropzone() {
  showDrop.value = true;
}
refresh();

const { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { title } = useTitle("Ticket Edit");

useHead({
    title: title,
    });
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <form>
      <div class="card mb-4">
        <div
          class="p-3 card-header d-flex align-items-center justify-content-between"
        >
          <div class="">
            <h3 class="card-title">{{ ticketDetails?.title }}</h3>
            <p>
              {{ $t('Ticket') }}# {{ ticketDetails?.number ?? "-" }} - {{ $t('Created at') }}
              {{ formatTime(ticketDetails?.date) ?? "-" }}
            </p>
          </div>
          <button type="button" class="secondary-btn" @click="openModal()">
            <i class="fe-settings"></i>
          </button>
        </div>
      </div>

      <ticket-edit-ticket
        v-if="isModalOpen"
        :showModal="isModalOpen"
        :hideModal="hideModal"
        :companies="companies"
        :data="data"
        :ticketId="ticketId"
        @updateTicket="
          hideModal();
          refresh();
        "
      />
      <div class="row">
        <div class="col-lg-8">
          <div class="card no-header">
            <div class="p-3 pt-0">
              <div class="row">
                <div class="col-12">
                  <div class="form-group">
                    <MdEditor
                      :preview="false"
                      :style="'height:300px;'"
                      :language="'en-US'"
                      v-model="state.text"
                      placeholder="Comment here"
                      :class="{ 'is-invalid': v$.text.$error }"
                    />
                    <div v-if="v$.text.$error" class="invalid-feedback">
                      <span class="text-danger" v-if="v$.text.required">{{
                        $t("This value is required")
                      }}</span
                      ><br />
                    </div>
                  </div>
                </div>
                <div class="col-12 d-flex align-items-center mt-2">
                  <submittal-button
                    bType="button"
                    :isLoading="submitted"
                    @click="store"
                    :buttonName="$t('Add Comment')"
                  />
                  <button
                    type="button"
                    class="primary-btn ms-2"
                    @click="showDropzone()"
                  >
                    <i class="fe-upload me-2"></i>
                    {{ $t("SELECT FILE") }}
                  </button>
                </div>
                <div class="col-12 mt-3" v-if="showDrop">
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
                          {{
                            $t("JPG, PNG or PDF, file size no more than 10MB")
                          }}
                        </p>
                      </div>
                      <div class="dropzone-btn">
                        <input
                          id="hidden-input"
                          type="file"
                          ref="file"
                          @change="setFiles"
                          name="files[]"
                          multiple
                          class="hidden"
                        />
                        <button
                          @click="$refs.file.click()"
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
                </div>
                <!-- Add a container for image previews -->
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
                <!-- <div class="col-12 mt-3">
                  <div class="dropzone-area">
                    <div class="row">
                      <div class="col-lg-6 my-2">
                        <div class="card mb-1 shadow-none border">
                          <div class="p-2">
                            <div class="row align-items-center">
                              <div class="col-auto">
                                <div class="avatar-sm">
                                  <span class="avatar-title bg-soft-primary text-primary rounded">
                                    <ElementsIcon v-bind:icon="`imgPrevIcon`" />
                                  </span>
                                </div>
                              </div>
                              <div class="col pl-0">
                                <a href="javascript:void(0);" class="text-muted font-weight-semibold">fileName</a>
                              </div>
                              <div class="col-auto">
                                <a href="javascript:void(0);" class="btn btn-link btn-lg text-muted">
                                  <i class="fe-trash"></i>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> -->
                <div class="col-12 mt-4">
                  <div
                    class="ticket"
                    :class="
                      userId === comment.userId ? 'ticket-right' : 'ticket-left'
                    "
                    v-for="comment in ticketDetails.comments"
                  >
                    <div class="ticket-user">
                      <div class="user-name">{{ $t('User not found') }} ~</div>
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
                                      <ElementsIcon
                                        v-bind:icon="`imgPrevIcon`"
                                      />
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
            <div class="p-3">
              <div class="row mt-4">
                <div class="col-lg-12 col-12">
                  <div class="form-group">
                    <elements-select
                      :key="state.visibility"
                      v-model="state.visibility"
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
                        :disabled="submitted"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
