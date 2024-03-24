<template>
    <div class="card mt-4">
        <div class="card-body">
            <div class="custom-dropzone mt-4">
                <div class="dropzone" @drop="dropHandler" @dragover="dragOverHandler">
                    <div class="dropzone-select">
                        <div class="dropzone-icon">
                            <i class="fe-upload-cloud"></i>
                        </div>
                        <div class="dropzone-text">
                            <h4>{{ $t("Select a file or drag and drop here") }}</h4>
                            <p>
                                {{ $t("File size no more than 10MB") }}
                            </p>
                        </div>
                        <div class="dropzone-btn">
                            <input id="hidden-input" type="file" ref="file" @change="setFiles" name="files[]" multiple
                                class="d-none" :accept="accept" />
                            <button @click="$refs.file.click()" id="button" type="button" class="primary-btn">
                                <i class="fe-upload me-2"></i>
                                {{ $t("SELECT FILE") }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="card-header pt-0 d-flex align-items-center">
            <h3 class="card-title me-2">{{ $t("To Upload") }}</h3>
            <ElementsTooltip />
        </div>
        <div class="card-body">
            <div class="dropzone-area mt-3">
                <div class="row">
                    <div v-if="form.files.length === 0" id="empty"
                        class="col-lg-12 h-100 w-100 text-center d-flex flex-column justify-content-center align-items-center">
                        <img class="mx-auto w-50"
                            src="https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png"
                            alt="no data" />
                        <span class="text-small text-secondary">
                            {{ $t("No files selected") }}
                        </span>
                    </div>
                    <div v-else class="col-lg-4 my-2" v-for="(file, index) in form.files" :key="index">
                        <div class="card mb-1 shadow-none border">
                            <div class="p-2">
                                <div class="row align-items-center">
                                    <div class="col-auto">
                                        <div class="avatar-sm">
                                            <span class="avatar-title bg-soft-primary text-primary rounded">
                                                <ElementsIcon v-bind:icon="'uploadFileIcon'" />
                                            </span>
                                        </div>
                                    </div>
                                    <div class="col pl-0">
                                        <a href="javascript:void(0);" class="text-muted font-weight-semibold">
                                            {{ file.viewableName }}</a>

                                        <p v-if="file.size" class="text-muted font-weight-semibold mb-0">
                                            {{
                                                file.size > 1024
                                                ? file.size > 1048576
                                                    ? Math.round(file.size / 1048576) +
                                                    "mb"
                                                    : Math.round(file.size / 1024) +
                                                    "kb"
                                                : file.size + "b"
                                            }}
                                        </p>
                                    </div>
                                    <div class="col-auto" @click="removeFile(index)">
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
        </div>
    </div>
</template>

<script>
export default {
    emits: ["fileChanged", "removeFile"],
    props: {
        productFiles: Object,
        removeInParent: {
            type: Boolean,
            default: false,
        },
        accept: {
            type: String,
            default: "",
        },
    },
    data() {
        return {
            form: this.productFiles,
        };
    },
    watch: {
        productFiles: {
            handler: function (val) {
                this.form = { ...val };
            },
            deep: true,
        },
    },
    methods: {
        dropHandler(event) {
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
                            this.form.files.filter((e) => e.name === file.name)
                                .length > 0
                        ) {
                            continue;
                        }
                        let getFile = file;
                        this.form.files.push(getFile);
                    }
                }
            }
            this.$emit("fileChanged", this.form.files);
        },
        dragOverHandler(event) {
            event.preventDefault();
        },
        /**
         * removes the file from the files array and emits 'removeFile' event
         * if 'removeInParent' is set then the file will be removed in the parent component
         * @param {index} index of the file to be removed
         */
        removeFile(index) {
            if (!this.removeInParent) {
                this.form.files.splice(index, 1);
            }
            this.$emit("removeFile", index);
        },
        setFiles(event) {
            const file = event.target.files;
            if (file.length === 0) {
                return false;
            }
            for (var i = 0; i < file.length; i++) {
                //check if array already has the file so no duplication occurs
                if (
                    this.form.files.filter((e) => e.name === file[i].name)
                        .length > 0
                ) {
                    continue;
                }
                let getFile = file[i];
                this.form.files.push(getFile);
            }
            this.$emit("fileChanged", this.form.files);
        },
    },
};
</script>

<style></style>
