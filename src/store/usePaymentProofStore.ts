import { create } from 'zustand';
import type {} from './types';

interface PaymentProofState {
  // State
  paymentProofs: PaymentProof[];
  
  // Actions
  addPaymentProof: (proof: Omit<PaymentProof, 'id' | 'uploadedAt'>) => void;
  updatePaymentProofStatus: (id: string, status: 'Aprobado' | 'Rechazado', validatedBy: string, rejectionReason?: string) => void;
  getPaymentProofsByAffiliate: (affiliateId: string) => PaymentProof[];
  getPendingPaymentProofs: () => PaymentProof[];
  getPaymentProofById: (id: string) => PaymentProof | undefined;
}

// Mock data inicial
const INITIAL_PAYMENT_PROOFS: PaymentProof[] = [
  {
    id: 'proof-001',
    affiliateId: 'user-affiliate',
    affiliateName: 'María González Hernández',
    monthYear: 'Diciembre 2025',
    amount: 232.00,
    numberOfDependents: 3,
    proofImageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
    uploadedAt: new Date('2025-12-15'),
    uploadedBy: 'user-affiliate',
    uploadedByRole: 'affiliate',
    status: 'Aprobado',
    validatedBy: 'user-recepcion',
    validatedAt: new Date('2025-12-16'),
  },
  {
    id: 'proof-002',
    affiliateId: 'user-affiliate',
    affiliateName: 'María González Hernández',
    monthYear: 'Enero 2026',
    amount: 232.00,
    numberOfDependents: 3,
    proofImageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
    uploadedAt: new Date('2026-01-15'),
    uploadedBy: 'user-affiliate',
    uploadedByRole: 'affiliate',
    status: 'Pendiente',
  },
  {
    id: 'proof-003',
    affiliateId: 'aff-002',
    affiliateName: 'Carlos Rodríguez Pérez',
    monthYear: 'Enero 2026',
    amount: 134.00,
    numberOfDependents: 1,
    proofImageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
    uploadedAt: new Date('2026-01-20'),
    uploadedBy: 'aff-002',
    uploadedByRole: 'affiliate',
    status: 'Pendiente',
  },
];

export const usePaymentProofStore = create<PaymentProofState>((set, get) => ({
  paymentProofs: INITIAL_PAYMENT_PROOFS,
  
  addPaymentProof: (proof) => {
    const newProof: PaymentProof = {
      ...proof,
      id: `proof-${Date.now()}`,
      uploadedAt: new Date(),
    };
    set((state) => ({
      paymentProofs: [...state.paymentProofs, newProof],
    }));
  },
  
  updatePaymentProofStatus: (id, status, validatedBy, rejectionReason) => {
    set((state) => ({
      paymentProofs: state.paymentProofs.map((proof) =>
        proof.id === id
          ? {
              ...proof,
              status,
              validatedBy,
              validatedAt: new Date(),
              rejectionReason: status === 'Rechazado' ? rejectionReason : undefined,
            }
          : proof
      ),
    }));
  },
  
  getPaymentProofsByAffiliate: (affiliateId) => {
    return get().paymentProofs.filter((proof) => proof.affiliateId === affiliateId);
  },
  
  getPendingPaymentProofs: () => {
    return get().paymentProofs.filter((proof) => proof.status === 'Pendiente');
  },
  
  getPaymentProofById: (id) => {
    return get().paymentProofs.find((proof) => proof.id === id);
  },
}));