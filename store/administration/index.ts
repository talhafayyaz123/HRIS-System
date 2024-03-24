import { defineStore } from "pinia";
import { IState } from "./types";
import { routes } from "~/utils/apiRoutes";
import { specificGetRequest } from "~/utils/apiRequests";

export const useAdministrationStore = defineStore("administration", {
  state: (): IState => {
    return {
      users: [],
      roles: [],
      permissions: [],
    };
  },
  actions: {
    async setAllUsers() {
      try {
        const allUsersRes = await specificGetRequest(
          routes.LIST_USERS,
          {
            limit_start: 1,
            limit_count: 500,
            type: "0",
          }
        );
        this.users = allUsersRes?.data.map((list: any) => {
          return { value: list.id, name: list.title };
        });
      } catch (error) {
        return error;
      }
    },

    async setAllRoles() {
      try {
        const allRolesRes = await specificGetRequest(routes.LIST_ROLES, {
          limit_start: 1,
          limit_count: 500,
          type: "0",
        });
        this.roles = allRolesRes.data.map((list: any) => {
          return { value: list.id, name: list.title };
        });
      } catch (error) {
        return error;
      }
    },
    async setAllPermissions() {
      try {
        const allPermisionsRes = await specificGetRequest(
          routes.LIST_PERMISSIONS,
          {
            limit_start: 1,
            limit_count: 500,
            type: "0",
          }
        );
        this.permissions = allPermisionsRes?.data.map((list: any) => {
          return { value: list.id, name: list.title };
        });
      } catch (error) {
        return error;
      }
    }
  },
});
