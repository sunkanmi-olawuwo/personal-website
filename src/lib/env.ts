import { createEnv } from "@t3-oss/env-nextjs";
import * as z from "zod";

export const env = createEnv({
  server: {},
  client: {
    NEXT_PUBLIC_HASHNODE_ENDPOINT: z.string().url().optional(),
    NEXT_PUBLIC_HASHNODE_PUBLICATION_ID: z.string().min(1).optional(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_HASHNODE_ENDPOINT: process.env.NEXT_PUBLIC_HASHNODE_ENDPOINT,
    NEXT_PUBLIC_HASHNODE_PUBLICATION_ID:
      process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_ID,
  },
  emptyStringAsUndefined: true,
});

export const isHashnodeConfigured = Boolean(
  env.NEXT_PUBLIC_HASHNODE_ENDPOINT && env.NEXT_PUBLIC_HASHNODE_PUBLICATION_ID
);
