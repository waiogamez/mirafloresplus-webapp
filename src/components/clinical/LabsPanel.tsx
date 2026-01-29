import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { FileText, Upload, Trash2, Eye, Download, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { uploadConsultationFile, deleteConsultationFile, type ConsultationFile } from '../../services/consultationApi';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface LabsPanelProps {
  consultationId: string;
  files: ConsultationFile[];
  onUpdate: () => void;
  readOnly?: boolean;
}

export function LabsPanel({ consultationId, files, onUpdate, readOnly = false }: LabsPanelProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewFile, setPreviewFile] = useState<ConsultationFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validar tipo de archivo
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error('Tipo de archivo no permitido. Solo PDF o imágenes (JPG, PNG)');
      return;
    }

    // Validar tamaño (máximo 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (selectedFile.size > maxSize) {
      toast.error('El archivo es demasiado grande. Máximo 10MB');
      return;
    }

    setIsUploading(true);

    try {
      await uploadConsultationFile(consultationId, selectedFile);
      toast.success('Archivo subido correctamente');
      
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Notify parent to refresh
      onUpdate();
    } catch (error) {
      toast.error('Error al subir el archivo');
      console.error('Error uploading file:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (fileId: string, fileName: string) => {
    if (!window.confirm(`¿Está seguro de eliminar ${fileName}?`)) {
      return;
    }

    try {
      await deleteConsultationFile(consultationId, fileId);
      toast.success('Archivo eliminado');
      onUpdate();
    } catch (error) {
      toast.error('Error al eliminar el archivo');
      console.error('Error deleting file:', error);
    }
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return '📄';
      case 'image':
        return '🖼️';
      default:
        return '📎';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <>
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#0477BF]" />
              Laboratorios y Archivos ({files.length})
            </CardTitle>
            {!readOnly && (
              <Button
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="bg-[#2BB9D9] hover:bg-[#1fa9c9]"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Subiendo...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Subir Archivo
                  </>
                )}
              </Button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileSelect}
            className="hidden"
          />
        </CardHeader>
        <CardContent className="space-y-4">
          {!readOnly && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-700">
                📎 <strong>Formatos permitidos:</strong> PDF, JPG, PNG (máximo 10MB)
              </p>
            </div>
          )}

          {/* Lista de Archivos */}
          <div className="space-y-2">
            {files.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No hay archivos subidos</p>
                {!readOnly && (
                  <p className="text-xs mt-1">Haga clic en "Subir Archivo" para agregar laboratorios o documentos</p>
                )}
              </div>
            ) : (
              files.map((file) => (
                <div
                  key={file.id}
                  className="p-3 bg-white rounded-lg border border-gray-200 hover:border-[#2BB9D9] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="text-2xl flex-shrink-0">
                        {getFileIcon(file.fileType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-900 truncate">
                          {file.fileName}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {file.fileType.toUpperCase()}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {formatFileSize(file.size)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          Subido: {format(new Date(file.uploadedAt), "dd/MM/yyyy HH:mm", { locale: es })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPreviewFile(file)}
                        className="text-[#0477BF] hover:bg-blue-50"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = file.fileUrl;
                          link.download = file.fileName;
                          link.click();
                        }}
                        className="text-[#62BF04] hover:bg-green-50"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      {!readOnly && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(file.id, file.fileName)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Preview Modal */}
      {previewFile && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setPreviewFile(null)}
        >
          <div 
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold text-gray-900">{previewFile.fileName}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPreviewFile(null)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="p-4 overflow-auto max-h-[calc(90vh-80px)]">
              {previewFile.fileType === 'pdf' ? (
                <iframe
                  src={previewFile.fileUrl}
                  className="w-full h-[600px] border-0"
                  title={previewFile.fileName}
                />
              ) : (
                <img
                  src={previewFile.fileUrl}
                  alt={previewFile.fileName}
                  className="max-w-full h-auto mx-auto"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
