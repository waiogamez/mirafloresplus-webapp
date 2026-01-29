import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useDoctorsStore } from './useDoctorsStore';

export interface AttendedAppointment {
  id: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  type: 'Presencial' | 'Videollamada';
  duration: number; // en minutos
  fee: number; // honorario médico en Quetzales
  status: 'En curso' | 'Completada' | 'Cancelada';
  notes?: string;
  attendedAt: Date;
  completedAt?: Date;
  createdBy: string; // ID del usuario que registró la atención
  branch?: string; // Sede donde se atendió (solo para presencial)
}

export interface MonthlyDoctorReport {
  doctorId: string;
  doctorName: string;
  month: string; // YYYY-MM
  totalAppointments: number;
  presencialAppointments: number;
  videollamadaAppointments: number;
  totalHours: number;
  totalFees: number; // Total de honorarios
  appointments: AttendedAppointment[];
}

interface AttendedAppointmentsState {
  attendedAppointments: AttendedAppointment[];
  
  // Actions
  startAppointment: (appointment: Omit<AttendedAppointment, 'id' | 'attendedAt' | 'status' | 'fee'>) => string;
  completeAppointment: (id: string, notes?: string) => void;
  cancelAppointment: (id: string, reason: string) => void;
  getAttendedByDoctor: (doctorId: string) => AttendedAppointment[];
  getAttendedByDate: (date: string) => AttendedAppointment[];
  getMonthlyReport: (doctorId: string, month: string) => MonthlyDoctorReport;
  getAllMonthlyReports: (month: string) => MonthlyDoctorReport[];
  getTodayAttended: () => AttendedAppointment[];
}

const FEES_BY_TYPE = {
  'Presencial': 150, // Q150 por consulta presencial (default)
  'Videollamada': 100, // Q100 por videoconsulta (default)
};

// Función helper para obtener honorarios del médico
function getDoctorFees(doctorId: string, type: 'Presencial' | 'Videollamada'): number {
  const doctor = useDoctorsStore.getState().getDoctorById(doctorId);
  
  if (doctor?.medicalFees) {
    return type === 'Videollamada' 
      ? doctor.medicalFees.videollamada 
      : doctor.medicalFees.presencial;
  }
  
  // Fallback a tarifas por defecto si no se encuentra el médico
  return FEES_BY_TYPE[type];
}

export const useAttendedAppointmentsStore = create<AttendedAppointmentsState>()(
  persist(
    (set, get) => ({
      attendedAppointments: [],
      
      // Iniciar atención de cita
      startAppointment: (appointmentData) => {
        // Obtener honorario personalizado del médico
        const fee = getDoctorFees(appointmentData.doctorId, appointmentData.type);
        
        const newAttended: AttendedAppointment = {
          ...appointmentData,
          id: `ATT-${Date.now()}`,
          attendedAt: new Date(),
          status: 'En curso',
          fee, // Usar honorario personalizado del médico
          duration: 0,
        };
        
        set((state) => ({
          attendedAppointments: [newAttended, ...state.attendedAppointments],
        }));
        
        return newAttended.id;
      },
      
      // Completar cita atendida
      completeAppointment: (id, notes) => {
        set((state) => ({
          attendedAppointments: state.attendedAppointments.map((apt) =>
            apt.id === id
              ? {
                  ...apt,
                  status: 'Completada',
                  completedAt: new Date(),
                  notes: notes || apt.notes,
                }
              : apt
          ),
        }));
      },
      
      // Cancelar cita
      cancelAppointment: (id, reason) => {
        set((state) => ({
          attendedAppointments: state.attendedAppointments.map((apt) =>
            apt.id === id
              ? {
                  ...apt,
                  status: 'Cancelada',
                  notes: `Cancelada: ${reason}`,
                  completedAt: new Date(),
                }
              : apt
          ),
        }));
      },
      
      // Obtener citas atendidas por doctor
      getAttendedByDoctor: (doctorId) => {
        return get().attendedAppointments.filter(
          (apt) => apt.doctorId === doctorId
        );
      },
      
      // Obtener citas atendidas por fecha
      getAttendedByDate: (date) => {
        return get().attendedAppointments.filter(
          (apt) => apt.date === date
        );
      },
      
      // Obtener citas atendidas hoy
      getTodayAttended: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().attendedAppointments.filter(
          (apt) => apt.date === today
        );
      },
      
      // Generar reporte mensual por doctor
      getMonthlyReport: (doctorId, month) => {
        const appointments = get().attendedAppointments.filter(
          (apt) => 
            apt.doctorId === doctorId && 
            apt.date.startsWith(month) &&
            apt.status === 'Completada'
        );
        
        const totalHours = appointments.reduce((sum, apt) => sum + apt.duration, 0) / 60;
        const totalFees = appointments.reduce((sum, apt) => sum + apt.fee, 0);
        
        return {
          doctorId,
          doctorName: appointments[0]?.doctorName || '',
          month,
          totalAppointments: appointments.length,
          presencialAppointments: appointments.filter(a => a.type === 'Presencial').length,
          videollamadaAppointments: appointments.filter(a => a.type === 'Videollamada').length,
          totalHours,
          totalFees,
          appointments,
        };
      },
      
      // Obtener reportes mensuales de todos los doctores
      getAllMonthlyReports: (month) => {
        const appointments = get().attendedAppointments.filter(
          (apt) => apt.date.startsWith(month) && apt.status === 'Completada'
        );
        
        // Agrupar por doctor
        const doctorMap = new Map<string, AttendedAppointment[]>();
        appointments.forEach((apt) => {
          if (!doctorMap.has(apt.doctorId)) {
            doctorMap.set(apt.doctorId, []);
          }
          doctorMap.get(apt.doctorId)!.push(apt);
        });
        
        // Generar reportes
        return Array.from(doctorMap.entries()).map(([doctorId, apts]) => {
          const totalHours = apts.reduce((sum, apt) => sum + apt.duration, 0) / 60;
          const totalFees = apts.reduce((sum, apt) => sum + apt.fee, 0);
          
          return {
            doctorId,
            doctorName: apts[0].doctorName,
            month,
            totalAppointments: apts.length,
            presencialAppointments: apts.filter(a => a.type === 'Presencial').length,
            videollamadaAppointments: apts.filter(a => a.type === 'Videollamada').length,
            totalHours,
            totalFees,
            appointments: apts,
          };
        });
      },
    }),
    {
      name: 'attended-appointments-storage',
    }
  )
);

/**
 * Selectors
 */
export const selectTodayAttended = (state: AttendedAppointmentsState) => 
  state.getTodayAttended();

export const selectInProgressAppointments = (state: AttendedAppointmentsState) =>
  state.attendedAppointments.filter(apt => apt.status === 'En curso');

/**
 * Helper hooks
 */
export const useTodayAttended = () => 
  useAttendedAppointmentsStore(selectTodayAttended);

export const useInProgressAppointments = () => 
  useAttendedAppointmentsStore(selectInProgressAppointments);