import { FilterPackages } from "@/types/filters";
import { gameFilters } from "./gameFilters";
import { platformFilters } from "./platformFilters";
import { genreFilters } from "./genreFilter";
import { developerFilters } from "./developerFilters";
import { articleFilters } from "./articleFilters";

export const filterPackages: FilterPackages = {
  game: gameFilters,
  platform: platformFilters,
  genre: genreFilters,
  developer: developerFilters,
  article: articleFilters,
  otherType: {
    filters: {},
    applyFilters: (params) => params,
    renderFilter: () => null,
  },
};
