import { defineStore } from "pinia";
import { IState } from "./types";
import { useAuthStore } from "../auth";
import { useNotificationStore } from "../notifications";
import { permissionService } from "@/helpers/authbackend/permission-service";

let token = localStorage.getItem("token") ?? "";
export const usePermissionStore = defineStore("permission", {
  state: (): IState => {
    return {
      permissions: [],
      permissionsNeeds: [],
      permissionsGlobal: [],
      count: 0,
    };
  },

  actions: {
    async permissionsGlobal(queryParams: any) {
      const authStore = useAuthStore();
      if (!token) token = authStore.token;
      return permissionService
        .permissionList(queryParams, token)
        .then((res) => {
          this.permissionsGlobal = res?.data ?? [];
        });
    },

    showPermissionList(queryParams: any) {
      const authStore = useAuthStore();
      const notificationStore = useNotificationStore();
      if (!token) token = authStore.token;

      notificationStore.error("");
      permissionService.permissionList(queryParams, token).then(
        (res) => {
          this.permissions = res?.data ?? [];
          this.permissionsNeeds = res?.data ?? [];
          this.count = res?.data?.count ?? 0;
          return res;
          //this.$router.push({ path: "/permissions" });
        },
        (error) => {
          notificationStore.error(
            "No user with given mail and password found or password is wrong"
          );
        }
      );
    },
  },
});
