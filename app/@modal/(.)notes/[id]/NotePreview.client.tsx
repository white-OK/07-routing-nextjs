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
    enabled: Boolean(id),
    refetchOnMount: false,
  });

  const handleClose = () => {
    router.back();
  };

  return (
    <Modal isOpen={true} onClose={handleClose}>
      <div>
        {isLoading && <p>Loading note details...</p>}
        {isError && <p>Could not fetch note details.</p>}

        {note && (
          <article>
            {note.tag && <span>{note.tag}</span>}
            <h2>{note.title}</h2>
            <p>{note.content}</p>
          </article>
        )}
      </div>
    </Modal>
  );
}
