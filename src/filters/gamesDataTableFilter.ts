import { BaseFilter, FilterPackage } from "@/types/filters";
import { DataTableParams } from "@/types/dataTable";
import { Game } from "@/types/game";

interface GameFilter extends BaseFilter {
  search: string;
}

export const gamesDataTableFilter: FilterPackage<Game, GameFilter> = {
  filters: {
    search: "",
  },
  applyFilters: (params: DataTableParams<Game, GameFilter>) => {
    const { search } = params.filters;
    return {
      filters: {
        search: search || "",
      },
    };
  },
};
