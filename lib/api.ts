import axios from "axios";
import type { Note, NewNote } from "../types/note";

const noteHubApi = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
});

noteHubApi.interceptors.request.use((config) => {
  const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  params: FetchNotesParams = {},
): Promise<FetchNotesResponse> => {

  const queryParams: Record<string, any> = {
    page: params.page ?? 1,
    perPage: params.perPage ?? 12,
  };

  if (params.search) {
    queryParams.search = params.search;
  }

  if (params.tag && params.tag !== "all") {
    queryParams.tag = params.tag;
  }

  const response = await noteHubApi.get<FetchNotesResponse>("/notes", {
    params: queryParams,
  });

  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await noteHubApi.get<Note>(`/notes/${id}`);
  return response.data;
};

export const createNote = async (newNote: NewNote): Promise<Note> => {
  const response = await noteHubApi.post<Note>("/notes", newNote);
  return response.data;
};

export const deleteNote = async (noteId: string): Promise<Note> => {
  const response = await noteHubApi.delete<Note>(`/notes/${noteId}`);
  return response.data;
};
