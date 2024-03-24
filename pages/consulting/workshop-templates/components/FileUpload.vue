<template>
  <div>
    <drop-zone
      @removeFile="removeFile"
      @file-changed="addFiles"
      :productFiles="form"
      :removeInParent="true"
      :accept="'application/json'"
    />
  </div>
</template>

<script>
import DropZone from "@/components/DropZone.vue";
import { workshopTemplateFileCreateRequest,workshopTemplateFileDeleteRequest } from "~/utils/apiRequests";

export default {
  props: {
    id: {
      type: Number,
      required: true,
    },
    files: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    DropZone,
  },
  mounted() {
    this.syncFormFilesWithFiles();
  },
  watch: {
    files() {
      this.syncFormFilesWithFiles();
    },
  },
  data() {
    return {
      form: {
        files: [],
      },
    };
  },
  methods: {
    async removeFile(index) {
      try {
        console.log(this.form.files?.[index])
        workshopTemplateFileDeleteRequest(this.form.files?.[index]?.id)
        // remove the file after API is successful
        this.form.files.splice(index, 1);
      } catch (e) {
        console.log(e);
      }
    },
    /**
     * syncs the values of form files to files prop
     */
    syncFormFilesWithFiles() {
      this.form.files = this.files;
    },
    /**
     * calls the upload file API for the workshop template
     * triggered when the user uploads a file
     * @param {files} the files being uploaded
     */
    async addFiles(files) {
      try {
        const formData = new FormData();
        formData.append("workshopTemplateId", this.id);
        files.forEach((file, index) => {
          // skip the files that are already uploaded
          if (!file.id) {
            formData.append(`files[${index}]`, file);
          }
        })
        workshopTemplateFileCreateRequest(
          formData
        )
          .then((response) => {

            this.form.files = response?.data ?? files;

          })
          .catch((error) => {
          });
        // sync the files with the latest files received in response
        // we need to do this because the if we delete a file, we need the id for that file
        // so we need to get the latest created files
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>
