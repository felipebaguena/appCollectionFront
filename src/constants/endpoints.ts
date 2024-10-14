export const ENDPOINTS = {
  CREATE_USER: "/users",
  GET_USER_ME: "/users/me",
  UPDATE_USER: (id: string) => `/users/${id}`,
  DELETE_USER: (id: string) => `/users/${id}`,
  LOGIN: "/auth/login",
  GET_GAMES_HOME: "/games/home",
  GET_GAME: (id: string) => `/games/${id}`,
  GET_GAMES_DATATABLE: "/games/datatable",
};
