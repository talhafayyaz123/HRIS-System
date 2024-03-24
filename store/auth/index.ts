import { authService } from "@/helpers/authbackend/auth.service";
import { defineStore } from "pinia";
import { IState } from "./types";

let token = JSON.parse(localStorage.getItem("token") ?? "{}");

export const useAuthStore = defineStore("auth", {
  state: (): IState => {
    return {
      authenticated: localStorage.getItem("authenticated") ? true : false,
      status: {},
      user: localStorage.getItem("user") ?? null,
      users: [],
      userPermissions: [],
      count: 0,
      isPublic: false,
      token: token,
      language: localStorage.getItem("lang") || "en",
    };
  },
  persist: true,
  actions: {
    async show(queryParams: any) {
      return authService.listUser(this.token, queryParams).then((res) => {
        return res;
      });
    },
    loginSuccess(user: any) {
      this.status = { loggeduser: true };
      this.user = user;
    },
    loginFailure() {
      this.status = {};
      this.user = null;
    },

    logout() {
      this.status = {};
      this.user = null;
    },
    authenticated(auth: any) {
      this.authenticated = auth;
    },

    set_user(value: any) {
      this.user = value;
    },
    lang(locale: any) {
      this.language = locale;
    },

    users(user: any) {
      this.users = user;
    },

    userPermissions(userPermissions: any) {
      this.userPermissions = userPermissions;
    },
    count(count: any) {
      this.count = count;
    },
    token(token: any) {
      this.token = token;
    },
    isPublicAction(pub: any) {
      this.isPublic = pub;
    },
  },
});
