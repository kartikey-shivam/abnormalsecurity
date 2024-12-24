"use client";

import React from "react";
import {
  FolderIcon,
  ShareIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

interface SidebarProps {
  onNavigate: (view: string) => void;
  activeView: string;
}

const Sidebar = ({ onNavigate, activeView }: SidebarProps) => {
  const navigation = [
    { name: "My Files", view: "dashboard", icon: FolderIcon },
    { name: "Shared Files", view: "shared", icon: ShareIcon },
    { name: "Settings", view: "settings", icon: Cog6ToothIcon },
  ];

  return (
    <div className="flex flex-col w-64 bg-white border-r">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex-1 px-3 space-y-1">
          <nav className="space-y-1">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => onNavigate(item.view)}
                className={`${
                  activeView === item.view
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full`}
              >
                <item.icon
                  className={`${
                    activeView === item.view
                      ? "text-gray-500"
                      : "text-gray-400 group-hover:text-gray-500"
                  } mr-3 flex-shrink-0 h-6 w-6`}
                  aria-hidden="true"
                />
                {item.name}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
