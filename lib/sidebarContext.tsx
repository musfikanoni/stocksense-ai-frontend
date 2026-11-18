"use client";
import React, { createContext, useContext, useState, useCallback, useMemo } from "react";

type SidebarContextType = {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  toggleMobile: () => void;
  closeMobile: () => void;
};

const SidebarContext = createContext<SidebarContextType>({
  mobileOpen: false,
  setMobileOpen: () => {},
  toggleMobile: () => {},
  closeMobile: () => {},
});

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobile = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      mobileOpen,
      setMobileOpen,
      toggleMobile,
      closeMobile,
    }),
    [mobileOpen, toggleMobile, closeMobile]
  );

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebar = () => useContext(SidebarContext);
