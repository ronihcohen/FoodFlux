"use client";

import { useEffect, useRef, useState } from "react";
import SignOutButton from "@/components/SignOutButton";

type User = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

type UserMenuProps = {
  user: User;
};

export default function UserMenu({ user }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const displayName = user.name ?? user.email ?? "User";

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
      >
        {user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.image}
            alt={displayName}
            className="h-8 w-8 rounded-full"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-neutral-200 grid place-items-center text-xs font-medium">
            {displayName.slice(0, 1).toUpperCase()}
          </div>
        )}
        <span className="hidden sm:block text-sm font-medium max-w-[10rem] truncate">
          {displayName}
        </span>
        <svg
          className={`h-4 w-4 hidden sm:block transition-transform ${open ? "rotate-180" : "rotate-0"}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.24-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {open ? (
        <div
          role="menu"
          aria-label="User menu"
          className="absolute right-0 z-50 mt-2 w-64 rounded-md border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-lg overflow-hidden"
        >
          <div className="p-3 flex items-center gap-3">
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt={displayName}
                className="h-10 w-10 rounded-full"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-neutral-200 grid place-items-center text-sm font-medium">
                {displayName.slice(0, 1).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <div className="text-sm font-medium truncate">{displayName}</div>
              {user.email ? (
                <div className="text-xs text-neutral-500 truncate">{user.email}</div>
              ) : null}
            </div>
          </div>
          <div className="h-px bg-black/5 dark:bg-white/10" />
          <div className="p-2">
            <SignOutButton className="btn-ghost w-full justify-start text-red-600" title="Logout">
              Logout
            </SignOutButton>
          </div>
        </div>
      ) : null}
    </div>
  );
}


