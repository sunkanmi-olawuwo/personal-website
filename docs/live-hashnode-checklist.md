# Live Hashnode Checklist

Use this checklist when you want to test the site against a real Hashnode publication instead of the local mock data.

## Recommended Setup

- Use a separate staging publication instead of your main publication.
- Keep using an account and inbox you already control.
- For newsletter testing, prefer an email alias such as `you+hashnode-staging@example.com`.

Why:

- You can seed realistic content without polluting your main blog.
- Newsletter signups, tags, and article slugs stay isolated.
- You can safely test pagination and tag filtering with throwaway content.

## Environment

Copy `.env.example` to `.env.local` and set:

```env
NEXT_PUBLIC_BLOG_DATA_MODE=live
NEXT_PUBLIC_HASHNODE_ENDPOINT=https://gql.hashnode.com
NEXT_PUBLIC_HASHNODE_PUBLICATION_ID=your-staging-publication-id
```

## Content To Seed

Create enough content to exercise the real UI:

- `15-30` published posts total
- `3-5` tags reused across posts
- At least one tag with `10+` posts
- A mix of posts with and without subtitles
- Distinct slugs and cover images

This matters because the site loads `9` posts at a time and only shows `Load more` when more content exists.

## Local Run

Start the app:

```bash
pnpm dev
```

Useful routes to test:

- `/`
- `/?tag=backend#latest-writing`
- `/?tag=testing#latest-writing`
- `/<a-real-post-slug>`

## Smoke Test Checklist

- Home page loads live publication title and posts.
- The first `9` posts render on the home page.
- `Load more` appears when there are more than `9` posts.
- Clicking `Load more` appends the next cursor page.
- Tag pills appear on cards.
- Clicking a tag pill routes to `/?tag=<slug>#latest-writing`.
- The filtered view only shows posts with that tag.
- A tag with more than `9` posts still paginates correctly.
- A post page shows its tags and links back into the filtered journal view.
- Newsletter signup works only when live Hashnode is configured.

## Direct Hashnode Sanity Check

Before debugging the app, confirm the publication responds directly from Hashnode.

Use the endpoint:

```text
https://gql.hashnode.com
```

Test query:

```graphql
query VerifyPosts($publicationId: ObjectId!, $first: Int!, $after: String, $tagSlugs: [String!]) {
  publication(id: $publicationId) {
    title
    posts(first: $first, after: $after, filter: { tagSlugs: $tagSlugs }) {
      edges {
        cursor
        node {
          id
          title
          slug
          tags {
            id
            name
            slug
          }
        }
      }
    }
  }
}
```

Example variables:

```json
{
  "publicationId": "your-staging-publication-id",
  "first": 9,
  "after": null,
  "tagSlugs": ["backend"]
}
```

If this query does not return the expected posts or tags, fix the publication data first before debugging the site.

## When To Use Mock Mode Instead

Go back to mock mode for:

- layout and styling work
- stable screenshots
- deterministic local testing
- working offline

Set:

```env
NEXT_PUBLIC_BLOG_DATA_MODE=mock
```

## References

- Hashnode GraphQL quickstart: https://docs.hashnode.com/quickstart/introduction
- Fetching posts from a publication: https://docs.hashnode.com/quickstart/hashnode-graphql-api-quickstart/how-to-fetch-posts-from-your-blog
- Publishing to another publication: https://docs.hashnode.com/help-center/hashnode-editor/how-to-change-blog-when-publishing-a-draft-to-another-publication
- Hashnode headless blog example: https://hashnode.com/blog/building-a-blog-with-remix-and-headless-hashnode-graphql-apis/
