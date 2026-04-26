"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Star,
  Archive,
  MoreHorizontal,
  Trash2,
  Trash,
  Edit3,
  MessageSquare,
  PenLine,
  Menu,
  X,
  Clock,
} from "lucide-react";
import SessionHeader from "../core/Seesion.header";
import MessageList from "../components/Message.list";
import ChatBox from "../core/Chat.box";
import ExportToolbar from "../components/Export.toolbar";
import HandwritingPreviewModal from "../core/Hand.writing.preview";
import NewSessionModal from "../core/New.session.modal";
import StatsCard from "../components/Stats.card";
import {
  IChatSessionResponse,
  IChatMessageResponse,
  IChatStats,
  IPagination,
  IPreviewResult,
  IPdfExportResult,
  ICustomizations,
  PaperStyle,
  ChatStatus,
} from "../../../lib/types/chat.types";

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_SESSIONS: IChatSessionResponse[] = [
  {
    id: "s1",
    title: "Physics Notes — Quantum Mechanics",
    messageCount: 12,
    isStarred: true,
    status: "active",
    lastMessageAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    pdfUrl: undefined,
  },
  {
    id: "s2",
    title: "History Essay — Renaissance",
    messageCount: 6,
    isStarred: false,
    status: "active",
    lastMessageAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    pdfUrl: "https://example.com/renaissance.pdf",
  },
  {
    id: "s3",
    title: "Math Problems — Calculus",
    messageCount: 24,
    isStarred: true,
    status: "active",
    lastMessageAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "s4",
    title: "Biology — Cell Division",
    messageCount: 8,
    isStarred: false,
    status: "archived",
    lastMessageAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const MOCK_MESSAGES: IChatMessageResponse[] = [
  {
    id: "m1",
    chatSessionId: "s1",
    type: "user_question",
    content: "Can you explain the wave-particle duality principle in quantum mechanics?",
    order: 1,
    metadata: { timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(), processingTimeMs: 0 },
  },
  {
    id: "m2",
    chatSessionId: "s1",
    type: "ai_answer",
    content: `**Wave-particle duality** is one of the foundational concepts in quantum mechanics, describing how every quantum entity — such as an electron or photon — can exhibit both **wave-like** and **particle-like** properties.

## Key Concepts

- **Wave behavior**: Demonstrated in the famous double-slit experiment, particles create an interference pattern as if they are waves passing through both slits simultaneously.
- **Particle behavior**: When observed, particles appear at a definite location — like a point on a detector screen.

## The Double-Slit Experiment

When electrons are fired at a barrier with two slits:

1. Without observation: an interference pattern emerges (wave behavior)
2. With observation: the pattern collapses to two bands (particle behavior)

This led de Broglie to propose that all matter has an associated wavelength:

\`λ = h / p\`

where \`h\` is Planck's constant and \`p\` is momentum.

The act of *measurement* itself collapses the wave function — a phenomenon central to the **Copenhagen interpretation** of quantum mechanics.`,
    order: 2,
    metadata: {
      timestamp: new Date(Date.now() - 88 * 60 * 1000).toISOString(),
      processingTimeMs: 1240,
    },
  },
  {
    id: "m3",
    chatSessionId: "s1",
    type: "user_question",
    content: "How does Heisenberg's uncertainty principle relate to this?",
    order: 3,
    metadata: { timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString() },
  },
  {
    id: "m4",
    chatSessionId: "s1",
    type: "ai_answer",
    content: `The **Heisenberg Uncertainty Principle** is a direct mathematical consequence of wave-particle duality.

It states that the more precisely we know a particle's **position**, the less precisely we can know its **momentum**, and vice versa:

\`Δx · Δp ≥ ℏ/2\`

This isn't a limitation of our instruments — it's a fundamental property of nature. The wave nature of particles means they don't have a precise location; their "position" is spread across a probability distribution.

**Intuitive analogy**: Think of a water wave. Where exactly is the wave? It's spread out. The more you try to localize it (make it a sharp spike), the more frequencies (momenta) you need — and vice versa.`,
    order: 4,
    metadata: {
      timestamp: new Date(Date.now() - 58 * 60 * 1000).toISOString(),
      processingTimeMs: 980,
    },
    previewImageUrl: undefined,
  },
];

const MOCK_STATS: IChatStats = {
  totalSessions: 4,
  activeSessions: 3,
  archivedSessions: 1,
  totalMessages: 50,
  averageMessagesPerSession: 12.5,
  totalPdfsGenerated: 2,
};

// ─── Utilities ────────────────────────────────────────────────────────────────
function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${d}d ago`;
}

// ─── SessionCard ──────────────────────────────────────────────────────────────
function SessionCard({
  session,
  isActive,
  onSelect,
  onStar,
  onUnstar,
  onArchive,
  onSoftDelete,
  onHardDelete,
}: {
  session: IChatSessionResponse;
  isActive: boolean;
  onSelect: () => void;
  onStar: () => void;
  onUnstar: () => void;
  onArchive: () => void;
  onSoftDelete: () => void;
  onHardDelete: () => void;
}) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div
      onClick={onSelect}
      className={`group relative flex flex-col gap-1 px-3 py-2.5 rounded-xl cursor-pointer transition mx-1.5 ${
        isActive
          ? "bg-black dark:bg-white"
          : "hover:bg-black/5 dark:hover:bg-white/5"
      }`}
    >
      <div className="flex items-start justify-between gap-1.5">
        <p className={`text-xs font-semibold leading-snug line-clamp-2 flex-1 ${
          isActive ? "text-white dark:text-black" : "text-black dark:text-white"
        }`}>
          {session.title}
        </p>

        <div className="flex items-center gap-0.5 shrink-0 mt-0.5">
          {/* Star */}
          <button
            onClick={(e) => { e.stopPropagation(); session.isStarred ? onUnstar() : onStar(); }}
            className={`p-1 rounded transition opacity-0 group-hover:opacity-100 ${isActive ? "opacity-100" : ""} ${
              session.isStarred ? "text-amber-400 opacity-100" : isActive ? "text-white/60 dark:text-black/60" : "text-neutral-400"
            }`}
          >
            <Star className={`w-3 h-3 ${session.isStarred ? "fill-amber-400" : ""}`} />
          </button>

          {/* Overflow menu */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowMenu((v) => !v)}
              className={`p-1 rounded transition opacity-0 group-hover:opacity-100 ${isActive ? "opacity-100 text-white/70 dark:text-black/70" : "text-neutral-400"} hover:opacity-100`}
            >
              <MoreHorizontal className="w-3 h-3" />
            </button>
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.12 }}
                  className="absolute right-0 top-6 w-44 bg-white dark:bg-neutral-800 border border-black/10 dark:border-white/10 rounded-xl shadow-xl z-50 py-1 overflow-hidden"
                  onMouseLeave={() => setShowMenu(false)}
                >
                  {[
                    { label: "Archive", icon: Archive, action: onArchive, className: "text-neutral-700 dark:text-neutral-300" },
                    { label: "Delete", icon: Trash2, action: onSoftDelete, className: "text-red-500" },
                    { label: "Delete permanently", icon: Trash, action: onHardDelete, className: "text-red-600" },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => { item.action(); setShowMenu(false); }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-black/5 dark:hover:bg-white/5 transition ${item.className}`}
                    >
                      <item.icon className="w-3 h-3" />
                      {item.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className={`flex items-center gap-2 text-[10px] ${
        isActive ? "text-white/60 dark:text-black/60" : "text-neutral-400 dark:text-neutral-500"
      }`}>
        <span className="flex items-center gap-0.5">
          <MessageSquare className="w-2.5 h-2.5" />
          {session.messageCount}
        </span>
        <span className="flex items-center gap-0.5">
          <Clock className="w-2.5 h-2.5" />
          {relativeTime(session.lastMessageAt)}
        </span>
        {session.status === "archived" && (
          <span className="px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[9px] font-medium">
            Archived
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Main ChatPage ─────────────────────────────────────────────────────────────
export default function ChatPage() {
  // State
  const [sessions, setSessions] = useState<IChatSessionResponse[]>(MOCK_SESSIONS);
  const [currentSession, setCurrentSession] = useState<IChatSessionResponse | null>(MOCK_SESSIONS[0]);
  const [messages, setMessages] = useState<IChatMessageResponse[]>(MOCK_MESSAGES);
  const [stats, setStats] = useState<IChatStats | null>(MOCK_STATS);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isRenderingPreview, setIsRenderingPreview] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [previewResult, setPreviewResult] = useState<IPreviewResult | null>(null);
  const [pdfResult, setPdfResult] = useState<IPdfExportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | "starred" | "archived">("all");
  const [showExportToolbar, setShowExportToolbar] = useState(false);
  const [showNewSessionModal, setShowNewSessionModal] = useState(false);
  const [previewModalMsgId, setPreviewModalMsgId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [savedCustomizations, setSavedCustomizations] = useState<ICustomizations | undefined>();
  const [savedPaperStyle, setSavedPaperStyle] = useState<PaperStyle | undefined>();

  // Filtered sessions
  const filteredSessions = sessions.filter((s) => {
    if (searchQuery && !s.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterTab === "starred") return s.isStarred;
    if (filterTab === "archived") return s.status === "archived";
    return s.status !== "deleted";
  });

  const currentMessages = messages.filter((m) => m.chatSessionId === currentSession?.id);
  const hasMessages = currentMessages.length > 0;

  // Handlers
  const handleSelectSession = (s: IChatSessionResponse) => {
    setCurrentSession(s);
    setPreviewResult(null);
    setPdfResult(null);
    setShowExportToolbar(false);
  };

  const handleCreate = (title: string) => {
    const newSession: IChatSessionResponse = {
      id: `s${Date.now()}`,
      title,
      messageCount: 0,
      isStarred: false,
      status: "active",
      lastMessageAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    setSessions((prev) => [newSession, ...prev]);
    setCurrentSession(newSession);
    setShowNewSessionModal(false);
  };

  const handleUpdate = (payload: { sessionId: string; title?: string; isStarred?: boolean; status?: ChatStatus }) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === payload.sessionId ? { ...s, ...payload } : s))
    );
    if (currentSession?.id === payload.sessionId) {
      setCurrentSession((prev) => prev ? { ...prev, ...payload } : prev);
    }
  };

  const handleSoftDelete = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    if (currentSession?.id === sessionId) setCurrentSession(null);
  };

  const handleHardDelete = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    if (currentSession?.id === sessionId) setCurrentSession(null);
  };

  const handleSend = (question: string) => {
    if (!currentSession) return;
    const newOrder = currentMessages.length + 1;
    const userMsg: IChatMessageResponse = {
      id: `m${Date.now()}-u`,
      chatSessionId: currentSession.id,
      type: "user_question",
      content: question,
      order: newOrder,
      metadata: { timestamp: new Date().toISOString() },
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsSendingMessage(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMsg: IChatMessageResponse = {
        id: `m${Date.now()}-a`,
        chatSessionId: currentSession.id,
        type: "ai_answer",
        content: `**Great question!** Here's a thoughtful response to: *"${question}"*\n\nThis is a simulated answer demonstrating the AI response bubble. In production, this would connect to the real API endpoint at \`POST /chat/${currentSession.id}/message\`.\n\n- The answer would be **streamed** or returned in full\n- Markdown formatting is fully supported\n- You can render this in your handwriting style using the **Render** button below`,
        order: newOrder + 1,
        metadata: {
          timestamp: new Date().toISOString(),
          processingTimeMs: Math.floor(Math.random() * 1500) + 500,
        },
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsSendingMessage(false);
    }, 1800);
  };

  const handleRenderPreview = (messageId: string, chatSessionId: string) => {
    setPreviewModalMsgId(messageId);
  };

  const handlePreview = (payload: {
    sessionId: string;
    messageId: string;
    chatSessionId: string;
    customizations: ICustomizations;
    paperStyle: PaperStyle;
  }) => {
    setIsRenderingPreview(true);
    // Simulate API call
    setTimeout(() => {
      setPreviewResult({
        messageId: payload.messageId,
        previewImageUrl: `https://via.placeholder.com/600x800/f8f8f0/1a1a2e?text=Handwriting+Preview`,
      });
      setIsRenderingPreview(false);
    }, 2000);
  };

  const handleExportPdf = (customizations: ICustomizations, paperStyle: PaperStyle) => {
    if (!currentSession) return;
    setIsExportingPdf(true);
    setTimeout(() => {
      setPdfResult({
        pdfUrl: currentSession.pdfUrl || "https://example.com/exported.pdf",
        pdfPublicId: `pdf_${Date.now()}`,
        fileSize: 245760,
        message: "PDF generated successfully",
      });
      setIsExportingPdf(false);
    }, 2500);
  };

  const previewMsg = previewModalMsgId
    ? currentMessages.find((m) => m.id === previewModalMsgId)
    : null;

  const FILTER_TABS = [
    { key: "all", label: "All" },
    { key: "starred", label: "⭐ Starred" },
    { key: "archived", label: "Archived" },
  ] as const;

  return (
    <div className="flex h-screen bg-white dark:bg-neutral-950 overflow-hidden font-sans">

      {/* ── Sidebar ────────────────────────────────────────────────── */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 264, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}
            className="flex flex-col bg-neutral-50 dark:bg-neutral-900 border-r border-black/8 dark:border-white/8 overflow-hidden shrink-0"
          >
            {/* Logo + New Chat */}
            <div className="flex items-center justify-between px-4 py-4 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-black dark:bg-white flex items-center justify-center">
                  <PenLine className="w-4 h-4 text-white dark:text-black" />
                </div>
                <span className="font-bold text-sm text-black dark:text-white tracking-tight">Scripta</span>
              </div>
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={() => setShowNewSessionModal(true)}
                className="w-7 h-7 rounded-lg bg-black dark:bg-white text-white dark:text-black flex items-center justify-center hover:opacity-80 transition"
                title="New chat"
              >
                <Plus className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Search */}
            <div className="px-3 mb-2 shrink-0">
              <div className="flex items-center gap-2 bg-white dark:bg-neutral-800 border border-black/8 dark:border-white/8 rounded-xl px-3 py-2">
                <Search className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search sessions…"
                  className="bg-transparent text-xs text-black dark:text-white placeholder-neutral-400 outline-none flex-1 min-w-0"
                />
              </div>
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-1 px-3 mb-2 shrink-0">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilterTab(tab.key)}
                  className={`flex-1 py-1 rounded-lg text-[11px] font-medium transition ${
                    filterTab === tab.key
                      ? "bg-black dark:bg-white text-white dark:text-black"
                      : "text-neutral-500 dark:text-neutral-400 hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Session list */}
            <div className="flex-1 overflow-y-auto space-y-0.5 py-1">
              {isLoading ? (
                <div className="space-y-2 px-3 py-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-14 rounded-xl bg-black/5 dark:bg-white/5 animate-pulse" />
                  ))}
                </div>
              ) : filteredSessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 py-12 px-4 text-center">
                  <div className="w-12 h-12 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-neutral-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                      {searchQuery ? "No results" : "No sessions yet"}
                    </p>
                    <p className="text-xs text-neutral-400 dark:text-neutral-500">
                      {searchQuery ? "Try a different search." : "Start your first chat!"}
                    </p>
                  </div>
                  {!searchQuery && (
                    <button
                      onClick={() => setShowNewSessionModal(true)}
                      className="text-xs font-medium text-black dark:text-white underline underline-offset-2"
                    >
                      New session →
                    </button>
                  )}
                </div>
              ) : (
                filteredSessions.map((s) => (
                  <SessionCard
                    key={s.id}
                    session={s}
                    isActive={currentSession?.id === s.id}
                    onSelect={() => handleSelectSession(s)}
                    onStar={() => handleUpdate({ sessionId: s.id, isStarred: true })}
                    onUnstar={() => handleUpdate({ sessionId: s.id, isStarred: false })}
                    onArchive={() => handleUpdate({ sessionId: s.id, status: "archived" })}
                    onSoftDelete={() => handleSoftDelete(s.id)}
                    onHardDelete={() => handleHardDelete(s.id)}
                  />
                ))
              )}
            </div>

            {/* Stats */}
            <StatsCard
              stats={stats}
              isLoading={false}
              onFetch={() => {}}
            />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── Main area ──────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 relative">
        {/* Sidebar toggle button */}
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          className="absolute left-3 top-3.5 z-10 p-1.5 rounded-lg text-neutral-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/8 transition"
        >
          {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>

        {!currentSession ? (
          // No session selected
          <div className="flex flex-col items-center justify-center flex-1 gap-6 text-center px-6">
            <div className="w-20 h-20 rounded-3xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
              <PenLine className="w-10 h-10 text-neutral-400 dark:text-neutral-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-black dark:text-white mb-2">
                Scripta
              </h1>
              <p className="text-neutral-500 dark:text-neutral-400 max-w-sm text-sm leading-relaxed">
                Ask questions and get answers written beautifully in your own handwriting style.
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNewSessionModal(true)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-black dark:bg-white text-white dark:text-black font-semibold text-sm hover:opacity-80 transition"
            >
              <Plus className="w-4 h-4" />
              Start a new chat
            </motion.button>
          </div>
        ) : (
          <>
            {/* Session header */}
            <SessionHeader
              currentSession={currentSession}
              currentSessionTitle={currentSession.title}
              currentSessionIsStarred={currentSession.isStarred}
              currentSessionStatus={currentSession.status}
              currentSessionMessageCount={currentSession.messageCount}
              currentSessionPdfUrl={currentSession.pdfUrl ?? null}
              onUpdate={handleUpdate}
              onSoftDelete={handleSoftDelete}
              onHardDelete={handleHardDelete}
              onExportPdfClick={() => setShowExportToolbar((v) => !v)}
            />

            {/* Messages + ChatBox */}
            <div className="flex-1 min-h-0 flex flex-col relative overflow-hidden">
              <MessageList
                messages={currentMessages}
                hasMessages={hasMessages}
                isSendingMessage={isSendingMessage}
                isRenderingPreview={isRenderingPreview}
                previewResult={previewResult}
                onRenderPreview={handleRenderPreview}
              />

              <ChatBox
                isSendingMessage={isSendingMessage}
                currentSessionId={currentSession.id}
                onSend={handleSend}
              />

              {/* Export Toolbar slide-in */}
              <ExportToolbar
                isOpen={showExportToolbar}
                onClose={() => setShowExportToolbar(false)}
                isExportingPdf={isExportingPdf}
                pdfResult={pdfResult}
                currentSessionPdfUrl={currentSession.pdfUrl ?? null}
                onExport={handleExportPdf}
                onClearPdf={() => setPdfResult(null)}
                savedCustomizations={savedCustomizations}
                savedPaperStyle={savedPaperStyle}
              />
            </div>
          </>
        )}
      </div>

      {/* ── Handwriting Preview Modal ──────────────────────────────── */}
      {previewMsg && (
        <HandwritingPreviewModal
          isOpen={!!previewModalMsgId}
          onClose={() => setPreviewModalMsgId(null)}
          messageId={previewMsg.id}
          chatSessionId={previewMsg.chatSessionId}
          sessionId={currentSession?.id ?? ""}
          isRenderingPreview={isRenderingPreview}
          previewResult={previewResult}
          onRender={handlePreview}
          onClearPreview={() => setPreviewResult(null)}
          onSaveSettings={(c, p) => {
            setSavedCustomizations(c);
            setSavedPaperStyle(p);
          }}
        />
      )}

      {/* ── New Session Modal ──────────────────────────────────────── */}
      <NewSessionModal
        isOpen={showNewSessionModal}
        onClose={() => setShowNewSessionModal(false)}
        onCreate={handleCreate}
        isLoading={isLoading}
        error={error}
        hasHandwritingImage={true}
      />
    </div>
  );
}