"use client";

import { getPostBySlug } from "@/lib/requests";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { notFound } from "next/navigation";

type Props = {
  slug: string;
};

export default function Post({ slug }: Props) {
  const { data, isPending } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => getPostBySlug(slug),
  });

  if (isPending) {
    return <div className="py-16 text-center text-muted-foreground">Loading post...</div>;
  }

  if (!data) return notFound();

  const usesRemoteMockImage = data.coverImage.url.includes("images.unsplash.com/");

  return (
    <div>
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
        <Image
          fill
          preload
          src={data.coverImage.url}
          alt={data.title}
          className="object-cover"
          sizes="100vw"
          unoptimized={usesRemoteMockImage}
        />
      </div>
      <h1 className="text-4xl lg:text-6xl text-center leading-relaxed font-bold mt-5">
        {data.title}
      </h1>
      <p className="my-5 text-center text-xl text-gray-600 dark:text-gray-300">
        {data.subtitle}
      </p>
      <div className="my-5 flex items-center justify-center text-lg">
        {data.author.profilePicture && (
          <Image
            src={data.author.profilePicture}
            alt={`${data.author.name} avatar`}
            width={40}
            height={40}
            className="mr-5 rounded-full object-cover"
            unoptimized={data.author.profilePicture.includes("images.unsplash.com/")}
          />
        )}
        {data.author.name}
      </div>
      <div
        className="blog-content text-xl leading-loose flex flex-col gap-5 mt-5"
        dangerouslySetInnerHTML={{ __html: data.content.html }}
      ></div>
    </div>
  );
}
