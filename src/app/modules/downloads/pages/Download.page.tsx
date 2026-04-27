"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Search,
  Download,
  Share2,
  Eye,
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Calendar,
  Clock,
  X,
} from "lucide-react";
import {
  ActionMenu,
  IconTrigger,
} from "@/ui/navigations/action/Action.menu.ui";
import type { ActionItem } from "@/ui/navigations/action/Action.menu.context";
import {
  StandaloneDatePicker,
  StandaloneTimePicker,
} from "@/ui/inputs/time/Time.ui";

interface PDFSession {
  _id: string;
  title: string;
  pdfUrl: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  isStarred: boolean;
}

interface FilterState {
  search: string;
  dateFrom: string;
  dateTo: string;
  timeFrom: string;
  timeTo: string;
  showDateFilter: boolean;
  showTimeFilter: boolean;
}

const ITEMS_PER_PAGE = 12;

export default function PDFShowcase({
  sessions = [],
}: {
  sessions: PDFSession[];
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    dateFrom: "",
    dateTo: "",
    timeFrom: "",
    timeTo: "",
    showDateFilter: false,
    showTimeFilter: false,
  });
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedPDF, setSelectedPDF] = useState<PDFSession | null>(null);

  const parseDateTime = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    try {
      return new Date(dateStr);
    } catch {
      return null;
    }
  };

  const checkDateInRange = (sessionDate: string): boolean => {
    if (!filters.dateFrom && !filters.dateTo) return true;

    const sessionTime = parseDateTime(sessionDate);
    if (!sessionTime) return true;

    if (filters.dateFrom) {
      const fromTime = parseDateTime(filters.dateFrom);
      if (fromTime && sessionTime < fromTime) return false;
    }

    if (filters.dateTo) {
      const toTime = parseDateTime(filters.dateTo);
      if (toTime) {
        const endOfDay = new Date(toTime);
        endOfDay.setHours(23, 59, 59, 999);
        if (sessionTime > endOfDay) return false;
      }
    }

    return true;
  };

  const checkTimeInRange = (createdDate: string): boolean => {
    if (!filters.timeFrom && !filters.timeTo) return true;

    const sessionDate = parseDateTime(createdDate);
    if (!sessionDate) return true;

    const sessionHours = sessionDate.getHours();
    const sessionMinutes = sessionDate.getMinutes();
    const sessionTimeMinutes = sessionHours * 60 + sessionMinutes;

    if (filters.timeFrom) {
      const [fromHour, fromMinute] = filters.timeFrom.split(":").map(Number);
      const fromTimeMinutes = fromHour * 60 + fromMinute;
      if (sessionTimeMinutes < fromTimeMinutes) return false;
    }

    if (filters.timeTo) {
      const [toHour, toMinute] = filters.timeTo.split(":").map(Number);
      const toTimeMinutes = toHour * 60 + toMinute;
      if (sessionTimeMinutes > toTimeMinutes) return false;
    }

    return true;
  };

  const filteredSessions = useMemo(() => {
    let results = sessions;

    if (filters.search.trim()) {
      const query = filters.search.toLowerCase();
      results = results.filter((session) =>
        session.title.toLowerCase().includes(query),
      );
    }

    if (filters.dateFrom || filters.dateTo) {
      results = results.filter((session) =>
        checkDateInRange(session.createdAt),
      );
    }

    if (filters.timeFrom || filters.timeTo) {
      results = results.filter((session) =>
        checkTimeInRange(session.createdAt),
      );
    }

    return results;
  }, [sessions, filters]);

  const totalPages = Math.ceil(filteredSessions.length / ITEMS_PER_PAGE);
  const paginatedSessions = filteredSessions.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE,
  );

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
      scrollContainerRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentPage, totalPages]);

  const handlePrevPage = useCallback(() => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
      scrollContainerRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentPage]);

  const handleDownload = (session: PDFSession) => {
    const link = document.createElement("a");
    link.href = session.pdfUrl;
    link.download = `${session.title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = (session: PDFSession) => {
    if (navigator.share) {
      navigator.share({
        title: session.title,
        url: session.pdfUrl,
      });
    } else {
      navigator.clipboard.writeText(session.pdfUrl);
      alert("Link copied to clipboard");
    }
  };

  const handleViewPDF = (session: PDFSession) => {
    window.open(session.pdfUrl, "_blank");
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "";
    }
  };

  const isAnyFilterActive =
    filters.dateFrom || filters.dateTo || filters.timeFrom || filters.timeTo;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div
        ref={scrollContainerRef}
        className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={24} className="text-gray-900 dark:text-white" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    PDF Library
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {filteredSessions.length}{" "}
                    {filteredSessions.length === 1 ? "document" : "documents"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium text-sm">
                <FileText size={16} />
                <span>{filteredSessions.length}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="Search PDFs..."
                  value={filters.search}
                  onChange={(e) => {
                    setFilters((prev) => ({ ...prev, search: e.target.value }));
                    setCurrentPage(0);
                  }}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-gray-400 dark:focus:border-gray-600"
                />
                {filters.search && (
                  <button
                    onClick={() => {
                      setFilters((prev) => ({ ...prev, search: "" }));
                      setCurrentPage(0);
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              <button
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    showDateFilter: !prev.showDateFilter,
                  }))
                }
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 ${
                  isAnyFilterActive || filters.showDateFilter
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                }`}
              >
                <Calendar size={16} />
                <span className="hidden sm:inline">Date</span>
              </button>

              <button
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    showTimeFilter: !prev.showTimeFilter,
                  }))
                }
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 ${
                  filters.timeFrom || filters.timeTo || filters.showTimeFilter
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                }`}
              >
                <Clock size={16} />
                <span className="hidden sm:inline">Time</span>
              </button>

              {isAnyFilterActive && (
                <button
                  onClick={() => {
                    setFilters({
                      search: "",
                      dateFrom: "",
                      dateTo: "",
                      timeFrom: "",
                      timeTo: "",
                      showDateFilter: false,
                      showTimeFilter: false,
                    });
                    setCurrentPage(0);
                  }}
                  className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 font-medium text-sm border border-gray-200 dark:border-gray-700"
                >
                  Clear
                </button>
              )}
            </div>

            <AnimatePresence>
              {filters.showDateFilter && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-gray-200 dark:border-gray-800"
                >
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-2">
                      From Date
                    </label>
                    <StandaloneDatePicker
                      size="sm"
                      placeholder="Start date"
                      value={filters.dateFrom}
                      onChange={(date) => {
                        setFilters((prev) => ({ ...prev, dateFrom: date }));
                        setCurrentPage(0);
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-2">
                      To Date
                    </label>
                    <StandaloneDatePicker
                      size="sm"
                      placeholder="End date"
                      value={filters.dateTo}
                      onChange={(date) => {
                        setFilters((prev) => ({ ...prev, dateTo: date }));
                        setCurrentPage(0);
                      }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {filters.showTimeFilter && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-gray-200 dark:border-gray-800"
                >
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-2">
                      From Time
                    </label>
                    <StandaloneTimePicker
                      size="sm"
                      placeholder="Start time"
                      value={filters.timeFrom}
                      onChange={(time) => {
                        setFilters((prev) => ({ ...prev, timeFrom: time }));
                        setCurrentPage(0);
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-2">
                      To Time
                    </label>
                    <StandaloneTimePicker
                      size="sm"
                      placeholder="End time"
                      value={filters.timeTo}
                      onChange={(time) => {
                        setFilters((prev) => ({ ...prev, timeTo: time }));
                        setCurrentPage(0);
                      }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {paginatedSessions.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              <AnimatePresence mode="popLayout">
                {paginatedSessions.map((session, index) => (
                  <PDFTile
                    key={session._id}
                    session={session}
                    index={index}
                    onView={handleViewPDF}
                    onDownload={handleDownload}
                    onShare={handleShare}
                  />
                ))}
              </AnimatePresence>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-8 border-t border-gray-200 dark:border-gray-800">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 0}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft
                    size={20}
                    className="text-gray-900 dark:text-white"
                  />
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }).map((_, pageIndex) => (
                    <button
                      key={pageIndex}
                      onClick={() => {
                        setCurrentPage(pageIndex);
                        scrollContainerRef.current?.scrollIntoView({
                          behavior: "smooth",
                        });
                      }}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        pageIndex === currentPage
                          ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                    >
                      {pageIndex + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages - 1}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight
                    size={20}
                    className="text-gray-900 dark:text-white"
                  />
                </button>

                <div className="ml-auto text-sm text-gray-600 dark:text-gray-400">
                  Page {currentPage + 1} of {totalPages}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
              <FileText
                size={32}
                className="text-gray-400 dark:text-gray-500"
              />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No PDFs Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {filters.search || isAnyFilterActive
                ? "Try adjusting your search or filters"
                : "No PDF documents available"}
            </p>
          </div>
        )}
      </div>

      <PDFModal pdf={selectedPDF} onClose={() => setSelectedPDF(null)} />
    </div>
  );
}

interface PDFTileProps {
  session: PDFSession;
  index: number;
  onView: (session: PDFSession) => void;
  onDownload: (session: PDFSession) => void;
  onShare: (session: PDFSession) => void;
}

function PDFTile({
  session,
  index,
  onView,
  onDownload,
  onShare,
}: PDFTileProps) {
  const actionItems: ActionItem[] = [
    {
      id: "view",
      label: "View",
      leadingIcon: <Eye size={16} />,
      onClick: () => onView(session),
    },
    {
      id: "download",
      label: "Download",
      leadingIcon: <Download size={16} />,
      onClick: () => onDownload(session),
    },
    {
      id: "share",
      label: "Share",
      leadingIcon: <Share2 size={16} />,
      onClick: () => onShare(session),
    },
  ];

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg dark:hover:shadow-black/30 transition-all duration-200"
    >
      <div className="relative h-40 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20" />
        <FileText
          size={48}
          className="text-gray-400 dark:text-gray-500 relative z-10"
        />

        <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
          <ActionMenu
            items={actionItems}
            trigger={
              <IconTrigger size="md" icon={<MoreVertical size={16} />} />
            }
            size="md"
            align="top-right"
          />
        </div>
      </div>

      <div className="p-4">
        <h3
          className="font-semibold text-gray-900 dark:text-white truncate text-sm mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer"
          onClick={() => onView(session)}
        >
          {session.title}
        </h3>

        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          {formatDate(session.createdAt)}
        </p>

        <div className="flex gap-2">
          <button
            onClick={() => onView(session)}
            className="flex-1 px-3 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Eye size={14} />
            <span className="hidden sm:inline">View</span>
          </button>

          <button
            onClick={() => onDownload(session)}
            className="flex-1 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

interface PDFModalProps {
  pdf: PDFSession | null;
  onClose: () => void;
}

function PDFModal({ pdf, onClose }: PDFModalProps) {
  return (
    <AnimatePresence>
      {pdf && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate flex-1">
                  {pdf.title}
                </h2>
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              <iframe
                src={pdf.pdfUrl}
                className="flex-1 w-full"
                title={pdf.title}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
