"use client";

import { signOut } from "next-auth/react";
import type { ReactNode } from "react";

type SignOutButtonProps = {
  className?: string;
  children?: ReactNode;
  title?: string;
};

export default function SignOutButton({ className, children, title }: SignOutButtonProps) {
  async function handleSignOut() {
    await signOut({ callbackUrl: "/signin" });
  }

  return (
    <button
      onClick={handleSignOut}
      className={className ?? "btn-ghost"}
      aria-label={title ?? "Logout"}
      title={title ?? "Logout"}
    >
      {children ?? "Logout"}
    </button>
  );
}


