import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchNotes } from "../../services/noteService";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import SearchBox from "../SearchBox/SearchBox";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import css from "./App.module.css";
import NoteForm from "../NoteForm/NoteForm";

function App() {
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const handlerOpenModal = () => setIsOpen(true);
  const handlerCloseModal = () => setIsOpen(false);

  const searchNote = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 500);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["fetchNotes", page, search],
    queryFn: () => fetchNotes({ page, perPage: 12, search }),
    placeholderData: keepPreviousData,
  });

  const notes = data?.notes || [];
  const totalPages = data?.totalPages || 1;

  return (
    <>
      <div className={css.app}>
        <header className={css.toolbar}>
          <SearchBox onSearch={searchNote} value={search} />
          {totalPages > 1 && (
            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
          )}
          <button className={css.button} onClick={handlerOpenModal}>
            Create note +
          </button>
          {isOpen && (
            <Modal onClose={handlerCloseModal}>
              <NoteForm onClose={handlerCloseModal} />
            </Modal>
          )}
        </header>
        {isLoading && <Loader />}
        {isError && <ErrorMessage />}
        {notes.length > 0 && <NoteList notes={notes} />}
      </div>
    </>
  );
}

export default App;
