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
  GET_PLATFORMS: "/platforms",
  GET_DEVELOPERS: "/developers",
  DELETE_GAME: (id: string) => `/games/${id}`,
  CREATE_GAME: "/games",
  UPLOAD_GAME_IMAGE: "/images",
  DELETE_IMAGE: (id: string) => `/images/${id}`,
  DELETE_MULTIPLE_IMAGES: "/images",
  GET_PLATFORMS_DATATABLE: "/platforms/datatable",
};
