'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  announcementClosed: boolean;
  closeAnnouncement: () => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      announcementClosed: false,
      closeAnnouncement: () => set({ announcementClosed: true }),
      searchOpen: false,
      setSearchOpen: (open) => set({ searchOpen: open }),
      mobileNavOpen: false,
      setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
    }),
    {
      name: 'bt_ui',
      partialize: (state) => ({ announcementClosed: state.announcementClosed }),
    },
  ),
);
