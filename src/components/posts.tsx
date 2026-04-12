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
      <div className="col-span-1 lg:col-span-3 w-full flex justify-center my-5">
        <Button
          className="w-full"
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
