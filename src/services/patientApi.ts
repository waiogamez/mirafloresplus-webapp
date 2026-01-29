/**
 * API Service para información de Pacientes/Afiliados
 * Mock implementation - reemplazar con llamadas reales al backend
 */

export interface PatientInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'M' | 'F' | 'Otro';
  bloodType?: string;
  allergies: string[];
  chronicConditions: string[];
  currentMedications: string[];
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  dependents: Dependent[];
  insurance: {
    plan: string;
    memberSince: string;
    status: 'active' | 'inactive';
  };
}

export interface Dependent {
  id: string;
  firstName: string;
  lastName: string;
  relationship: string;
  dateOfBirth: string;
  gender: 'M' | 'F' | 'Otro';
}

export interface MedicalHistory {
  id: string;
  date: string;
  type: 'consultation' | 'lab' | 'prescription' | 'procedure';
  title: string;
  doctor: string;
  specialty: string;
  summary: string;
  attachments?: string[];
}

// Mock data
const mockPatients: Record<string, PatientInfo> = {
  'patient-001': {
    id: 'patient-001',
    firstName: 'María',
    lastName: 'González',
    email: 'maria.gonzalez@email.com',
    phone: '+502 5555-1234',
    dateOfBirth: '1985-03-15',
    gender: 'F',
    bloodType: 'O+',
    allergies: ['Penicilina', 'Polen'],
    chronicConditions: ['Hipertensión'],
    currentMedications: ['Losartán 50mg (diario)'],
    emergencyContact: {
      name: 'Juan González',
      relationship: 'Esposo',
      phone: '+502 5555-5678',
    },
    dependents: [
      {
        id: 'dep-001',
        firstName: 'Ana',
        lastName: 'González',
        relationship: 'Hija',
        dateOfBirth: '2015-08-20',
        gender: 'F',
      },
      {
        id: 'dep-002',
        firstName: 'Carlos',
        lastName: 'González',
        relationship: 'Hijo',
        dateOfBirth: '2018-11-10',
        gender: 'M',
      },
    ],
    insurance: {
      plan: 'Para Todos',
      memberSince: '2024-01-15',
      status: 'active',
    },
  },
};

const mockHistory: Record<string, MedicalHistory[]> = {
  'patient-001': [
    {
      id: 'hist-001',
      date: '2026-01-15',
      type: 'consultation',
      title: 'Consulta General',
      doctor: 'Dr. Roberto Martínez',
      specialty: 'Medicina General',
      summary: 'Control de presión arterial. Paciente estable con medicación actual.',
    },
    {
      id: 'hist-002',
      date: '2025-12-10',
      type: 'lab',
      title: 'Exámenes de Laboratorio',
      doctor: 'Dr. Ana García',
      specialty: 'Medicina General',
      summary: 'Perfil lipídico y glucosa en ayunas. Resultados dentro de rangos normales.',
    },
    {
      id: 'hist-003',
      date: '2025-11-05',
      type: 'prescription',
      title: 'Renovación de Receta',
      doctor: 'Dr. Carlos Hernández',
      specialty: 'Cardiología',
      summary: 'Renovación de Losartán 50mg para control de hipertensión.',
    },
  ],
};

/**
 * Obtener información completa del paciente
 */
export async function getPatientInfo(patientId: string): Promise<PatientInfo> {
  await new Promise(resolve => setTimeout(resolve, 300));

  const patient = mockPatients[patientId];
  
  if (!patient) {
    throw new Error('Paciente no encontrado');
  }

  return { ...patient };
}

/**
 * Obtener historial médico del paciente
 */
export async function getPatientHistory(patientId: string): Promise<MedicalHistory[]> {
  await new Promise(resolve => setTimeout(resolve, 400));

  const history = mockHistory[patientId] || [];
  
  return [...history];
}

/**
 * Buscar paciente por ID de cita
 */
export async function getPatientByAppointment(appointmentId: string): Promise<PatientInfo> {
  await new Promise(resolve => setTimeout(resolve, 300));

  // En producción, esto haría un lookup en el backend
  // Por ahora retornamos el paciente mock
  return getPatientInfo('patient-001');
}
