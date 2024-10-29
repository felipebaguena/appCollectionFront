import { FilterPackages } from "@/types/filters";
import { gameFilters } from "./gameFilters";
import { platformFilters } from "./platformFilters";
import { genreFilters } from "./genreFilter";

export const filterPackages: FilterPackages = {
  game: gameFilters,
  platform: platformFilters,
  genre: genreFilters,
  otherType: {
    filters: {},
    applyFilters: (params) => params,
    renderFilter: () => null,
  },
};
