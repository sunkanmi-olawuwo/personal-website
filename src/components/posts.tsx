"use client";

import { getPosts } from "@/lib/requests";
import { useInfiniteQuery } from "@tanstack/react-query";
import BlogCard from "./blog-card";
import { Button } from "./ui/button";

export default function Posts() {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam }) => getPosts({ pageParam }),
    getNextPageParam: (lastPage) =>
      lastPage.length < 9 ? undefined : lastPage[lastPage.length - 1].cursor,
    initialPageParam: "",
  });
  const postEdges = data?.pages.flatMap((group) => group ?? []) ?? [];

  return (
    <>
      {postEdges.map((post, index) => (
        <BlogCard
          key={post.cursor}
          post={post.node}
          loading={index < 3 ? "eager" : undefined}
        />
      ))}
      <div className="col-span-1 mt-4 flex w-full justify-center sm:mt-5 lg:col-span-3">
        <Button
          className="w-full rounded-full border-border/80 bg-[hsl(var(--surface))] px-8 py-6 text-sm font-semibold tracking-[0.18em] sm:w-auto"
          variant="outline"
          disabled={!hasNextPage || isFetchingNextPage}
          onClick={() => fetchNextPage()}
        >
          {isFetchingNextPage
            ? "Loading..."
            : hasNextPage
            ? "Load more"
            : "That's all for today!"}
        </Button>
      </div>
    </>
  );
}
