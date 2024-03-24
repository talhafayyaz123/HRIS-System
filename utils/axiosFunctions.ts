import axios from "axios";
export enum MethodType {
  "post" = "POST",
  "get" = "GET",
  "put" = "PUT",
  "delete" = "DELETE",
}
const runtimeConfig = useRuntimeConfig();
const api = axios.create({
  baseURL: runtimeConfig.public.backEndUrl + "/api",
});
const clientApi = axios.create({
  baseURL: runtimeConfig.public.authBaseUrl,
});
const mailService = axios.create({
  baseURL: runtimeConfig.public.mailServiceUrl,
});

export const getApiResponse = async (
    url: string,
    isAuth: boolean,
    req: MethodType,
    data?: unknown,
    params?: unknown,
    token?: string,
    responseType?: string
) => {
  const jwt =
    token || (isAuth ? JSON.parse(localStorage.getItem("token") as any) : "");

  const config = {
    url,
    data,
    params,
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    method: req,
    responseType
  };
  const result = await api(config);
  return result.data;
};

export const specificApiResponse = async (
    url: string,
    isAuth: boolean,
    req: MethodType,
    data?: unknown,
    params?: unknown,
    token?: string
) => {
  const jwt =
      token || (isAuth ? JSON.parse(localStorage.getItem("token") as any) : "");

  const config = {
    url,
    data,
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    method: req,
  };
  const result = await clientApi(config);
  return result.data;
};

export const mailServiceResponse = async (
    url: string,
    isAuth: boolean,
    req: MethodType,
    data?: unknown,
) => {
  const jwt =
      isAuth ? JSON.parse(localStorage.getItem("token") as any) : "";

  const config = {
    data,
    url,
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    method: req,
  };
  const result = await mailService(config);
  return result.data;
};

export const nuxtResponse = async(
  url: string,
  isAuth: boolean,
  req: MethodType,
  query?: unknown,
  body?: unknown,
  isGeneric:unknown
  )=>{


  const jwt = (isAuth ? JSON.parse(localStorage.getItem("token") as any) : "");

  if(body === undefined || body !== null){
    var  config :any= {
      query,
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      method: req
    };

    if(isGeneric){
      var baseURL=url;
    }else{
       var baseURL= runtimeConfig.public.backEndUrl + "/api"+url;
    }  
  

  }else{
    var config :any= {
      query,
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      method: req,
      body,
    };
    var baseURL= runtimeConfig.public.backEndUrl + "/api"+url;
  }
  const response = await useFetch(baseURL, config);
  return response.data;

}


