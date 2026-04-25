"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PenLine,
  FileText,
  Upload,
  Download,
  Trash2,
  History,
  Settings,
  LogOut,
  Plus,
  ImageIcon,
  ChevronRight,
  Sparkles,
  User,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/app/context/Auth.context";
import { useProfile } from "@/app/hooks/useProfile.hooks";
import { useAppSelector } from "@/app/lib/hooks";
import { selectHandwritingImage } from "@/app/lib/features/profile/profile.selector";

type Tab = "generate" | "history" | "profile" | "settings";

const paperStyles = [
  { id: "lined", label: "Lined Notebook" },
  { id: "plain", label: "Plain White" },
  { id: "college", label: "College-Ruled" },
];

function Sidebar({
  activeTab,
  setTab,
  collapsed,
  onToggle,
}: {
  activeTab: Tab;
  setTab: (t: Tab) => void;
  collapsed: boolean;
  onToggle: () => void;
}) {
  const { user, signOut } = useAuth();

  const navItems: { id: Tab; icon: typeof PenLine; label: string }[] = [
    { id: "generate", icon: Sparkles, label: "Generate" },
    { id: "history", icon: History, label: "History" },
    { id: "profile", icon: User, label: "Profile" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  return (
    <aside
      className={`flex flex-col h-screen border-r border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 transition-all duration-300 ${collapsed ? "w-16" : "w-60"}`}
    >
      <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-900">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-zinc-900 dark:bg-white flex items-center justify-center">
              <PenLine className="w-3 h-3 text-white dark:text-zinc-900" />
            </div>
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Inkify
            </span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors ml-auto"
        >
          {collapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === id
                ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-3 border-t border-zinc-100 dark:border-zinc-900">
        <div
          className={`flex items-center gap-3 px-3 py-2 mb-2 ${collapsed ? "justify-center" : ""}`}
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-6 h-6 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
              <User className="w-3 h-3 text-zinc-500" />
            </div>
          )}
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                {user?.name}
              </p>
              <p className="text-[10px] text-zinc-400 truncate">
                {user?.email}
              </p>
            </div>
          )}
        </div>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all duration-200"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  );
}

