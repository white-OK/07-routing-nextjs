// import {
//   QueryClient,
//   dehydrate,
//   HydrationBoundary,
// } from "@tanstack/react-query";
// import { fetchNoteById } from "@/lib/api";
// import NotePreviewClient from "./NotePreview.client";

// interface NotePreviewProps {
//   params: Promise<{
//     id: string;
//   }>;
// }

// export default async function NotePreview({ params }: NotePreviewProps) {
//   const { id } = await params;
//   const queryClient = new QueryClient();

//   await queryClient.prefetchQuery({
//     queryKey: ["note", id],
//     queryFn: () => fetchNoteById(id),
//   });

//   return (
//     <HydrationBoundary state={dehydrate(queryClient)}>
//       <NotePreviewClient id={id} />
//     </HydrationBoundary>
//   );
// }
"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import Modal from "@/components/Modal/Modal";

interface NoteModalProps {
  params: Promise<{ id: string }>;
}

export default function NoteModalPage({ params }: NoteModalProps) {
  const router = useRouter();
  const { id } = use(params);

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
