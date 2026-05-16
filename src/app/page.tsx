import Posts from "@/components/posts";
import HomeHero from "@/components/home-hero";
import WritingMark from "@/components/writing-mark";
import { getPosts } from "@/lib/requests";
import type { PostEdge } from "@/lib/types";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

export const dynamic = "force-dynamic";

function getTagSlug(tagParam: string | string[] | undefined) {
  const rawTagSlug = Array.isArray(tagParam) ? tagParam[0] : tagParam;

  return rawTagSlug?.trim() || undefined;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string | string[] | undefined }>;
}) {
  const { tag } = await searchParams;
  const tagSlug = getTagSlug(tag);
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["posts", tagSlug ?? "all"],
    queryFn: ({ pageParam }) => getPosts({ pageParam, tagSlug }),
    getNextPageParam: (lastPage: PostEdge[]) =>
      lastPage.length < 9 ? undefined : lastPage[lastPage.length - 1].cursor,
    initialPageParam: "",
  });

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-4 pb-10 pt-6 sm:px-6 lg:px-8 lg:pt-10">
      <HomeHero />
      <section
        id="latest-writing"
        className="section-open page-reveal page-reveal-delay-2 pt-12 sm:pt-14 lg:pt-16"
        aria-labelledby="latest-writing-title"
      >
        <div className="relative flex flex-col gap-8 sm:gap-10">
          <div className="flex flex-col gap-4">
            <p className="font-display text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-primary/75">
              Journal
            </p>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-3">
                <h2
                  id="latest-writing-title"
                  className="text-balance font-display text-3xl font-bold tracking-[-0.04em] sm:text-4xl lg:text-5xl"
                >
                  Articles
                </h2>
                <p className="max-w-2xl text-pretty text-base leading-8 text-muted-foreground">
                  Thoughtful articles on software systems, AI applications, cloud
                  architecture, testing, and the practical decisions required to
                  build reliable software.
                </p>
              </div>
              <div className="w-full lg:max-w-[20.5rem] lg:self-center lg:pl-8">
                <WritingMark />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <HydrationBoundary state={dehydrate(queryClient)}>
              <Posts tagSlug={tagSlug} />
            </HydrationBoundary>
          </div>
        </div>
      </section>
    </main>
  );
}
