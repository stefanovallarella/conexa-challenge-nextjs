"use client";

import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useCallback } from "react";
import { SEARCH_DEBOUNCE_MS } from "@/core/config/constants";
import { useDebounce } from "@/core/hooks/useDebounce";
import { characterPageQuery } from "../queries";
import { EMPTY_CHARACTER_PAGE } from "../types/character.types";
import { useCharacterFilters } from "./useCharacterFilters";

export function useCharacterPanel() {
  const { filters, search, filterByStatus, goToPage } = useCharacterFilters();
  const settledSearchTerm = useDebounce(filters.searchTerm, SEARCH_DEBOUNCE_MS);
  const queryClient = useQueryClient();

  const queryForPage = useCallback(
    (page: number) =>
      characterPageQuery({
        page,
        name: settledSearchTerm || undefined,
        status: filters.status ?? undefined,
      }),
    [settledSearchTerm, filters.status],
  );

  const { data, isPending, isError, isPlaceholderData, refetch } = useQuery({
    ...queryForPage(filters.page),
    placeholderData: keepPreviousData,
  });

  const page = data ?? EMPTY_CHARACTER_PAGE;

  const prefetchNextPage = useCallback(() => {
    if (page.currentPage >= page.totalPages) return;
    void queryClient.prefetchQuery(queryForPage(page.currentPage + 1));
  }, [queryClient, queryForPage, page.currentPage, page.totalPages]);

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
    prefetchNextPage,
  };
}
