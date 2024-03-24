import { authService } from "@/helpers/authbackend/auth.service";
import { defineStore } from "pinia";
import { IState } from "./types";
import genericFeatures from "~/composables/generic";
const { fetchListing, showGenericListing } = genericFeatures();
const runtimeConfig = useRuntimeConfig();

export const useAppStore = defineStore("app", {
  state: (): IState => {
    return {
      employees: [],
      customers: []
    };
  },
  persist: true,
  actions: {
    setEmployees() {
      fetchListing(
        runtimeConfig.public.authBaseUrl + routes.LIST_USERS,
        {
          limit_start: 0,
          limit_count: 100,
          type: "employee",
        },
        true
      ).then((response: any) => {
        this.employees= response?.value?.data?.map((manager: any) => {
          return {
            text: manager.first_name + " " + manager.last_name,
            value: manager.id,
            first_name: manager.first_name,
            last_name: manager.last_name,
            phone: manager.phone
          };
        });
      });
    },
    // setCompanies() {
    //   showGenericListing(routes.COMPANY).then((response:any) => {
    //     this.customers = response?.data?.customers.map((customer: any) => {
    //       return {
    //         text: customer.name,
    //         value: customer.id,
    //       };
    //     });
    //   });
    // },
  },
});
