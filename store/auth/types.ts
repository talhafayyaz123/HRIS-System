export interface IState {
  authenticated: boolean;
  status: {};
  user: string | null;
  users: [];
  userPermissions: [];
  count: number;
  isPublic: boolean;
  token: string;
  language: string;
}
