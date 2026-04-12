"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import NewsletterSignupForm from "./newsletter-signup-form";

export default function NewsletterCard() {
  const [open, setOpen] = useState(false);

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
        <NewsletterSignupForm className="mt-3" onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
