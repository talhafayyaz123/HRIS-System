<script setup lang="ts">
import {required} from "@vuelidate/validators";
import {useVuelidate} from "@vuelidate/core";
import {reactive, ref} from "vue";
import commonCode from "~/composables/common";
import genericFunctionality from "~/composables/genericFunctionality";
import {routes} from "~/utils/apiRoutes";
const

    {router, Toast} = commonCode(),
    { submitted, isLoading, apiRoute, storeFunc } = genericFunctionality(),
    profileData = reactive({
        id: "",
        personalNumber: "",
        firstName: "",
        lastName: "",
        location: "",
        teams: [],
        departments: []
    }),
  state = reactive({
      processNumber: "",
      title: "",
      date: new Date(),
      description: "",
      suggestedSolution: "",
      affectedGroup: "",
      files: [],
      userId: "",
  }),
  ticketFilesState = reactive({
      files: [],
  }),
  validationRules = {
      title: { required },
      date: { required },
      description: { required },
      suggestedSolution: { required },
  },
    props = defineProps({
        userData : {
            type : Object,
            default: {}
        },
        teams : {
            type : Object,
            default: {}
        },
        departments : {
            type : Object,
            default: {}
        },
        affectedGroups : {
            type : Object,
            default: {}
        },
        step : {
            type : Number,
            default: 1
        },
        userId : {
            type : String,
            default: ''
        }
    }),

    v$ = useVuelidate(validationRules, state),
    store = () => {
        submitted.value = true;
        //stop here if form is invalid
        v$.value.$touch();
        if (v$.value.$invalid) {
            submitted.value = false;
            return false;
        } else {
            const formData = new FormData();
            formData.append("employeeId", props.userData?.id);
            formData.append("processNumber", state.processNumber);
            formData.append("title", state.title);
            formData.append("date", state.date);
            formData.append("description", state.description);
            formData.append("suggestedSolution", state.suggestedSolution);
            formData.append("affectedGroupId", state.affectedGroup);
            ticketFilesState.files.forEach((file) => {
                formData.append("files[]", file ?? null);
            });
            apiRoute.value = routes.CIP;
            storeFunc(formData)

        }
    }

function setFiles(event: { target: { files: any; }; }) {
    const file = event.target.files;
    if (file.length === 0) {
        return false;
    }
    for (let i = 0; i < file.length; i++) {
        //check if array already has the file so no duplication occurs
        if (ticketFilesState.files.filter((e) => e.name === file[i].name).length > 0) {
            continue;
        }
        let getFile = file[i];

        getFile.preview = URL.createObjectURL(getFile);
        ticketFilesState.files.push(getFile);

        if (ticketFilesState.files.length > 0) {
            // to handle error state
            console.log('no file exist')
            //productFilesError.value = false;
        }
    }
}
function dropHandler(event: { preventDefault: () => void; dataTransfer: { items: string | any[]; }; }) {
    event.preventDefault();
    if (event.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (var i = 0; i < event.dataTransfer.items.length; i++) {
            const item = event.dataTransfer.items[i];
            // If dropped items aren't files, reject them
            if (item.kind === "file") {
                const file = item.getAsFile();
                //check if array already has the file so no duplication occurs
                if (ticketFilesState.files.filter((e) => e.name === file.name).length > 0) {
                    continue;
                }
                let getFile = file[i];
                getFile.preview = URL.createObjectURL(getFile);
                ticketFilesState.files.push(file);
            }
        }
    }
}

