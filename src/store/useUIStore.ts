import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UIState {
  // Sidebar
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  // Theme
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  
  // Modals
  modals: Record<string, boolean>;
  openModal: (modalId: string) => void;
  closeModal: (modalId: string) => void;
  toggleModal: (modalId: string) => void;
  
  // Current Page
  currentPage: string;
  setCurrentPage: (page: string) => void;
  
  // Loading states
  globalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;
  
  // Search
  globalSearchOpen: boolean;
  setGlobalSearchOpen: (open: boolean) => void;
  
  // Help/Tour
  showKeyboardShortcuts: boolean;
  setShowKeyboardShortcuts: (show: boolean) => void;
  showOnboardingTour: boolean;
  setShowOnboardingTour: (show: boolean) => void;
  hasCompletedTour: boolean;
  completeTour: () => void;
}

/**
 * UI Store - Manages all UI-related state
 * Persisted to localStorage for consistent user experience
 */
export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Sidebar state
      sidebarCollapsed: false,
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed: boolean) =>
        set({ sidebarCollapsed: collapsed }),
      
      // Theme state
      theme: 'light',
      setTheme: (theme: 'light' | 'dark') => set({ theme }),
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      
      // Modals state
      modals: {},
      openModal: (modalId: string) =>
        set((state) => ({
          modals: { ...state.modals, [modalId]: true },
        })),
      closeModal: (modalId: string) =>
        set((state) => ({
          modals: { ...state.modals, [modalId]: false },
        })),
      toggleModal: (modalId: string) =>
        set((state) => ({
          modals: { ...state.modals, [modalId]: !state.modals[modalId] },
        })),
      
      // Current page
      currentPage: 'dashboard',
      setCurrentPage: (page: string) => set({ currentPage: page }),
      
      // Global loading
      globalLoading: false,
      setGlobalLoading: (loading: boolean) => set({ globalLoading: loading }),
      
      // Global search
      globalSearchOpen: false,
      setGlobalSearchOpen: (open: boolean) => set({ globalSearchOpen: open }),
      
      // Help & Tour
      showKeyboardShortcuts: false,
      setShowKeyboardShortcuts: (show: boolean) =>
        set({ showKeyboardShortcuts: show }),
      showOnboardingTour: false,
      setShowOnboardingTour: (show: boolean) =>
        set({ showOnboardingTour: show }),
      hasCompletedTour: false,
      completeTour: () => set({ hasCompletedTour: true, showOnboardingTour: false }),
    }),
    {
      name: 'miraflores-ui',
      storage: createJSONStorage(() => localStorage),
      // Persist UI preferences
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
        hasCompletedTour: state.hasCompletedTour,
      }),
    }
  )
);

/**
 * Selectors
 */
export const selectSidebarCollapsed = (state: UIState) => state.sidebarCollapsed;
export const selectTheme = (state: UIState) => state.theme;
export const selectCurrentPage = (state: UIState) => state.currentPage;
export const selectModalOpen = (modalId: string) => (state: UIState) =>
  state.modals[modalId] || false;

/**
 * Helper hooks
 */
export const useSidebarCollapsed = () => useUIStore(selectSidebarCollapsed);
export const useTheme = () => useUIStore(selectTheme);
export const useCurrentPage = () => useUIStore(selectCurrentPage);
export const useModalOpen = (modalId: string) =>
  useUIStore(selectModalOpen(modalId));
