import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, HttpStatusCode } from 'axios';

const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_ROOT}`,
  headers: {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Access-Control-Allow-Origin': `${process.env.NEXT_PUBLIC_APP_ROOT}`,
    'content-type': 'application/json;charset=utf-8',
  },
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => handleSuccessResponse(response),
  (error) => handleErrorResponse(error)
);

const handleSuccessResponse = (res: AxiosResponse): any => {
  return res;
};

const handleErrorResponse = (res: AxiosError): any => {
  console.error(res);
  switch (res.response?.status) {
    case HttpStatusCode.BadRequest:
      throw res;
    case HttpStatusCode.Unauthorized:
      location.href = '/login';
      break;
    case HttpStatusCode.Forbidden:
      location.href = '/';
      break;
    case HttpStatusCode.PaymentRequired:
      location.href = '/user/payment';
      break;
    case HttpStatusCode.NotFound:
      console.error('画面が見つかりません。');
      break;
    case HttpStatusCode.ServiceUnavailable:
      console.error('メンテナンス');
      break;
    default:
    // location.href = '/error';
  }
};

export const http = {
  get: async (url: string, params?: any): Promise<AxiosResponse> => {
    return await axiosInstance.get(url, { params: params });
  },
  post: async (url: string, params?: any, config?: AxiosRequestConfig) => {
    return await axiosInstance.post(url, params, config);
  },
  put: async (url: string, params?: any, config?: AxiosRequestConfig) => {
    return await axiosInstance.put(url, params, config);
  },
  delete: async (url: string) => {
    return await axiosInstance.delete(url);
  },
};
