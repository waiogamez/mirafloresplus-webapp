import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { FileText, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { updateConsultationNotes } from '../../services/consultationApi';

interface NotesPanelProps {
  consultationId: string;
  initialNotes?: string;
  readOnly?: boolean;
}

export function NotesPanel({ consultationId, initialNotes = '', readOnly = false }: NotesPanelProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);

  // Auto-save cada 10 segundos si hay cambios
  useEffect(() => {
    if (readOnly || notes === initialNotes) return;

    // Limpiar timer anterior
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }

    // Crear nuevo timer
    const timer = setTimeout(() => {
      handleSave(true);
    }, 10000); // 10 segundos

    setAutoSaveTimer(timer);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [notes, readOnly]);

  const handleSave = async (isAutoSave = false) => {
    if (readOnly || !notes.trim()) return;

    setIsSaving(true);

    try {
      await updateConsultationNotes(consultationId, { notes });
      setLastSaved(new Date());
      
      if (!isAutoSave) {
        toast.success('Notas guardadas correctamente');
      }
    } catch (error) {
      toast.error('Error al guardar las notas');
      console.error('Error saving notes:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const formatLastSaved = () => {
    if (!lastSaved) return '';
    
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastSaved.getTime()) / 1000);
    
    if (diff < 60) return 'Guardado hace unos segundos';
    if (diff < 3600) return `Guardado hace ${Math.floor(diff / 60)} minutos`;
    return `Guardado a las ${lastSaved.toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#0477BF]" />
            Notas de la Consulta
          </CardTitle>
          {!readOnly && (
            <Button
              size="sm"
              onClick={() => handleSave(false)}
              disabled={isSaving || notes === initialNotes}
              className="bg-[#0477BF] hover:bg-[#0366a3]"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar
                </>
              )}
            </Button>
          )}
        </div>
        {lastSaved && (
          <p className="text-xs text-gray-500 mt-1">
            {formatLastSaved()}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Escriba aquí las notas de la consulta médica...&#10;&#10;• Motivo de consulta&#10;• Síntomas actuales&#10;• Exploración física&#10;• Diagnóstico&#10;• Plan de tratamiento&#10;• Recomendaciones"
          className="min-h-[400px] resize-none font-mono text-sm"
          disabled={readOnly}
        />
        
        {!readOnly && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-700">
              💡 <strong>Auto-guardado:</strong> Las notas se guardan automáticamente cada 10 segundos mientras escribes.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
