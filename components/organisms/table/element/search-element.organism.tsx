import { Input } from "antd";
import { onSearchTableSubject } from "../../../../constants/observables";

interface SearchElementProps {}

export function SearchElement({}: SearchElementProps) {
  function handleOnSearch(value: string) {
    onSearchTableSubject.next(value);
  }

  return <Input.Search onSearch={handleOnSearch} />;
}
