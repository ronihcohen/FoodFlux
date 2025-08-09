"use client";

import { signOut } from "next-auth/react";

type SignOutButtonProps = {
  className?: string;
};

export default function SignOutButton({ className }: SignOutButtonProps) {
  async function handleSignOut() {
    await signOut({ callbackUrl: "/signin" });
  }

  return (
    <button onClick={handleSignOut} className={className ?? "btn-ghost"}>
      Logout
    </button>
  );
}


