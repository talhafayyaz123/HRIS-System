import { defineStore } from "pinia";
import { IState } from './types';

export const useNotificationStore = defineStore("notification", {
  state: (): IState => {
    return {
        type: null,
        message: null
    };
  },

  actions: {
    success(message: string) {
        this.type = 'success';
        this.message = message;
    },
    error(message: string) {
        this.type = 'danger';
        this.message = message;
    },
    clear(message: string) {
        this.type = null;
        this.message = null;
    }
  },
});
