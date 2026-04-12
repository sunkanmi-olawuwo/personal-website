import request, { gql } from "graphql-request";
import { env, isHashnodeConfigured } from "./env";
import {
  GetPostsArgs,
  GetPostsResponse,
  PostDetails,
  PostEdge,
  SubscribeToNewsletterResponse,
  PublicationName,
  GetPostBySlugResponse,
} from "./types";

const endpoint = env.NEXT_PUBLIC_HASHNODE_ENDPOINT ?? "https://gql.hashnode.com";
const publicationId = env.NEXT_PUBLIC_HASHNODE_PUBLICATION_ID;

const FALLBACK_BLOG_NAME = {
  title: "Personal Website",
  displayTitle: "Personal Website",
  favicon: "/favicon.ico",
};

const FALLBACK_POSTS: PostEdge[] = [
  {
    cursor: "fallback-welcome",
    node: {
      title: "Connect your Hashnode publication",
      subtitle: "The app is running locally with placeholder content.",
      slug: "welcome",
      content: {
        text: "Set NEXT_PUBLIC_HASHNODE_PUBLICATION_ID to load live posts from Hashnode.",
      },
      coverImage: {
        url: "/vercel.svg",
      },
      author: {
        name: "Personal Website",
      },
    },
  },
];

const FALLBACK_POST_BY_SLUG: Record<string, PostDetails> = {
  welcome: {
    title: "Connect your Hashnode publication",
    subtitle: "The app is running locally with placeholder content.",
    coverImage: {
      url: "/vercel.svg",
    },
    content: {
      html: `
        <p>This app has been upgraded and can now build without external services.</p>
        <p>Add <code>NEXT_PUBLIC_HASHNODE_PUBLICATION_ID</code> to load your live Hashnode content.</p>
      `,
    },
    author: {
      name: "Personal Website",
    },
  },
};

async function safeRequest<T>(query: string, variables: Record<string, unknown>) {
  if (!isHashnodeConfigured || !publicationId) {
    return null;
  }

  try {
    return await request<T>(endpoint, query, variables);
  } catch {
    return null;
  }
}

export async function getBlogName() {
  const query = gql`
    query getBlogName($publicationId: ObjectId!) {
      publication(id: $publicationId) {
        title
        displayTitle
        favicon
      }
    }
  `;

  const response = await safeRequest<PublicationName>(query, {
    publicationId,
  });

  if (!response) {
    return FALLBACK_BLOG_NAME;
  }

  return {
    title: response.publication.title,
    displayTitle: response.publication.displayTitle,
    favicon: response.publication.favicon,
  };
}

export async function getPosts({ first = 9, pageParam = "" }: GetPostsArgs) {
  const query = gql`
    query getPosts($publicationId: ObjectId!, $first: Int!, $after: String) {
      publication(id: $publicationId) {
        posts(first: $first, after: $after) {
          edges {
            node {
              id
              title
              subtitle
              slug
              content {
                text
              }
              coverImage {
                url
              }
              author {
                name
                profilePicture
              }
            }
            cursor
          }
        }
      }
    }
  `;

  const response = await safeRequest<GetPostsResponse>(query, {
    publicationId,
    first,
    after: pageParam,
  });

  return response?.publication.posts.edges ?? FALLBACK_POSTS.slice(0, first);
}

export async function subscribeToNewsletter(email: string) {
  if (!isHashnodeConfigured || !publicationId) {
    throw new Error(
      "Newsletter signups are unavailable until the Hashnode environment variables are configured."
    );
  }

  const mutation = gql`
    mutation subscribeToNewsletter($publicationId: ObjectId!, $email: String!) {
      subscribeToNewsletter(
        input: { email: $email, publicationId: $publicationId }
      ) {
        status
      }
    }
  `;

  return request<SubscribeToNewsletterResponse>(
    endpoint,
    mutation,
    {
      publicationId,
      email,
    }
  );
}

export async function getPostBySlug(slug: string) {
  const query = gql`
    query getPostBySlug($publicationId: ObjectId!, $slug: String!) {
      publication(id: $publicationId) {
        post(slug: $slug) {
          title
          subtitle
          coverImage {
            url
          }
          content {
            html
          }
          author {
            name
            profilePicture
          }
        }
      }
    }
  `;

  const response = await safeRequest<GetPostBySlugResponse>(query, {
    publicationId,
    slug,
  });

  return response?.publication.post ?? FALLBACK_POST_BY_SLUG[slug] ?? null;
}
