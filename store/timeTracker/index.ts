import { defineStore } from 'pinia';
import { IState } from './types';

export const useTimeTrackerStore = defineStore('time-tracker', {
  state: (): IState => {  
    return {
      filters: {
        date: new Date().toJSON().slice(0, 10),
        customerId: "",
        userId: localStorage.getItem("user_id") ?? null
      },
      startTime : "08:00:00",
      timeTrackerRecord:[]
    }
  },
  getters: {},
  actions: {},
})



