import Post from "@/components/post";
import { getPostBySlug } from "@/lib/requests";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getPostBySlug(slug);

  return {
    title: data?.title ?? "Post not found",
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["post", slug],
    queryFn: () => getPostBySlug(slug),
  });

  return (
    <div className="max-w-7xl w-full px-3 xl:p-0 mx-auto">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Post slug={slug} />
      </HydrationBoundary>
    </div>
  );
}
