"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import Modal from "@/components/Modal/Modal";
import css from "./NotePreview.module.css";

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
    refetchOnMount: false, // Пам'ятаємо за попереднє зауваження ментора
  });

  const handleClose = () => {
    router.back();
  };

  return (
    <Modal isOpen={true} onClose={handleClose}>
      <div className={css.content}>
        {isLoading && <p>Loading note details...</p>}
        {isError && <p>Could not fetch note details.</p>}

        {note && (
          <article>
            {note.tag && <span className={css.tag}>{note.tag}</span>}
            <h2 className={css.title}>{note.title}</h2>
            <p className={css.body}>{note.content}</p>
          </article>
        )}
      </div>
    </Modal>
  );
}
