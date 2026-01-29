/**
 * API Service para Consultas Médicas
 * Mock implementation - reemplazar con llamadas reales al backend
 */

export interface Consultation {
  id: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  status: 'waiting' | 'in_call' | 'ended';
  startedAt?: string;
  endedAt?: string;
  duration?: number;
  roomName: string;
  notes?: string;
  prescriptions: Prescription[];
  files: ConsultationFile[];
}

export interface Prescription {
  id: string;
  consultationId: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
  createdAt: string;
}

export interface ConsultationFile {
  id: string;
  consultationId: string;
  fileName: string;
  fileType: 'pdf' | 'image' | 'lab_result';
  fileUrl: string;
  uploadedBy: string;
  uploadedAt: string;
  size: number;
}

export interface UpdateNotesRequest {
  notes: string;
}

export interface CreatePrescriptionRequest {
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface UploadFileResponse {
  id: string;
  fileName: string;
  fileUrl: string;
}

// Simulación de base de datos en memoria
const mockConsultations = new Map<string, Consultation>();

/**
 * Obtener información de una consulta
 */
export async function getConsultation(appointmentId: string): Promise<Consultation> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));

  // Buscar en mock o crear nueva
  let consultation = mockConsultations.get(appointmentId);
  
  if (!consultation) {
    // Crear consulta mock basada en appointmentId
    consultation = {
      id: `consult-${appointmentId}`,
      appointmentId: appointmentId,
      patientId: 'patient-001',
      patientName: 'María González',
      doctorId: 'doctor-001',
      doctorName: 'Dr. Carlos Hernández',
      specialty: 'Medicina General',
      status: 'waiting',
      roomName: `room-${appointmentId}-${Date.now()}`,
      notes: '',
      prescriptions: [],
      files: [],
    };
    
    mockConsultations.set(appointmentId, consultation);
  }

  return { ...consultation };
}

/**
 * Actualizar notas de la consulta
 */
export async function updateConsultationNotes(
  consultationId: string, 
  data: UpdateNotesRequest
): Promise<Consultation> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const consultation = Array.from(mockConsultations.values())
    .find(c => c.id === consultationId);

  if (!consultation) {
    throw new Error('Consulta no encontrada');
  }

  consultation.notes = data.notes;
  
  return { ...consultation };
}

/**
 * Crear una receta médica
 */
export async function createPrescription(
  consultationId: string,
  data: CreatePrescriptionRequest
): Promise<Prescription> {
  await new Promise(resolve => setTimeout(resolve, 300));

  const consultation = Array.from(mockConsultations.values())
    .find(c => c.id === consultationId);

  if (!consultation) {
    throw new Error('Consulta no encontrada');
  }

  const prescription: Prescription = {
    id: `rx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    consultationId,
    ...data,
    createdAt: new Date().toISOString(),
  };

  consultation.prescriptions.push(prescription);

  return { ...prescription };
}

/**
 * Eliminar una receta
 */
export async function deletePrescription(
  consultationId: string,
  prescriptionId: string
): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const consultation = Array.from(mockConsultations.values())
    .find(c => c.id === consultationId);

  if (!consultation) {
    throw new Error('Consulta no encontrada');
  }

  consultation.prescriptions = consultation.prescriptions.filter(
    p => p.id !== prescriptionId
  );
}

/**
 * Subir archivo (laboratorio, imagen, PDF)
 */
export async function uploadConsultationFile(
  consultationId: string,
  file: File
): Promise<UploadFileResponse> {
  // Simular upload
  await new Promise(resolve => setTimeout(resolve, 1000));

  const consultation = Array.from(mockConsultations.values())
    .find(c => c.id === consultationId);

  if (!consultation) {
    throw new Error('Consulta no encontrada');
  }

  // En producción, subir a S3/storage y obtener URL real
  const mockUrl = URL.createObjectURL(file);
  
  const fileType = file.type.includes('pdf') 
    ? 'pdf' 
    : file.type.includes('image') 
    ? 'image' 
    : 'lab_result';

  const consultationFile: ConsultationFile = {
    id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    consultationId,
    fileName: file.name,
    fileType,
    fileUrl: mockUrl,
    uploadedBy: 'doctor',
    uploadedAt: new Date().toISOString(),
    size: file.size,
  };

  consultation.files.push(consultationFile);

  return {
    id: consultationFile.id,
    fileName: consultationFile.fileName,
    fileUrl: consultationFile.fileUrl,
  };
}

/**
 * Eliminar archivo
 */
export async function deleteConsultationFile(
  consultationId: string,
  fileId: string
): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const consultation = Array.from(mockConsultations.values())
    .find(c => c.id === consultationId);

  if (!consultation) {
    throw new Error('Consulta no encontrada');
  }

  consultation.files = consultation.files.filter(f => f.id !== fileId);
}

/**
 * Finalizar consulta
 */
export async function endConsultation(consultationId: string): Promise<Consultation> {
  await new Promise(resolve => setTimeout(resolve, 300));

  const consultation = Array.from(mockConsultations.values())
    .find(c => c.id === consultationId);

  if (!consultation) {
    throw new Error('Consulta no encontrada');
  }

  const startTime = consultation.startedAt 
    ? new Date(consultation.startedAt) 
    : new Date();
  const endTime = new Date();
  const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000 / 60);

  consultation.status = 'ended';
  consultation.endedAt = endTime.toISOString();
  consultation.duration = duration;

  return { ...consultation };
}

/**
 * Iniciar consulta (cambiar estado a in_call)
 */
export async function startConsultation(consultationId: string): Promise<Consultation> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const consultation = Array.from(mockConsultations.values())
    .find(c => c.id === consultationId);

  if (!consultation) {
    throw new Error('Consulta no encontrada');
  }

  consultation.status = 'in_call';
  consultation.startedAt = new Date().toISOString();

  return { ...consultation };
}
