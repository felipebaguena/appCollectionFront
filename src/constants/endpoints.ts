export const ENDPOINTS = {
  CREATE_USER: "/users",
  GET_USER_ME: "/users/me",
  UPDATE_USER: (id: string) => `/users/${id}`,
  DELETE_USER: (id: string) => `/users/${id}`,
  LOGIN: "/auth/login",
  GET_GAMES_HOME: "/games/home",
  GET_GAME: (id: string) => `/games/${id}`,
  SET_GAME: (id: string) => `/games/${id}`,
  GET_GAMES_DATATABLE: "/games/datatable",
  GET_GAME_IMAGES: "/images/game",
  SET_COVER: (imageId: number) => `/images/${imageId}/setCover`,
  GET_GENRES: "/genres",
  GET_GENRES_DATATABLE: "/genres/datatable",
  CREATE_GENRE: "/genres",
  GET_GENRE: (id: string) => `/genres/${id}`,
  UPDATE_GENRE: (id: string) => `/genres/${id}`,
  DELETE_GENRE: (id: string) => `/genres/${id}`,
  GET_PLATFORMS: "/platforms",
  GET_DEVELOPERS: "/developers",
  DELETE_GAME: (id: string) => `/games/${id}`,
  CREATE_GAME: "/games",
  UPLOAD_GAME_IMAGE: "/images",
  DELETE_IMAGE: (id: string) => `/images/${id}`,
  DELETE_MULTIPLE_IMAGES: "/images",
  GET_PLATFORMS_DATATABLE: "/platforms/datatable",
  CREATE_PLATFORM: "/platforms",
  GET_PLATFORM: (id: string) => `/platforms/${id}`,
  SET_PLATFORM: (id: string) => `/platforms/${id}`,
  DELETE_PLATFORM: (id: string) => `/platforms/${id}`,
  GET_DEVELOPERS_DATATABLE: "/developers/datatable",
  CREATE_DEVELOPER: "/developers",
  GET_DEVELOPER: (id: string) => `/developers/${id}`,
  UPDATE_DEVELOPER: (id: string) => `/developers/${id}`,
  DELETE_DEVELOPER: (id: string) => `/developers/${id}`,
  GET_GAMES_COLLECTION: "/games/collection",
  GET_PLATFORMS_MULTISELECT: (search: string) =>
    `/platforms/multiselect?search=${search}`,
  GET_GENRES_MULTISELECT: (search: string) =>
    `/genres/multiselect?search=${search}`,
  GET_DEVELOPERS_MULTISELECT: (search: string) =>
    `/developers/multiselect?search=${search}`,
  ADD_GAME_TO_COLLECTION: "/user-games/me",
  GET_USER_GAME_DETAILS: (id: string) => `/user-games/${id}/details`,
  UPDATE_USER_GAME: (id: string) => `/user-games/${id}`,
  DELETE_USER_GAME: (id: string) => `/user-games/${id}`,
};
