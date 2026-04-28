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

interface PdfCardProps {
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

export function PdfCard({
  pdf,
  index,
  onView,
  onDownload,
  onShare,
  onDelete,
  onOpenChat,
}: PdfCardProps) {
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
      label: "Delete PDF",
      leadingIcon: <Trash2 size={13} />,
      variant: "danger" as const,
      dividerBefore: true,
      onClick: () => onDelete(pdf),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.18,
        delay: Math.min(index * 0.025, 0.25),
        ease: "easeOut",
      }}
      className="group relative flex flex-col rounded-2xl border border-gray-100 dark:border-gray-900 bg-white dark:bg-black hover:border-gray-200 dark:hover:border-gray-800 hover:shadow-sm dark:hover:shadow-none transition-all duration-200 overflow-hidden"
    >
      <div
        className="relative flex-1 flex items-center justify-center h-36 bg-gray-50 dark:bg-gray-950 cursor-pointer"
        onClick={() => onView(pdf)}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-200">
            <FileText size={22} className="text-gray-400 dark:text-gray-600" />
          </div>
          <span className="text-[10px] font-medium text-gray-400 dark:text-gray-600 uppercase tracking-widest">
            PDF
          </span>
        </div>

        <div className="absolute inset-0 bg-gray-900/0 group-hover:bg-gray-900/2 dark:group-hover:bg-white/2 transition-colors duration-200" />

        <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <div onClick={(e) => e.stopPropagation()}>
            <ActionMenu
              items={menuItems}
              align="bottom-right"
              size="sm"
              trigger={
                <IconTrigger
                  size="sm"
                  icon={<MoreHorizontal size={13} />}
                  variant="default"
                />
              }
            />
          </div>
        </div>

        <div className="absolute top-2.5 left-2.5">
          <span
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider border
                        ${
                          pdf.exportedBy === "auto"
                            ? "bg-blue-50 dark:bg-blue-950/40 text-blue-500 dark:text-blue-400 border-blue-100 dark:border-blue-900"
                            : "bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-500 border-gray-200 dark:border-gray-800"
                        }`}
          >
            {pdf.exportedBy === "auto" ? <Zap size={8} /> : <User size={8} />}
            {pdf.exportedBy}
          </span>
        </div>
      </div>

      <div className="px-3.5 py-3 border-t border-gray-100 dark:border-gray-900">
        <p
          className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate leading-tight cursor-pointer hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
          onClick={() => onView(pdf)}
          title={pdf.chatSession?.title ?? "Untitled chat"}
        >
          {pdf.chatSession?.title ?? "Untitled chat"}
        </p>

        <div className="flex items-center gap-2.5 mt-1.5">
          <span className="text-[11px] text-gray-400 dark:text-gray-600 flex items-center gap-1">
            <Clock size={10} />
            {formatDate(pdf.generatedAt)}
          </span>
          <span className="text-gray-200 dark:text-gray-800">·</span>
          <span className="text-[11px] text-gray-400 dark:text-gray-600">
            {formatFileSize(pdf.fileSize)}
          </span>
          <span className="text-gray-200 dark:text-gray-800">·</span>
          <span className="text-[11px] text-gray-400 dark:text-gray-600 flex items-center gap-1">
            <MessageSquare size={10} />
            {pdf.messageCount}
          </span>
        </div>

        <div className="flex items-center gap-1.5 mt-2.5">
          <button
            onClick={() => onView(pdf)}
            className="flex-1 flex items-center justify-center gap-1.5 h-7 rounded-lg text-[11px] font-medium bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            <ExternalLink size={11} />
            View
          </button>
          <button
            onClick={() => onDownload(pdf)}
            className="flex-1 flex items-center justify-center gap-1.5 h-7 rounded-lg text-[11px] font-medium border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-950 transition-colors"
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
        </div>
      </div>
    </motion.div>
  );
}
