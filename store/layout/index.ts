import { defineStore } from "pinia";
import { IState } from './types';

export const useLayoutStore = defineStore("layout", {
  state: (): IState => {
    return {
      layoutType: "vertical",
      layoutWidth: "fluid",
      leftSidebarType: "dark",
      leftSidebarSize: "default",
      menuPosition: "fixed",
      topbar: "light",
      loader: false,
    };
  },

  actions: {
    changeLayoutType(layoutType: string) {
      this.layoutType = layoutType;
    },

    changeLayoutWidth(layoutWidth: string) {
      this.layoutWidth = layoutWidth;
    },

    changeLeftSidebarType(leftSidebarType: string) {
      this.leftSidebarType = leftSidebarType;
    },

    changeLeftSidebarSize(leftSidebarSize: string) {
      this.leftSidebarSize = leftSidebarSize;
    },
    CHANGE_TOPBAR(topbar: string) {
      this.topbar = topbar;
    },
    changeLoaderValue(loader: boolean) {
      this.loader = loader;
    },

    changeMenuPosition(menuPosition: string) {
      this.menuPosition = menuPosition;
    },
  },
});
