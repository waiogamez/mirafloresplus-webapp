/**
 * Página de Facturación Electrónica (FEL)
 * Vista y gestión de facturas FEL
 */

import React, { useState } from 'react';
import { useFELStore } from '../store/useFELStore';
import FELInvoiceTemplate from './FELInvoice';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import {
  FileText,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Printer,
  Mail,
  Plus,
  ArrowLeft,
} from 'lucide-react';

export function FELInvoicePage() {
  const { invoices, currentInvoice, setCurrentInvoice, certifyInvoice, cancelInvoice } =
    useFELStore();

  const [viewMode, setViewMode] = useState<'list' | 'preview'>('list');

  // Manejar vista de factura
  const handleViewInvoice = (invoiceId: string) => {
    const invoice = invoices.find((inv) => inv.id === invoiceId);
    if (invoice) {
      setCurrentInvoice(invoice);
      setViewMode('preview');
    }
  };

  // Manejar certificación
  const handleCertify = async (invoiceId: string) => {
    try {
      await certifyInvoice(invoiceId);
      alert('Factura certificada exitosamente');
    } catch (error) {
      alert('Error al certificar factura');
    }
  };

  // Manejar anulación
  const handleCancel = async (invoiceId: string) => {
    if (window.confirm('¿Está seguro que desea anular esta factura?')) {
      try {
        await cancelInvoice(invoiceId);
        alert('Factura anulada exitosamente');
      } catch (error) {
        alert('Error al anular factura');
      }
    }
  };

  // Manejar descarga
  const handleDownload = () => {
    if (currentInvoice) {
      alert(`Descargando factura ${currentInvoice.invoiceNumber}`);
    }
  };

  // Manejar impresión
  const handlePrint = () => {
    window.print();
  };

  // Manejar envío por email
  const handleEmail = () => {
    if (currentInvoice) {
      alert(`Enviando factura ${currentInvoice.invoiceNumber} a ${currentInvoice.receiver.name}`);
    }
  };

  // Volver a lista
  const handleBackToList = () => {
    setViewMode('list');
    setCurrentInvoice(null);
  };

  // Status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Issued':
        return <Badge className="bg-green-500">Emitida</Badge>;
      case 'Cancelled':
        return <Badge className="bg-red-500">Anulada</Badge>;
      case 'Draft':
        return <Badge className="bg-gray-500">Borrador</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Calcular totales
  const totalInvoices = invoices.length;
  const totalIssued = invoices.filter((inv) => inv.status === 'Issued').length;
  const totalDraft = invoices.filter((inv) => inv.status === 'Draft').length;
  const totalCancelled = invoices.filter((inv) => inv.status === 'Cancelled').length;
  const totalAmount = invoices
    .filter((inv) => inv.status === 'Issued')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  // Vista de Lista
  if (viewMode === 'list') {
    return (
      <div className="w-full">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[#0477BF] mb-2">Sistema de Facturación Electrónica (FEL)</h1>
          <p className="text-gray-600">
            Gestión de facturas electrónicas certificadas por SAT Guatemala
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Facturas</p>
                <p className="text-2xl text-gray-900">{totalInvoices}</p>
              </div>
              <FileText className="w-8 h-8 text-[#0477BF]" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Emitidas</p>
                <p className="text-2xl text-green-600">{totalIssued}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Borradores</p>
                <p className="text-2xl text-gray-600">{totalDraft}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-gray-500" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Emitido</p>
                <p className="text-2xl text-[#0477BF]">Q{totalAmount.toFixed(2)}</p>
              </div>
              <FileText className="w-8 h-8 text-[#62BF04]" />
            </div>
          </Card>
        </div>

        {/* Lista de Facturas */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-900">Facturas Electrónicas</h2>
            <Button className="bg-[#0477BF] hover:bg-[#035a91]">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Factura
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-600">Serie-Número</th>
                  <th className="text-left py-3 px-4 text-gray-600">Fecha</th>
                  <th className="text-left py-3 px-4 text-gray-600">Cliente</th>
                  <th className="text-left py-3 px-4 text-gray-600">NIT</th>
                  <th className="text-right py-3 px-4 text-gray-600">Monto</th>
                  <th className="text-center py-3 px-4 text-gray-600">Estado</th>
                  <th className="text-center py-3 px-4 text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900">{invoice.invoiceNumber}</td>
                    <td className="py-3 px-4 text-gray-600">{invoice.issueDate}</td>
                    <td className="py-3 px-4 text-gray-900">{invoice.receiver.name}</td>
                    <td className="py-3 px-4 text-gray-600">{invoice.receiver.nit}</td>
                    <td className="py-3 px-4 text-right text-gray-900">
                      Q{invoice.totalAmount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center">{getStatusBadge(invoice.status)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewInvoice(invoice.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {invoice.status === 'Draft' && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleCertify(invoice.id)}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                        {invoice.status === 'Issued' && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleCancel(invoice.id)}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  }

  // Vista de Preview
  return (
    <div className="w-full">
      {/* Header con acciones */}
      <div className="mb-6 flex items-center justify-between">
        <Button variant="outline" onClick={handleBackToList}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Lista
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleEmail}>
            <Mail className="w-4 h-4 mr-2" />
            Enviar
          </Button>
          <Button variant="outline" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Descargar
          </Button>
          <Button className="bg-[#0477BF] hover:bg-[#035a91]" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Imprimir
          </Button>
        </div>
      </div>

      {/* Factura */}
      {currentInvoice && <FELInvoiceTemplate invoice={currentInvoice} />}
    </div>
  );
}

export default FELInvoicePage;
