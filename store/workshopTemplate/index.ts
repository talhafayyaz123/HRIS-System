import { defineStore } from 'pinia';

export const useWorkshopTemplateStore = defineStore('workshop', {
    state: () => {  // this is state
      return {
        selectedWidget: null,
        cards: [],
        selectedWidgetType: "",
        inputConfigurations: {
          widgets: {},
          groups: {},
        },
        isDragging: false,
        showPreview: false,
      }
    },    
    actions: {
      setSelectedWidget(value: any) {
        this.selectedWidget = value;
      },
      setCards(value: any) {
        this.cards = value;
      },
      setIsDragging(value: any) {
        this.isDragging = value;
      },
      setSelectedWidgetType(value: any) {
        this.selectedWidgetType = value;
      },
      setShowPreview(value: any) {
        this.showPreview = value;
      },

      setInputConfiguration(value: any) {
        this.inputConfigurations = value;
      },
      },    
  })



  