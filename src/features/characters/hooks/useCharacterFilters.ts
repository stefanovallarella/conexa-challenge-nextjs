"use client";

import { useCallback, useReducer } from "react";
import type { CharacterStatusFilter } from "@/core/config/constants";

export interface CharacterFiltersState {
  page: number;
  searchTerm: string;
  status: CharacterStatusFilter | null;
}

type CharacterFiltersAction =
  | { type: "searchChanged"; searchTerm: string }
  | { type: "statusChanged"; status: CharacterStatusFilter | null }
  | { type: "pageChanged"; page: number };

const INITIAL_FILTERS: CharacterFiltersState = {
  page: 1,
  searchTerm: "",
  status: null,
};

function characterFiltersReducer(
  state: CharacterFiltersState,
  action: CharacterFiltersAction,
): CharacterFiltersState {
  switch (action.type) {
    // Narrowing the results has to send the reader back to page one, or they
    // land on a page number the new result set may not even have.
    case "searchChanged":
      return { ...state, searchTerm: action.searchTerm, page: 1 };
    case "statusChanged":
      return { ...state, status: action.status, page: 1 };
    case "pageChanged":
      return { ...state, page: action.page };
  }
}

export function useCharacterFilters() {
  const [filters, dispatch] = useReducer(
    characterFiltersReducer,
    INITIAL_FILTERS,
  );

  const search = useCallback(
    (searchTerm: string) => dispatch({ type: "searchChanged", searchTerm }),
    [],
  );

  const filterByStatus = useCallback(
    (status: CharacterStatusFilter | null) =>
      dispatch({ type: "statusChanged", status }),
    [],
  );

  const goToPage = useCallback(
    (page: number) => dispatch({ type: "pageChanged", page }),
    [],
  );

  return { filters, search, filterByStatus, goToPage };
}
