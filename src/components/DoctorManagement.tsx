import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
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
  UserPlus,
  Edit,
  Trash2,
  DollarSign,
  Search,
  CheckCircle,
  XCircle,
  Stethoscope,
  Mail,
  Phone,
  Building2,
  Award,
} from 'lucide-react';
import { useDoctorsStore } from '../store/useDoctorsStore';
import { toast } from 'sonner';

export function DoctorManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showFeesDialog, setShowFeesDialog] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    specialty: '',
    licenseNumber: '',
    hospital: 'Hospital Miraflores Zona 10' as const,
    videollamadaFee: 100,
    presencialFee: 150,
  });
  
  const doctors = useDoctorsStore((state) => state.doctors);
  const addDoctor = useDoctorsStore((state) => state.addDoctor);
  const updateDoctor = useDoctorsStore((state) => state.updateDoctor);
  const updateDoctorFees = useDoctorsStore((state) => state.updateDoctorFees);
  const toggleDoctorStatus = useDoctorsStore((state) => state.toggleDoctorStatus);
  
  // Filtrar doctores por búsqueda
  const filteredDoctors = doctors.filter((doc) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      doc.firstName.toLowerCase().includes(searchLower) ||
      doc.lastName.toLowerCase().includes(searchLower) ||
      doc.email.toLowerCase().includes(searchLower) ||
      doc.specialty?.toLowerCase().includes(searchLower) ||
      doc.licenseNumber?.toLowerCase().includes(searchLower)
    );
  });
  
  const handleAddDoctor = () => {
    setIsProcessing(true);
    
    const doctorId = addDoctor({
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      hospital: formData.hospital,
      specialty: formData.specialty,
      licenseNumber: formData.licenseNumber,
      permissions: ['read', 'write'],
      medicalFees: {
        videollamada: formData.videollamadaFee,
        presencial: formData.presencialFee,
      },
    });
    
    setTimeout(() => {
      setIsProcessing(false);
      setShowAddDialog(false);
      toast.success('Doctor agregado exitosamente', {
        description: `${formData.firstName} ${formData.lastName} - ID: ${doctorId}`,
      });
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        specialty: '',
        licenseNumber: '',
        hospital: 'Hospital Miraflores Zona 10',
        videollamadaFee: 100,
        presencialFee: 150,
      });
    }, 800);
  };
  
  const handleEditDoctor = () => {
    if (!selectedDoctor) return;
    
    setIsProcessing(true);
    
    updateDoctor(selectedDoctor.id, {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      hospital: formData.hospital,
      specialty: formData.specialty,
      licenseNumber: formData.licenseNumber,
    });
    
    setTimeout(() => {
      setIsProcessing(false);
      setShowEditDialog(false);
      toast.success('Doctor actualizado exitosamente');
      setSelectedDoctor(null);
    }, 800);
  };
  
  const handleUpdateFees = () => {
    if (!selectedDoctor) return;
    
    setIsProcessing(true);
    
    updateDoctorFees(selectedDoctor.id, {
      videollamada: formData.videollamadaFee,
      presencial: formData.presencialFee,
    });
    
    setTimeout(() => {
      setIsProcessing(false);
      setShowFeesDialog(false);
      toast.success('Honorarios actualizados exitosamente', {
        description: `Videollamada: Q${formData.videollamadaFee} | Presencial: Q${formData.presencialFee}`,
      });
      setSelectedDoctor(null);
    }, 800);
  };
  
  const openEditDialog = (doctor: any) => {
    setSelectedDoctor(doctor);
    setFormData({
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      email: doctor.email,
      password: '',
      phone: doctor.phone || '',
      specialty: doctor.specialty || '',
      licenseNumber: doctor.licenseNumber || '',
      hospital: doctor.hospital || 'Hospital Miraflores Zona 10',
      videollamadaFee: doctor.medicalFees?.videollamada || 100,
      presencialFee: doctor.medicalFees?.presencial || 150,
    });
    setShowEditDialog(true);
  };
  
  const openFeesDialog = (doctor: any) => {
    setSelectedDoctor(doctor);
    setFormData({
      ...formData,
      videollamadaFee: doctor.medicalFees?.videollamada || 100,
      presencialFee: doctor.medicalFees?.presencial || 150,
    });
    setShowFeesDialog(true);
  };
  
  const handleToggleStatus = (doctorId: string, currentStatus: boolean) => {
    toggleDoctorStatus(doctorId);
    toast.success(currentStatus ? 'Doctor desactivado' : 'Doctor activado');
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#0477BF]">Gestión de Médicos</h2>
          <p className="text-sm text-gray-500 mt-1">
            Administra médicos, especialidades y honorarios personalizados
          </p>
        </div>
        <Button
          className="bg-[#62BF04] hover:bg-[#52a003] text-white"
          onClick={() => setShowAddDialog(true)}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Agregar Médico
        </Button>
      </div>
      
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-[#0477BF]/10 flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-[#0477BF]" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Médicos</p>
              <h3 className="text-2xl font-bold text-[#0477BF]">{doctors.length}</h3>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-[#62BF04]/10 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-[#62BF04]" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Activos</p>
              <h3 className="text-2xl font-bold text-[#62BF04]">
                {doctors.filter((d) => d.isActive).length}
              </h3>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Inactivos</p>
              <h3 className="text-2xl font-bold text-red-600">
                {doctors.filter((d) => !d.isActive).length}
              </h3>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Búsqueda */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar por nombre, email, especialidad o número de colegiado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>
      
      {/* Tabla de Médicos */}
      <Card className="p-6">
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-[#0477BF]">Médico</TableHead>
                <TableHead className="text-[#0477BF]">Contacto</TableHead>
                <TableHead className="text-[#0477BF]">Especialidad</TableHead>
                <TableHead className="text-[#0477BF]">Sede</TableHead>
                <TableHead className="text-[#0477BF] text-center">Honorarios</TableHead>
                <TableHead className="text-[#0477BF] text-center">Estado</TableHead>
                <TableHead className="text-[#0477BF] text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDoctors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <Stethoscope className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-semibold mb-2">
                      No se encontraron médicos
                    </p>
                    <p className="text-sm text-gray-400">
                      {searchTerm
                        ? 'Intenta con otros términos de búsqueda'
                        : 'Agrega tu primer médico al sistema'}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredDoctors.map((doctor) => (
                  <TableRow key={doctor.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {doctor.firstName} {doctor.lastName}
                        </p>
                        <p className="text-sm text-gray-500">ID: {doctor.id}</p>
                        {doctor.licenseNumber && (
                          <div className="flex items-center gap-1 mt-1">
                            <Award className="w-3 h-3 text-gray-400" />
                            <p className="text-xs text-gray-500">{doctor.licenseNumber}</p>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-600">{doctor.email}</span>
                        </div>
                        {doctor.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-600">{doctor.phone}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-[#2BB9D9] text-[#2BB9D9]">
                        {doctor.specialty || 'No especificada'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          {doctor.hospital?.includes('Zona 10') ? 'Zona 10' : 'Roosevelt'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="space-y-1">
                        <div className="text-sm">
                          <span className="text-gray-600">💻 </span>
                          <span className="font-semibold text-[#2BB9D9]">
                            Q{doctor.medicalFees?.videollamada || 100}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-600">🏥 </span>
                          <span className="font-semibold text-[#0477BF]">
                            Q{doctor.medicalFees?.presencial || 150}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={doctor.isActive ? 'default' : 'secondary'}
                        className={
                          doctor.isActive
                            ? 'bg-[#62BF04] hover:bg-[#52a003]'
                            : 'bg-gray-400'
                        }
                      >
                        {doctor.isActive ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(doctor)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-[#62BF04] text-[#62BF04] hover:bg-[#62BF04]/10"
                          onClick={() => openFeesDialog(doctor)}
                        >
                          <DollarSign className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className={
                            doctor.isActive
                              ? 'border-red-500 text-red-600 hover:bg-red-50'
                              : 'border-[#62BF04] text-[#62BF04] hover:bg-[#62BF04]/10'
                          }
                          onClick={() =>
                            handleToggleStatus(doctor.id, doctor.isActive || false)
                          }
                        >
                          {doctor.isActive ? (
                            <XCircle className="w-3 h-3" />
                          ) : (
                            <CheckCircle className="w-3 h-3" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
      
      {/* Dialog: Agregar Médico */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Médico</DialogTitle>
            <DialogDescription>
              Complete la información del médico y configure sus honorarios
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <div>
              <Label htmlFor="firstName">Nombre *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                placeholder="Dr. Juan"
              />
            </div>
            
            <div>
              <Label htmlFor="lastName">Apellido *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                placeholder="Pérez García"
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="doctor@mirafloresplus.com"
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="+502 2268-3457"
              />
            </div>
            
            <div>
              <Label htmlFor="specialty">Especialidad *</Label>
              <Input
                id="specialty"
                value={formData.specialty}
                onChange={(e) =>
                  setFormData({ ...formData, specialty: e.target.value })
                }
                placeholder="Medicina General, Pediatría, etc."
              />
            </div>
            
            <div>
              <Label htmlFor="licenseNumber">Número de Colegiado</Label>
              <Input
                id="licenseNumber"
                value={formData.licenseNumber}
                onChange={(e) =>
                  setFormData({ ...formData, licenseNumber: e.target.value })
                }
                placeholder="COL-12345"
              />
            </div>
            
            <div className="col-span-2">
              <Label htmlFor="hospital">Sede Asignada</Label>
              <Select
                value={formData.hospital}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, hospital: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hospital Miraflores Zona 10">
                    Hospital Miraflores Zona 10
                  </SelectItem>
                  <SelectItem value="Hospital Miraflores Roosevelt">
                    Hospital Miraflores Roosevelt
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="col-span-2 border-t pt-4">
              <h4 className="font-semibold text-gray-900 mb-3">
                💰 Honorarios Médicos (Quetzales)
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="videollamadaFee">Videoconsulta</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      Q
                    </span>
                    <Input
                      id="videollamadaFee"
                      type="number"
                      value={formData.videollamadaFee}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          videollamadaFee: Number(e.target.value),
                        })
                      }
                      className="pl-8"
                      min="0"
                      step="10"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Honorario por videollamada
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="presencialFee">Consulta Presencial</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      Q
                    </span>
                    <Input
                      id="presencialFee"
                      type="number"
                      value={formData.presencialFee}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          presencialFee: Number(e.target.value),
                        })
                      }
                      className="pl-8"
                      min="0"
                      step="10"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Honorario por consulta presencial
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddDialog(false)}
              disabled={isProcessing}
            >
              Cancelar
            </Button>
            <Button
              className="bg-[#62BF04] hover:bg-[#52a003]"
              onClick={handleAddDoctor}
              disabled={
                isProcessing ||
                !formData.firstName ||
                !formData.lastName ||
                !formData.email ||
                !formData.specialty
              }
            >
              {isProcessing ? 'Agregando...' : 'Agregar Médico'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog: Editar Médico */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Información del Médico</DialogTitle>
            <DialogDescription>
              Actualiza los datos personales del médico
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <div>
              <Label htmlFor="edit-firstName">Nombre</Label>
              <Input
                id="edit-firstName"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
              />
            </div>
            
            <div>
              <Label htmlFor="edit-lastName">Apellido</Label>
              <Input
                id="edit-lastName"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
            </div>
            
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            
            <div>
              <Label htmlFor="edit-phone">Teléfono</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
            
            <div>
              <Label htmlFor="edit-specialty">Especialidad</Label>
              <Input
                id="edit-specialty"
                value={formData.specialty}
                onChange={(e) =>
                  setFormData({ ...formData, specialty: e.target.value })
                }
              />
            </div>
            
            <div>
              <Label htmlFor="edit-licenseNumber">Número de Colegiado</Label>
              <Input
                id="edit-licenseNumber"
                value={formData.licenseNumber}
                onChange={(e) =>
                  setFormData({ ...formData, licenseNumber: e.target.value })
                }
              />
            </div>
            
            <div className="col-span-2">
              <Label htmlFor="edit-hospital">Sede Asignada</Label>
              <Select
                value={formData.hospital}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, hospital: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hospital Miraflores Zona 10">
                    Hospital Miraflores Zona 10
                  </SelectItem>
                  <SelectItem value="Hospital Miraflores Roosevelt">
                    Hospital Miraflores Roosevelt
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEditDialog(false)}
              disabled={isProcessing}
            >
              Cancelar
            </Button>
            <Button
              className="bg-[#0477BF] hover:bg-[#0366a3]"
              onClick={handleEditDoctor}
              disabled={isProcessing}
            >
              {isProcessing ? 'Actualizando...' : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog: Configurar Honorarios */}
      <Dialog open={showFeesDialog} onOpenChange={setShowFeesDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configurar Honorarios Médicos</DialogTitle>
            <DialogDescription>
              {selectedDoctor && (
                <>
                  Actualiza los honorarios para{' '}
                  <strong>
                    {selectedDoctor.firstName} {selectedDoctor.lastName}
                  </strong>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-blue-900">
                  Honorarios Personalizados
                </h4>
              </div>
              <p className="text-sm text-blue-700">
                Estos honorarios se aplicarán automáticamente a cada cita atendida
                por este médico
              </p>
            </div>
            
            <div>
              <Label htmlFor="fees-videollamada">🎥 Videoconsulta (Quetzales)</Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                  Q
                </span>
                <Input
                  id="fees-videollamada"
                  type="number"
                  value={formData.videollamadaFee}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      videollamadaFee: Number(e.target.value),
                    })
                  }
                  className="pl-8 text-lg font-semibold"
                  min="0"
                  step="10"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Honorario por cada videollamada completada
              </p>
            </div>
            
            <div>
              <Label htmlFor="fees-presencial">🏥 Consulta Presencial (Quetzales)</Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                  Q
                </span>
                <Input
                  id="fees-presencial"
                  type="number"
                  value={formData.presencialFee}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      presencialFee: Number(e.target.value),
                    })
                  }
                  className="pl-8 text-lg font-semibold"
                  min="0"
                  step="10"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Honorario por cada consulta presencial completada
              </p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-900">
                <strong>Vista previa:</strong> Este médico ganará{' '}
                <strong className="text-[#62BF04]">
                  Q{formData.videollamadaFee}
                </strong>{' '}
                por videollamada y{' '}
                <strong className="text-[#62BF04]">
                  Q{formData.presencialFee}
                </strong>{' '}
                por consulta presencial
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowFeesDialog(false)}
              disabled={isProcessing}
            >
              Cancelar
            </Button>
            <Button
              className="bg-[#62BF04] hover:bg-[#52a003]"
              onClick={handleUpdateFees}
              disabled={isProcessing}
            >
              {isProcessing ? 'Actualizando...' : 'Actualizar Honorarios'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
