<script setup lang="ts">
import { useLayoutStore } from "@/store/layout";
import { routes } from "~/utils/apiRoutes";
import genericFunctionality from "~/composables/genericFunctionality";
import { ref } from "vue";
import commonCode from "~/composables/common";
import { useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";
const store = useLayoutStore();
const { t } = useI18n();
const
  {
    apiRoute, currentPerPage, currentPage, data, orderColumn, orderDirection,
    listingFunc, onSortChange, handleSearch, destroy
  } = genericFunctionality(),
  { router, Toast, deleteAlert } = commonCode();

const optionalItems = {
  searchBar: false,
  isBtnShow: false,
  btnText: "",
  path: "",
};
const breadCrumbsConfig = [
  {
    text: "Admin portal",
    to: "/",
  },
  {
    text: "Self Service",
    active: true,
  },
],

  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  { title } = useTitle("Self Service");
useHead({
  title: title,
});
</script>

<template>
  <div>
    <page-header :title="title" :items="items" :optionalItems="optionalItems" @watchEvent="handleSearch" />

    <div class="self-service">
      <nuxt-link to="/time-trackers" class="self-service-box">
        <div class="icon">
          <elements-icon v-bind:icon="'timeTrackerIcon'" />
        </div>
        <p>{{ $t('Time Tracker') }}</p>
      </nuxt-link>
      <nuxt-link to="/vacation-request" class="self-service-box">
        <div class="icon">
          <elements-icon v-bind:icon="'umbrellaIcon'" />
        </div>
        <p>{{ $t('Vacation Request') }}</p>
      </nuxt-link>
      <nuxt-link to="/self-service/travel-expenses" class="self-service-box">
        <div class="icon">
          <elements-icon v-bind:icon="'travelIcon'" />
        </div>
        <p>{{ $t('Travel Expenses') }}</p>
      </nuxt-link>
      <nuxt-link to="/" class="self-service-box">
        <div class="icon">
          <elements-icon v-bind:icon="'assetIcon'" />
        </div>
        <p>{{ $t('Asset Store') }}</p>
      </nuxt-link>
      <nuxt-link to="/" class="self-service-box">
        <div class="icon">
          <elements-icon v-bind:icon="'myassetIcon'" />
        </div>
        <p>{{ $t('My Assets') }}</p>
      </nuxt-link>
      <nuxt-link to="/" class="self-service-box">
        <div class="icon">
          <elements-icon v-bind:icon="'personalIcon'" />
        </div>
        <p>{{ $t('Personal Request') }}</p>
      </nuxt-link>
      <nuxt-link to="/" class="self-service-box">
        <div class="icon">
          <elements-icon v-bind:icon="'modifyIcon'" />
        </div>
        <p>{{ $t('Modify My Data') }}</p>
      </nuxt-link>
      <nuxt-link to="/" class="self-service-box">
        <div class="icon">
          <elements-icon v-bind:icon="'accessIcon'" />
        </div>
        <p>{{ $t('Access To Personal Files') }}</p>
      </nuxt-link>
      <nuxt-link to="/" class="self-service-box">
        <div class="icon">
          <elements-icon v-bind:icon="'investIcon'" />
        </div>
        <p>{{ $t('Invest Request') }}</p>
      </nuxt-link>
      <nuxt-link to="/continuous-improvement-process" class="self-service-box">
        <div class="icon">
          <elements-icon v-bind:icon="'chartIcon'" />
        </div>
        <p>{{ $t('Continuous Improvement Process (CIP)') }}</p>
      </nuxt-link>
    </div>

  </div>
</template>
