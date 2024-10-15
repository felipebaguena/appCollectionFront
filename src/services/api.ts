export const API_BASE_URL = "http://localhost:3000";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface RequestConfig {
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
}

export const api = {
  request: async <T>(
    endpoint: string | ((id: string) => string),
    config: RequestConfig,
    id?: string
  ): Promise<T> => {
    const finalEndpoint =
      typeof endpoint === "function" ? endpoint(id!) : endpoint;
    const response = await fetch(`${API_BASE_URL}${finalEndpoint}`, {
      ...config,
      headers: {
        "Content-Type": "application/json",
        ...config.headers,
      },
      body: config.body ? JSON.stringify(config.body) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error en la petición");
    }

    return response.json();
  },

  get: <T>(
    endpoint: string | ((id: string) => string),
    config?: Omit<RequestConfig, "method">,
    id?: string
  ) => api.request<T>(endpoint, { method: "GET", ...config }, id),

  post: <T>(endpoint: string, data: any) =>
    api.request<T>(endpoint, { method: "POST", body: data }),
  put: <T>(
    endpoint: string | ((id: string) => string),
    id: string,
    data: any
  ) => api.request<T>(endpoint, { method: "PUT", body: data }, id),
  delete: <T>(endpoint: string | ((id: string) => string), id: string) =>
    api.request<T>(endpoint, { method: "DELETE" }, id),
};

export const getImageUrl = (imagePath: string): string => {
  if (imagePath.startsWith("http")) {
    return imagePath;
  }
  return `${API_BASE_URL}/${imagePath}`;
};
