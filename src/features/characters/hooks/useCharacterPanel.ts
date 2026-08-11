"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { SEARCH_DEBOUNCE_MS } from "@/core/config/constants";
import { useDebounce } from "@/core/hooks/useDebounce";
import { characterPageQuery } from "../queries";
import { EMPTY_CHARACTER_PAGE } from "../types/character.types";
import { useCharacterFilters } from "./useCharacterFilters";

export function useCharacterPanel() {
  const { filters, search, filterByStatus, goToPage } = useCharacterFilters();
  const settledSearchTerm = useDebounce(filters.searchTerm, SEARCH_DEBOUNCE_MS);

  const { data, isPending, isError, isPlaceholderData, refetch } = useQuery({
    ...characterPageQuery({
      page: filters.page,
      name: settledSearchTerm || undefined,
      status: filters.status ?? undefined,
    }),
    placeholderData: keepPreviousData,
  });

  const page = data ?? EMPTY_CHARACTER_PAGE;

  return {
    characters: page.characters,
    currentPage: page.currentPage,
    totalPages: page.totalPages,
    totalCount: page.totalCount,
    isLoading: isPending,
    isChangingPage: isPlaceholderData,
    isError,
    retry: refetch,
    searchTerm: filters.searchTerm,
    status: filters.status,
    search,
    filterByStatus,
    goToPage,
  };
}
