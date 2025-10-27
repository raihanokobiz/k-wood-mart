import { apiBaseUrl } from "@/config/config";

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface ApiRequestOptions<T = unknown> {
  endpoint: string;
  method?: RequestMethod;
  body?: T;
  headers?: HeadersInit;
}

export const apiRequest = async <T = unknown>({
  endpoint,
  method = 'GET',
  body,
  headers = {},
}: ApiRequestOptions): Promise<T> => {



  const res = await fetch(`${apiBaseUrl}${endpoint}`
    , {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...(typeof body !== 'undefined' ? { body: JSON.stringify(body) } : {}),
  }
);
  const result = await res.json();


  return result;
};
