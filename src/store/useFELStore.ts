/**
 * Store de Facturación Electrónica (FEL)
 * Gestión de facturas electrónicas según normativa SAT Guatemala
 */

import { create } from 'zustand';

// ============================================================================
// TIPOS
// ============================================================================

export interface FELItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  iva: number;
  total: number;
}

export interface FELCompany {
  name: string;
  nit: string;
  address: string;
  municipality: string;
  department: string;
  country: string;
  postalCode: string;
}

export interface FELInvoice {
  id: string;
  invoiceNumber: string;
  uuid: string;
  issueDate: string;
  issuer: FELCompany;
  receiver: FELCompany;
  items: FELItem[];
  subtotalAmount: number;
  ivaAmount: number;
  totalAmount: number;
  qrCode?: string;
  consultationUrl: string;
  status: 'Draft' | 'Issued' | 'Cancelled';
  createdAt: string;
  certifiedAt?: string;
}

interface FELState {
  invoices: FELInvoice[];
  currentInvoice: FELInvoice | null;
  setCurrentInvoice: (invoice: FELInvoice | null) => void;
  certifyInvoice: (id: string) => Promise<void>;
  cancelInvoice: (id: string) => Promise<void>;
}

// ============================================================================
// DATOS DE EJEMPLO
// ============================================================================

const mockInvoices: FELInvoice[] = [
  {
    id: '1',
    invoiceNumber: 'A001-00000001',
    uuid: '2E8F9A3B-4C5D-6E7F-8A9B-0C1D2E3F4A5B',
    issueDate: '2025-11-04',
    issuer: {
      name: 'MIRAFLORES PLUS S.A.',
      nit: '1234567-8',
      address: 'Av. Las Américas 10-50 Zona 14',
      municipality: 'Guatemala',
      department: 'Guatemala',
      country: 'Guatemala',
      postalCode: '01014',
    },
    receiver: {
      name: 'María José Rodríguez Pérez',
      nit: '9876543-2',
      address: 'Calzada Roosevelt 22-43 Zona 11',
      municipality: 'Mixco',
      department: 'Guatemala',
      country: 'Guatemala',
      postalCode: '01011',
    },
    items: [
      {
        id: '1',
        description: 'Plan Familiar Premium - Mensualidad Noviembre 2025',
        quantity: 1,
        unitPrice: 500.0,
        iva: 60.0,
        total: 560.0,
      },
      {
        id: '2',
        description: 'Consulta Médica General - Dr. Carlos Hernández',
        quantity: 2,
        unitPrice: 150.0,
        iva: 36.0,
        total: 336.0,
      },
      {
        id: '3',
        description: 'Exámenes de Laboratorio - Hemograma Completo',
        quantity: 1,
        unitPrice: 200.0,
        iva: 24.0,
        total: 224.0,
      },
    ],
    subtotalAmount: 1000.0,
    ivaAmount: 120.0,
    totalAmount: 1120.0,
    qrCode: 'QR_CODE_PLACEHOLDER',
    consultationUrl: 'https://fel.sat.gob.gt/consulta/2E8F9A3B',
    status: 'Issued',
    createdAt: '2025-11-04T10:30:00',
    certifiedAt: '2025-11-04T10:35:00',
  },
  {
    id: '2',
    invoiceNumber: 'A001-00000002',
    uuid: '3F9G0B4C-5D6E-7F8G-9H0I-1J2K3L4M5N6O',
    issueDate: '2025-11-03',
    issuer: {
      name: 'MIRAFLORES PLUS S.A.',
      nit: '1234567-8',
      address: 'Av. Las Américas 10-50 Zona 14',
      municipality: 'Guatemala',
      department: 'Guatemala',
      country: 'Guatemala',
      postalCode: '01014',
    },
    receiver: {
      name: 'Juan Carlos López García',
      nit: '5647382-1',
      address: 'Boulevard Vista Hermosa 15-25 Zona 15',
      municipality: 'Guatemala',
      department: 'Guatemala',
      country: 'Guatemala',
      postalCode: '01015',
    },
    items: [
      {
        id: '1',
        description: 'Plan Individual Básico - Mensualidad Noviembre 2025',
        quantity: 1,
        unitPrice: 250.0,
        iva: 30.0,
        total: 280.0,
      },
      {
        id: '2',
        description: 'Radiografía de Tórax',
        quantity: 1,
        unitPrice: 300.0,
        iva: 36.0,
        total: 336.0,
      },
    ],
    subtotalAmount: 550.0,
    ivaAmount: 66.0,
    totalAmount: 616.0,
    qrCode: 'QR_CODE_PLACEHOLDER_2',
    consultationUrl: 'https://fel.sat.gob.gt/consulta/3F9G0B4C',
    status: 'Draft',
    createdAt: '2025-11-03T14:20:00',
  },
];

// ============================================================================
// STORE
// ============================================================================

export const useFELStore = create<FELState>((set) => ({
  invoices: mockInvoices,
  currentInvoice: null,

  setCurrentInvoice: (invoice) =>
    set({
      currentInvoice: invoice,
    }),

  certifyInvoice: async (id) => {
    // Simular llamada API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    set((state) => ({
      invoices: state.invoices.map((inv) =>
        inv.id === id
          ? {
              ...inv,
              status: 'Issued' as const,
              certifiedAt: new Date().toISOString(),
              uuid: `CERT-${Math.random().toString(36).substring(7).toUpperCase()}`,
            }
          : inv
      ),
    }));
  },

  cancelInvoice: async (id) => {
    // Simular llamada API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    set((state) => ({
      invoices: state.invoices.map((inv) =>
        inv.id === id
          ? {
              ...inv,
              status: 'Cancelled' as const,
            }
          : inv
      ),
    }));
  },
}));
