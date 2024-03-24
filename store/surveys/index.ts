import {defineStore} from 'pinia';

export const useSurveysStore = defineStore('my-surveys', {
    state: () => ({
        id: null,
        surveys: [],
        errorList: {},
        allOptions: {},
        allConditions: {},
    }),
    actions: {
        setId(payload) {
            this.id = payload;
        },
        setSurveys(payload) {
            this.surveys = payload;
        },
        setErrorList(payload) {
            this.errorList = payload;
        },
        setAllOptions(payload) {
            this.allOptions = payload;
        },
        setAllConditions(payload) {
            this.allConditions = payload;
        },
    },
});
