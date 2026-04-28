"use client";
import { motion } from "framer-motion";
import {
  FileText,
  Download,
  ExternalLink,
  Share2,
  Trash2,
  MoreHorizontal,
  MessageSquare,
  Clock,
  Zap,
  User,
} from "lucide-react";
import {
  ActionMenu,
  IconTrigger,
  type ActionItem,
} from "@/ui/navigations/action/Action.menu.ui";
import { IPdfRecord } from "../types";

interface PdfListRowProps {
  pdf: IPdfRecord;
  index: number;
  onView: (pdf: IPdfRecord) => void;
  onDownload: (pdf: IPdfRecord) => void;
  onShare: (pdf: IPdfRecord) => void;
  onDelete: (pdf: IPdfRecord) => void;
  onOpenChat: (sessionId: string) => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: diffDays > 365 ? "numeric" : undefined,
  });
}

export function PdfListRow({
  pdf,
  index,
  onView,
  onDownload,
  onShare,
  onDelete,
  onOpenChat,
}: PdfListRowProps) {
  const menuItems: ActionItem[] = [
    {
      id: "view",
      label: "View PDF",
      leadingIcon: <ExternalLink size={13} />,
      onClick: () => onView(pdf),
    },
    {
      id: "download",
      label: "Download",
      leadingIcon: <Download size={13} />,
      onClick: () => onDownload(pdf),
    },
    {
      id: "share",
      label: "Share",
      leadingIcon: <Share2 size={13} />,
      onClick: () => onShare(pdf),
    },
    ...(pdf.chatSession
      ? [
          {
            id: "open-chat",
            label: "Open source chat",
            leadingIcon: <MessageSquare size={13} />,
            dividerBefore: true,
            onClick: () => onOpenChat(pdf.chatSession!._id),
          },
        ]
      : []),
    {
      id: "delete",
      label: "Delete PDF record",
      leadingIcon: <Trash2 size={13} />,
      variant: "danger" as const,
      dividerBefore: true,
      onClick: () => onDelete(pdf),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.15,
        delay: Math.min(index * 0.02, 0.2),
        ease: "easeOut",
      }}
      className="group flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-900 bg-white dark:bg-black hover:border-gray-200 dark:hover:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-950/50 transition-all duration-150"
    >
      <div
        className="shrink-0 w-9 h-9 rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-900 flex items-center justify-center cursor-pointer group-hover:border-gray-200 dark:group-hover:border-gray-800 transition-colors"
        onClick={() => onView(pdf)}
      >
        <FileText size={16} className="text-gray-400 dark:text-gray-600" />
      </div>

      <div
        className="flex-1 min-w-0 cursor-pointer"
        onClick={() => onView(pdf)}
      >
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate leading-tight">
          {pdf.chatSession?.title ?? "Untitled chat"}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span
            className={`inline-flex items-center gap-0.5 text-[10px] font-medium
                        ${pdf.exportedBy === "auto" ? "text-blue-500 dark:text-blue-400" : "text-gray-400 dark:text-gray-600"}`}
          >
            {pdf.exportedBy === "auto" ? <Zap size={9} /> : <User size={9} />}
            {pdf.exportedBy}
          </span>
          <span className="text-gray-200 dark:text-gray-800 text-[10px]">
            ·
          </span>
          <span className="text-[11px] text-gray-400 dark:text-gray-600 flex items-center gap-1">
            <Clock size={9} />
            {formatDate(pdf.generatedAt)}
          </span>
          <span className="text-gray-200 dark:text-gray-800 text-[10px]">
            ·
          </span>
          <span className="text-[11px] text-gray-400 dark:text-gray-600">
            {formatFileSize(pdf.fileSize)}
          </span>
          <span className="text-gray-200 dark:text-gray-800 text-[10px]">
            ·
          </span>
          <span className="text-[11px] text-gray-400 dark:text-gray-600 flex items-center gap-1">
            <MessageSquare size={9} />
            {pdf.messageCount} msgs
          </span>
        </div>
      </div>

      <div className="shrink-0 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <button
          onClick={() => onView(pdf)}
          className="flex items-center gap-1 h-7 px-2.5 rounded-lg text-[11px] font-medium bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
        >
          <ExternalLink size={11} />
          View
        </button>
        <button
          onClick={() => onDownload(pdf)}
          className="flex items-center gap-1 h-7 px-2.5 rounded-lg text-[11px] font-medium border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-950 transition-colors"
        >
          <Download size={11} />
          Download
        </button>
        <button
          onClick={() => onShare(pdf)}
          className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-950 transition-colors"
        >
          <Share2 size={11} />
        </button>

        <div onClick={(e) => e.stopPropagation()}>
          <ActionMenu
            items={menuItems}
            align="bottom-right"
            size="sm"
            trigger={
              <IconTrigger
                size="sm"
                icon={<MoreHorizontal size={13} />}
                variant="ghost"
              />
            }
          />
        </div>
      </div>
    </motion.div>
  );
}
