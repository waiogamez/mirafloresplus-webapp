import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Pill, Plus, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { createPrescription, deletePrescription, type Prescription } from '../../services/consultationApi';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface PrescriptionPanelProps {
  consultationId: string;
  prescriptions: Prescription[];
  onUpdate: () => void;
  readOnly?: boolean;
}

export function PrescriptionPanel({ 
  consultationId, 
  prescriptions, 
  onUpdate,
  readOnly = false 
}: PrescriptionPanelProps) {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    medication: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.medication || !formData.dosage || !formData.frequency || !formData.duration) {
      toast.error('Por favor complete todos los campos requeridos');
      return;
    }

    setIsSubmitting(true);

    try {
      await createPrescription(consultationId, formData);
      
      toast.success('Receta agregada correctamente');
      
      // Reset form
      setFormData({
        medication: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: '',
      });
      setShowForm(false);
      
      // Notify parent to refresh
      onUpdate();
    } catch (error) {
      toast.error('Error al crear la receta');
      console.error('Error creating prescription:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (prescriptionId: string, medication: string) => {
    if (!window.confirm(`¿Está seguro de eliminar la receta de ${medication}?`)) {
      return;
    }

    try {
      await deletePrescription(consultationId, prescriptionId);
      toast.success('Receta eliminada');
      onUpdate();
    } catch (error) {
      toast.error('Error al eliminar la receta');
      console.error('Error deleting prescription:', error);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Pill className="w-5 h-5 text-[#0477BF]" />
            Recetas Médicas ({prescriptions.length})
          </CardTitle>
          {!readOnly && !showForm && (
            <Button
              size="sm"
              onClick={() => setShowForm(true)}
              className="bg-[#62BF04] hover:bg-[#52a003]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Receta
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Formulario Nueva Receta */}
        {showForm && (
          <form onSubmit={handleSubmit} className="p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-[#0477BF]">Nueva Receta</h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowForm(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label htmlFor="medication">Medicamento *</Label>
                <Input
                  id="medication"
                  value={formData.medication}
                  onChange={(e) => setFormData({ ...formData, medication: e.target.value })}
                  placeholder="Ej: Paracetamol"
                  required
                />
              </div>

              <div>
                <Label htmlFor="dosage">Dosis *</Label>
                <Input
                  id="dosage"
                  value={formData.dosage}
                  onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                  placeholder="Ej: 500mg"
                  required
                />
              </div>

              <div>
                <Label htmlFor="frequency">Frecuencia *</Label>
                <Input
                  id="frequency"
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  placeholder="Ej: Cada 8 horas"
                  required
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="duration">Duración *</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="Ej: 5 días"
                  required
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="instructions">Instrucciones Adicionales</Label>
                <Textarea
                  id="instructions"
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  placeholder="Ej: Tomar con alimentos, evitar alcohol..."
                  rows={2}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#62BF04] hover:bg-[#52a003]"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Receta
                </>
              )}
            </Button>
          </form>
        )}

        {/* Lista de Recetas */}
        <div className="space-y-3">
          {prescriptions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Pill className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No hay recetas registradas</p>
              {!readOnly && (
                <p className="text-xs mt-1">Haga clic en "Nueva Receta" para agregar una</p>
              )}
            </div>
          ) : (
            prescriptions.map((rx) => (
              <div
                key={rx.id}
                className="p-4 bg-white rounded-lg border border-gray-200 hover:border-[#0477BF] transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{rx.medication}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {rx.dosage}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Frecuencia:</strong> {rx.frequency}</p>
                      <p><strong>Duración:</strong> {rx.duration}</p>
                      {rx.instructions && (
                        <p className="text-xs bg-amber-50 p-2 rounded border border-amber-200 mt-2">
                          <strong>⚠️ Instrucciones:</strong> {rx.instructions}
                        </p>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Creada: {format(new Date(rx.createdAt), "dd 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}
                    </p>
                  </div>
                  {!readOnly && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(rx.id, rx.medication)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
