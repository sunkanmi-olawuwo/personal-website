import { PostMetadata } from "@/lib/types";
import { Card, CardContent, CardHeader } from "./ui/card";
import Link from "next/link";
import Image from "next/image";

type Props = {
  post: PostMetadata;
};

export default function BlogCard({ post }: Props) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
          <Image
            fill
            src={post.coverImage.url}
            alt={post.title}
            className="object-cover"
            sizes="(min-width: 1024px) 33vw, 100vw"
          />
        </div>
      </CardHeader>
      <CardContent>
        <h2 className="text-xl font-bold">
          <Link href={`/${post.slug}`} className="hover:underline">
            {post.title}
          </Link>
        </h2>
        <div className="mt-3 flex gap-3 items-center">
          {post?.author.profilePicture && (
            <Image
              src={post.author.profilePicture}
              alt={`${post.author.name} avatar`}
              width={28}
              height={28}
              className="h-7 w-7 rounded-full object-cover"
            />
          )}{" "}
          {post.author.name}
        </div>
        <p className="text-gray-500 line-clamp-4 mt-3">
          {post.subtitle || post.content.text}
        </p>
      </CardContent>
    </Card>
  );
}
