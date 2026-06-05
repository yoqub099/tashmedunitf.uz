"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { NavTreeItem } from "@/types";

const NavigationContext = createContext<NavTreeItem[]>([]);

export function NavigationProvider({
  items,
  children,
}: {
  items: NavTreeItem[];
  children: ReactNode;
}) {
  return (
    <NavigationContext.Provider value={items}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation(): NavTreeItem[] {
  return useContext(NavigationContext);
}
