import { authFetchRequestHeader } from "./auth-fetch-request-header";
const runtimeConfig = useRuntimeConfig();
const baseUrl = runtimeConfig.public.authBaseUrl;
export const authService = {
  login,
  listUser,
  logout,
};
async function sendRequest(url: any, options: any) {
  const response = await fetch(baseUrl + url, options);
    return await response.json();
}

async function login(mail: any, password:any, remember:boolean) {
  const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mail, password, remember })
  };
  return fetch(baseUrl+"/login", requestOptions)
      .then(handleResponse)
      .then(response => {
          localStorage.setItem('token', JSON.stringify(response.token))
          localStorage.setItem(
            "refresh_token",
            response?.refresh_token
          );
          localStorage.setItem(
            "roles",
            JSON.stringify(response?.token_info?.roles ?? [])
          );
          localStorage.setItem(
            "permissions",
            JSON.stringify(response?.token_info?.permissions ?? [])
          );
          localStorage.setItem(
            "scopes",
            JSON.stringify(response?.token_info?.scopes ?? [])
          );
          localStorage.setItem(
            "user_id",
            response?.token_info?.user_id
          );
          localStorage.setItem(
            "types",
            JSON.stringify(response?.token_info?.types ?? {})
          );
          localStorage.setItem(
            "user",
            JSON.stringify(response?.token_info?.user) ?? "{}");
          localStorage.setItem("authenticated", JSON.stringify(true));
          console.log('res', response);
        return response;
      });
}

async function listUser(token: any, payload: any) {
  const requestOptions = authFetchRequestHeader(token, "GET");
  if (!!requestOptions)
    return sendRequest(`/list-user-by-id?id=${payload?.id}`, requestOptions);
  return Promise.reject(new Error("Request options not available"));
}

function logout() {
  // remove user from local storage to log user out
  localStorage.removeItem("token");
  localStorage.removeItem("lang");
  localStorage.removeItem("user");
  localStorage.removeItem("user_id");
  localStorage.removeItem("type");
  localStorage.removeItem("roles");
  localStorage.removeItem("permissions");
  localStorage.removeItem("scopes");
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("authenticated");
  window.sessionStorage.removeItem("notificationMessages");
  //this.$store.commit("permission/permissions", []);
}

function handleResponse(response:any) {
  return response.text().then((text:any) => {
      const data = text && JSON.parse(text);
      if (!response.ok) {
          if (response.status === 401) {
              // auto logout if 401 response returned from api
              logout();
              location.reload();
          }
          const error = (data && data.message) || response.statusText;
          return Promise.reject(error);
      }
      return data;
  });
}

