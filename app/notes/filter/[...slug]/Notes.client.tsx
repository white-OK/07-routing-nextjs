"use client";

import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";

import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";

import { fetchNotes, type FetchNotesResponse } from "@/lib/api";
import css from "./NotesPage.module.css";

interface NotesClientProps {
  tag: string;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  const handleDebouncedSearch = useDebouncedCallback((value: string) => {
    setDebouncedSearch(value);
    setPage(1);
  }, 300);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    handleDebouncedSearch(value);
  };

  const { data, isLoading, isError } = useQuery<FetchNotesResponse, Error>({
    queryKey: ["notes", tag, page, debouncedSearch],
    queryFn: () =>
      fetchNotes({
        tag: tag === "all" ? undefined : tag,
        page,
        perPage: 12,
        search: debouncedSearch,
      }),
    placeholderData: keepPreviousData,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={css.container}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />

        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}
      </header>

      {isError && (
        <p className={css.status}>
          Something went wrong. Could not fetch notes.
        </p>
      )}
      {isLoading && <p className={css.status}>Loading, please wait...</p>}

      {!isLoading && !isError && notes.length === 0 && (
        <p className={css.empty}>
          {debouncedSearch
            ? "No notes found matching your search."
            : "No notes available."}
        </p>
      )}

      {!isLoading && !isError && notes.length > 0 && <NoteList notes={notes} />}
    </div>
  );
}
