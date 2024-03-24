<script setup lang="ts">
import { ref, reactive, computed, provide, inject } from "vue";
import commonCode from "~/composables/common";
import { ProductTypeEnum } from "~/utils/enums";
import { useProductStore } from "~/store/product";
import ProductTab from "./ProductTab.vue";
import DependenciesTab from "./DependenciesTab.vue";
import InstallRoutinesTab from "./InstallRoutinesTab.vue";
import ChildrensTab from "./ChildrensTab.vue";
import UnInstallRoutinesTab from "./UnInstallRoutinesTab.vue";
import ParametersTab from "./ParametersTab.vue";
import AdditionalServicesTab from "./AdditionalServicesTab.vue";
import FilesTab from "./FilesTab.vue";

const { t } = useI18n();
const product = useProductStore();

const step = ref(1);
const completedSteps = ref([1]);
const prevStep = () => {
  completedSteps.value.pop();
  step.value -= 1;
};

const nextStep = () => {
  const steps = (step.value += 1);
  completedSteps.value.push(steps);
};
function tabs(num: any) {
  step.value = num;
}
function checkStepInArray(value: any) {
  return completedSteps.value.includes(value);
}
provide("nextPrevSteps", { nextStep, prevStep });
</script>

<template>
  <div>
    <div class="wizard-tab" v-show="product.productType === ProductTypeEnum.SOFTWARE ||
      product.productType === ProductTypeEnum.CLOUD
      ">
      <ul class="">
        <li class="nav-item" role="presentation" @click="checkStepInArray(1) ? tabs(1) : ''">
          <a class="nav-link" :class="{ active: step === 1, 'step-done': checkStepInArray(1) }">
            {{ $t('Product') }}
          </a>
        </li>
        <li class="nav-item" role="presentation" @click="checkStepInArray(2) ? tabs(2) : ''">
          <a class="nav-link" :class="{ active: step === 2, 'step-done': checkStepInArray(2) }">
            {{ $t('Dependencies') }}
          </a>
        </li>
        <li class="nav-item" role="presentation" @click="checkStepInArray(3) ? tabs(3) : ''">
          <a class="nav-link" :class="{ active: step === 3, 'step-done': checkStepInArray(3) }">
            {{ $t('Install Routines') }}
          </a>
        </li>
        <li class="nav-item" role="presentation" @click="checkStepInArray(4) ? tabs(4) : ''">
          <a class="nav-link" :class="{ active: step === 4, 'step-done': checkStepInArray(4) }">
            {{ $t('Uninstall Routines') }}
          </a>
        </li>
        <li class="nav-item" role="presentation" @click="checkStepInArray(5) ? tabs(5) : ''">
          <a class="nav-link" :class="{ active: step === 5, 'step-done': checkStepInArray(5) }">
            {{ $t('Childrens') }}
          </a>
        </li>
        <li class="nav-item" role="presentation" @click="checkStepInArray(6) ? tabs(6) : ''">
          <a class="nav-link" :class="{ active: step === 6, 'step-done': checkStepInArray(6) }">
            {{ $t('Parameters') }}
          </a>
        </li>
        <li class="nav-item" role="presentation" @click="checkStepInArray(7) ? tabs(7) : ''">
          <a class="nav-link" :class="{ active: step === 7, 'step-done': checkStepInArray(7) }">
            {{ $t('Additional Services') }}
          </a>
        </li>
        <li class="nav-item" role="presentation" @click="checkStepInArray(8) ? checkStepInArray(8) : ''">
          <a class="nav-link" :class="{ active: step === 8, 'step-done': step > 8 }">
            {{ $t('Files') }}
          </a>
        </li>
      </ul>
    </div>
    <div class="wizard-tab supplier-tab" v-show="product.productType === ProductTypeEnum.SERVICE ||
      product.productType === ProductTypeEnum.PAUSCHAL || product.productType === ProductTypeEnum.TRAVELING
      ">
      <ul class="">
        <li class="nav-item" role="presentation" @click="checkStepInArray(1) ? tabs(1) : ''">
          <a class="nav-link" :class="{ active: step === 1, 'step-done': checkStepInArray(1) }">
            {{ $t('Product') }}
          </a>
        </li>

        <li class="nav-item" role="presentation" @click="checkStepInArray(2) ? tabs(2) : ''">
          <a class="nav-link" :class="{ active: step === 2, 'step-done': checkStepInArray(2) }">
            {{ $t('Childrens') }}
          </a>
        </li>
      </ul>
    </div>
    <div class="wizard-tab" v-show="product.productType == ProductTypeEnum.HOSTING">
      <ul class="">
        <li class="nav-item" role="presentation" @click="checkStepInArray(1) ? tabs(1) : ''">
          <a class="nav-link" :class="{ active: step === 1, 'step-done': checkStepInArray(1) }">
            {{ $t('Product') }}
          </a>
        </li>
        <li class="nav-item" role="presentation" @click="checkStepInArray(2) ? tabs(2) : ''">
          <a class="nav-link" :class="{ active: step === 2, 'step-done': checkStepInArray(2) }">
            {{ $t('Install Routines') }}
          </a>
        </li>
        <li class="nav-item" role="presentation" @click="checkStepInArray(3) ? tabs(3) : ''">
          <a class="nav-link" :class="{ active: step === 3, 'step-done': checkStepInArray(3) }">
            {{ $t('Uninstall Routines') }}
          </a>
        </li>
        <li class="nav-item" role="presentation" @click="checkStepInArray(4) ? tabs(4) : ''">
          <a class="nav-link" :class="{ active: step === 4, 'step-done': checkStepInArray(4) }">
            {{ $t('Childrens') }}
          </a>
        </li>
        <li class="nav-item" role="presentation" @click="checkStepInArray(5) ? tabs(5) : ''">
          <a class="nav-link" :class="{ active: step === 5, 'step-done': checkStepInArray(5) }">
            {{ $t('Parameters') }}
          </a>
        </li>
        <li class="nav-item" role="presentation" @click="checkStepInArray(6) ? tabs(6) : ''">
          <a class="nav-link" :class="{ active: step === 6, 'step-done': checkStepInArray(6) }">
            {{ $t('Additional Services') }}
          </a>
        </li>
        <li class="nav-item" role="presentation" @click="checkStepInArray(7) ? checkStepInArray(7) : ''">
          <a class="nav-link" :class="{ active: step === 7, 'step-done': step > 7 }">
            {{ $t('Files') }}
          </a>
        </li>
      </ul>
    </div>
    <div class="wizard-tab" v-show="product.productType == ProductTypeEnum.AMS">
      <ul class="">
        <li class="nav-item" role="presentation" @click="checkStepInArray(1) ? tabs(1) : ''">
          <a class="nav-link" :class="{ active: step === 1, 'step-done': checkStepInArray(1) }">
            {{ $t('Product') }}
          </a>
        </li>
      </ul>
    </div>

    <div class="wizard-content">
      <!-- product-tab is common tab, in all cases -->
      <product-tab v-show="step === 1" />
      <div v-if="product.productType === ProductTypeEnum.SOFTWARE ||
        product.productType === ProductTypeEnum.CLOUD
        ">
        <dependencies-tab v-show="step === 2" />
        <install-routines-tab v-show="step === 3" />
        <un-install-routines-tab v-show="step === 4" />
        <childrens-tab v-show="step === 5" />
        <parameters-tab v-show="step === 6" />
        <additional-services-tab v-show="step === 7" />
        <files-tab v-show="step === 8" />
      </div>

      <div v-else-if="product.productType === ProductTypeEnum.SERVICE ||
        product.productType === ProductTypeEnum.PAUSCHAL || product.productType === ProductTypeEnum.TRAVELING
        ">
        <childrens-tab v-show="step === 2" />
      </div>

      <div v-else-if="product.productType === ProductTypeEnum.HOSTING">
        <install-routines-tab v-show="step === 2" />
        <un-install-routines-tab v-show="step === 3" />
        <childrens-tab v-show="step === 4" />
        <parameters-tab v-show="step === 5" />
        <additional-services-tab v-show="step === 6" />
        <files-tab v-show="step === 7" />
      </div>
    </div>
  </div>
</template>