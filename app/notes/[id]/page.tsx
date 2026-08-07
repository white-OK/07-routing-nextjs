// import {
//   QueryClient,
//   dehydrate,
//   HydrationBoundary,
// } from "@tanstack/react-query";
// import { fetchNoteById } from "@/lib/api";
// import NotePreviewClient from "../../@modal/(.)notes/[id]/NotePreview.client";

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
import Link from "next/link";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import css from "./NoteDetails.module.css"; // Перевірте назву вашого CSS-модуля для сторінки деталізації

interface NotePreviewProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function NotePage({ params }: NotePreviewProps) {
  const { id } = await params;
  const queryClient = new QueryClient();

  // Префетчимо дані для SSR
  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  // Отримуємо нотатку
  const note = await fetchNoteById(id);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className={css.container}>
        <Link href="/notes/filter/all" className={css.backLink}>
          ← Back to all notes
        </Link>

        <article className={css.card}>
          {note?.tag && <span className={css.tag}>{note.tag}</span>}
          <h1 className={css.title}>{note?.title}</h1>
          <p className={css.content}>{note?.content}</p>
        </article>
      </main>
    </HydrationBoundary>
  );
}
