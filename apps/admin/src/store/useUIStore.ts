"use client";

import { create } from "zustand";

interface UIState {
  // Mobile menu
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;

  // Edit modal
  isEditModalOpen: boolean;
  editingEntity: { type: string; id?: number | string; data?: Record<string, unknown> } | null;
  openEditModal: (type: string, id?: number | string, data?: Record<string, unknown>) => void;
  closeEditModal: () => void;

  // Delete confirmation
  isDeleteDialogOpen: boolean;
  deletingEntity: { type: string; id: number | string; label?: string } | null;
  openDeleteDialog: (type: string, id: number | string, label?: string) => void;
  closeDeleteDialog: () => void;

  // Dashboard dropdown
  isDashboardOpen: boolean;
  toggleDashboard: () => void;
  closeDashboard: () => void;

  // Notification
  isNotificationOpen: boolean;
  toggleNotification: () => void;
  closeNotification: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  // Mobile menu
  isMobileMenuOpen: false,
  toggleMobileMenu: () => set((s) => ({ isMobileMenuOpen: !s.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),

  // Edit modal
  isEditModalOpen: false,
  editingEntity: null,
  openEditModal: (type, id, data) =>
    set({ isEditModalOpen: true, editingEntity: { type, id, data } }),
  closeEditModal: () => set({ isEditModalOpen: false, editingEntity: null }),

  // Delete confirmation
  isDeleteDialogOpen: false,
  deletingEntity: null,
  openDeleteDialog: (type, id, label) =>
    set({ isDeleteDialogOpen: true, deletingEntity: { type, id, label } }),
  closeDeleteDialog: () => set({ isDeleteDialogOpen: false, deletingEntity: null }),

  // Dashboard dropdown
  isDashboardOpen: false,
  toggleDashboard: () => set((s) => ({ isDashboardOpen: !s.isDashboardOpen, isNotificationOpen: false })),
  closeDashboard: () => set({ isDashboardOpen: false }),

  // Notification
  isNotificationOpen: false,
  toggleNotification: () => set((s) => ({ isNotificationOpen: !s.isNotificationOpen, isDashboardOpen: false })),
  closeNotification: () => set({ isNotificationOpen: false }),
}));
