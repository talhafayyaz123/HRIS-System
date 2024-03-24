interface IUserInfo {
    name: string
    age: number
  }

export interface IState {
    userList: IUserInfo[]
    user: IUserInfo | null
    count: number
    result: null
}