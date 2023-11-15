import { useOutletContext } from "react-router-dom";
import { Note } from "../type/Note";

export function useNote() {
  return useOutletContext<Note>()
}