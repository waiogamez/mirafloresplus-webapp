import { create } from 'zustand';
import { Appointment } from './types';

interface AppointmentState {
  appointments: Appointment[];
  isLoading: boolean;
  error: string | null;
  
  // Filters
  filters: {
    status: string[];
    type: string[];
    dateRange: { start: string; end: string } | null;
    search: string;
  };
  
  // Actions
  fetchAppointments: () => Promise<void>;
  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  deleteAppointment: (id: string) => void;
  setFilters: (filters: Partial<AppointmentState['filters']>) => void;
  clearFilters: () => void;
  
  // Computed
  getFilteredAppointments: () => Appointment[];
  getTodayAppointments: () => Appointment[];
  getUpcomingAppointments: () => Appointment[];
  getPendingConfirmationAppointments: () => Appointment[];
}

// Mock data
const mockAppointments: Appointment[] = [
  {
    id: 'apt-001',
    affiliateId: 'AF-2586',
    affiliateName: 'María González',
    doctorId: 'doc-001',
    doctorName: 'Dr. Carlos Méndez',
    date: new Date().toISOString().split('T')[0], // Today's date
    time: '10:00',
    type: 'Consulta General',
    status: 'Confirmada',
    hospital: 'Hospital Miraflores Zona 10',
    notes: 'Chequeo de rutina',
    createdBy: 'user-123',
    createdAt: new Date('2025-10-28'),
  },
  {
    id: 'apt-002',
    affiliateId: 'AF-3847',
    affiliateName: 'Juan Pérez',
    doctorId: 'doc-002',
    doctorName: 'Dra. Ana Rodríguez',
    date: new Date().toISOString().split('T')[0], // Today's date
    time: '14:30',
    type: 'Especialista',
    status: 'Programada',
    hospital: 'Hospital Miraflores Roosevelt',
    notes: 'Cardiología',
    createdBy: 'user-123',
    createdAt: new Date('2025-10-27'),
  },
  {
    id: 'apt-003',
    affiliateId: 'AF-1234',
    affiliateName: 'Laura Martínez',
    doctorId: 'doc-003',
    doctorName: 'Dr. Roberto García',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    time: '09:00',
    type: 'Seguimiento',
    status: 'Confirmada',
    hospital: 'Hospital Miraflores Zona 10',
    createdBy: 'user-123',
    createdAt: new Date('2025-10-29'),
  },
];

/**
 * Appointment Store - Manages appointment data
 */
export const useAppointmentStore = create<AppointmentState>((set, get) => ({
  appointments: mockAppointments,
  isLoading: false,
  error: null,
  
  filters: {
    status: [],
    type: [],
    dateRange: null,
    search: '',
  },
  
  // Fetch appointments (mock)
  fetchAppointments: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      set({
        appointments: mockAppointments,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: 'Error al cargar citas',
        isLoading: false,
      });
    }
  },
  
  // Add appointment
  addAppointment: (appointmentData) => {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: `apt-${Date.now()}`,
      createdAt: new Date(),
    };
    
    set((state) => ({
      appointments: [...state.appointments, newAppointment],
    }));
  },
  
  // Update appointment
  updateAppointment: (id: string, updates: Partial<Appointment>) => {
    set((state) => ({
      appointments: state.appointments.map((apt) =>
        apt.id === id
          ? { ...apt, ...updates, updatedAt: new Date() }
          : apt
      ),
    }));
  },
  
  // Update appointment status
  updateAppointmentStatus: (id: string, status: Appointment['status']) => {
    set((state) => ({
      appointments: state.appointments.map((apt) =>
        apt.id === id
          ? { ...apt, status, updatedAt: new Date() }
          : apt
      ),
    }));
  },
  
  // Delete appointment
  deleteAppointment: (id: string) => {
    set((state) => ({
      appointments: state.appointments.filter((apt) => apt.id !== id),
    }));
  },
  
  // Set filters
  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
  },
  
  // Clear filters
  clearFilters: () => {
    set({
      filters: {
        status: [],
        type: [],
        dateRange: null,
        search: '',
      },
    });
  },
  
  // Get filtered appointments
  getFilteredAppointments: () => {
    const { appointments, filters } = get();
    
    return appointments.filter((apt) => {
      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(apt.status)) {
        return false;
      }
      
      // Type filter
      if (filters.type.length > 0 && !filters.type.includes(apt.type)) {
        return false;
      }
      
      // Date range filter
      if (filters.dateRange) {
        const aptDate = new Date(apt.date);
        const startDate = new Date(filters.dateRange.start);
        const endDate = new Date(filters.dateRange.end);
        if (aptDate < startDate || aptDate > endDate) {
          return false;
        }
      }
      
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          apt.affiliateName.toLowerCase().includes(searchLower) ||
          apt.doctorName.toLowerCase().includes(searchLower) ||
          apt.type.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    });
  },
  
  // Get today's appointments
  getTodayAppointments: () => {
    const today = new Date().toISOString().split('T')[0];
    return get().appointments.filter((apt) => apt.date === today);
  },
  
  // Get upcoming appointments
  getUpcomingAppointments: () => {
    const today = new Date().toISOString().split('T')[0];
    return get()
      .appointments.filter((apt) => apt.date >= today)
      .sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);
        if (dateCompare !== 0) return dateCompare;
        return a.time.localeCompare(b.time);
      });
  },
  
  // Get pending confirmation appointments
  getPendingConfirmationAppointments: () => {
    return get().appointments.filter((apt) => apt.status === 'Pendiente');
  },
}));

/**
 * Selectors
 */
export const selectAppointments = (state: AppointmentState) => state.appointments;
export const selectIsLoading = (state: AppointmentState) => state.isLoading;
export const selectFilters = (state: AppointmentState) => state.filters;

/**
 * Helper hooks
 */
export const useAppointments = () => useAppointmentStore(selectAppointments);
export const useAppointmentsLoading = () => useAppointmentStore(selectIsLoading);
export const useAppointmentFilters = () => useAppointmentStore(selectFilters);