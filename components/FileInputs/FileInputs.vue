<script setup lang="ts">
import { ref, computed, watch } from "vue";

const props = defineProps({
  productFiles: Object,
  removeInParent: {
    type: Boolean,
    default: false,
  },
  accept: {
    type: String,
    default: "",
  },
});
const emits = defineEmits(["fileChanged", "removeFile"]);

const form = ref(props.productFiles);

watch(
  () => props.productFiles,
  (productFiles) => {
    form.value = { ...productFiles };
  },
  { deep: true }
);

function dropHandler(event) {
  event.preventDefault();
  if (event.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)
    for (var i = 0; i < event.dataTransfer.items.length; i++) {
      const item = event.dataTransfer.items[i];
      // If dropped items aren't files, reject them
      if (item.kind === "file") {
        const file = item.getAsFile();
        //check if array already has the file so no duplication occurs
        if (form.value.files.filter((e) => e.name === file.name).length > 0) {
          continue;
        }
        let getFile = file;
        form.value.files.push(getFile);
      }
    }
  }
  emits("fileChanged", form.value.files);
}

function dragOverHandler(event) {
  event.preventDefault();
}

/**
 * removes the file from the files array and emits 'removeFile' event
 * if 'removeInParent' is set then the file will be removed in the parent component
 * @param {index} index of the file to be removed
 */
function removeFile(index: any) {
  if (!props.removeInParent) {
    form.value.files.splice(index, 1);
  }
  emits("removeFile", index);
}

function setFiles(event) {
  const file = event.target.files;
  if (file.length === 0) {
    return false;
  }
  for (var i = 0; i < file.length; i++) {
    //check if array already has the file so no duplication occurs
    if (form.value.files.filter((e) => e.name === file[i].name).length > 0) {
      continue;
    }
    let getFile = file[i];
    form.value.files.push(getFile);
  }
  emits("fileChanged", form.value.files);
}
</script>

<template>
  <div class="col-lg-6">
    <div class="custom-dropzone">
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
              ref="file"
              @change="setFiles"
              name="files[]"
              multiple
              class="hidden"
              :accept="accept"
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
    <section>
      <div class="dropzone-area mt-3">
        <div class="row">
          <div
            class="col-xl-4 my-2"
            v-for="(file, index) in form.files"
            :key="index"
          >
            <div class="card mb-1 shadow-none border">
              <div class="p-2">
                <div class="row align-items-center">
                  <div class="col-auto">
                    <div class="avatar-sm">
                      <span
                        class="avatar-title bg-soft-primary text-primary rounded"
                      >
                        .ZIP
                      </span>
                    </div>
                  </div>
                  <div class="col pl-0">
                    <a
                      href="javascript:void(0);"
                      class="text-muted font-weight-semibold"
                    >
                      {{ file.name }}
                    </a>

                    <p v-if="file.size" class="mb-0">
                      {{
                        file.size > 1024
                          ? file.size > 1048576
                            ? Math.round(file.size / 1048576) + "mb"
                            : Math.round(file.size / 1024) + "kb"
                          : file.size + "b"
                      }}
                    </p>
                  </div>
                  <div class="col-auto" @click="removeFile(index)">
                    <a
                      href="javascript:void(0);"
                      class="btn btn-link btn-lg text-muted"
                    >
                      <i class="fe-trash"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
