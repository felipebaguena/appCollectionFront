import { useState } from "react";
import { api } from "@/services/api";
import { ENDPOINTS } from "@/constants/endpoints";

interface User {
  name: string;
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
}

export const useUserActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUser = async (userData: User) => {
    setIsLoading(true);
    setError(null);

    try {
      await api.post(ENDPOINTS.CREATE_USER, userData);
      setIsLoading(false);
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error desconocido");
      setIsLoading(false);
      return false;
    }
  };

  const getUser = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("No se encontró el token de acceso");
      }

      const user = await api.get<User>(ENDPOINTS.GET_USER_ME, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIsLoading(false);
      return user;
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error desconocido");
      setIsLoading(false);
      return null;
    }
  };

  const updateUser = async (userData: { name: string }) => {
    setIsLoading(true);
    setError(null);

    try {
      await api.put<User>(ENDPOINTS.UPDATE_USER_ME, "", userData);
      setIsLoading(false);
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error desconocido");
      setIsLoading(false);
      return false;
    }
  };

  const deleteUser = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await api.delete(ENDPOINTS.DELETE_USER, id);
      setIsLoading(false);
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error desconocido");
      setIsLoading(false);
      return false;
    }
  };

  const login = async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post<LoginResponse>(
        ENDPOINTS.LOGIN,
        credentials,
        false, // silentSuccess
        { skipAuthRedirect: true }
      );
      setIsLoading(false);
      return { success: true, access_token: response.access_token };
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error desconocido");
      setIsLoading(false);
      return { success: false, access_token: "" };
    }
  };

  return {
    createUser,
    getUser,
    updateUser,
    deleteUser,
    login,
    isLoading,
    error,
  };
};
