import { create } from 'zustand';
import { Affiliate } from './types';

interface AffiliateState {
  affiliates: Affiliate[];
  isLoading: boolean;
  error: string | null;
  
  // Filters
  filters: {
    status: string[];
    planType: string[];
    search: string;
  };
  
  // Actions
  fetchAffiliates: () => Promise<void>;
  addAffiliate: (affiliate: Omit<Affiliate, 'id' | 'memberSince'>) => void;
  updateAffiliate: (id: string, updates: Partial<Affiliate>) => void;
  deleteAffiliate: (id: string) => void;
  setFilters: (filters: Partial<AffiliateState['filters']>) => void;
  clearFilters: () => void;
  
  // Computed
  getFilteredAffiliates: () => Affiliate[];
  getAffiliateById: (id: string) => Affiliate | undefined;
  getActiveAffiliates: () => Affiliate[];
  getAffiliatesByPlan: (planType: string) => Affiliate[];
}

// Mock data
const mockAffiliates: Affiliate[] = [
  {
    id: 'AF-2586',
    firstName: 'María',
    lastName: 'González',
    dpi: '1234567890101',
    email: 'maria.gonzalez@email.com',
    phone: '+502 5555-1234',
    dateOfBirth: '1985-03-15',
    gender: 'Femenino',
    address: 'Zona 10, Guatemala',
    city: 'Guatemala',
    department: 'Guatemala',
    planType: 'Premium',
    status: 'Activo',
    memberSince: new Date('2023-01-15'),
    dependents: [
      {
        id: 'dep-001',
        firstName: 'Carlos',
        lastName: 'González',
        dateOfBirth: '2010-05-20',
        relationship: 'Hijo',
        gender: 'Masculino',
      },
    ],
    emergencyContact: {
      name: 'Pedro González',
      relationship: 'Esposo',
      phone: '+502 5555-5678',
    },
  },
  {
    id: 'AF-3847',
    firstName: 'Juan',
    lastName: 'Pérez',
    dpi: '2345678901012',
    email: 'juan.perez@email.com',
    phone: '+502 5555-2345',
    dateOfBirth: '1978-07-22',
    gender: 'Masculino',
    address: 'Zona 14, Guatemala',
    city: 'Guatemala',
    department: 'Guatemala',
    planType: 'Elite',
    status: 'Activo',
    memberSince: new Date('2022-06-10'),
    emergencyContact: {
      name: 'Ana Pérez',
      relationship: 'Esposa',
      phone: '+502 5555-6789',
    },
  },
  {
    id: 'AF-1234',
    firstName: 'Laura',
    lastName: 'Martínez',
    dpi: '3456789012103',
    email: 'laura.martinez@email.com',
    phone: '+502 5555-3456',
    dateOfBirth: '1992-11-08',
    gender: 'Femenino',
    address: 'Zona 15, Guatemala',
    city: 'Guatemala',
    department: 'Guatemala',
    planType: 'Básico',
    status: 'Activo',
    memberSince: new Date('2024-02-20'),
  },
  {
    id: 'AF-5678',
    firstName: 'Roberto',
    lastName: 'Castillo',
    dpi: '4567890123104',
    email: 'roberto.castillo@email.com',
    phone: '+502 5555-4567',
    dateOfBirth: '1988-09-14',
    gender: 'Masculino',
    address: 'Zona 11, Guatemala',
    city: 'Guatemala',
    department: 'Guatemala',
    planType: 'Premium',
    status: 'Pendiente',
    memberSince: new Date('2025-10-25'),
  },
];

/**
 * Affiliate Store - Manages affiliate/patient data
 */
export const useAffiliateStore = create<AffiliateState>((set, get) => ({
  affiliates: mockAffiliates,
  isLoading: false,
  error: null,
  
  filters: {
    status: [],
    planType: [],
    search: '',
  },
  
  // Fetch affiliates (mock)
  fetchAffiliates: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      set({
        affiliates: mockAffiliates,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: 'Error al cargar afiliados',
        isLoading: false,
      });
    }
  },
  
  // Add affiliate
  addAffiliate: (affiliateData) => {
    const newAffiliate: Affiliate = {
      ...affiliateData,
      id: `AF-${Math.floor(1000 + Math.random() * 9000)}`,
      memberSince: new Date(),
    };
    
    set((state) => ({
      affiliates: [...state.affiliates, newAffiliate],
    }));
  },
  
  // Update affiliate
  updateAffiliate: (id: string, updates: Partial<Affiliate>) => {
    set((state) => ({
      affiliates: state.affiliates.map((affiliate) =>
        affiliate.id === id ? { ...affiliate, ...updates } : affiliate
      ),
    }));
  },
  
  // Delete affiliate
  deleteAffiliate: (id: string) => {
    set((state) => ({
      affiliates: state.affiliates.filter((affiliate) => affiliate.id !== id),
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
        planType: [],
        search: '',
      },
    });
  },
  
  // Get filtered affiliates
  getFilteredAffiliates: () => {
    const { affiliates, filters } = get();
    
    return affiliates.filter((affiliate) => {
      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(affiliate.status)) {
        return false;
      }
      
      // Plan type filter
      if (filters.planType.length > 0 && !filters.planType.includes(affiliate.planType)) {
        return false;
      }
      
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          affiliate.firstName.toLowerCase().includes(searchLower) ||
          affiliate.lastName.toLowerCase().includes(searchLower) ||
          affiliate.email.toLowerCase().includes(searchLower) ||
          affiliate.id.toLowerCase().includes(searchLower) ||
          affiliate.dpi.includes(filters.search)
        );
      }
      
      return true;
    });
  },
  
  // Get affiliate by ID
  getAffiliateById: (id: string) => {
    return get().affiliates.find((affiliate) => affiliate.id === id);
  },
  
  // Get active affiliates
  getActiveAffiliates: () => {
    return get().affiliates.filter((affiliate) => affiliate.status === 'Activo');
  },
  
  // Get affiliates by plan
  getAffiliatesByPlan: (planType: string) => {
    return get().affiliates.filter((affiliate) => affiliate.planType === planType);
  },
}));

/**
 * Selectors
 */
export const selectAffiliates = (state: AffiliateState) => state.affiliates;
export const selectIsLoading = (state: AffiliateState) => state.isLoading;
export const selectFilters = (state: AffiliateState) => state.filters;

/**
 * Helper hooks
 */
export const useAffiliates = () => useAffiliateStore(selectAffiliates);
export const useAffiliatesLoading = () => useAffiliateStore(selectIsLoading);
export const useAffiliateFilters = () => useAffiliateStore(selectFilters);
