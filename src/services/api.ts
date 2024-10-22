import { logMessage } from "@/contexts/LogContext";
import { showNotification } from "@/contexts/NotificationContext";

export const API_BASE_URL = "http://localhost:3000";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface RequestConfig {
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  silentSuccess?: boolean;
}

const getAuthToken = () => {
  return localStorage.getItem("access_token");
};

export const api = {
  request: async <T>(
    endpoint: string | ((id: string) => string),
    config: RequestConfig,
    id?: string
  ): Promise<T> => {
    const finalEndpoint =
      typeof endpoint === "function" ? endpoint(id!) : endpoint;
    const token = getAuthToken();

    let headers: Record<string, string> = {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...config.headers,
    };

    let body = config.body;

    // Si no es FormData, asumimos que es JSON
    if (!(config.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
      body = config.body ? JSON.stringify(config.body) : undefined;
    }

    const response = await fetch(`${API_BASE_URL}${finalEndpoint}`, {
      ...config,
      headers,
      body,
    });

    if (!response.ok) {
      const errorData = await response.text();
      logMessage(`PETICION ERRONEA: ${config.method} ${finalEndpoint}`);
      showNotification("Algo salió mal", "error");
      throw new Error(errorData || "Error en la petición");
    }

    if (config.method !== "GET" && !config.silentSuccess) {
      logMessage(
        `PETICIÓN EXITOSA ${response.status}: ${config.method} ${finalEndpoint}`
      );
      showNotification("Petición exitosa", "success");
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    } else {
      return response.text() as unknown as T;
    }
  },

  get: <T>(
    endpoint: string | ((id: string) => string),
    config?: Omit<RequestConfig, "method">,
    id?: string
  ) => api.request<T>(endpoint, { method: "GET", ...config }, id),

  post: <T>(endpoint: string, data: any, silentSuccess: boolean = false) =>
    api.request<T>(endpoint, { method: "POST", body: data, silentSuccess }),

  put: <T>(
    endpoint: string | ((id: string) => string),
    id: string,
    data: any,
    silentSuccess: boolean = false
  ) =>
    api.request<T>(endpoint, { method: "PUT", body: data, silentSuccess }, id),

  delete: <T>(
    endpoint: string | ((id: string) => string),
    id: string,
    silentSuccess: boolean = false
  ) => api.request<T>(endpoint, { method: "DELETE", silentSuccess }, id),

  postFormData: <T>(
    endpoint: string,
    formData: FormData,
    silentSuccess: boolean = false
  ) =>
    api.request<T>(endpoint, {
      method: "POST",
      body: formData,
      headers: {},
      silentSuccess,
    }),
};

export const getImageUrl = (imagePath: string): string => {
  if (imagePath.startsWith("http")) {
    return imagePath;
  }
  return `${API_BASE_URL}/${imagePath}`;
};
