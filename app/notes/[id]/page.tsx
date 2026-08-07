// import {
//   QueryClient,
//   HydrationBoundary,
//   dehydrate,
// } from "@tanstack/react-query";
// import { fetchNoteById } from "@/lib/api";
// import NoteDetailsClient from "./NoteDetails.client";

// interface PageProps {
//   params: Promise<{ id: string }>;
// }

// export default async function NoteDetailsPage({ params }: PageProps) {
//   const { id } = await params;
//   const queryClient = new QueryClient();

//   await queryClient.prefetchQuery({
//     queryKey: ["note", id],
//     queryFn: () => fetchNoteById(id),
//   });

//   return (
//     <HydrationBoundary state={dehydrate(queryClient)}>
//       <NoteDetailsClient />
//     </HydrationBoundary>
//   );
// }
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import NotePreviewClient from "../../@modal/(.)notes/[id]/NotePreview.client";

interface NotePreviewProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function NotePreview({ params }: NotePreviewProps) {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreviewClient id={id} />
    </HydrationBoundary>
  );
}
