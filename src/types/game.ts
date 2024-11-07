export interface Platform {
  id: number;
  name: string;
  code: string;
}

export interface Genre {
  id: number;
  name: string;
  code: string;
}

export interface Developer {
  id: number;
  name: string;
  code: string;
}

export interface Image {
  id: number;
  filename: string;
  path: string;
  isCover: boolean;
  gameId: number;
}

export interface Game {
  id: number;
  title: string;
  releaseYear: number;
  description: string;
  coverId: number | null;
  platforms: Platform[];
  genres: Genre[];
  developers: Developer[];
  images: Image[];
  inCollection?: boolean;
}

export interface GameResponse {
  data: Game[];
  total: number;
}