watch(
    () => props.userData,
    () => {
        profileData.personalNumber = props.userData?.personalNumber
        profileData.firstName = props.userData?.name.split(" ")[0]
        profileData.lastName = props.userData?.name.split(" ")[1]
        profileData.location = props.userData?.location
        profileData.teams = props.userData?.teams
        profileData.departments = props.userData?.departments
        profileData.id = props.userData?.id
    }
);
</script>
<template>
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">{{ $t('User Information') }}</h3>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-lg-4">
                        <div class="form-group">
                            <elements-input
                                v-model="profileData.personalNumber"
                                :label="$t('Personal Number')"
                                :disabled="true"
                            />
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="form-group">
                            <elements-input
                                v-model="profileData.firstName"
                                :label="$t('First Name')"
                                :disabled="true"
                            />
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="form-group">
                            <elements-input
                                v-model="profileData.lastName"
                                :label="$t('Last Name')"
                                :disabled="true"
                            />
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="form-group">
                            <elements-input
                                v-model="profileData.location"
                                :label="$t('Location')"
                                :disabled="true"
                            />
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="form-group">
                            <elements-multiselect
                                v-model="profileData.teams"
                                :options="teams"
                                label="name"
                                track-by="value"
                                :multiple="true"
                                :disabled="true"
                                :key="profileData.teams"
                                :textLabel="$t('Teams')"
                            />
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="form-group">
                            <elements-multiselect
                                v-model="profileData.departments"
                                :options="departments"
                                label="name"
                                track-by="value"
                                :multiple="true"
                                :disabled="true"
                                :key="profileData.departments"
                                :textLabel="$t('Departments')"
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
        <form  @submit.prevent="store">
            <div class="card mt-4">
                <div class="card-header">
                    <h3 class="card-title">{{ $t('Fill CIP Details') }}</h3>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-lg-4">
                            <div class="form-group">
                                <elements-input
                                    v-model="state.processNumber"
                                    :label="$t('Personal Number')"
                                    :disabled="submitted"
                                />
                            </div>
                        </div>
                        <div class="col-lg-4">
                            <div class="form-group">
                                <elements-input
                                    v-model="state.title"
                                    :label="$t('Title')"
                                    :required="true"
                                    :disabled="submitted"
                                    :class="{ 'is-invalid': v$.title.$error }"
                                />
                            </div>
                            <div v-if="v$.title.$error" class="invalid-feedback">
                              <span class="text-danger" v-if="v$.title.required">{{$t("This value is required") }}</span><br/>
                            </div>
                        </div>
                        <div class="col-lg-4">
                            <div class="form-group">
                                <elements-input
                                    v-model="state.date"
                                    :label="$t('Date')"
                                    :required="true"
                                    :disabled="submitted"
                                    :class="{ 'is-invalid': v$.date.$error }"
                                    type="date"
                                />
                            </div>
                            <div v-if="v$.date.$error" class="invalid-feedback">
                                <span class="text-danger" v-if="v$.date.required">{{$t("This value is required") }}</span><br />
                            </div>
                        </div>
                        <div class="col-lg-12">
                            <div class="form-group textarea">
<!--                                <elements-text-area-->
<!--                                    :key="state.description"-->
<!--                                    v-model="state.description"-->
<!--                                    rows="10"-->
<!--                                    cols="30"-->
<!--                                    :required="true"-->
<!--                                    :isReadonly="submitted"-->
<!--                                    :label="$t('Description')"-->
<!--                                    />-->
                                <textarea class="form-control" v-model="state.description" placeholder="." name="" id="" cols="30" rows="10"></textarea>
                                <label for="" class="input-label">{{ $t('Description') }}</label>
                            </div>
                        </div>
                        <div class="col-lg-12">
                            <div class="form-group textarea">
<!--                                <elements-text-area-->
<!--                                    v-model="state.suggestedSolution"-->
<!--                                    :key="state.suggestedSolution"-->
<!--                                    rows="10"-->
<!--                                    cols="30"-->
<!--                                    :required="true"-->
<!--                                    :isReadonly="submitted"-->
<!--                                    :label="$t('Suggestion Solution')"-->
<!--                                />-->
                                <textarea class="form-control" v-model="state.suggestedSolution" placeholder="." name="" id="" cols="30" rows="10"></textarea>
                                <label for="" class="input-label">{{ $t('Suggestion Solution') }}</label>
                            </div>
                        </div>
                        <div class="col-lg-4">
                            <div class="form-group">
                                <elements-multiselect
                                    :key="state.affectedGroup"
                                    v-model="state.affectedGroup"
                                    :options="affectedGroups"
                                    label="name" track-by="value"
                                    :textLabel="$t('Affected Groups')"
                                    :required="true"
                                />
                            </div>
                        </div>
                        <div class="col-12 mt-3">
                            <div class="dropzone" @drop="dropHandler" @dragover="(event) => event.preventDefault()">
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
                                        <input id="hidden-input" type="file" ref="file" @change="setFiles" name="files[]" multiple
                                               class="hidden" />
                                        <button @click="$refs.file.click()" id="button" type="button" class="primary-btn">
                                            <i class="fe-upload me-2"></i>
                                            {{ $t("SELECT FILE") }}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="image-previews mt-3">
                                <div v-for="file in ticketFilesState.files" :key="file.name" class="image-preview">
                                    <img v-if="file.type === 'image/jpeg'" :src="file.preview" width="150" height="100" alt="Preview" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        <div class="mt-3 d-flex align-items-center justify-content-end">
            <submittal-button @click="store()" :isLoading="isLoading" :icon-name="'saveIcon'" :buttonName="$t('Save and Proceed')" />
        </div>
    </form>
</template>