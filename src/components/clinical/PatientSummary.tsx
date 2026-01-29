import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { User, Calendar, Phone, Mail, AlertTriangle, Heart, Pill, Users, Clock, Loader2 } from 'lucide-react';
import { getPatientInfo, getPatientHistory, type PatientInfo, type MedicalHistory } from '../../services/patientApi';
import { format, differenceInYears } from 'date-fns';
import { es } from 'date-fns/locale';

interface PatientSummaryProps {
  patientId: string;
}

export function PatientSummary({ patientId }: PatientSummaryProps) {
  const [patient, setPatient] = useState<PatientInfo | null>(null);
  const [history, setHistory] = useState<MedicalHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPatientData();
  }, [patientId]);

  const loadPatientData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [patientData, historyData] = await Promise.all([
        getPatientInfo(patientId),
        getPatientHistory(patientId),
      ]);

      setPatient(patientData);
      setHistory(historyData);
    } catch (err) {
      console.error('Error loading patient data:', err);
      setError('Error al cargar la información del paciente');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#0477BF] mx-auto mb-2" />
            <p className="text-sm text-gray-600">Cargando información del paciente...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !patient) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center text-red-600">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">{error || 'No se pudo cargar la información'}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const age = differenceInYears(new Date(), new Date(patient.dateOfBirth));

  return (
    <Card className="h-full overflow-auto">
      <CardHeader className="pb-3 sticky top-0 bg-white z-10 border-b">
        <CardTitle className="text-lg flex items-center gap-2">
          <User className="w-5 h-5 text-[#0477BF]" />
          Información del Paciente
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Datos Personales */}
        <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3 mb-3">
            <div className="p-2 bg-[#0477BF] rounded-full">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-900">
                {patient.firstName} {patient.lastName}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="default" className="bg-[#0477BF]">
                  {patient.insurance.plan}
                </Badge>
                <Badge variant={patient.insurance.status === 'active' ? 'default' : 'destructive'} className={patient.insurance.status === 'active' ? 'bg-[#62BF04]' : ''}>
                  {patient.insurance.status === 'active' ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2 text-gray-700">
              <Calendar className="w-4 h-4 text-[#0477BF]" />
              <span>{age} años</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <User className="w-4 h-4 text-[#0477BF]" />
              <span>{patient.gender === 'M' ? 'Masculino' : patient.gender === 'F' ? 'Feminino' : 'Otro'}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Phone className="w-4 h-4 text-[#0477BF]" />
              <span className="text-xs">{patient.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Mail className="w-4 h-4 text-[#0477BF]" />
              <span className="text-xs truncate">{patient.email}</span>
            </div>
          </div>

          {patient.bloodType && (
            <div className="mt-2 p-2 bg-red-50 rounded border border-red-200">
              <p className="text-sm font-semibold text-red-700">
                🩸 Tipo de Sangre: {patient.bloodType}
              </p>
            </div>
          )}
        </div>

        {/* Alertas Médicas */}
        {(patient.allergies.length > 0 || patient.chronicConditions.length > 0) && (
          <div className="p-4 bg-amber-50 rounded-lg border-l-4 border-amber-500">
            <h4 className="font-semibold text-amber-900 flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4" />
              Alertas Médicas
            </h4>
            
            {patient.allergies.length > 0 && (
              <div className="mb-2">
                <p className="text-xs font-semibold text-amber-800 mb-1">Alergias:</p>
                <div className="flex flex-wrap gap-1">
                  {patient.allergies.map((allergy, idx) => (
                    <Badge key={idx} variant="destructive" className="text-xs">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {patient.chronicConditions.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-amber-800 mb-1">Condiciones Crónicas:</p>
                <div className="flex flex-wrap gap-1">
                  {patient.chronicConditions.map((condition, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs bg-amber-200 text-amber-900">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Medicación Actual */}
        {patient.currentMedications.length > 0 && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-[#0477BF] flex items-center gap-2 mb-2">
              <Pill className="w-4 h-4" />
              Medicación Actual
            </h4>
            <ul className="space-y-1 text-sm text-gray-700">
              {patient.currentMedications.map((med, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#0477BF] mt-1">•</span>
                  <span>{med}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Contacto de Emergencia */}
        {patient.emergencyContact && (
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <h4 className="font-semibold text-red-900 flex items-center gap-2 mb-2">
              <Heart className="w-4 h-4" />
              Contacto de Emergencia
            </h4>
            <div className="text-sm text-red-800">
              <p className="font-semibold">{patient.emergencyContact.name}</p>
              <p className="text-xs">{patient.emergencyContact.relationship}</p>
              <p className="flex items-center gap-1 mt-1">
                <Phone className="w-3 h-3" />
                {patient.emergencyContact.phone}
              </p>
            </div>
          </div>
        )}

        {/* Dependientes */}
        {patient.dependents.length > 0 && (
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-900 flex items-center gap-2 mb-2">
              <Users className="w-4 h-4" />
              Dependientes ({patient.dependents.length})
            </h4>
            <div className="space-y-2">
              {patient.dependents.map((dep) => {
                const depAge = differenceInYears(new Date(), new Date(dep.dateOfBirth));
                return (
                  <div key={dep.id} className="text-sm bg-white p-2 rounded border border-purple-200">
                    <p className="font-semibold text-gray-900">
                      {dep.firstName} {dep.lastName}
                    </p>
                    <p className="text-xs text-gray-600">
                      {dep.relationship} • {depAge} años
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Historial Reciente */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4" />
            Historial Reciente ({history.length})
          </h4>
          <div className="space-y-2 max-h-60 overflow-auto">
            {history.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                Sin historial previo
              </p>
            ) : (
              history.slice(0, 5).map((item) => (
                <div key={item.id} className="text-sm bg-white p-3 rounded border border-gray-200">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-semibold text-gray-900">{item.title}</p>
                    <Badge variant="secondary" className="text-xs">
                      {item.type === 'consultation' ? 'Consulta' : 
                       item.type === 'lab' ? 'Laboratorio' :
                       item.type === 'prescription' ? 'Receta' : 'Procedimiento'}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600">{item.doctor} • {item.specialty}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.summary}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {format(new Date(item.date), "dd 'de' MMMM, yyyy", { locale: es })}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
