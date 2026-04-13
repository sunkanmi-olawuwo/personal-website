# Next.js Blog Powered by Hashnode Headless

This project is a Next.js blog that can run in three content modes:

- `auto`: use Hashnode when configured, otherwise fall back to realistic mock content
- `mock`: always use local mock blog data
- `live`: require a working Hashnode connection

## Setup

Install dependencies:

```bash
npm install
```

Copy `.env.example` to `.env.local` and choose a content mode:

```bash
NEXT_PUBLIC_BLOG_DATA_MODE=mock
NEXT_PUBLIC_HASHNODE_ENDPOINT=https://gql.hashnode.com
NEXT_PUBLIC_HASHNODE_PUBLICATION_ID=
```

## Running Locally

Use mock content for UI and design work:

```bash
npm run dev
```

If you want live Hashnode data instead, set:

```bash
NEXT_PUBLIC_BLOG_DATA_MODE=live
NEXT_PUBLIC_HASHNODE_PUBLICATION_ID=your-publication-id
```

If you leave `NEXT_PUBLIC_BLOG_DATA_MODE=auto`, the app will use live Hashnode data when the env vars are present and fall back to mock content when they are not.

## Testing

Run the full local test suite:

```bash
npm test
```

The default Playwright run uses explicit mock mode so the blog pages stay stable and previewable without an external content dependency.

For repeatable live-publication checks, see [docs/live-hashnode-checklist.md](docs/live-hashnode-checklist.md).
