/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/static-components */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  MessageCircle,
  Download,
  Settings,
  Monitor,
  User2,
} from "lucide-react";
import {
  SidebarProvider,
  useSidebarContext,
  Sidebar as SidebarComponent,
  type SidebarItem,
  type SidebarSize,
  type SidebarVariant,
  type SidebarPosition,
} from "../../../ui/navigations/sidebar/Sidebar.ui";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/Auth.context";
import Recent from "@/app/modules/chat/core/Recent.chat";
import SearchModal from "@/app/modules/search/components/Search";
import { FaEnvelopeOpenText } from "react-icons/fa6";

export { useSidebarContext, SidebarProvider };

export default function Sidebar({
  size = "md",
  variant = "default",
  position = "left",
  sticky = true,
  showToggle = true,
  showHamburger = true,
  title = "Assignmate",
  defaultMode = "expanded",
  persistToStorage = true,
  enableKeyboardShortcut = true,
  className = "",
}: {
  size?: SidebarSize;
  variant?: SidebarVariant;
  position?: SidebarPosition;
  sticky?: boolean;
  showToggle?: boolean;
  showHamburger?: boolean;
  title?: string;
  defaultMode?: "expanded" | "collapsed" | "hidden";
  persistToStorage?: boolean;
  enableKeyboardShortcut?: boolean;
  className?: string;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Handle keyboard shortcut for search (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearchClick = () => {
    setIsSearchModalOpen(true);
  };

  const sidebarItems: SidebarItem[] = [
    {
      id: "new-chat",
      label: "New Chat",
      icon: <Plus size={18} />,
      onClick: () => router.push("/chat"),
    },
    {
      id: "search",
      label: "Search",
      icon: <Search size={18} />,
      onClick: handleSearchClick,
    },
    {
      id: "chats",
      label: "Chats",
      icon: <MessageCircle size={18} />,
      onClick: () => router.push("/history"),
    },
    {
      id: "downloads",
      label: "Downloads",
      icon: <Download size={18} />,
      onClick: () => router.push("/downloads"),
    },
    {
      id: "calligrapher",
      label: "Calligrapher",
      icon: <FaEnvelopeOpenText size={18} />,
      onClick: () => router.push("/calligrapher"),
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings size={18} />,
      onClick: () => router.push("/settings"),
    },
  ];

  const CustomHeader = () => (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 flex items-center justify-center shrink-0">
        <span>
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-6 h-6 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center shrink-0">
              <User2 className="w-3 h-3 text-zinc-500" />
            </div>
          )}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate line-clamp-1">
          {user?.name}
        </p>
      </div>
    </div>
  );

  const CustomFooter = () => (
    <div className="space-y-2">
      <button
        onClick={() => router.push("/download/desktop")}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-100"
      >
        <Monitor size={16} />
        <span className="text-sm">Install Desktop Version</span>
      </button>
    </div>
  );

  return (
    <SidebarProvider
      defaultActiveItem="home"
      defaultMode={defaultMode}
      size={size}
      variant={variant}
      persistToStorage={persistToStorage}
      enableKeyboardShortcut={enableKeyboardShortcut}
    >
      <div className="flex h-screen bg-white dark:bg-gray-950">
        <SidebarComponent
          items={sidebarItems}
          size={size}
          variant={variant}
          position={position}
          sticky={sticky}
          showSearch={false}
          showToggle={showToggle}
          showHamburger={showHamburger}
          title={title}
          header={<CustomHeader />}
          footer={<CustomFooter />}
          bottomContent={<Recent />}
          className={className}
          innerClassName="bg-white dark:bg-gray-900"
          headerClassName="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800"
          bodyClassName="bg-white dark:bg-gray-900"
          footerClassName="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
        />

        {/* Search Modal */}
        <SearchModal
          isOpen={isSearchModalOpen}
          onClose={() => setIsSearchModalOpen(false)}
        />
      </div>
    </SidebarProvider>
  );
}