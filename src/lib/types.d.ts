export type PublicationName = {
  publication: {
    title: string;
    displayTitle?: string;
    favicon?: string;
  };
};

export type PostMetadata = {
  title: string;
  subtitle?: string;
  slug: string;
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
};

export type PostEdge = {
  node: PostMetadata;
  cursor: string;
};

export type PostDetails = {
  title: string;
  subtitle?: string;
  coverImage: {
    url: string;
  };
  content: {
    html: string;
  };
  author: {
    name: string;
    profilePicture?: string;
  };
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
