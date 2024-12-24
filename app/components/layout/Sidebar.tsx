"use client";

import React from "react";
import {
  FolderIcon,
  ShareIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

interface NavigationItem {
  name: string;
  view: string;
  icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
}

interface SidebarProps {
  onNavigate: (view: string) => void;
  activeView: string;
}

const navigation: NavigationItem[] = [
  { name: "My Files", view: "dashboard", icon: FolderIcon },
  { name: "Shared Files", view: "shared", icon: ShareIcon },
  { name: "Security", view: "security", icon: ShieldCheckIcon },
  { name: "Team Access", view: "team", icon: UserGroupIcon },
  { name: "Settings", view: "settings", icon: Cog6ToothIcon },
];

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, activeView }) => {
  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white border-r">
          <div className="flex flex-col flex-grow">
            <nav className="flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = activeView === item.view;
                return (
                  <button
                    key={item.name}
                    onClick={() => onNavigate(item.view)}
                    className={`${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50"
                    } group flex items-center w-full px-2 py-2 text-sm font-medium rounded-md`}
                  >
                    <item.icon
                      className={`${
                        isActive ? "text-blue-600" : "text-gray-400"
                      } mr-3 flex-shrink-0 h-6 w-6`}
                    />
                    {item.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
