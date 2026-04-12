import { createEnv } from "@t3-oss/env-nextjs";
import * as z from "zod";

const blogDataModeSchema = z.enum(["auto", "mock", "live"]);

export const env = createEnv({
  server: {},
  client: {
    NEXT_PUBLIC_BLOG_DATA_MODE: blogDataModeSchema.optional(),
    NEXT_PUBLIC_HASHNODE_ENDPOINT: z.string().url().optional(),
    NEXT_PUBLIC_HASHNODE_PUBLICATION_ID: z.string().min(1).optional(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_BLOG_DATA_MODE: process.env.NEXT_PUBLIC_BLOG_DATA_MODE,
    NEXT_PUBLIC_HASHNODE_ENDPOINT: process.env.NEXT_PUBLIC_HASHNODE_ENDPOINT,
    NEXT_PUBLIC_HASHNODE_PUBLICATION_ID:
      process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_ID,
  },
  emptyStringAsUndefined: true,
});

export const blogDataMode = env.NEXT_PUBLIC_BLOG_DATA_MODE ?? "auto";

export const isHashnodeConfigured = Boolean(
  env.NEXT_PUBLIC_HASHNODE_ENDPOINT && env.NEXT_PUBLIC_HASHNODE_PUBLICATION_ID
);

export const isNewsletterConfigured =
  blogDataMode !== "mock" && isHashnodeConfigured;
