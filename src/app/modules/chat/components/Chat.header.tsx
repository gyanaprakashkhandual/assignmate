"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, MoreHorizontal } from "lucide-react";

interface ChatHeaderProps {
  sessionId: string;
}

export function ChatHeader({ sessionId }: ChatHeaderProps) {
  const router = useRouter();

  return (
    <header className="h-14 flex items-center justify-between px-4 border-b border-gray-100 dark:border-zinc-800 bg-white dark:bg-black shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl text-gray-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all duration-150"
          title="Go back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-sm font-semibold text-black dark:text-white leading-tight">
            Chat
          </h1>
          <p className="text-[11px] text-gray-400 dark:text-zinc-600 font-mono leading-tight truncate max-w-[200px]">
            {sessionId}
          </p>
        </div>
      </div>

      <button
        className="p-2 rounded-xl text-gray-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all duration-150"
        title="Options"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>
    </header>
  );
}