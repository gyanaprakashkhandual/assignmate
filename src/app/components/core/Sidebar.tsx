"use client";

import React from "react";
import {
  Home,
  Plus,
  Search,
  MessageCircle,
  Download,
  Settings,
  Monitor,
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
import { useProfile } from "@/app/hooks/useProfile.hooks";

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
  const { nickname, username } = useProfile();

  const displayName = nickname || username || "User";

  const sidebarItems: SidebarItem[] = [
    {
      id: "home",
      label: "Home",
      icon: <Home size={18} />,
      onClick: () => router.push("/"),
    },
    {
      id: "new-chat",
      label: "New Chat",
      icon: <Plus size={18} />,
      onClick: () => router.push("/chat/new"),
    },
    {
      id: "search",
      label: "Search",
      icon: <Search size={18} />,
      onClick: () => router.push("/search"),
    },
    {
      id: "chats",
      label: "Chats",
      icon: <MessageCircle size={18} />,
      onClick: () => router.push("/chats"),
    },
    {
      id: "downloads",
      label: "Downloads",
      icon: <Download size={18} />,
      onClick: () => router.push("/downloads"),
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
      <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center shrink-0">
        <span className="text-white font-bold text-sm">
          {displayName.charAt(0).toUpperCase()}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
          {displayName}
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
          className={className}
          innerClassName="bg-white dark:bg-gray-900"
          headerClassName="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800"
          bodyClassName="bg-white dark:bg-gray-900"
          footerClassName="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
        />
      </div>
    </SidebarProvider>
  );
}
