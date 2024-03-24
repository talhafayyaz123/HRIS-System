<script setup>
import { useLayoutStore } from "~/store/layout";
import useDebouncedRef from "~/composables/useDebouncedRef";
import { ref, watch } from "vue";

/**
 * Page-header component
 */

const props = defineProps({
  title: {
    type: String,
    default: ""
  },

  isticketDetailShow: {
    type: Boolean,
    default: false
  },
  items: {
    type: Array,
    default: () => {
      return [];
    }
  },
  currentView: String,
  optionalItems: {
    type: Object,
    default: () => {
      return {
        searchBar: false,
        listBar: false,
        isBtnShow: false,
        btnText: '',
        path: '/',
        isBtn2Show: false,
        btn2Text: '',
        btn2Path: '/',
        csvBtn: false,
        csvBtnText: '',
        csvBtnPath: '/',
        csvBtnIcon:'',
        modalBtn:false,
        modalBtnText:'',
        modalBtnIcon:'',
        downloadCsvBtn:false,
        downloadCsvBtnText:'',
        downloadCsvBtnIcon:'',
      };
    }
  },
  breadCrupmBtn: false,
});
const emit = defineEmits(["watchEvent","modalEvent","breadEvent","downloadCsvEvent"])
const layout = useLayoutStore();
const showSearch = ref(false);

// debounced actually used for delay watch in millisecond
const searchGlobal = useDebouncedRef('', 800);
function modalOpen(){
  emit('modalEvent')
}
function downloadCsv(){
  emit('downloadCsvEvent')
}
function toggleSearch() {
  showSearch.value = true;
}
function closeSearch() {
  showSearch.value = false;
}
function handleSearch() {
  emit("search")
}
function showGrid() {
  emit('update-view', 'grid');
}
function showList() {
  emit('update-view', 'list');
}
function breadcrumFunct(){
  emit('breadEvent')
}
watch(searchGlobal, (current) => {
  emit('watchEvent', current)
});
</script>
<template>
  <div class="page-header"
    :class="{ 'page-title-box-alt': layout.layoutType !== 'vertical' && layout.layoutType !== 'two-column' }">
    <div class="page-title">
      <!-- <h3>{{ title }}</h3> -->
      <div class="page-title-right">
        <ol class="breadcrumb m-0 align-items-center">
          <li class="breadcrumb-item" v-for="(item, index) in items" :key="index">
            <!-- If it's not the last item, make it a link -->
            <Loader :isLoading="layout.loader" />
            <nuxt-link class="cursor-pointer" v-if="index < items.length - 1 && breadCrupmBtn" @click="breadcrumFunct">{{ item.text }}</nuxt-link>
            <div class="d-flex align-items-center" v-else>
              <nuxt-link v-if="index < items.length - 1" :to="item.to">{{ item.text }}</nuxt-link>
              <span v-else>{{ item.text }}</span>
            </div>
            <!-- If it's the last item, make it non-clickable (active) -->
            
          </li>
        </ol>
      </div>
    </div>
    <div class="other-items d-flex justify-center">
      <!---========--->
      <div class="search-close" @click="closeSearch" v-if="showSearch == true">
        <ElementsIcon v-bind:icon="'xIcon'" />
      </div>
      <div v-else class="search-icon" v-show="optionalItems.searchBar" @click="toggleSearch">
        <img src="@/assets/images/searchheader.svg" alt="">
      </div>
      <div class="search" v-show="showSearch">
        <div class="form-group m-0">
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fe-search"></i>
              </span>
            </div>
            <input v-model="searchGlobal" type="search" placeholder="Search here" class="form-control"
              @blur="handleSearch" />
          </div>
        </div>
      </div>
      <!---========--->
      <div class="left-icon-box" v-show="optionalItems.listBar">
        <div v-if="currentView !== 'list'" @click="showList">
          <ElementsIcon v-bind:icon="'listIcon'" />
        </div>
        <div v-if="currentView !== 'grid'" @click="showGrid">
          <ElementsIcon v-bind:icon="'cardIcon'" />
        </div>
      </div>
      <!---========--->
      <div class="right-side">
        <NuxtLink v-if="optionalItems.csvBtn" :to="optionalItems.csvBtnPath" class="primary-btn me-2">
          <ElementsIcon v-bind:icon="optionalItems.csvBtnIcon" class="me-1 add-icon" />
          {{ $t(optionalItems.csvBtnText) }}
        </NuxtLink>
        <button v-if="optionalItems.downloadCsvBtn" class="primary-btn me-2" @click="downloadCsv()">
          <ElementsIcon v-bind:icon="optionalItems.downloadCsvBtnIcon" class="me-1 add-icon" />
          {{ $t(optionalItems.downloadCsvBtnText) }}
        </button>
        <button v-if="optionalItems.modalBtn" class="primary-btn me-2" @click="modalOpen()">
          <ElementsIcon v-bind:icon="optionalItems.modalBtnIcon" class="me-1 add-icon" />
          {{ $t(optionalItems.modalBtnText) }}
        </button>
        
        <NuxtLink v-if="optionalItems.isBtnShow" :to="optionalItems.path" class="primary-btn">
          <i class="me-2 fas fa-plus"></i>{{ $t(optionalItems.btnText) }}
        </NuxtLink>
        <NuxtLink v-if="optionalItems.isBtn2Show" :to="optionalItems.btn2Path" class="primary-btn ms-2">
          <i
            class="me-2 fas fa-plus"></i>{{ $t(optionalItems.btn2Text) }}
        </NuxtLink>

      </div>
      <!---========--->
    </div>

  </div>
<!-- end page title --></template>
