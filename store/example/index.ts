import { defineStore } from 'pinia';
import { IState } from './types';

export const useUserStore = defineStore('user', {
    state: (): IState => {  // this is state
      return {
        userList: [{name: 'ali', age : 21}],
        user: null,
        count: 0,
        result: null,
      }
    },
    getters: {
        getCounter : (state) => state.count,
        doubleCount(): number { 
            return this.count * 2
        },
        getUserList: (state) => state.userList,
        user: (state) => state.user,
      },

    actions: {
        increment() {
          this.count++
        },
        // we can pass any set of arguments and return anything/update state
        incrementNumber(num:number) {
            this.count = this.count +num
        },
        // is action is async,
        async registerUser(login:any, password: any) {
            // try {
            //   this.result = await api.post({ login, password })
            // } catch (error) {
            //     console.log(error)
            // }
          },
      },    
  })



  