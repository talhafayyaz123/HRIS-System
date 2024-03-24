<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { email, required } from "@vuelidate/validators";
import { reactive, onBeforeMount, computed } from "vue";
import { useNotificationStore } from "@/store/notifications";
import { useAuthStore } from "~/store/auth";
import { useAppStore } from "~/store/app";
import { authService } from "~/helpers/authbackend/auth.service";
import commonCode from "~/composables/common";

import { routes } from "~/utils/apiRoutes";

useHead({
  title: `Login`,
});
definePageMeta({
  layout: "auth",
  title: "Login",
});
const notificationStore = useNotificationStore();
const authStore = useAuthStore();
const appStore = useAppStore();
const { router, Toast } = commonCode();

const state = reactive({
  isLoading: false,
  mail: "",
  password: "",
  remember: false,
  authError: null,
  showPassword: "password",
  tryingToLogIn: false,
  isAuthError: false,
});
const validationRules = {
  mail: { required, email },
  password: { required },
};

const managers = ref([]);


const v$ = useVuelidate(validationRules, state);

onBeforeMount(function () {
  if (localStorage.getItem("token")) {
    navigateTo("/");
  }
});
function tooglePassword() {
  state.showPassword = state.showPassword === "password" ? "text" : "password";
}

const notificationAutoCloseDuration = computed(function () {
  return notificationStore ? 5 : 0;
});

async function loginHandler() {
  //stop here if form is invalid
  v$.value.$touch();
  if (v$.value.$invalid) {
    return false;
  } else {
    state.isLoading = true;
    const { mail, password, remember } = state;

    if (mail && password) {
      authService.login(mail, password, remember).then(
        (user) => {
          // adding to store
          appStore.setEmployees();
          authStore.loginSuccess(user);
          authStore.token(user.token);
          authStore.authenticated(true);
          state.isLoading = false;
          Toast.fire({
            title: "Success",
            text: "Logged in!",
            icon: "success",
          });
          navigateTo("/");
        },
        (error) => {
          authStore.loginFailure();
          notificationStore.error(
            Toast.fire({
              title: "Error!",
              text: "No user with given mail and password found or password is wrong.",
              icon: "error",
            })
          );
          state.isLoading = false;
        }
      );
    }
  }
}
</script>

<template>
  <div class="auth-wrapper">
    <Loader :isLoading="state.isLoading" />
    <div class="auth-left">
      <img class="auth-img" src="@/assets/images/auth.png" alt="">
      <img class="auth-bg" src="@/assets/images/auth-bg.png" alt="">
    </div>
    <div class="auth-right">
      <elements-icon v-bind:icon="'BluelogoIcon'" />
      <h2 class="mt-3">Login</h2>
      <h4 class="mb-3">Please fill your information below</h4>
      <form @submit.prevent="loginHandler">
        <div class="form-group mb-3">
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <elements-icon v-bind:icon="'logemailIcon'" />
              </span>
            </div>
            <input class="form-control" v-model="state.mail" type="email" id="emailaddress" placeholder="Enter your email"
              :class="{ 'is-invalid': v$.mail.$error }" />
          </div>
        </div>
        <div v-if="v$.mail.$error" class="invalid-feedback">
          <span class="text-danger" v-if="v$.mail.required">{{
            $t("This value is required")
          }}</span><br />
          <span class="text-danger" v-if="v$.mail.email">{{
            $t("Please enter valid email.")
          }}</span>
        </div>

        <div class="form-group mb-3">
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <elements-icon v-bind:icon="'lockIcon'" />
              </span>
            </div>
            <input v-model="state.password" :type="state.showPassword" id="password" class="form-control"
              placeholder="Enter your password" :class="{
                'is-invalid': v$.password.$error,
              }" />
            <div class="input-group-append">
              <span class="input-group-text" @click="tooglePassword" data-password="false">
                  <elements-icon v-bind:icon="'visibleIcon'" />
                <!-- <i class="fe" :class="{ 'fe-eye': showPassword == 'password', 'fe-eye-off': showPassword == 'text' }"></i> -->
              </span>
            </div>
          </div>
        </div>
        <div v-if="v$.password.$error" class="invalid-feedback">
          <span class="text-danger" v-if="v$.password.required">{{
            $t("This value is required")
          }}</span>
        </div>
        <div class="d-flex align-items-center justify-content-between mb-5">
          <div class="switch">
            <div class="switch-label">Remember me</div>
            <input type="checkbox" id="switch" checked />
            <label for="switch"></label>
          </div>
          <nuxt-link to="/account/forgot-password" class="forget-pass">Forgot your password?</nuxt-link>
        </div>

        <div class="form-group d-flex align-items-center justify-content-center mb-0">
          <button class="btn-primary" type="submit">
            <span class="me-2">Log In</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
              <path
                d="M13.2549 10.3404L8.00693 5.09415C7.77665 4.86445 7.40357 4.86445 7.17271 5.09415C6.94243 5.32384 6.94243 5.69693 7.17271 5.92662L12.0044 10.7566L7.17329 15.5865C6.94301 15.8162 6.94301 16.1893 7.17329 16.4196C7.40357 16.6493 7.77723 16.6493 8.00751 16.4196L13.2555 11.1734C13.4823 10.9461 13.4823 10.5671 13.2549 10.3404Z"
                fill="white" stroke="white" stroke-width="0.5" />
            </svg>
          </button>
        </div>
        <hr class="mt-3 mb-2">
        <div class="social-links mt-5">
          <ul>
            <li>
              <nuxt-link to=""><img src="@/assets/images/facebook.png" alt=""></nuxt-link>
            </li>
            <li>
              <nuxt-link to=""><img src="@/assets/images/instagram.png" alt=""></nuxt-link>
            </li>
            <li>
              <nuxt-link to=""><img src="@/assets/images/twitter.png" alt=""></nuxt-link>
            </li>
          </ul>
        </div>
      </form>
    </div>
  </div>

  <!-- end row -->
</template>
