import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  Monitor,
  MonitorOff,
  ChevronRight,
  ChevronLeft,
  User,
  FileText,
  Clipboard,
  Save,
  Download,
  Calendar,
  Pill,
  Activity,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { useUIStore } from "../store";

export function VideoCallPage() {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [notes, setNotes] = useState("");
  const [callDuration, setCallDuration] = useState(0);
  
  // Get navigation function
  const setCurrentPage = useUIStore((state) => state.setCurrentPage);
  
  const [patientInfo] = useState({
    name: "María González Hernández",
    age: 45,
    id: "GT-2024-0158",
    consultationType: "Consulta de Seguimiento",
  });

  // Cronómetro de duración de llamada
  useEffect(() => {
    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleToggleMic = () => {
    setIsMicOn(!isMicOn);
    toast.info(isMicOn ? "Micrófono desactivado" : "Micrófono activado");
  };

  const handleToggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    toast.info(isVideoOn ? "Cámara desactivada" : "Cámara activada");
  };

  const handleToggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    toast.info(isScreenSharing ? "Compartir pantalla detenido" : "Compartiendo pantalla");
  };

  const handleEndCall = () => {
    toast.success("Videollamada finalizada");
    // Navigate back to dashboard
    setCurrentPage("dashboard");
  };

  const handleSaveNotes = () => {
    toast.success("Notas guardadas exitosamente");
  };

  const handleDownloadReport = () => {
    toast.success("Reporte descargado");
  };

  return (
    <div className="h-screen flex bg-[#F2F2F2]">
      {/* Main Video Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-gray-900">Videollamada con {patientInfo.name}</h1>
            <p className="text-sm text-gray-600">
              {patientInfo.consultationType} • ID: {patientInfo.id}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
              <Activity className="w-3 h-3 mr-1" />
              En llamada • {formatDuration(callDuration)}
            </Badge>
          </div>
        </div>

        {/* Video Area */}
        <div className="flex-1 relative bg-gray-900">
          {/* Patient's Video (Full Screen - Remote) */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#9DD973]/20 to-[#62BF04]/20">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-48 h-48 rounded-full bg-[#62BF04] flex items-center justify-center mb-6 mx-auto shadow-2xl">
                  <User className="w-24 h-24 text-white" />
                </div>
                <p className="text-white text-2xl">{patientInfo.name}</p>
                <p className="text-lg text-white/80">{patientInfo.age} años • Paciente</p>
              </div>
            </div>
            <div className="absolute top-6 left-6 bg-white/90 px-4 py-2 rounded-full shadow-lg">
              <span className="text-sm">Paciente</span>
            </div>
            <div className="absolute top-6 right-6">
              <Badge className="bg-green-500 text-white px-4 py-2 shadow-lg">
                <Activity className="w-4 h-4 mr-2" />
                Conectado
              </Badge>
            </div>
          </div>

          {/* Doctor's Video (Picture-in-Picture - Local) */}
          <Card className="absolute bottom-6 right-6 w-72 h-48 overflow-hidden bg-gradient-to-br from-[#0477BF]/90 to-[#2BB9D9]/90 border-4 border-white shadow-2xl">
            <div className="absolute inset-0 flex items-center justify-center">
              {isVideoOn ? (
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mb-2 mx-auto backdrop-blur-sm">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-white text-sm">Dr. Carlos Rodríguez</p>
                  <p className="text-xs text-white/80">Médico General</p>
                </div>
              ) : (
                <div className="text-center">
                  <VideoOff className="w-10 h-10 text-white/70 mb-2 mx-auto" />
                  <p className="text-white/80 text-sm">Cámara desactivada</p>
                </div>
              )}
            </div>
            <div className="absolute top-2 left-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="text-xs text-white">Tú</span>
            </div>
            <div className="absolute bottom-2 right-2 flex gap-2">
              {!isMicOn && (
                <div className="bg-red-500 rounded-full p-1.5 shadow-lg">
                  <MicOff className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Control Bar */}
        <div className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-center gap-4">
            <Button
              variant={isMicOn ? "default" : "destructive"}
              size="lg"
              onClick={handleToggleMic}
              className="rounded-full w-14 h-14"
            >
              {isMicOn ? (
                <Mic className="w-6 h-6" />
              ) : (
                <MicOff className="w-6 h-6" />
              )}
            </Button>

            <Button
              variant={isVideoOn ? "default" : "destructive"}
              size="lg"
              onClick={handleToggleVideo}
              className="rounded-full w-14 h-14"
            >
              {isVideoOn ? (
                <Video className="w-6 h-6" />
              ) : (
                <VideoOff className="w-6 h-6" />
              )}
            </Button>

            <Button
              variant={isScreenSharing ? "default" : "outline"}
              size="lg"
              onClick={handleToggleScreenShare}
              className="rounded-full w-14 h-14"
            >
              {isScreenSharing ? (
                <Monitor className="w-6 h-6" />
              ) : (
                <MonitorOff className="w-6 h-6" />
              )}
            </Button>

            <Button
              variant="destructive"
              size="lg"
              onClick={handleEndCall}
              className="rounded-full w-14 h-14 bg-red-600 hover:bg-red-700"
            >
              <Phone className="w-6 h-6 rotate-[135deg]" />
            </Button>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div
        className={`bg-white border-l border-gray-200 transition-all duration-300 ${
          isSidebarOpen ? "w-96" : "w-0"
        } overflow-hidden`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-gray-900">Información del Paciente</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(false)}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Sidebar Content */}
          <ScrollArea className="flex-1">
            <div className="p-6 space-y-6">
              {/* Patient Info Card */}
              <Card className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#0477BF] flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-900">{patientInfo.name}</h3>
                    <p className="text-sm text-gray-600">{patientInfo.age} años</p>
                    <p className="text-xs text-gray-500 mt-1">ID: {patientInfo.id}</p>
                  </div>
                </div>
              </Card>

              {/* Tabs for different sections */}
              <Tabs defaultValue="history" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="history">Historial</TabsTrigger>
                  <TabsTrigger value="notes">Notas</TabsTrigger>
                  <TabsTrigger value="prescriptions">Recetas</TabsTrigger>
                </TabsList>

                <TabsContent value="history" className="space-y-4 mt-4">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-4 h-4 text-[#0477BF]" />
                      <h4 className="text-sm text-gray-900">Citas Recientes</h4>
                    </div>
                    <div className="space-y-2">
                      <Card className="p-3">
                        <p className="text-sm">15 Ene 2025 - Chequeo General</p>
                        <p className="text-xs text-gray-600">Dr. Martínez</p>
                      </Card>
                      <Card className="p-3">
                        <p className="text-sm">08 Dic 2024 - Control Presión</p>
                        <p className="text-xs text-gray-600">Dr. López</p>
                      </Card>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Activity className="w-4 h-4 text-[#62BF04]" />
                      <h4 className="text-sm text-gray-900">Signos Vitales</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Card className="p-3">
                        <p className="text-xs text-gray-600">Presión</p>
                        <p className="text-sm">120/80</p>
                      </Card>
                      <Card className="p-3">
                        <p className="text-xs text-gray-600">Temperatura</p>
                        <p className="text-sm">36.5°C</p>
                      </Card>
                      <Card className="p-3">
                        <p className="text-xs text-gray-600">Frecuencia</p>
                        <p className="text-sm">72 bpm</p>
                      </Card>
                      <Card className="p-3">
                        <p className="text-xs text-gray-600">Peso</p>
                        <p className="text-sm">68 kg</p>
                      </Card>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Clipboard className="w-4 h-4 text-[#2BB9D9]" />
                      <h4 className="text-sm text-gray-900">Diagnósticos</h4>
                    </div>
                    <div className="space-y-2">
                      <Badge variant="outline" className="w-full justify-start">
                        Hipertensión controlada
                      </Badge>
                      <Badge variant="outline" className="w-full justify-start">
                        Diabetes tipo 2
                      </Badge>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="notes" className="space-y-4 mt-4">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-4 h-4 text-[#0477BF]" />
                      <h4 className="text-sm text-gray-900">Notas de la Consulta</h4>
                    </div>
                    <Textarea
                      placeholder="Escribe tus observaciones y notas médicas aquí..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="min-h-[200px]"
                    />
                    <div className="flex gap-2 mt-3">
                      <Button
                        onClick={handleSaveNotes}
                        size="sm"
                        className="flex-1"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Guardar
                      </Button>
                      <Button
                        onClick={handleDownloadReport}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Exportar
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="text-sm text-gray-900 mb-3">Notas Anteriores</h4>
                    <div className="space-y-2">
                      <Card className="p-3">
                        <p className="text-xs text-gray-500">15 Ene 2025</p>
                        <p className="text-sm mt-1">
                          Paciente presenta mejoría en control de presión arterial...
                        </p>
                      </Card>
                      <Card className="p-3">
                        <p className="text-xs text-gray-500">08 Dic 2024</p>
                        <p className="text-sm mt-1">
                          Control de rutina. Valores dentro de parámetros normales...
                        </p>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="prescriptions" className="space-y-4 mt-4">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Pill className="w-4 h-4 text-[#62BF04]" />
                      <h4 className="text-sm text-gray-900">Medicamentos Activos</h4>
                    </div>
                    <div className="space-y-2">
                      <Card className="p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm">Losartán 50mg</p>
                            <p className="text-xs text-gray-600">1 tableta cada 24h</p>
                          </div>
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            Activo
                          </Badge>
                        </div>
                      </Card>
                      <Card className="p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm">Metformina 850mg</p>
                            <p className="text-xs text-gray-600">1 tableta cada 12h</p>
                          </div>
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            Activo
                          </Badge>
                        </div>
                      </Card>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="text-sm text-gray-900 mb-3">Nueva Prescripción</h4>
                    <Button className="w-full" variant="outline">
                      <Pill className="w-4 h-4 mr-2" />
                      Agregar Medicamento
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Toggle Sidebar Button (when closed) */}
      {!isSidebarOpen && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsSidebarOpen(true)}
          className="absolute right-4 top-24 rounded-full shadow-lg"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
      )}

      {/* Back Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setCurrentPage("dashboard")}
        className="absolute left-4 top-24 rounded-full shadow-lg bg-white"
        title="Volver al dashboard"
      >
        <ArrowLeft className="w-5 h-5" />
      </Button>
    </div>
  );
}