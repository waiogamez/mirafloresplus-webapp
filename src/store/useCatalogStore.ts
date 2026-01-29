import { create } from 'zustand';

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  license: string;
  email: string;
  phone: string;
  negotiatedRate: number;
  status: "Activo" | "Inactivo";
  branchId: number;
  contract: string;
  notes?: string;
}

export interface ExtraService {
  id: number;
  name: string;
  code: string;
  description: string;
  price: number;
  category: string;
  status: "Activo" | "Inactivo";
  branchId: number;
  requiresAppointment: boolean;
  estimatedDuration?: number;
}

interface CatalogState {
  specialists: Doctor[];
  extraServices: ExtraService[];
  
  // Getters
  getActiveSpecialists: () => Doctor[];
  getActiveServices: () => ExtraService[];
  getSpecialistsByBranch: (branchId: number) => Doctor[];
  getServicesByBranch: (branchId: number) => ExtraService[];
  
  // Setters
  setSpecialists: (specialists: Doctor[]) => void;
  setExtraServices: (services: ExtraService[]) => void;
  addSpecialist: (specialist: Doctor) => void;
  addExtraService: (service: ExtraService) => void;
  updateSpecialist: (id: number, specialist: Partial<Doctor>) => void;
  updateExtraService: (id: number, service: Partial<ExtraService>) => void;
  deleteSpecialist: (id: number) => void;
  deleteExtraService: (id: number) => void;
}

export const useCatalogStore = create<CatalogState>((set, get) => ({
  // Initial data
  specialists: [
    {
      id: 1,
      name: "Dr. Fernando Ruiz Castillo",
      specialty: "Cardiología",
      license: "ESP-GT-2012-034",
      email: "fruiz@cardioclinic.gt",
      phone: "+502 5555-1111",
      negotiatedRate: 250,
      status: "Activo",
      branchId: 1,
      contract: "Por Consulta",
      notes: "Disponible lunes, miércoles y viernes",
    },
    {
      id: 2,
      name: "Dra. Patricia Morales López",
      specialty: "Pediatría",
      license: "ESP-GT-2014-067",
      email: "pmorales@pediatriagt.com",
      phone: "+502 5555-2222",
      negotiatedRate: 220,
      status: "Activo",
      branchId: 1,
      contract: "Por Consulta",
    },
    {
      id: 3,
      name: "Dr. Miguel Santana Pérez",
      specialty: "Traumatología",
      license: "ESP-GT-2016-089",
      email: "msantana@traumacenter.gt",
      phone: "+502 5555-3333",
      negotiatedRate: 280,
      status: "Activo",
      branchId: 2,
      contract: "Por Consulta",
    },
    {
      id: 4,
      name: "Dra. Laura Ramírez García",
      specialty: "Dermatología",
      license: "ESP-GT-2018-123",
      email: "lramirez@dermaclinic.gt",
      phone: "+502 5555-4444",
      negotiatedRate: 220,
      status: "Activo",
      branchId: 1,
      contract: "Por Consulta",
    },
  ],

  extraServices: [
    {
      id: 1,
      name: "Hemograma Completo",
      code: "LAB-001",
      description: "Análisis completo de células sanguíneas",
      price: 180,
      category: "Laboratorio - Hematología",
      status: "Activo",
      branchId: 1,
      requiresAppointment: false,
    },
    {
      id: 2,
      name: "Perfil Lipídico",
      code: "LAB-002",
      description: "Colesterol total, HDL, LDL y triglicéridos",
      price: 150,
      category: "Laboratorio - Química Sanguínea",
      status: "Activo",
      branchId: 2,
      requiresAppointment: false,
    },
    {
      id: 3,
      name: "Glucosa en Ayunas",
      code: "LAB-003",
      description: "Medición de glucosa en sangre",
      price: 60,
      category: "Laboratorio - Química Sanguínea",
      status: "Activo",
      branchId: 1,
      requiresAppointment: false,
    },
    {
      id: 4,
      name: "Radiografía de Tórax",
      code: "IMG-001",
      description: "Imagen radiológica del tórax",
      price: 180,
      category: "Imagenología - Rayos X",
      status: "Activo",
      branchId: 1,
      requiresAppointment: true,
      estimatedDuration: 15,
    },
    {
      id: 5,
      name: "Ultrasonido Abdominal",
      code: "IMG-002",
      description: "Ecografía completa del abdomen",
      price: 280,
      category: "Imagenología - Ultrasonido",
      status: "Activo",
      branchId: 2,
      requiresAppointment: true,
      estimatedDuration: 30,
    },
    {
      id: 6,
      name: "Electrocardiograma (EKG)",
      code: "CAR-001",
      description: "Estudio del ritmo cardíaco",
      price: 120,
      category: "Imagenología - Rayos X",
      status: "Activo",
      branchId: 1,
      requiresAppointment: true,
      estimatedDuration: 20,
    },
    {
      id: 7,
      name: "Terapia Física (Sesión)",
      code: "TER-001",
      description: "Sesión individual de terapia física",
      price: 175,
      category: "Terapia Física",
      status: "Activo",
      branchId: 1,
      requiresAppointment: true,
      estimatedDuration: 45,
    },
    {
      id: 8,
      name: "Consulta Nutricional",
      code: "NUT-001",
      description: "Asesoría con nutricionista certificado",
      price: 150,
      category: "Nutrición",
      status: "Activo",
      branchId: 2,
      requiresAppointment: true,
      estimatedDuration: 30,
    },
  ],

  // Getters
  getActiveSpecialists: () => {
    return get().specialists.filter(s => s.status === "Activo");
  },

  getActiveServices: () => {
    return get().extraServices.filter(s => s.status === "Activo");
  },

  getSpecialistsByBranch: (branchId: number) => {
    return get().specialists.filter(s => s.branchId === branchId && s.status === "Activo");
  },

  getServicesByBranch: (branchId: number) => {
    return get().extraServices.filter(s => s.branchId === branchId && s.status === "Activo");
  },

  // Setters
  setSpecialists: (specialists) => set({ specialists }),
  
  setExtraServices: (services) => set({ extraServices: services }),

  addSpecialist: (specialist) => set((state) => ({
    specialists: [...state.specialists, specialist]
  })),

  addExtraService: (service) => set((state) => ({
    extraServices: [...state.extraServices, service]
  })),

  updateSpecialist: (id, updatedFields) => set((state) => ({
    specialists: state.specialists.map(s =>
      s.id === id ? { ...s, ...updatedFields } : s
    )
  })),

  updateExtraService: (id, updatedFields) => set((state) => ({
    extraServices: state.extraServices.map(s =>
      s.id === id ? { ...s, ...updatedFields } : s
    )
  })),

  deleteSpecialist: (id) => set((state) => ({
    specialists: state.specialists.filter(s => s.id !== id)
  })),

  deleteExtraService: (id) => set((state) => ({
    extraServices: state.extraServices.filter(s => s.id !== id)
  })),
}));
