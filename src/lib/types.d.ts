export type PublicationName = {
  publication: {
    title: string;
    displayTitle?: string;
    favicon?: string;
  };
};

export type Tag = {
  id: string;
  name: string;
  slug: string;
};

export type PostMetadata = {
  id?: string;
  title: string;
  subtitle?: string;
  slug: string;
  publishedAt?: string;
  readingMinutes?: number;
  content: {
    text: string;
  };
  coverImage: {
    url: string;
  };
  author: {
    name: string;
    profilePicture?: string;
  };
  tags: Tag[];
};

export type PostEdge = {
  node: PostMetadata;
  cursor: string;
};

export type PostDetails = {
  id?: string;
  slug?: string;
  title: string;
  subtitle?: string;
  publishedAt?: string;
  readingMinutes?: number;
  coverImage: {
    url: string;
  };
  content: {
    html: string;
    text?: string;
  };
  author: {
    name: string;
    profilePicture?: string;
    bio?: string;
  };
  tags: Tag[];
};

export type GetPostsResponse = {
  publication: {
    posts: {
      edges: PostEdge[];
    };
  };
};

export type GetPostsArgs = {
  first?: number;
  pageParam?: string;
  tagSlug?: string;
};

export type SubscribeToNewsletterResponse = {
  subscribeToNewsletter: {
    status: string;
  };
};

export type GetPostBySlugResponse = {
  publication: {
    post: PostDetails | null;
  };
};
