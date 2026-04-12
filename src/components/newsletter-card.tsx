"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { subscribeToNewsletter } from "@/lib/requests";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { ClientError } from "graphql-request";
import { isHashnodeConfigured } from "@/lib/env";

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
    localStorage.setItem("newsletter", email);
    toast.success(
      "Subscribed to newsletter! Check your email to confirm your subscription."
    );
    setOpen(false);
  }

  function onError(err: unknown) {
    if (err instanceof ClientError && err.response.errors?.length) {
      toast.error(err.response.errors[0]!.message);
      return;
    }

    if (err instanceof Error) {
      toast.error(err.message);
      return;
    }

    toast.error("Something went wrong!");
  }

  function handleOpen() {
    // Find localStorage key to see if already registered
    if (localStorage.getItem("newsletter")) return;

    setOpen(true);
  }

  async function handleSubscribe() {
    if (!isHashnodeConfigured) {
      toast.info("Configure the Hashnode environment variables to enable newsletter signups.");
      return;
    }

    await mutateAsync(email);
  }

  useEffect(() => {
    setTimeout(() => {
      handleOpen();
    }, 5000);
  }, []);

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Join the newsletter!</DialogTitle>
        </DialogHeader>
        <p>
          Enter your email to join the newsletter and stay up to date with the
          latest posts published in this blog!
        </p>
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
