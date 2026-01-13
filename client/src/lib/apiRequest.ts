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
  const res = await fetch(`${apiBaseUrl}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...(typeof body !== 'undefined' ? { body: JSON.stringify(body) } : {}),
  });

  // Check if response is ok
  if (!res.ok) {
    const contentType = res.headers.get('content-type');
    let errorMessage = `HTTP ${res.status}`;

    try {
      if (contentType && contentType.includes('application/json')) {
        const errorData = await res.json();
        errorMessage = errorData?.message || errorMessage;
      } else {
        const text = await res.text();
        // Extract error from HTML if it's an error page
        if (text.includes('<!DOCTYPE')) {
          errorMessage = `Server error (${res.status}) - check server logs`;
        } else {
          errorMessage = text.substring(0, 200);
        }
      }
    } catch (e) {
      errorMessage = `HTTP ${res.status} - Invalid response format`;
    }

    throw new Error(errorMessage);
  }

  const result = await res.json();
  return result;
};
