export const ENDPOINTS = {
  CREATE_USER: "/users",
  GET_USER_ME: "/users/me",
  GET_USER_STATS: "/users/me/stats",
  GET_USER_YEAR_STATS: "/users/me/yearly-stats",
  UPDATE_USER_ME: "/users/me",
  UPDATE_USER: (id: string) => `/users/${id}`,
  UPDATE_USER_AVATAR: "/users/me/avatar",
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
  GET_USER_GAMES_COLLECTION: "/user-games/collection",
  GET_ARTICLES_DATATABLE: "/articles/datatable",
  GET_ARTICLE: (id: string) => `/articles/${id}`,
  SET_ARTICLE: (id: string) => `/articles/${id}`,
  DELETE_ARTICLE: (id: string) => `/articles/${id}`,
  CREATE_ARTICLE: "/articles",
  GET_GAMES_SEARCH: (title: string) => `/games/search?title=${title}`,
  GET_ACTIVE_TEMPLATES: "/article-templates/active",
  UPLOAD_ARTICLE_IMAGE: "/article-images",
  GET_ARTICLE_IMAGES: (articleId: string) =>
    `/article-images/article/${articleId}`,
  GET_GAME_ARTICLE_IMAGES: (gameId: string) => `/article-images/game/${gameId}`,
  UPDATE_ARTICLE_IMAGES: (articleId: string) => `/articles/${articleId}/images`,
  DELETE_ARTICLE_IMAGE: (id: string) => `/article-images/${id}`,
  UPLOAD_GAME_ARTICLE_IMAGE: (gameId: string) =>
    `/article-images/game/${gameId}/upload`,
  SET_ARTICLE_COVER: "/article-images/set-cover",
  SCHEDULE_ARTICLE: (id: string) => `/articles/${id}/schedule`,
  PUBLISH_ARTICLE: (id: string) => `/articles/${id}/publish`,
  UNPUBLISH_ARTICLE: (id: string) => `/articles/${id}/unpublish`,
  GET_ARTICLES_HOME: "/articles/home",
  GET_TOP_RATED_GAMES: "/games/top-rated",
  GET_ALL_ARTICLES: (page: number, limit: number, gameId?: number) =>
    `/articles/all-articles?page=${page}&limit=${limit}${
      gameId ? `&gameId=${gameId}` : ""
    }`,
  GET_USER_FRIENDS: "/users/me/friends",
  GET_FRIEND_PROFILE: (friendId: string) =>
    `/users/me/friends/${friendId}/detail`,
  GET_UNREAD_MESSAGES: "/users/me/messages/unread-count",
  GET_USER_CONVERSATIONS: "/users/me/conversations",
  GET_FRIEND_MESSAGES: (friendId: string) =>
    `/users/me/friends/${friendId}/messages`,
  SEND_FRIEND_MESSAGE: (friendId: string) =>
    `/users/me/friends/${friendId}/messages`,
  GET_BASIC_USERS: (nik?: string) => `/users/basic${nik ? `?nik=${nik}` : ""}`,
  SEND_FRIEND_REQUEST: "/users/me/friends/requests",
  GET_FRIEND_REQUESTS: "/users/me/friends/requests",
  ANSWER_FRIEND_REQUEST: (requestId: number) =>
    `/users/me/friends/requests/${requestId}`,
  CREATE_ARTICLE_COMMENT: (articleId: string) =>
    `/articles/comments/article/${articleId}`,
  GET_ARTICLE_COMMENTS: (articleId: string, page: number, limit: number) =>
    `/articles/comments/article/${articleId}?page=${page}&limit=${limit}`,
  UPDATE_ARTICLE_COMMENT: (commentId: string) =>
    `/articles/comments/${commentId}`,
  DELETE_ARTICLE_COMMENT: (commentId: string) =>
    `/articles/comments/${commentId}`,
};
