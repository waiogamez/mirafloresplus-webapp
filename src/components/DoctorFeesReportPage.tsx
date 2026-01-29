import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Calendar,
  Download,
  TrendingUp,
  FileText,
  ChevronDown,
  ChevronUp,
  Search,
  Video,
  MapPin,
  Clock,
  EyeOff,
} from 'lucide-react';
import { QuetzalIcon } from './ui/quetzal-icon';
import { useAttendedAppointmentsStore } from '../store/useAttendedAppointmentsStore';
import { useAuthStore } from '../store/useAuthStore';
import { formatDuration } from '../utils/notificationHelpers';

export function DoctorFeesReportPage() {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('all');
  
  const user = useAuthStore(state => state.user);
  const getAllMonthlyReports = useAttendedAppointmentsStore(state => state.getAllMonthlyReports);
  const attendedAppointments = useAttendedAppointmentsStore(state => state.attendedAppointments);
  
  // Determinar si el usuario puede ver honorarios
  // Solo: superadmin, finanzas, junta, y el doctor (solo sus propios honorarios)
  const canViewFees = user?.role === 'superadmin' || 
                      user?.role === 'finanzas' || 
                      user?.role === 'junta' ||
                      user?.role === 'doctor';
  
  const isReception = user?.role === 'recepcion';
  
  // Obtener reportes del mes seleccionado
  let monthlyReports = getAllMonthlyReports(selectedMonth);
  
  // Si es doctor, solo mostrar sus propios datos
  if (user?.role === 'doctor') {
    monthlyReports = monthlyReports.filter(report => report.doctorId === user.id);
  }
  
  // Filtrar reportes
  const filteredReports = monthlyReports.filter(report => {
    const matchesSearch = report.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDoctor = selectedDoctor === 'all' || report.doctorId === selectedDoctor;
    return matchesSearch && matchesDoctor;
  });
  
  // Calcular totales
  const totalAppointments = filteredReports.reduce((sum, r) => sum + r.totalAppointments, 0);
  const totalFees = filteredReports.reduce((sum, r) => sum + r.totalFees, 0);
  const totalVideollamadas = filteredReports.reduce((sum, r) => sum + r.videollamadaAppointments, 0);
  const totalPresenciales = filteredReports.reduce((sum, r) => sum + r.presencialAppointments, 0);
  
  // Generar meses para el selector (últimos 12 meses)
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const label = date.toLocaleDateString('es-GT', { year: 'numeric', month: 'long' });
    return { value, label };
  });
  
  // Obtener lista única de doctores
  const uniqueDoctors = Array.from(
    new Map(
      attendedAppointments
        .filter(apt => apt.status === 'Completada')
        .map(apt => [apt.doctorId, { id: apt.doctorId, name: apt.doctorName }])
    ).values()
  );
  
  const handleExportReport = () => {
    // Aquí se generaría un CSV o PDF del reporte
    console.log('Exportando reporte de honorarios médicos...');
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#0477BF]">
            {isReception ? 'Reporte de Consultas Médicas' : 'Reporte de Honorarios Médicos'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isReception 
              ? 'Control mensual de consultas atendidas por los médicos'
              : 'Control mensual de consultas atendidas y pagos a médicos'
            }
          </p>
        </div>
        <Button 
          className="bg-[#0477BF] hover:bg-[#0366a3] text-white"
          onClick={handleExportReport}
        >
          <Download className="w-4 h-4 mr-2" />
          Exportar Reporte
        </Button>
      </div>
      
      {/* Alerta de permisos para Recepción */}
      {isReception && (
        <Card className="p-4 border-2 border-amber-200 bg-amber-50">
          <div className="flex items-center gap-3">
            <EyeOff className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-amber-900">Acceso Limitado</p>
              <p className="text-sm text-amber-700">
                Como Recepción, puedes ver el conteo de consultas pero no los honorarios de los médicos. 
                Los valores monetarios están ocultos.
              </p>
            </div>
          </div>
        </Card>
      )}
      
      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#0477BF]/10">
              <Calendar className="w-5 h-5 text-[#0477BF]" />
            </div>
            <p className="text-sm text-gray-600">Total Consultas</p>
          </div>
          <h3 className="text-2xl font-bold text-[#0477BF]">{totalAppointments}</h3>
          <p className="text-xs text-gray-500 mt-1">
            {totalPresenciales} presenciales • {totalVideollamadas} videollamadas
          </p>
        </Card>
        
        {canViewFees && (
          <Card className="p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#62BF04]/10">
                <QuetzalIcon className="w-5 h-5 text-[#62BF04]" />
              </div>
              <p className="text-sm text-gray-600">Total Honorarios</p>
            </div>
            <h3 className="text-2xl font-bold text-[#62BF04]">Q{totalFees.toFixed(2)}</h3>
            <p className="text-xs text-gray-500 mt-1">
              Periodo: {selectedMonth}
            </p>
          </Card>
        )}
        
        <Card className="p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#2BB9D9]/10">
              <Video className="w-5 h-5 text-[#2BB9D9]" />
            </div>
            <p className="text-sm text-gray-600">Videollamadas</p>
          </div>
          <h3 className="text-2xl font-bold text-[#2BB9D9]">{totalVideollamadas}</h3>
          {canViewFees && (
            <p className="text-xs text-gray-500 mt-1">
              Honorarios totales estimados
            </p>
          )}
        </Card>
        
        <Card className="p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-purple-100">
              <MapPin className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-sm text-gray-600">Presenciales</p>
          </div>
          <h3 className="text-2xl font-bold text-purple-600">{totalPresenciales}</h3>
          {canViewFees && (
            <p className="text-xs text-gray-500 mt-1">
              Honorarios totales estimados
            </p>
          )}
        </Card>
      </div>
      
      {/* Filtros */}
      <Card className="p-6 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por nombre de doctor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Seleccionar mes" />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Todos los doctores" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los doctores</SelectItem>
              {uniqueDoctors.map(doc => (
                <SelectItem key={doc.id} value={doc.id}>
                  {doc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>
      
      {/* Tabla de Reportes por Doctor */}
      <Card className="p-6 border border-gray-200">
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900">
            Reporte por Doctor ({filteredReports.length})
          </h3>
        </div>
        
        {filteredReports.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-semibold mb-2">
              No hay registros para este periodo
            </p>
            <p className="text-sm text-gray-400">
              Selecciona otro mes o doctor para ver los datos
            </p>
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-[#0477BF]">Doctor</TableHead>
                  <TableHead className="text-[#0477BF] text-center">Total Consultas</TableHead>
                  <TableHead className="text-[#0477BF] text-center">Presenciales</TableHead>
                  <TableHead className="text-[#0477BF] text-center">Videollamadas</TableHead>
                  <TableHead className="text-[#0477BF] text-center">Horas Totales</TableHead>
                  {canViewFees && (
                    <TableHead className="text-[#0477BF] text-right">Honorarios</TableHead>
                  )}
                  <TableHead className="text-[#0477BF] text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.doctorId} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <p className="font-semibold text-gray-900">{report.doctorName}</p>
                        <p className="text-sm text-gray-500">ID: {report.doctorId}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="border-[#0477BF] text-[#0477BF]">
                        {report.totalAppointments}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-500" />
                        <span className="text-gray-900">{report.presencialAppointments}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Video className="w-3 h-3 text-[#2BB9D9]" />
                        <span className="text-gray-900">{report.videollamadaAppointments}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Clock className="w-3 h-3 text-gray-500" />
                        <span className="text-gray-900">{report.totalHours.toFixed(1)} h</span>
                      </div>
                    </TableCell>
                    {canViewFees && (
                      <TableCell className="text-right">
                        <span className="font-bold text-[#62BF04]">
                          Q{report.totalFees.toFixed(2)}
                        </span>
                      </TableCell>
                    )}
                    <TableCell className="text-center">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          // Aquí se abriría un modal con el detalle
                          console.log('Ver detalle de', report.doctorName);
                        }}
                      >
                        Ver Detalle
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        
        {filteredReports.length > 0 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Mostrando {filteredReports.length} doctor(es)
            </p>
            {canViewFees && (
              <div className="text-right">
                <p className="text-sm text-gray-600">Total a pagar este mes:</p>
                <p className="text-xl font-bold text-[#62BF04]">
                  Q{totalFees.toFixed(2)}
                </p>
              </div>
            )}
          </div>
        )}
      </Card>
      
      {/* Información Adicional */}
      <Card className="p-6 border border-gray-200 bg-blue-50">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">
              💡 Información sobre Honorarios Médicos
            </h4>
            <div className="space-y-1 text-sm text-blue-800">
              <p>• <strong>Consulta Presencial:</strong> Q150.00 por consulta</p>
              <p>• <strong>Videoconsulta:</strong> Q100.00 por consulta</p>
              <p>• Los honorarios se calculan automáticamente al completar cada cita</p>
              <p>• El pago se realiza mensualmente basado en las citas completadas</p>
              <p>• Este reporte se genera automáticamente para Finanzas y Administración</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}