"use client";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Star,
  FileText,
  Trash2,
  Archive,
  ShieldAlert,
  MoreHorizontal,
  Clock,
} from "lucide-react";
import {
  ActionMenu,
  IconTrigger,
  type ActionItem,
} from "@/ui/navigations/action/Action.menu.ui";
import { IChatSessionResponse } from "@/app/lib/types/chat.types";

interface HistorySessionCardProps {
  session: IChatSessionResponse;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onOpen: (id: string) => void;
  onSoftDelete: (id: string) => void;
  onHardDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onStar: (id: string) => void;
  index: number;
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function HistorySessionCard({
  session,
  isSelected,
  onToggleSelect,
  onOpen,
  onSoftDelete,
  onHardDelete,
  onArchive,
  onStar,
  index,
}: HistorySessionCardProps) {
  const menuItems: ActionItem[] = [
    {
      id: "open",
      label: "Open chat",
      leadingIcon: <MessageSquare size={14} />,
      onClick: () => onOpen(session.id),
    },
    {
      id: "star",
      label: session.isStarred ? "Unstar" : "Star",
      leadingIcon: (
        <Star
          size={14}
          className={session.isStarred ? "fill-amber-400 text-amber-400" : ""}
        />
      ),
      onClick: () => onStar(session.id),
    },
    {
      id: "archive",
      label: "Archive",
      leadingIcon: <Archive size={14} />,
      dividerBefore: true,
      onClick: () => onArchive(session.id),
    },
    {
      id: "delete",
      label: "Delete",
      leadingIcon: <Trash2 size={14} />,
      variant: "warning",
      onClick: () => onSoftDelete(session.id),
    },
    {
      id: "delete-permanent",
      label: "Delete permanently",
      leadingIcon: <ShieldAlert size={14} />,
      variant: "danger",
      onClick: () => onHardDelete(session.id),
    },
  ];

  const statusBadgeClass =
    session.status === "archived"
      ? "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800"
      : session.status === "deleted"
        ? "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800"
        : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.18,
        delay: Math.min(index * 0.03, 0.3),
        ease: "easeOut",
      }}
      className={`group relative flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all duration-150 cursor-pointer
                ${
                  isSelected
                    ? "bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700"
                    : "bg-white dark:bg-black border-gray-100 dark:border-gray-900 hover:border-gray-200 dark:hover:border-gray-800 hover:bg-gray-50/60 dark:hover:bg-gray-950"
                }
            `}
    >
      <div
        className="shrink-0 flex items-center justify-center"
        onClick={(e) => {
          e.stopPropagation();
          onToggleSelect(session.id);
        }}
      >
        <div
          className={`w-4 h-4 rounded border-[1.5px] flex items-center justify-center transition-all duration-150 cursor-pointer
                        ${
                          isSelected
                            ? "bg-gray-900 dark:bg-white border-gray-900 dark:border-white"
                            : "border-gray-300 dark:border-gray-700 group-hover:border-gray-400 dark:group-hover:border-gray-600"
                        }
                    `}
        >
          {isSelected && (
            <motion.svg
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              width="9"
              height="9"
              viewBox="0 0 9 9"
              fill="none"
            >
              <path
                d="M1.5 4.5L3.5 6.5L7.5 2.5"
                stroke={isSelected ? "white" : "black"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          )}
        </div>
      </div>

      <div
        className="flex-1 min-w-0 flex items-center gap-3"
        onClick={() => onOpen(session.id)}
      >
        <div
          className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors
                        ${isSelected ? "bg-gray-200 dark:bg-gray-800" : "bg-gray-100 dark:bg-gray-900 group-hover:bg-gray-200 dark:group-hover:bg-gray-800"}
                    `}
        >
          <MessageSquare
            size={14}
            className="text-gray-500 dark:text-gray-400"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate leading-tight">
              {session.title}
            </span>
            {session.isStarred && (
              <Star
                size={11}
                className="shrink-0 fill-amber-400 text-amber-400"
              />
            )}
            {statusBadgeClass && (
              <span
                className={`shrink-0 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${statusBadgeClass}`}
              >
                {session.status}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-gray-400 dark:text-gray-600 flex items-center gap-1">
              <MessageSquare size={10} />
              {session.messageCount}
            </span>
            <span className="text-gray-200 dark:text-gray-800 text-xs">·</span>
            <span className="text-xs text-gray-400 dark:text-gray-600 flex items-center gap-1">
              <Clock size={10} />
              {formatRelativeTime(session.lastMessageAt)}
            </span>
            {session.pdfUrl && (
              <>
                <span className="text-gray-200 dark:text-gray-800 text-xs">
                  ·
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-600 flex items-center gap-1">
                  <FileText size={10} />
                  PDF
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div
        className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => e.stopPropagation()}
      >
        <ActionMenu
          items={menuItems}
          align="bottom-right"
          size="sm"
          trigger={
            <IconTrigger
              size="sm"
              icon={<MoreHorizontal size={14} />}
              variant="ghost"
            />
          }
        />
      </div>
    </motion.div>
  );
}
