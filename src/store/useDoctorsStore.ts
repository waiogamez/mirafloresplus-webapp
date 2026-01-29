import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from './types';

interface DoctorsState {
  doctors: User[];
  
  // Actions
  addDoctor: (doctor: Omit<User, 'id' | 'createdAt'>) => string;
  updateDoctor: (id: string, updates: Partial<User>) => void;
  deleteDoctor: (id: string) => void;
  getDoctorById: (id: string) => User | undefined;
  getAllDoctors: () => User[];
  getActiveDoctors: () => User[];
  updateDoctorFees: (id: string, fees: { videollamada: number; presencial: number }) => void;
  toggleDoctorStatus: (id: string) => void;
}

// Mock doctors iniciales
const INITIAL_DOCTORS: User[] = [
  {
    id: 'DOC-001',
    email: 'doctor@mirafloresplus.com',
    firstName: 'Dr. Carlos',
    lastName: 'Hernández',
    role: 'doctor',
    phone: '+502 2268-3457',
    hospital: 'Hospital Miraflores Zona 10',
    permissions: ['read', 'write'],
    createdAt: new Date('2024-01-08'),
    lastLogin: new Date(),
    specialty: 'Medicina General',
    licenseNumber: 'COL-12345',
    isActive: true,
    medicalFees: {
      videollamada: 100,
      presencial: 150,
    },
  },
  {
    id: 'DOC-002',
    email: 'dra.martinez@mirafloresplus.com',
    firstName: 'Dra. María',
    lastName: 'Martínez',
    role: 'doctor',
    phone: '+502 2268-3460',
    hospital: 'Hospital Miraflores Zona 10',
    permissions: ['read', 'write'],
    createdAt: new Date('2024-02-15'),
    lastLogin: new Date(),
    specialty: 'Pediatría',
    licenseNumber: 'COL-67890',
    isActive: true,
    medicalFees: {
      videollamada: 120,
      presencial: 180,
    },
  },
  {
    id: 'DOC-003',
    email: 'dr.lopez@mirafloresplus.com',
    firstName: 'Dr. Roberto',
    lastName: 'López',
    role: 'doctor',
    phone: '+502 2268-3461',
    hospital: 'Hospital Miraflores Roosevelt',
    permissions: ['read', 'write'],
    createdAt: new Date('2024-03-10'),
    lastLogin: new Date(),
    specialty: 'Cardiología',
    licenseNumber: 'COL-11223',
    isActive: true,
    medicalFees: {
      videollamada: 150,
      presencial: 200,
    },
  },
];

export const useDoctorsStore = create<DoctorsState>()(
  persist(
    (set, get) => ({
      doctors: INITIAL_DOCTORS,
      
      // Agregar nuevo doctor
      addDoctor: (doctorData) => {
        const newDoctor: User = {
          ...doctorData,
          id: `DOC-${Date.now()}`,
          createdAt: new Date(),
          role: 'doctor',
          isActive: true,
          medicalFees: doctorData.medicalFees || {
            videollamada: 100,
            presencial: 150,
          },
        };
        
        set((state) => ({
          doctors: [...state.doctors, newDoctor],
        }));
        
        return newDoctor.id;
      },
      
      // Actualizar doctor
      updateDoctor: (id, updates) => {
        set((state) => ({
          doctors: state.doctors.map((doc) =>
            doc.id === id ? { ...doc, ...updates } : doc
          ),
        }));
      },
      
      // Eliminar doctor (soft delete - marca como inactivo)
      deleteDoctor: (id) => {
        set((state) => ({
          doctors: state.doctors.map((doc) =>
            doc.id === id ? { ...doc, isActive: false } : doc
          ),
        }));
      },
      
      // Obtener doctor por ID
      getDoctorById: (id) => {
        return get().doctors.find((doc) => doc.id === id);
      },
      
      // Obtener todos los doctores
      getAllDoctors: () => {
        return get().doctors;
      },
      
      // Obtener solo doctores activos
      getActiveDoctors: () => {
        return get().doctors.filter((doc) => doc.isActive);
      },
      
      // Actualizar honorarios del doctor
      updateDoctorFees: (id, fees) => {
        set((state) => ({
          doctors: state.doctors.map((doc) =>
            doc.id === id
              ? { ...doc, medicalFees: fees }
              : doc
          ),
        }));
      },
      
      // Alternar estado activo/inactivo
      toggleDoctorStatus: (id) => {
        set((state) => ({
          doctors: state.doctors.map((doc) =>
            doc.id === id ? { ...doc, isActive: !doc.isActive } : doc
          ),
        }));
      },
    }),
    {
      name: 'doctors-storage',
    }
  )
);

/**
 * Selectors
 */
export const selectAllDoctors = (state: DoctorsState) => state.getAllDoctors();
export const selectActiveDoctors = (state: DoctorsState) => state.getActiveDoctors();

/**
 * Helper hooks
 */
export const useAllDoctors = () => useDoctorsStore(selectAllDoctors);
export const useActiveDoctors = () => useDoctorsStore(selectActiveDoctors);
