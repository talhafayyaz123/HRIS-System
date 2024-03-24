import { defineStore } from 'pinia';
import { IState } from "./types";

export const useProductStore = defineStore('product', {
    state: (): IState => {  // this is state
      return {
        productId: null,
        productVersion: [],
        productType: 'software',
      }
    },
    actions: {
        addProductData( prodData: any){
          this.productId = prodData.id;
          this.productVersion =  prodData?.versions?.map((ver: any) => {
          return {
            value: ver?.id,
            name: ver?.version,
          };
        });
        },
        setProductType(prodType:string){
          this.productType = prodType
        }
      },    
  })



  