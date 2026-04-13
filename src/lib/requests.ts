import request, { gql } from "graphql-request";

import { blogDataMode, env, isHashnodeConfigured } from "./env";
import {
  getMockPostBySlug,
  getMockPostsPage,
  mockPostEdges,
  mockPublication,
} from "./mock-blog-data";
import {
  GetPostBySlugResponse,
  GetPostsArgs,
  GetPostsResponse,
  PublicationName,
  SubscribeToNewsletterResponse,
} from "./types";

const endpoint = env.NEXT_PUBLIC_HASHNODE_ENDPOINT ?? "https://gql.hashnode.com";
const publicationId = env.NEXT_PUBLIC_HASHNODE_PUBLICATION_ID;

function requireLiveHashnodeConfig() {
  if (isHashnodeConfigured && publicationId) {
    return;
  }

  throw new Error(
    "Live blog data mode requires NEXT_PUBLIC_HASHNODE_ENDPOINT and NEXT_PUBLIC_HASHNODE_PUBLICATION_ID."
  );
}

async function requestBlogData<T>(query: string, variables: Record<string, unknown>) {
  if (blogDataMode === "mock") {
    return null;
  }

  if (blogDataMode === "live") {
    requireLiveHashnodeConfig();

    return request<T>(endpoint, query, variables);
  }

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

  const response = await requestBlogData<PublicationName>(query, {
    publicationId,
  });

  if (!response) {
    return mockPublication;
  }

  return {
    title: response.publication.title,
    displayTitle: response.publication.displayTitle,
    favicon: response.publication.favicon,
  };
}

export async function getPosts({
  first = 9,
  pageParam = "",
  tagSlug,
}: GetPostsArgs) {
  const postsFilterDeclaration = tagSlug ? ", $tagSlugs: [String!]" : "";
  const postsFilterArgument = tagSlug ? ", filter: { tagSlugs: $tagSlugs }" : "";
  const query = gql`
    query getPosts($publicationId: ObjectId!, $first: Int!, $after: String${postsFilterDeclaration}) {
      publication(id: $publicationId) {
        posts(first: $first, after: $after${postsFilterArgument}) {
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
              tags {
                id
                name
                slug
              }
            }
            cursor
          }
        }
      }
    }
  `;

  const response = await requestBlogData<GetPostsResponse>(query, {
    publicationId,
    first,
    after: pageParam,
    ...(tagSlug ? { tagSlugs: [tagSlug] } : {}),
  });

  return response?.publication.posts.edges ?? getMockPostsPage({ first, pageParam, tagSlug });
}

export async function subscribeToNewsletter(email: string) {
  if (blogDataMode === "mock" || !isHashnodeConfigured || !publicationId) {
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

  return request<SubscribeToNewsletterResponse>(endpoint, mutation, {
    publicationId,
    email,
  });
}

export async function getPostBySlug(slug: string) {
  const query = gql`
    query getPostBySlug($publicationId: ObjectId!, $slug: String!) {
      publication(id: $publicationId) {
        post(slug: $slug) {
          id
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
          tags {
            id
            name
            slug
          }
        }
      }
    }
  `;

  const response = await requestBlogData<GetPostBySlugResponse>(query, {
    publicationId,
    slug,
  });

  if (!response) {
    return getMockPostBySlug(slug);
  }

  return response.publication.post;
}

export const mockPostCount = mockPostEdges.length;
