import "bootstrap/dist/css/bootstrap.min.css";
import { v4 as uuidV4 } from "uuid";
import { useMemo } from "react";
import {
  Navigate,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Tag } from "./type/Tag";
import { NoteData, RawNote } from "./type/Note";
import { useLocalStorage } from "./hook/useLocalStorage";
import { Container } from "react-bootstrap";
import { Note } from "./component/Note";
import { NoteList } from "./component/NoteList";
import { EditNote } from "./component/EditNote";
import { NewNote } from "./component/NewNote";

function App() {
  const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", []);
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", []);

  const notesWithTags = useMemo(() => {
    return notes.map((note) => {
      return {
        ...note,
        tags: tags.filter((tag) => note.tagIds.includes(tag.id)),
      };
    });
  }, [notes, tags]);

  function onCreateNote({ tags, ...data }: NoteData) {
    setNotes((prev) => {
      return [
        ...prev,
        { ...data, id: uuidV4(), tagIds: tags.map((tag) => tag.id) },
      ];
    });
  }

  function onUpdateNote(id: string, { tags, ...data }: NoteData) {
    setNotes((prevNotes) => {
      return prevNotes.map((note) => {
        if (note.id === id) {
          return { ...note, ...data, tagIds: tags.map((tag) => tag.id) };
        } else {
          return note;
        }
      });
    });
  }

  function onDeleteNote(id: string) {
    setNotes((prevNotes) => {
      return prevNotes.filter((note) => note.id !== id);
    });
  }

  function addTag(tag: Tag) {
    setTags((prev) => [...prev, tag]);
  }

  function updateTag(id: string, label: string) {
    setTags((prevTags) => {
      return prevTags.map((tag) => {
        if (tag.id === id) {
          return { ...tag, label };
        } else {
          return tag;
        }
      });
    });
  }

  function deleteTag(id: string) {
    setTags((prevTags) => {
      return prevTags.filter((tag) => tag.id !== id);
    });
  }

  const routes = createBrowserRouter([
    {
      path: "/",
      element: (
        <NoteList
          notes={notesWithTags}
          availableTags={tags}
          onUpdateTag={updateTag}
          onDeleteTag={deleteTag}
        />
      ),
      children: [
        { index: true, element: <Note onDelete={onDeleteNote} /> },
        {
          path: "edit",
          element: (
            <EditNote
              onSubmit={onUpdateNote}
              onAddTag={addTag}
              availableTags={tags}
            />
          ),
        },
      ],
    },
    {
      path: "/new",
      element: (
        <NewNote
          onSubmit={onCreateNote}
          onAddTag={addTag}
          availableTags={tags}
        />
      ),
    },
    { path: "*", element: <Navigate to="/" replace /> },
  ]);

  return (
    <Container className="my-4">
      <RouterProvider router={routes} />
    </Container>
  );
}

export default App;
