import { create } from 'zustand';
import { User, UserRole } from './types';

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
}

// Mock database of users for production demo
const MOCK_USERS = {
  'recepcion@mirafloresplus.com': {
    password: 'recepcion123',
    user: {
      id: 'user-recepcion',
      email: 'recepcion@mirafloresplus.com',
      firstName: 'Ana',
      lastName: 'Martínez López',
      role: 'recepcion' as UserRole,
      phone: '+502 2268-3456',
      hospital: 'Hospital Miraflores Zona 10',
      permissions: ['read', 'write'],
      createdAt: new Date('2024-01-10'),
      lastLogin: new Date(),
    }
  },
  'doctor@mirafloresplus.com': {
    password: 'doctor123',
    user: {
      id: 'user-doctor',
      email: 'doctor@mirafloresplus.com',
      firstName: 'Dr. Carlos',
      lastName: 'Hernández',
      role: 'doctor' as UserRole,
      phone: '+502 2268-3457',
      hospital: 'Hospital Miraflores Zona 10',
      permissions: ['read', 'write'],
      createdAt: new Date('2024-01-08'),
      lastLogin: new Date(),
    }
  },
  'finanzas@mirafloresplus.com': {
    password: 'finanzas123',
    user: {
      id: 'user-finanzas',
      email: 'finanzas@mirafloresplus.com',
      firstName: 'Carlos',
      lastName: 'Méndez',
      role: 'finanzas' as UserRole,
      phone: '+502 2268-3458',
      hospital: 'Hospital Miraflores Zona 10',
      permissions: ['read', 'write', 'approve'],
      createdAt: new Date('2024-01-05'),
      lastLogin: new Date(),
    }
  },
  'junta@mirafloresplus.com': {
    password: 'junta123',
    user: {
      id: 'user-junta',
      email: 'junta@mirafloresplus.com',
      firstName: 'Roberto',
      lastName: 'Morales',
      role: 'junta' as UserRole,
      phone: '+502 2268-3459',
      hospital: 'Hospital Miraflores Zona 10',
      permissions: ['read', 'approve'],
      createdAt: new Date('2024-01-01'),
      lastLogin: new Date(),
    }
  },
  'afiliado@gmail.com': {
    password: 'afiliado123',
    user: {
      id: 'user-affiliate',
      email: 'afiliado@gmail.com',
      firstName: 'María',
      lastName: 'González Hernández',
      role: 'affiliate' as UserRole,
      phone: '+502 5555-1234',
      hospital: 'Hospital Miraflores Zona 10',
      permissions: ['read'],
      createdAt: new Date('2024-02-15'),
      lastLogin: new Date(),
      planName: 'Para Todos' as const,
      numberOfDependents: 3, // Afiliado + 3 dependientes = Q232.00
      isActive: true, // Estado activo porque tiene comprobante aprobado
      membershipExpiryDate: new Date('2025-02-15'), // Vencimiento de membresía
    }
  },
  'admin@mirafloresplus.com': {
    password: 'admin123',
    user: {
      id: 'user-admin',
      email: 'admin@mirafloresplus.com',
      firstName: 'Mario',
      lastName: 'Rodríguez',
      role: 'superadmin' as UserRole,
      phone: '+502 2268-3460',
      hospital: 'Hospital Miraflores Zona 10',
      permissions: ['read', 'write', 'approve', 'delete', 'admin'],
      createdAt: new Date('2023-12-01'),
      lastLogin: new Date(),
    }
  }
};

/**
 * Auth Store - Manages authentication state
 * Manually persisted to localStorage (no persist middleware to avoid issues with functions)
 */
export const useAuthStore = create<AuthState>()((set, get) => {
  // Try to load initial state from localStorage
  let initialUser: User | null = null;
  let initialIsAuthenticated = false;
  
  try {
    const stored = localStorage.getItem('miraflores-auth');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.user && parsed.isAuthenticated) {
        initialUser = {
          ...parsed.user,
          createdAt: new Date(parsed.user.createdAt),
          lastLogin: new Date(parsed.user.lastLogin),
        };
        initialIsAuthenticated = true;
        console.log('🔄 [Auth Store] Restored session:', initialUser.firstName, initialUser.role);
      }
    }
  } catch (error) {
    console.error('❌ [Auth Store] Error loading from localStorage:', error);
  }
  
  // Helper function to save to localStorage
  const saveToLocalStorage = (user: User | null, isAuthenticated: boolean) => {
    try {
      const dataToSave = {
        user,
        isAuthenticated,
      };
      localStorage.setItem('miraflores-auth', JSON.stringify(dataToSave));
      if (user) {
        console.log('💾 [Auth Store] Session saved:', user.firstName, user.role);
      }
    } catch (error) {
      console.error('❌ [Auth Store] Error saving to localStorage:', error);
    }
  };
  
  return {
    // Initial state
    user: initialUser,
    isAuthenticated: initialIsAuthenticated,
    isLoading: false,
    
    // Login action
    login: async (email: string, password: string) => {
      set({ isLoading: true });
      
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Find user in mock database
        const userCredentials = MOCK_USERS[email.toLowerCase() as keyof typeof MOCK_USERS];
        
        if (!userCredentials || userCredentials.password !== password) {
          set({ isLoading: false });
          throw new Error('Credenciales inválidas');
        }
        
        // Update last login
        const authenticatedUser: User = {
          ...userCredentials.user,
          lastLogin: new Date(),
        };
        
        set({
          user: authenticatedUser,
          isAuthenticated: true,
          isLoading: false,
        });
        
        saveToLocalStorage(authenticatedUser, true);
        console.log('✅ [Auth Store] Login successful:', authenticatedUser.firstName, authenticatedUser.role);
      } catch (error) {
        set({ isLoading: false });
        throw error;
      }
    },
    
    // Logout action
    logout: () => {
      set({
        user: null,
        isAuthenticated: false,
      });
      saveToLocalStorage(null, false);
      console.log('👋 [Auth Store] User logged out');
    },
    
    // Set user directly
    setUser: (user: User) => {
      set({
        user,
        isAuthenticated: true,
      });
      saveToLocalStorage(user, true);
    },
    
    // Update user fields
    updateUser: (updates: Partial<User>) => {
      const currentUser = get().user;
      if (!currentUser) return;
      
      const updatedUser = {
        ...currentUser,
        ...updates,
      };
      
      set({
        user: updatedUser,
      });
      
      saveToLocalStorage(updatedUser, true);
    },
  };
});

/**
 * Selectors for optimized component updates
 */
export const selectUser = (state: AuthState) => state.user;
export const selectUserRole = (state: AuthState) => state.user?.role || 'finanzas';
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated;
export const selectUserPermissions = (state: AuthState) => state.user?.permissions || [];

/**
 * Helper hooks for common patterns
 */
export const useCurrentUser = () => useAuthStore(selectUser);
export const useUserRole = () => useAuthStore(selectUserRole);
export const useIsAuthenticated = () => useAuthStore(selectIsAuthenticated);
/**
 * Mock fix para evitar errores de importación de Figma
 */
export const useSwitchRole = () => () => console.log("SwitchRole no implementado");
