"use client";

import { useMutation } from "@tanstack/react-query";
import { ClientError } from "graphql-request";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { isNewsletterConfigured } from "@/lib/env";
import { subscribeToNewsletter } from "@/lib/requests";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";

export default function NewsletterCard() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["newsletter"],
    mutationFn: subscribeToNewsletter,
    onError: onError,
    onSuccess: onSuccess,
  });

  function onSuccess() {
    window.localStorage.setItem("newsletter", email);
    toast.success(
      "Subscribed to newsletter! Check your email to confirm your subscription."
    );
    setOpen(false);
  }

  function onError(err: unknown) {
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

  async function handleSubscribe() {
    if (!isNewsletterConfigured) {
      toast.info("Configure the Hashnode environment variables to enable newsletter signups.");
      return;
    }

    await mutateAsync(email);
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (window.localStorage.getItem("newsletter")) return;

      setOpen(true);
    }, 5000);

    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Join the newsletter!</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Enter your email to join the newsletter and stay up to date with the
          latest posts published in this blog!
        </DialogDescription>
        <div className="flex flex-col gap-5 mt-3">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button onClick={handleSubscribe} disabled={isPending || !email}>
            {isPending ? "Loading..." : "Subscribe"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
