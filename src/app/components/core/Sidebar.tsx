/* eslint-disable react-hooks/static-components */
"use client";

import React, { useState } from "react";
import {
  Home,
  MapPin,
  Moon,
  Sun,
  Settings,
  LogOut,
  Bell,
  Calendar,
  User2,
  Download,
  Check,
  History,
  MessageCircle,
} from "lucide-react";
import { useProfile } from "@/app/hooks/useProfile";
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
import { Tooltip } from "@/ui/data/tooltip/Tooltip.ui";
import { BsSpotify } from "react-icons/bs";
import { TiWeatherCloudy } from "react-icons/ti";
import MoodOrb from "../widget/Sidebar.widget";
import { GoReport } from "react-icons/go";

export { useSidebarContext, SidebarProvider };

export default function Sidebar({
  size = "md",
  variant = "default",
  position = "left",
  sticky = true,
  showToggle = true,
  showHamburger = true,
  title = "Dashboard",
  defaultMode = "expanded",
  persistToStorage = true,
  enableKeyboardShortcut = true,
  className = "",
}: {
  size?: SidebarSize;
  variant?: SidebarVariant;
  position?: SidebarPosition;
  sticky?: boolean;
  showSearch?: boolean;
  showToggle?: boolean;
  showHamburger?: boolean;
  title?: string;
  defaultMode?: "expanded" | "collapsed" | "hidden";
  persistToStorage?: boolean;
  enableKeyboardShortcut?: boolean;
  className?: string;
}) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();
  const { profile } = useProfile();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const sidebarItems: SidebarItem[] = [
    {
      id: "nudge",
      label: "Nudge",
      icon: <MessageCircle size={18} />,
      onClick: () => {
        router.push("/");
      },
    },
    {
      id: "mood",
      label: "Mood",
      icon: <Moon size={18} />,
      onClick: () => {
        router.push("/mood");
      },
    },
    {
      id: "todo",
      label: "TODO",
      icon: <Check size={18} />,
      onClick: () => {
        router.push("/todo");
      },
    },
    {
      id: "calendar",
      label: "Calendar",
      icon: <Calendar size={18} />,
      onClick: () => {
        router.push("/calendar");
      },
    },
    {
      id: "spotify",
      label: "Spotify",
      icon: <BsSpotify size={18} />,
      onClick: () => {
        router.push("/spotify");
      },
    },
    {
      id: "locations",
      label: "Locations",
      icon: <MapPin size={18} />,
      onClick: () => {
        router.push("/locations");
      },
    },
    {
      id: "reports",
      label: "Reports",
      icon: <GoReport size={18} />,
      onClick: () => {
        router.push("/reports");
      },
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell size={18} />,
      onClick: () => {
        router.push("/notifications");
      },
    },
    {
      id: "history",
      label: "History",
      icon: <History size={18} />,
      onClick: () => {
        router.push("/history");
      },
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings size={18} />,
      onClick: () => {
        router.push("/settings");
      },
    },
    {
      id: "profile",
      label: "Profile",
      icon: <User2 size={18} />,
      onClick: () => {
        if (profile?.username) {
          router.push(`/${profile.username}`);
        }
      },
    },
  ];
 const MoodOrbWidget = () => <MoodOrb />;
  const CustomHeader = () => (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center shrink-0">
        <Tooltip content={profile?.fullName}>
          <span className="text-white font-bold text-sm">
            {profile?.fullName?.charAt(0) || "U"}
          </span>
        </Tooltip>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
          {profile?.fullName || "User Name"}
        </p>
      </div>
    </div>
  );

  const CustomFooter = () => (
    <div className="space-y-2">
      <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-400 bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-100">
        <Download size={16} />
        <span className="text-sm">Install Mobile App</span>
      </button>
    </div>
  );

  return (
    <SidebarProvider
      defaultActiveItem="dashboard"
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
          moodWidget={<MoodOrbWidget />}
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