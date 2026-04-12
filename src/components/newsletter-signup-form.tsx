"use client";

import { useMutation } from "@tanstack/react-query";
import { ClientError } from "graphql-request";
import { useState } from "react";
import type { FormEvent } from "react";
import { toast } from "sonner";

import { isNewsletterConfigured } from "@/lib/env";
import { cn } from "@/lib/utils";
import { subscribeToNewsletter } from "@/lib/requests";

import { Button } from "./ui/button";
import { Input } from "./ui/input";

type Props = {
  buttonClassName?: string;
  className?: string;
  inputClassName?: string;
  onSuccess?: () => void;
  placeholder?: string;
};

export default function NewsletterSignupForm({
  buttonClassName,
  className,
  inputClassName,
  onSuccess,
  placeholder = "Email",
}: Props) {
  const [email, setEmail] = useState("");

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["newsletter"],
    mutationFn: subscribeToNewsletter,
    onError: handleError,
    onSuccess: handleSuccess,
  });

  function handleSuccess() {
    window.localStorage.setItem("newsletter", email);
    toast.success(
      "Subscribed to newsletter! Check your email to confirm your subscription."
    );
    setEmail("");
    onSuccess?.();
  }

  function handleError(err: unknown) {
    const firstGraphQLError =
      err instanceof ClientError ? err.response.errors?.[0] : undefined;

    if (firstGraphQLError) {
      toast.error(firstGraphQLError.message);
      return;
    }

    if (err instanceof Error) {
      toast.error(err.message);
      return;
    }

    toast.error("Something went wrong!");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isNewsletterConfigured) {
      toast.info(
        "Configure the Hashnode environment variables to enable newsletter signups."
      );
      return;
    }

    await mutateAsync(email);
  }

  return (
    <form className={cn("flex flex-col gap-5", className)} onSubmit={handleSubmit}>
      <Input
        type="email"
        placeholder={placeholder}
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className={inputClassName}
      />
      <Button
        type="submit"
        disabled={isPending || !email}
        className={buttonClassName}
      >
        {isPending ? "Loading..." : "Subscribe"}
      </Button>
    </form>
  );
}
