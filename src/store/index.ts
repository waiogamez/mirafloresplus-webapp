/**
 * Miraflores Plus - Centralized State Management
 * 
 * All stores are exported from this file for easy imports
 * 
 * @example
 * import { useAuthStore, useUIStore } from './store';
 */

// Stores
// export { useAuthStore, useCurrentUser, useUserRole, useIsAuthenticated, useSwitchRole } from './useAuthStore'; 
export { useUIStore, useSidebarCollapsed, useTheme, useCurrentPage, useModalOpen } from './useUIStore';
export { useNotificationStore, useNotifications, useUnreadCount, useUnreadNotifications } from './useNotificationStore';
export { useAppointmentStore, useAppointments, useAppointmentsLoading, useAppointmentFilters } from './useAppointmentStore';
export { useAffiliateStore, useAffiliates, useAffiliatesLoading, useAffiliateFilters } from './useAffiliateStore';
export { useAttendedAppointmentsStore, useTodayAttended, useInProgressAppointments } from './useAttendedAppointmentsStore';
export { useDoctorsStore, useAllDoctors, useActiveDoctors } from './useDoctorsStore';

// Types
export type { User, UserRole, Appointment, Affiliate, Dependent, Payment, Invoice, Notification, Metric, SystemStatus } from './types';

/**
 * Store Usage Guide
 * =================
 * 
 * 1. Auth Store (useAuthStore)
 * ----------------------------
 * Manages authentication and user state
 * 
 * @example
 * ```tsx
 * import { useAuthStore, useCurrentUser } from './store';
 * 
 * function MyComponent() {
 *   // Using the store directly
 *   const { user, login, logout } = useAuthStore();
 *   
 *   // Using a selector hook (optimized)
 *   const user = useCurrentUser();
 *   
 *   return <div>Hello {user?.firstName}</div>;
 * }
 * ```
 * 
 * 2. UI Store (useUIStore)
 * ------------------------
 * Manages UI state like sidebar, theme, modals
 * 
 * @example
 * ```tsx
 * import { useUIStore, useSidebarCollapsed } from './store';
 * 
 * function Sidebar() {
 *   const collapsed = useSidebarCollapsed();
 *   const toggleSidebar = useUIStore(state => state.toggleSidebar);
 *   
 *   return (
 *     <aside className={collapsed ? 'collapsed' : ''}>
 *       <button onClick={toggleSidebar}>Toggle</button>
 *     </aside>
 *   );
 * }
 * ```
 * 
 * 3. Notification Store (useNotificationStore)
 * --------------------------------------------
 * Manages in-app notifications
 * 
 * @example
 * ```tsx
 * import { useNotificationStore, useUnreadCount } from './store';
 * 
 * function NotificationBell() {
 *   const unreadCount = useUnreadCount();
 *   const markAllAsRead = useNotificationStore(state => state.markAllAsRead);
 *   
 *   return (
 *     <button>
 *       <Bell />
 *       {unreadCount > 0 && <Badge>{unreadCount}</Badge>}
 *     </button>
 *   );
 * }
 * ```
 * 
 * 4. Appointment Store (useAppointmentStore)
 * ------------------------------------------
 * Manages appointment data and operations
 * 
 * @example
 * ```tsx
 * import { useAppointmentStore, useAppointments } from './store';
 * 
 * function AppointmentList() {
 *   const appointments = useAppointments();
 *   const addAppointment = useAppointmentStore(state => state.addAppointment);
 *   const updateAppointment = useAppointmentStore(state => state.updateAppointment);
 *   
 *   const handleAdd = () => {
 *     addAppointment({
 *       affiliateId: 'AF-001',
 *       affiliateName: 'Juan Pérez',
 *       // ... other fields
 *     });
 *   };
 *   
 *   return (
 *     <div>
 *       {appointments.map(apt => (
 *         <AppointmentCard key={apt.id} appointment={apt} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 * 
 * 5. Affiliate Store (useAffiliateStore)
 * --------------------------------------
 * Manages affiliate/patient data
 * 
 * @example
 * ```tsx
 * import { useAffiliateStore, useAffiliates } from './store';
 * 
 * function AffiliateList() {
 *   const affiliates = useAffiliates();
 *   const getFilteredAffiliates = useAffiliateStore(
 *     state => state.getFilteredAffiliates
 *   );
 *   
 *   const filtered = getFilteredAffiliates();
 *   
 *   return (
 *     <div>
 *       {filtered.map(affiliate => (
 *         <AffiliateCard key={affiliate.id} affiliate={affiliate} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 * 
 * Performance Tips
 * ================
 * 
 * 1. Use Selectors
 * ----------------
 * Always use selectors to avoid unnecessary re-renders
 * 
 * ❌ Bad:
 * ```tsx
 * const store = useAuthStore(); // Re-renders on ANY store change
 * ```
 * 
 * ✅ Good:
 * ```tsx
 * const user = useAuthStore(state => state.user); // Only re-renders when user changes
 * ```
 * 
 * 2. Use Helper Hooks
 * -------------------
 * We provide optimized hooks for common selectors
 * 
 * ```tsx
 * const user = useCurrentUser(); // Already optimized
 * const unreadCount = useUnreadCount(); // Already optimized
 * ```
 * 
 * 3. Memoize Computed Values
 * ---------------------------
 * Use store's computed functions for complex operations
 * 
 * ```tsx
 * const getFilteredAffiliates = useAffiliateStore(
 *   state => state.getFilteredAffiliates
 * );
 * const filtered = getFilteredAffiliates(); // Computed in the store
 * ```
 * 
 * 4. Batch Updates
 * ----------------
 * Zustand automatically batches React updates
 * 
 * ```tsx
 * // These will trigger only ONE re-render
 * useUIStore.setState({ sidebarCollapsed: true });
 * useUIStore.setState({ theme: 'dark' });
 * ```
 * 
 * DevTools
 * ========
 * 
 * Zustand DevTools are automatically enabled in development.
 * Install Redux DevTools extension to inspect state:
 * https://github.com/reduxjs/redux-devtools
 */

/**
 * Reset all stores (useful for testing or logout)
 */
export function resetAllStores() {
  useAuthStore.getState().logout();
  useUIStore.setState({
    sidebarCollapsed: false,
    currentPage: 'dashboard',
    modals: {},
  });
  useNotificationStore.setState({
    notifications: [],
  });
  useAppointmentStore.setState({
    appointments: [],
    filters: {
      status: [],
      type: [],
      dateRange: null,
      search: '',
    },
  });
  useAffiliateStore.setState({
    affiliates: [],
    filters: {
      status: [],
      planType: [],
      search: '',
    },
  });
}

/**
 * Get all stores state (useful for debugging)
 */
export function getAllStoresState() {
  return {
    auth: useAuthStore.getState(),
    ui: useUIStore.getState(),
    notifications: useNotificationStore.getState(),
    appointments: useAppointmentStore.getState(),
    affiliates: useAffiliateStore.getState(),
  };
}