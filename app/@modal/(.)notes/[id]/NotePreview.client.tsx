"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import Modal from "@/components/Modal/Modal";

interface NotePreviewClientProps {
  id: string;
}

export default function NotePreviewClient({ id }: NotePreviewClientProps) {
  const router = useRouter();

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  const handleClose = () => {
    router.back();
  };

  return (
    <Modal isOpen={true} onClose={handleClose}>
      {isLoading && <p>Loading note details...</p>}
      {isError && <p>Error loading note details.</p>}
      {note && (
        <article>
          <h2>{note.title}</h2>
          <p>
            <strong>Tag:</strong> {note.tag}
          </p>
          <div>{note.content}</div>
          <small>
            Created at: {new Date(note.createdAt).toLocaleDateString()}
          </small>
        </article>
      )}
    </Modal>
  );
}
