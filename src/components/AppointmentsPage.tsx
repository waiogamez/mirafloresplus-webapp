import { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "./ui/select";
import { Search, CalendarIcon, Download, Plus, Clock } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { AddAppointmentDialog } from "./AddAppointmentDialog";
import { Toaster } from "./ui/sonner";

const appointmentsData = [
  { id: "CIT-1045", patient: "María González", doctor: "Dr. Ramírez", specialty: "Cardiología", date: "2025-10-16", time: "09:00 AM", status: "Programada", type: "Presencial" },
  { id: "CIT-1044", patient: "Carlos Rodríguez", doctor: "Dr. López", specialty: "Pediatría", date: "2025-10-16", time: "10:30 AM", status: "Programada", type: "Videollamada" },
  { id: "CIT-1043", patient: "Ana Martínez", doctor: "Dr. Silva", specialty: "Dermatología", date: "2025-10-16", time: "11:00 AM", status: "Completada", type: "Presencial" },
  { id: "CIT-1042", patient: "Juan Pérez", doctor: "Dr. Torres", specialty: "General", date: "2025-10-16", time: "02:00 PM", status: "Programada", type: "Presencial" },
  { id: "CIT-1041", patient: "Laura Díaz", doctor: "Dr. Méndez", specialty: "Oftalmología", date: "2025-10-15", time: "03:30 PM", status: "Completada", type: "Presencial" },
  { id: "CIT-1040", patient: "Pedro Sánchez", doctor: "Dr. Castro", specialty: "Ortopedia", date: "2025-10-15", time: "04:00 PM", status: "Cancelada", type: "Presencial" },
  { id: "CIT-1039", patient: "Isabel Fernández", doctor: "Dr. Vargas", specialty: "Neurología", date: "2025-10-15", time: "09:30 AM", status: "No asistió", type: "Videollamada" },
  { id: "CIT-1038", patient: "Miguel Torres", doctor: "Dr. Ramírez", specialty: "Cardiología", date: "2025-10-14", time: "11:00 AM", status: "Completada", type: "Presencial" },
];

export function AppointmentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [date, setDate] = useState<Date>();
  const [showAddDialog, setShowAddDialog] = useState(false);

  const filteredAppointments = appointmentsData.filter(appointment => {
    const matchesSearch = 
      appointment.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter;
    const matchesType = typeFilter === "all" || appointment.type === typeFilter;
    const matchesDate = !date || appointment.date === format(date, "yyyy-MM-dd");
    
    return matchesSearch && matchesStatus && matchesType && matchesDate;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#0477BF]">Citas Médicas</h1>
          <p className="text-sm text-gray-500 mt-1">
            Programe y administre las citas de los pacientes
          </p>
        </div>
        <Button 
          className="text-white"
          style={{ backgroundColor: '#0477BF' }}
          onClick={() => setShowAddDialog(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Cita
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#0477BF15' }}>
              <CalendarIcon className="w-5 h-5" style={{ color: '#0477BF' }} />
            </div>
            <p className="text-sm text-gray-600">Citas de Hoy</p>
          </div>
          <h3 className="text-[#0477BF]">47</h3>
        </Card>
        <Card className="p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#62BF0415' }}>
              <Clock className="w-5 h-5" style={{ color: '#62BF04' }} />
            </div>
            <p className="text-sm text-gray-600">Programadas</p>
          </div>
          <h3 className="text-[#62BF04]">145</h3>
        </Card>
        <Card className="p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-green-100">
              <CalendarIcon className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm text-gray-600">Completadas</p>
          </div>
          <h3 className="text-green-600">289</h3>
        </Card>
        <Card className="p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-red-100">
              <CalendarIcon className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-sm text-gray-600">Canceladas</p>
          </div>
          <h3 className="text-red-600">34</h3>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-6 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por paciente, doctor o ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full md:w-[200px]">
                <CalendarIcon className="w-4 h-4 mr-2" />
                {date ? format(date, "PPP", { locale: es }) : "Seleccionar fecha"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los Estados</SelectItem>
              <SelectItem value="Programada">Programada</SelectItem>
              <SelectItem value="Completada">Completada</SelectItem>
              <SelectItem value="Cancelada">Cancelada</SelectItem>
              <SelectItem value="No asistió">No asistió</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los Tipos</SelectItem>
              <SelectItem value="Presencial">Presencial</SelectItem>
              <SelectItem value="Videollamada">Videollamada</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="w-full md:w-auto">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card className="p-6 border border-gray-200">
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-[#0477BF]">ID</TableHead>
                <TableHead className="text-[#0477BF]">Paciente</TableHead>
                <TableHead className="text-[#0477BF]">Doctor</TableHead>
                <TableHead className="text-[#0477BF]">Especialidad</TableHead>
                <TableHead className="text-[#0477BF]">Fecha y Hora</TableHead>
                <TableHead className="text-[#0477BF]">Tipo</TableHead>
                <TableHead className="text-[#0477BF]">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.map((appointment) => (
                <TableRow key={appointment.id} className="hover:bg-gray-50">
                  <TableCell className="text-gray-900">{appointment.id}</TableCell>
                  <TableCell className="text-gray-900">{appointment.patient}</TableCell>
                  <TableCell className="text-gray-900">{appointment.doctor}</TableCell>
                  <TableCell className="text-gray-600">{appointment.specialty}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p className="text-gray-900">{appointment.date}</p>
                      <p className="text-gray-500">{appointment.time}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline"
                      className={
                        appointment.type === "Videollamada"
                          ? "border-[#2BB9D9] text-[#2BB9D9] bg-[#2BB9D9]/5"
                          : "border-gray-400 text-gray-700 bg-gray-50"
                      }
                    >
                      {appointment.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline"
                      className={
                        appointment.status === "Programada"
                          ? "border-[#0477BF] text-[#0477BF] bg-[#0477BF]/5"
                          : appointment.status === "Completada"
                          ? "border-[#62BF04] text-[#62BF04] bg-[#62BF04]/5"
                          : appointment.status === "Cancelada"
                          ? "border-red-500 text-red-600 bg-red-50"
                          : "border-orange-500 text-orange-600 bg-orange-50"
                      }
                    >
                      {appointment.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-500">
            Mostrando {filteredAppointments.length} de {appointmentsData.length} citas
          </p>
        </div>
      </Card>

      {/* Dialog para agregar cita */}
      <AddAppointmentDialog 
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAppointmentAdded={() => {
          // Aquí se actualizaría la lista de citas en producción
          // console.log("Cita agregada, actualizar lista");
        }}
      />

      <Toaster />
    </div>
  );
}