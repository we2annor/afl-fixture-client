"use client";

import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

function getSnapshot() {
  return new Date().getFullYear();
}

function getServerSnapshot() {
  return undefined;
}

export function Footer() {
  const year = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <footer className='border-t bg-background'>
      <div className='mx-auto w-full max-w-5xl px-4 py-6 text-sm text-muted-foreground'>
        &copy; {year ?? ""} Ernest Annor. All rights reserved.
      </div>
    </footer>
  );
}
