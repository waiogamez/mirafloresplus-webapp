/**
 * Plantilla de Factura Electrónica (FEL) - Guatemala
 * Cumple con normativa SAT-INFILE
 */

import React from 'react';
import { FELInvoice } from '../store/useFELStore';
import { Logo } from './Logo';

interface FELInvoiceProps {
  invoice: FELInvoice;
  showWatermark?: boolean;
}

export function FELInvoiceTemplate({ invoice, showWatermark = false }: FELInvoiceProps) {
  // Helper para formatear fechas desde string 'YYYY-MM-DD'
  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    return `${day} de ${months[parseInt(month) - 1]} de ${year}`;
  };

  // Helper para formatear fecha-hora desde string ISO
  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${day}/${month}/${year} a las ${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="fel-invoice bg-white relative" style={{ width: '210mm', minHeight: '297mm' }}>
      {/* Watermark para borradores */}
      {showWatermark && invoice.status === 'Draft' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 z-10">
          <span className="text-9xl font-bold text-gray-400 rotate-[-45deg]">
            BORRADOR
          </span>
        </div>
      )}

      <div className="p-12 relative">
        {/* ================================================================
            ENCABEZADO
        ================================================================ */}
        <div className="flex justify-between items-start mb-8 pb-8 border-b-2 border-[#0477BF]">
          {/* Bloque Izquierdo - Logo y Emisor */}
          <div className="flex-1">
            <div className="mb-4">
              <Logo className="w-48 h-auto" />
            </div>
            <div className="space-y-1">
              <h2 className="font-semibold text-gray-900">
                {invoice.issuer.name}
              </h2>
              <p className="text-sm text-gray-600">
                NIT: {invoice.issuer.nit}
              </p>
            </div>
          </div>

          {/* Bloque Derecho - Info FEL */}
          <div className="text-right space-y-2">
            <div className="inline-block bg-[#0477BF] text-white px-4 py-2 rounded-lg mb-2">
              <span className="font-semibold">FEL – Factura Electrónica</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm">
                <span className="text-gray-600">Serie y Número:</span>{' '}
                <span className="font-bold text-gray-900">
                  {invoice.invoiceNumber}
                </span>
              </p>
              <p className="text-xs text-gray-500 break-all max-w-xs">
                <span className="font-medium">UUID:</span>
                <br />
                {invoice.uuid}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Fecha:</span>{' '}
                {formatDate(invoice.issueDate)}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Hora:</span> 10:30:00
              </p>
            </div>
          </div>
        </div>

        {/* ================================================================
            DATOS EMISOR Y RECEPTOR
        ================================================================ */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Emisor */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2 text-xs uppercase tracking-wide">
              Emisor
            </h3>
            <div className="space-y-1 text-xs">
              <p>
                <span className="text-gray-600">Nombre:</span>{' '}
                <span className="text-gray-900">{invoice.issuer.name}</span>
              </p>
              <p>
                <span className="text-gray-600">NIT:</span>{' '}
                <span className="text-gray-900">{invoice.issuer.nit}</span>
              </p>
              <p>
                <span className="text-gray-600">Dirección:</span>{' '}
                <span className="text-gray-900">{invoice.issuer.address}</span>
              </p>
              <p>
                <span className="text-gray-600">Municipio:</span>{' '}
                <span className="text-gray-900">{invoice.issuer.municipality}</span>
              </p>
              <p>
                <span className="text-gray-600">Departamento:</span>{' '}
                <span className="text-gray-900">{invoice.issuer.department}</span>
              </p>
              <p>
                <span className="text-gray-600">País:</span>{' '}
                <span className="text-gray-900">{invoice.issuer.country}</span>
              </p>
              <p>
                <span className="text-gray-600">Código Postal:</span>{' '}
                <span className="text-gray-900">{invoice.issuer.postalCode}</span>
              </p>
            </div>
          </div>

          {/* Receptor */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2 text-xs uppercase tracking-wide">
              Receptor
            </h3>
            <div className="space-y-1 text-xs">
              <p>
                <span className="text-gray-600">Nombre:</span>{' '}
                <span className="text-gray-900">{invoice.receiver.name}</span>
              </p>
              <p>
                <span className="text-gray-600">NIT/CUI:</span>{' '}
                <span className="text-gray-900">{invoice.receiver.nit}</span>
              </p>
              <p>
                <span className="text-gray-600">Dirección:</span>{' '}
                <span className="text-gray-900">{invoice.receiver.address}</span>
              </p>
              <p>
                <span className="text-gray-600">Municipio:</span>{' '}
                <span className="text-gray-900">{invoice.receiver.municipality}</span>
              </p>
              <p>
                <span className="text-gray-600">Departamento:</span>{' '}
                <span className="text-gray-900">{invoice.receiver.department}</span>
              </p>
              <p>
                <span className="text-gray-600">País:</span>{' '}
                <span className="text-gray-900">{invoice.receiver.country}</span>
              </p>
              <p>
                <span className="text-gray-600">Código Postal:</span>{' '}
                <span className="text-gray-900">{invoice.receiver.postalCode}</span>
              </p>
            </div>
          </div>
        </div>

        {/* ================================================================
            TABLA DE ÍTEMS
        ================================================================ */}
        <div className="mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#0477BF] text-white">
                <th className="px-4 py-3 text-left text-sm font-semibold w-12">#</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Descripción
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold w-24">
                  Cantidad
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold w-32">
                  Precio Unit.
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold w-32">
                  IVA (Q)
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold w-32">
                  Total (Q)
                </th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr
                  key={item.id}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="px-4 py-3 text-sm text-gray-600 border-b border-gray-200">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">
                    {item.description}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right border-b border-gray-200">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right border-b border-gray-200">
                    Q {item.unitPrice.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right border-b border-gray-200">
                    Q {item.iva.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right border-b border-gray-200">
                    Q {item.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================================================================
            TOTALES
        ================================================================ */}
        <div className="flex justify-end mb-8">
          <div className="w-80">
            <div className="bg-gray-50 rounded-lg p-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Subtotal:</span>
                <span className="text-gray-900 font-medium">
                  Q {invoice.subtotalAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">IVA (12%):</span>
                <span className="text-gray-900 font-medium">
                  Q {invoice.ivaAmount.toFixed(2)}
                </span>
              </div>
              <div className="pt-3 border-t-2 border-gray-300">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-900">Gran Total:</span>
                  <span className="font-bold text-[#0477BF] text-xl">
                    Q {invoice.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================
            PIE DE DOCUMENTO
        ================================================================ */}
        <div className="border-t-2 border-gray-200 pt-6">
          <div className="flex items-start justify-between">
            {/* QR Code Placeholder */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-gray-300">
                <svg
                  className="w-20 h-20 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                  />
                </svg>
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">
                Escanee para
                <br />
                consultar DTE
              </p>
            </div>

            {/* Información Legal */}
            <div className="flex-1 ml-8 space-y-3">
              <p className="text-xs text-gray-600 leading-relaxed">
                <span className="font-semibold text-gray-900">
                  Documento Tributario Electrónico (DTE)
                </span>
                <br />
                Documento generado y certificado electrónicamente conforme a los
                requisitos establecidos por la Superintendencia de Administración
                Tributaria (SAT) de Guatemala, según resolución SAT-FEL.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-900">
                  <span className="font-semibold">Consulte este DTE en:</span>
                  <br />
                  <a
                    href={invoice.consultationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0477BF] hover:underline font-medium"
                  >
                    {invoice.consultationUrl}
                  </a>
                </p>
              </div>

              {invoice.certifiedAt && (
                <p className="text-xs text-green-700 font-medium">
                  ✓ Certificado electrónicamente el {formatDateTime(invoice.certifiedAt)}
                </p>
              )}

              {invoice.status === 'Cancelled' && (
                <p className="text-xs text-red-700 font-bold bg-red-50 border border-red-200 rounded p-2">
                  ⚠ FACTURA ANULADA
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Badge de estado (solo visible en pantalla) */}
        {invoice.status === 'Draft' && (
          <div className="mt-6 print:hidden">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
              <p className="text-sm text-yellow-800 font-medium">
                📝 Este es un borrador. No tiene validez fiscal hasta ser certificado.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Estilos para impresión */}
      <style>{`
        @media print {
          .fel-invoice {
            box-shadow: none !important;
            margin: 0 !important;
            width: 210mm;
            min-height: 297mm;
          }
          
          @page {
            size: A4;
            margin: 0;
          }
          
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
}

export default FELInvoiceTemplate;
