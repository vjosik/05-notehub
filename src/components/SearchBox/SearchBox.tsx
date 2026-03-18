import css from "./SearchBox.module.css";
import type { DebouncedState } from "use-debounce";

interface SearchBoxProps {
  onSearch: DebouncedState<React.Dispatch<React.SetStateAction<string>>>;
  value: string;
}

export default function SearchBox({ onSearch, value }: SearchBoxProps) {
  return (
    <input
      className={css.input}
      defaultValue={value}
      type="text"
      placeholder="Search notes"
      onChange={(event) => onSearch(event.target.value)}
    />
  );
}
