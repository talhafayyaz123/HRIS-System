<script setup lang="ts">
import { ref, reactive } from "vue";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import genericFunctionality from "~/composables/genericFunctionality";
import { useAuthStore } from '@/store/auth'
import { routes } from "~/utils/apiRoutes";

const { router, Toast, deleteAlert } = commonCode(),
  { submitted, isLoading, apiRoute, storeFunc,updateFunc } = genericFunctionality(),
  { t } = useI18n(),
  productId = ref(""),
  productName = ref(""),
  managers = ref([]),
  authStore = useAuthStore(),
  emits = defineEmits(["performanceEntry"]),
  props = defineProps([
    "showModal",
    "hideModal",
    "products",
    "managers",
    "isAdd",
    "editRecord",
  ]),
  performanceEntryInitial = {
    date: "",
    description: "",
    internalNote: "",
    isGoodwill: "",
    quantity: "",
    userId: "",
  },
  performanceRecord: any = reactive({ ...performanceEntryInitial }),
  goodWillOptions = [
    { value: "1", name: "Yes" },
    { value: "0", name: "No" },
  ],
  validationRules = {
    userId: { required },
    date: { required },
    isGoodwill: { required },
    description: { required },
  },
  v$ = useVuelidate(validationRules, performanceRecord),
  save = () => {
    v$.value.$touch();
    if (v$.value.$invalid) {
      submitted.value = false;
      return false;
    } else {
      try {
        isLoading.value = true;

        let user = managers.value.filter(
          (item: any) => item.value == performanceRecord.userId
        );

          if(props.isAdd==='insertSingle'){
            apiRoute.value = routes.PERFORMANCE_RECORD_STORE_SINGLE;
                   let payLoad=  {
                    id: router.params.id,
                    ...performanceRecord,
                    time: performanceRecord.quantity,
                    date: performanceRecord.date,
                    userId: performanceRecord.userId,
                    editedUserId: authStore.$state.user?.token_info?.user_id
                };
                
                storeFunc(payLoad);

          }else if (props.isAdd === false) {
          emits("performanceEntry", {
            ...performanceRecord,
            time: performanceRecord.quantity,
            userId: user,
            index: props.editRecord.index,
          });
        } else if(props.isAdd==='updateSingle'){
          apiRoute.value = routes.PERFORMANCE_RECORD_ENTRY_UPDATE;
        let payLoad={
          ...performanceRecord,
            time:performanceRecord.quantity,
            date: performanceRecord.date,
            userId: performanceRecord.userId,
            editedUserId: authStore.$state.user?.token_info?.user_id
        }
   
       updateFunc(payLoad,props.editRecord.id);

        }else{
          emits("performanceEntry", {
            ...performanceRecord,
            time: performanceRecord.quantity,
            userId: user,
          });
        }

         Object.assign(performanceRecord, performanceEntryInitial);
        props.hideModal();
      } catch (e) {
        Toast.fire({ title: t("Error!"), text: t("Error"), icon: "error" });
        isLoading.value = false;
        submitted.value = false;
      }
    }
  };

managers.value = props.managers;

watch(
  () => props.isAdd,
  () => {
    if (props.isAdd === false  || props.isAdd==='updateSingle') {
    
      const { date, description, internalNote, isGoodwill, quantity, userId } =
        props.editRecord;
      performanceRecord.date = date;
      performanceRecord.description = description;
      performanceRecord.isGoodwill = isGoodwill;
      performanceRecord.quantity = quantity;
      if(props.isAdd==='updateSingle'){
        performanceRecord.userId = userId?.value;
      }else{
        performanceRecord.userId = userId[0]?.value;
      }
      performanceRecord.internalNote = internalNote;
    }
  }
);
</script>

<template>
  <Modal
    :showModal="props.showModal"
    @hideModal="props.hideModal"
    :title="`Add Product`"
    class="table-modal"
  >

    <div class="row mt-4">
      <div class="col-12 col-lg-6 col-sm-12">
        <div class="form-group">
          <elements-multiselect
            v-model="performanceRecord.userId"
            :class="{ 'is-invalid': v$.userId.$error }"
            :options="managers"
            label="text"
            track-by="value"
            :textLabel="$t('Person/Reference')"
            :required="true"
          />
        </div>
        <div v-if="v$.userId.$error" class="invalid-feedback">
          <span class="text-danger" v-if="v$.userId.required">{{
            $t("This value is required")
          }}</span
          ><br />
        </div>
      </div>
      <div class="col-lg-6">
        <div class="form-group">
          <elements-input
            v-model="performanceRecord.quantity"
            :label="$t('Quantity')"
            :required="true"
            id="group-name"
            :disabled="submitted"
            type="number"
          />
        </div>
      </div>
      <div class="col-12 col-lg-6 col-sm-12">
        <div class="form-group">
          <elements-multiselect
            v-model="performanceRecord.isGoodwill"
            :class="{ 'is-invalid': v$.isGoodwill.$error }"
            :options="goodWillOptions"
            label="name"
            track-by="value"
            :textLabel="$t('Goodwill')"
            :required="true"
          />
        </div>

        <div v-if="v$.isGoodwill.$error" class="invalid-feedback">
          <span class="text-danger" v-if="v$.isGoodwill.required">{{
            $t("This value is required")
          }}</span
          ><br />
        </div>
      </div>
      <div class="col-lg-6">
        <div class="form-group">
          <elements-input
            v-model="performanceRecord.date"
            :label="$t('Created Date')"
            :required="true"
            id="group-name"
            :disabled="submitted"
            :class="{ 'is-invalid': v$.date.$error }"
            type="date"
          />
        </div>
        <div v-if="v$.date.$error" class="invalid-feedback">
          <span class="text-danger" v-if="v$.date.required">{{
            $t("This value is required")
          }}</span
          ><br />
        </div>
      </div>

      <div class="col-lg-6">
        <div class="form-group textarea">
          <textarea
            :class="{ 'is-invalid': v$.description.$error }"
            v-model="performanceRecord.description"
            class="form-control"
            placeholder="."
          ></textarea>
          <label for="" class="input-label">Description</label>
        </div>
        <div v-if="v$.date.$description" class="invalid-feedback">
          <span class="text-danger" v-if="v$.description.required">{{
            $t("This value is required")
          }}</span
          ><br />
        </div>
      </div>

      <div class="col-lg-6">
        <div class="form-group textarea">
          <textarea
            v-model="performanceRecord.internalNote"
            class="form-control"
            placeholder="."
          ></textarea>
          <label for="" class="input-label">Custom Notes Field</label>
        </div>
      </div>
    </div>
    <div class="d-flex align-items-center justify-content-end mt-3">
      <button
        type="button"
        class="primary-btn me-2"
        data-bs-dismiss="modal"
        @click="() => props.hideModal()"
      >
        Close
      </button>
      <submittal-button :buttonName="$t('Save')" @click="save()" />
    </div>
  </Modal>
</template>

