import { FilterPackages } from "@/types/filters";
import { gameFilters } from "./gameFilters";
import { platformFilters } from "./platformFilters";

export const filterPackages: FilterPackages = {
  game: gameFilters,
  platform: platformFilters,
  otherType: {
    filters: {},
    applyFilters: (params) => params,
    renderFilter: () => null,
  },
};