function GenerateTab() {
  const [prompt, setPrompt] = useState("");
  const [paperStyle, setPaperStyle] = useState("lined");
  const [isGenerating, setIsGenerating] = useState(false);
  const hasHandwriting = useAppSelector(selectHandwritingImage);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsGenerating(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      <div className="flex-1 flex flex-col gap-5">
        {!hasHandwriting && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800"
          >
            <ImageIcon className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                No handwriting profile
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                Upload a photo of your handwriting in the Profile tab to
                personalize your documents.
              </p>
            </div>
          </motion.div>
        )}

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
            Assignment Prompt
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your question or assignment topic..."
            rows={6}
            className="w-full px-4 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent resize-none transition-all"
          />
          <p className="text-[11px] text-zinc-400 dark:text-zinc-600 text-right">
            {prompt.length} characters
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
            Paper Style
          </label>
          <div className="flex gap-2 flex-wrap">
            {paperStyles.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setPaperStyle(id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 ${
                  paperStyle === id
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white"
                    : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-600"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
          className="flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-all duration-200 shadow-lg shadow-zinc-900/10"
        >
          {isGenerating ? (
            <>
              <motion.div
                className="w-4 h-4 border-2 border-white/30 dark:border-zinc-900/30 border-t-white dark:border-t-zinc-900 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Assignment
            </>
          )}
        </motion.button>
      </div>

      <div className="lg:w-80 flex flex-col gap-4">
        <div className="p-5 rounded-2xl border border-zinc-100 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-900/50">
          <h3 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-4">
            Preview
          </h3>
          <div className="aspect-[3/4] rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shadow-inner">
            <div className="text-center p-6">
              <FileText className="w-8 h-8 text-zinc-300 dark:text-zinc-600 mx-auto mb-3" />
              <p className="text-xs text-zinc-400 dark:text-zinc-600">
                Your document will preview here
              </p>
            </div>
          </div>
        </div>

        <button
          disabled
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm font-medium text-zinc-400 dark:text-zinc-600 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </button>
      </div>
    </div>
  );
}

function HistoryTab() {
  const mockHistory = [
    {
      id: "1",
      question: "Explain Newton's laws of motion",
      date: "2 hours ago",
      style: "Lined Notebook",
    },
    {
      id: "2",
      question: "Summarize the causes of World War I",
      date: "Yesterday",
      style: "College-Ruled",
    },
    {
      id: "3",
      question: "Describe the water cycle in detail",
      date: "3 days ago",
      style: "Plain White",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Recent assignments
        </h2>
        <span className="text-xs text-zinc-400 dark:text-zinc-600">
          {mockHistory.length} total
        </span>
      </div>

      <div className="space-y-3">
        {mockHistory.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.35 }}
            className="group flex items-center gap-4 p-4 rounded-xl border border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-900/30 hover:border-zinc-200 dark:hover:border-zinc-800 hover:shadow-sm transition-all duration-200 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
              <FileText className="w-4.5 h-4.5 text-zinc-500" size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                {item.question}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[11px] text-zinc-400">{item.date}</span>
                <span className="text-zinc-300 dark:text-zinc-700">·</span>
                <span className="text-[11px] text-zinc-400">{item.style}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">
                <Download className="w-3.5 h-3.5" />
              </button>
              <button className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 text-zinc-400 hover:text-red-500 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-300 dark:text-zinc-700 group-hover:text-zinc-500 transition-colors flex-shrink-0" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ProfileTab() {
  const { profile, uploadImage, removeImage, isLoading } = useProfile();
  const { user } = useAuth();
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      uploadImage(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-3xl">
      <div className="flex-1 space-y-6">
        <div className="flex items-center gap-4">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-14 h-14 rounded-2xl object-cover border border-zinc-200 dark:border-zinc-800"
            />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
              <User className="w-6 h-6 text-zinc-400" />
            </div>
          )}
          <div>
            <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              {user?.name}
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {user?.email}
            </p>
            {profile?.designation && (
              <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
                {profile.designation}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Username", value: profile?.username ?? "—" },
            { label: "Nickname", value: profile?.nickname ?? "—" },
            { label: "Designation", value: profile?.designation ?? "—" },
            {
              label: "Age",
              value: profile?.age ? `${profile.age} years` : "—",
            },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-900"
            >
              <p className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-wider mb-1">
                {label}
              </p>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:w-64 flex flex-col gap-4">
        <div>
          <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider block mb-3">
            Handwriting Sample
          </label>

          {profile?.handwritingImage ? (
            <div className="relative group rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
              <img
                src={profile.handwritingImage.url}
                alt="Handwriting sample"
                className="w-full aspect-square object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => removeImage()}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500 text-white text-xs font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`relative aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200 ${
                dragOver
                  ? "border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800"
                  : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600"
              }`}
              onClick={() => document.getElementById("hw-upload")?.click()}
            >
              <input
                id="hw-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
              />
              {isLoading ? (
                <motion.div
                  className="w-6 h-6 border-2 border-zinc-300 border-t-zinc-900 dark:border-t-zinc-100 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              ) : (
                <>
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                    <Upload className="w-4.5 h-4.5 text-zinc-500" size={18} />
                  </div>
                  <div className="text-center px-4">
                    <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      Drop your handwriting
                    </p>
                    <p className="text-[11px] text-zinc-400 dark:text-zinc-600 mt-0.5">
                      JPEG, PNG or WebP · Max 5MB
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SettingsTab() {
  const { signOut } = useAuth();

  return (
    <div className="max-w-lg space-y-6">
      <div className="p-6 rounded-2xl border border-zinc-100 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-900/30 space-y-4">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Danger zone
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Delete account
            </p>
            <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-0.5">
              Permanently remove your account and all data
            </p>
          </div>
          <button className="px-4 py-2 rounded-xl border border-red-200 dark:border-red-800 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
            Delete
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Sign out
            </p>
            <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-0.5">
              Sign out of your account
            </p>
          </div>
          <button
            onClick={signOut}
            className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}

const TAB_LABELS: Record<Tab, string> = {
  generate: "Generate",
  history: "History",
  profile: "Profile",
  settings: "Settings",
};

export default function Homepage() {
  const [activeTab, setActiveTab] = useState<Tab>("generate");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-white dark:bg-zinc-950 overflow-hidden">
      <div className="hidden md:flex">
        <Sidebar
          activeTab={activeTab}
          setTab={setActiveTab}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 flex-shrink-0">
          <div>
            <h1
              className="text-base font-semibold text-zinc-900 dark:text-zinc-100"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              {TAB_LABELS[activeTab]}
            </h1>
            <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-0.5">
              {activeTab === "generate" &&
                "Create a new handwritten assignment"}
              {activeTab === "history" &&
                "View and re-download past assignments"}
              {activeTab === "profile" && "Manage your handwriting profile"}
              {activeTab === "settings" && "Account and preferences"}
            </p>
          </div>

          {activeTab === "generate" && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              New Assignment
            </motion.button>
          )}
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="h-full"
            >
              {activeTab === "generate" && <GenerateTab />}
              {activeTab === "history" && <HistoryTab />}
              {activeTab === "profile" && <ProfileTab />}
              {activeTab === "settings" && <SettingsTab />}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="md:hidden flex border-t border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950">
          {(["generate", "history", "profile", "settings"] as Tab[]).map(
            (tab) => {
              const icons = {
                generate: Sparkles,
                history: History,
                profile: User,
                settings: Settings,
              };
              const Icon = icons[tab];
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors ${activeTab === tab ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400 dark:text-zinc-600"}`}
                >
                  <Icon className="w-4.5 h-4.5" size={18} />
                  {TAB_LABELS[tab]}
                </button>
              );
            },
          )}
        </div>
      </main>
    </div>
  );
}
