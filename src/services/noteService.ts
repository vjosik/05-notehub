import axios from "axios";
import type { Note } from "../types/note";

const ENDPOINT = "/notes";
const API_KEY = import.meta.env.VITE_NOTEHUB_TOKEN;

const apiClient = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${API_KEY}`,
  },
});

interface FetchNotesParams {
  search?: string;
  tag?: string;
  page?: number;
  perPage?: number;
  sortBy?: string;
}

interface FetchNotesResponce {
  notes: Note[];
  totalPages: number;
}

interface CreateNoteBody {
  title: string;
  content: string;
  tag: string;
}

export async function fetchNotes(params: FetchNotesParams) {
  const { data } = await apiClient.get<FetchNotesResponce>(ENDPOINT, {
    params,
  });
  return data;
}

export async function createNote(body: CreateNoteBody) {
  const { data } = await apiClient.post<Note>(ENDPOINT, body);
  return data;
}

export async function deleteNote(id: Note["id"]) {
  const { data } = await apiClient.delete<Note>(`${ENDPOINT}/${id}`);
  return data;
}
