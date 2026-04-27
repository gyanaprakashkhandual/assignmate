"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  MessageSquare,
  FileText,
  Loader,
  Star,
  File as FileIcon,
  Filter,
  Calendar,
  Clock,
} from "lucide-react";
import { useChat } from "@/app/hooks/useChat.hooks";
import { IChatSessionResponse } from "@/app/lib/types/chat.types";
import { Tooltip } from "@/ui/data/tooltip/Tooltip.ui";
import {
  StandaloneDatePicker,
  StandaloneTimePicker,
} from "@/ui/inputs/time/Time.ui";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FilterState {
  showFilters: boolean;
  dateFrom: string;
  dateTo: string;
  timeFrom: string;
  timeTo: string;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const { sessions, fetchSessions, getSession, isLoading } = useChat(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filters, setFilters] = useState<FilterState>({
    showFilters: false,
    dateFrom: "",
    dateTo: "",
    timeFrom: "",
    timeTo: "",
  });
  const searchInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && sessions.length === 0) {
      fetchSessions();
    }
  }, [isOpen, sessions.length, fetchSessions]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  const parseDateTime = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    try {
      return new Date(dateStr);
    } catch {
      return null;
    }
  };

  const checkDateInRange = (
    sessionDate: string,
    dateFrom: string,
    dateTo: string,
  ): boolean => {
    if (!dateFrom && !dateTo) return true;

    const sessionTime = parseDateTime(sessionDate);
    if (!sessionTime) return true;

    if (dateFrom) {
      const fromTime = parseDateTime(dateFrom);
      if (fromTime && sessionTime < fromTime) return false;
    }

    if (dateTo) {
      const toTime = parseDateTime(dateTo);
      if (toTime) {
        const endOfDay = new Date(toTime);
        endOfDay.setHours(23, 59, 59, 999);
        if (sessionTime > endOfDay) return false;
      }
    }

    return true;
  };

  const checkTimeInRange = (
    createdDate: string,
    timeFrom: string,
    timeTo: string,
  ): boolean => {
    if (!timeFrom && !timeTo) return true;

    const sessionDate = parseDateTime(createdDate);
    if (!sessionDate) return true;

    const sessionHours = sessionDate.getHours();
    const sessionMinutes = sessionDate.getMinutes();
    const sessionTimeMinutes = sessionHours * 60 + sessionMinutes;

    if (timeFrom) {
      const [fromHour, fromMinute] = timeFrom.split(":").map(Number);
      const fromTimeMinutes = fromHour * 60 + fromMinute;
      if (sessionTimeMinutes < fromTimeMinutes) return false;
    }

    if (timeTo) {
      const [toHour, toMinute] = timeTo.split(":").map(Number);
      const toTimeMinutes = toHour * 60 + toMinute;
      if (sessionTimeMinutes > toTimeMinutes) return false;
    }

    return true;
  };

  const filteredSessions: IChatSessionResponse[] = useMemo(() => {
    let results = sessions;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter((session) =>
        session.title.toLowerCase().includes(query),
      );
    }

    if (filters.dateFrom || filters.dateTo) {
      results = results.filter((session) =>
        checkDateInRange(
          session.lastMessageAt,
          filters.dateFrom,
          filters.dateTo,
        ),
      );
    }

    if (filters.timeFrom || filters.timeTo) {
      results = results.filter((session) =>
        checkTimeInRange(
          session.lastMessageAt,
          filters.timeFrom,
          filters.timeTo,
        ),
      );
    }

    return results;
  }, [searchQuery, sessions, filters]);

  const handleSelectSession = (session: IChatSessionResponse) => {
    getSession(session.id);
    router.push(`/chat/${session.id}`);
    onClose();
    setSearchQuery("");
    setFilters({
      showFilters: false,
      dateFrom: "",
      dateTo: "",
      timeFrom: "",
      timeTo: "",
    });
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSelectedIndex(0);
    searchInputRef.current?.focus();
  };

  const clearFilters = () => {
    setFilters({
      showFilters: false,
      dateFrom: "",
      dateTo: "",
      timeFrom: "",
      timeTo: "",
    });
  };

  const isAnyFilterActive =
    filters.dateFrom || filters.dateTo || filters.timeFrom || filters.timeTo;

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          e.preventDefault();
          onClose();
          break;

        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < filteredSessions.length - 1 ? prev + 1 : prev,
          );
          scrollToSelected();
          break;

        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          scrollToSelected();
          break;

        case "Enter":
          e.preventDefault();
          if (filteredSessions.length > 0) {
            handleSelectSession(filteredSessions[selectedIndex]);
          }
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredSessions, selectedIndex, onClose]);

  const scrollToSelected = () => {
    const element = containerRef.current?.querySelector(
      `[data-index="${selectedIndex}"]`,
    ) as HTMLElement;
    if (element) {
      element.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-50 flex items-start justify-center pt-[8vh] pointer-events-none"
          >
            <div className="w-full max-w-4xl mx-auto px-4 pointer-events-auto">
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl dark:shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
                {/* Search Input Section */}
                <div className="border-b border-gray-200 dark:border-gray-800 p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Search
                      size={20}
                      className="text-gray-400 dark:text-gray-500 shrink-0"
                    />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search chats by title..."
                      className="flex-1 bg-transparent text-base text-gray-900 dark:text-white outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                    {searchQuery && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={clearSearch}
                        className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        aria-label="Clear search"
                      >
                        <X
                          size={18}
                          className="text-gray-500 dark:text-gray-400"
                        />
                      </motion.button>
                    )}
                    <button
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          showFilters: !prev.showFilters,
                        }))
                      }
                      className={`p-1.5 rounded-lg transition-colors ${
                        isAnyFilterActive
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                          : "hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
                      }`}
                      aria-label="Toggle filters"
                    >
                      <Filter size={18} />
                    </button>
                    <button
                      onClick={onClose}
                      className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      aria-label="Close modal"
                    >
                      <X
                        size={18}
                        className="text-gray-500 dark:text-gray-400"
                      />
                    </button>
                  </div>

                  {/* Results Counter */}
                  {filteredSessions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-gray-500 dark:text-gray-400"
                    >
                      {filteredSessions.length} chat
                      {filteredSessions.length !== 1 ? "s" : ""} found
                    </motion.div>
                  )}
                </div>

                {/* Filters Section */}
                <AnimatePresence>
                  {filters.showFilters && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 p-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-2">
                            Date From
                          </label>
                          <StandaloneDatePicker
                            size="sm"
                            placeholder="Start date"
                            value={filters.dateFrom}
                            onChange={(date) =>
                              setFilters((prev) => ({
                                ...prev,
                                dateFrom: date,
                              }))
                            }
                          />
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-2">
                            Date To
                          </label>
                          <StandaloneDatePicker
                            size="sm"
                            placeholder="End date"
                            value={filters.dateTo}
                            onChange={(date) =>
                              setFilters((prev) => ({
                                ...prev,
                                dateTo: date,
                              }))
                            }
                          />
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-2">
                            Time From
                          </label>
                          <StandaloneTimePicker
                            size="sm"
                            placeholder="Start time"
                            value={filters.timeFrom}
                            onChange={(time) =>
                              setFilters((prev) => ({
                                ...prev,
                                timeFrom: time,
                              }))
                            }
                          />
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-2">
                            Time To
                          </label>
                          <StandaloneTimePicker
                            size="sm"
                            placeholder="End time"
                            value={filters.timeTo}
                            onChange={(time) =>
                              setFilters((prev) => ({
                                ...prev,
                                timeTo: time,
                              }))
                            }
                          />
                        </div>
                      </div>

                      {isAnyFilterActive && (
                        <button
                          onClick={clearFilters}
                          className="mt-3 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors underline"
                        >
                          Clear all filters
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Results Section */}
                <div className="max-h-[65vh] overflow-hidden flex flex-col bg-white dark:bg-gray-900">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-16">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Loader
                          size={28}
                          className="text-gray-400 dark:text-gray-500"
                        />
                      </motion.div>
                    </div>
                  ) : !searchQuery.trim() &&
                    sessions.length > 0 &&
                    filteredSessions.length > 0 ? (
                    <div
                      ref={containerRef}
                      className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent"
                    >
                      <AnimatePresence mode="popLayout">
                        {filteredSessions.map((session, index) => (
                          <SessionResultItem
                            key={session.id}
                            session={session}
                            index={index}
                            isSelected={index === selectedIndex}
                            onSelect={() => handleSelectSession(session)}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  ) : searchQuery.trim() && filteredSessions.length > 0 ? (
                    <div
                      ref={containerRef}
                      className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent"
                    >
                      <AnimatePresence mode="popLayout">
                        {filteredSessions.map((session, index) => (
                          <SessionResultItem
                            key={session.id}
                            session={session}
                            index={index}
                            isSelected={index === selectedIndex}
                            onSelect={() => handleSelectSession(session)}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  ) : sessions.length === 0 ? (
                    <EmptyState
                      icon={<MessageSquare size={28} />}
                      title="No chats yet"
                      message="Create a new chat to get started"
                    />
                  ) : (
                    <EmptyState
                      icon={<Search size={28} />}
                      title="No chats found"
                      message={`No results match your filters`}
                    />
                  )}
                </div>

                {/* Footer */}
                {filteredSessions.length > 0 && searchQuery.trim() && (
                  <div className="border-t border-gray-200 dark:border-gray-800 px-4 py-2 text-center text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50">
                    {selectedIndex + 1} of {filteredSessions.length}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

interface SessionResultItemProps {
  session: IChatSessionResponse;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}

function SessionResultItem({
  session,
  index,
  isSelected,
  onSelect,
}: SessionResultItemProps) {
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
    <motion.button
      key={session.id}
      data-index={index}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -8 }}
      transition={{ duration: 0.12, delay: index * 0.02 }}
      onClick={onSelect}
      className={`w-full text-left px-4 py-3.5 border-b border-gray-100 dark:border-gray-800 last:border-b-0 transition-colors duration-100 group ${
        isSelected
          ? "bg-blue-50 dark:bg-gray-800/80"
          : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`shrink-0 transition-colors ${
            isSelected
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400"
          }`}
        >
          {session.pdfUrl ? (
            <FileText size={16} />
          ) : (
            <MessageSquare size={16} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <Tooltip content={session.title} showCopy position="right">
            <p
              className={`text-sm font-medium truncate transition-colors ${
                isSelected
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white"
              }`}
            >
              {session.title}
            </p>
          </Tooltip>
          <div className="flex items-center gap-3 mt-1">
            <p
              className={`text-xs transition-colors ${
                isSelected
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
              }`}
            >
              {session.messageCount}{" "}
              {session.messageCount === 1 ? "message" : "messages"}
            </p>
            <span className="text-gray-300 dark:text-gray-700">•</span>
            <p
              className={`text-xs transition-colors ${
                isSelected
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
              }`}
            >
              {formatDate(session.lastMessageAt)}
            </p>
          </div>
        </div>

        {session.isStarred && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="shrink-0"
          >
            <Star size={14} className="text-amber-400 fill-amber-400" />
          </motion.div>
        )}

        {session.pdfUrl && (
          <Tooltip content="View PDF" position="left">
            <a
              href={session.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={`shrink-0 p-2 rounded-lg transition-colors ${
                isSelected
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50"
                  : "text-gray-400 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
            >
              <FileIcon size={14} />
            </a>
          </Tooltip>
        )}

        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="shrink-0 w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400"
          />
        )}
      </div>
    </motion.button>
  );
}

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  message: string;
}

function EmptyState({ icon, title, message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
        <div className="text-gray-400 dark:text-gray-500">{icon}</div>
      </div>
      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
        {title}
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center max-w-xs">
        {message}
      </p>
    </div>
  );
}
