import { authFetchRequestHeader } from "./auth-fetch-request-header";

const baseUrl = process.env.authBaseUrl;
export const permissionService = {
  permissionList,
};

async function sendRequest(url: any, options: any) {
  const response = await fetch(baseUrl + url, options);
  const data = await response.json();
  return data;
}
function permissionList(payload: any, token: string) {
  const requestOptions = authFetchRequestHeader(token);
  if (!!requestOptions) {
    const start = payload?.limit_start || 0;
    const count = payload?.limit_count || 10;
    return sendRequest(
      `/list-permissions?limit_start=${start}&limit_count=${count}`,
      requestOptions
    ).then(
      (res) => {
        console.log(res.json());
      /*   this.permissions = res?.data ?? [];
        this.permissionsNeeds = res?.data ?? [];
        this.count = res?.data?.count ?? 0;
        return res; */
        //this.$router.push({ path: "/permissions" });
      },
      (error) => {
       /*  notificationStore.error(
          "No user with given mail and password found or password is wrong"
        ); */
      }
    );
  }
  return Promise.reject(new Error("Request options not available"));
}
