import { FilterPackages } from "@/types/filters";
import { gameFilters } from "./gameFilters";

export const filterPackages: FilterPackages = {
  game: gameFilters,
  otherType: {
    filters: {},
    applyFilters: (params) => params,
    renderFilter: () => null,
  },
};
