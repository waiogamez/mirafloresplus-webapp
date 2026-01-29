import { Button } from "./ui/button";
import { Download, FileText } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface AffiliateContractData {
  affiliateId: string;
  firstName: string;
  lastName: string;
  dpi: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  department: string;
  plan: string;
  signatureDate: string;
}

interface ContractPDFGeneratorProps {
  contractData: AffiliateContractData;
  className?: string;
}

export function ContractPDFGenerator({ contractData, className }: ContractPDFGeneratorProps) {
  
  const generatePDF = () => {
    // Crear contenido HTML para el PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Contrato Miraflores Plus - ${contractData.affiliateId}</title>
        <style>
          @page {
            size: letter;
            margin: 2cm;
          }
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #0477BF;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            color: #0477BF;
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .tagline {
            color: #2BB9D9;
            font-size: 14px;
            font-style: italic;
          }
          h1 {
            color: #0477BF;
            font-size: 24px;
            text-align: center;
            margin: 20px 0;
          }
          h2 {
            color: #0477BF;
            font-size: 18px;
            margin-top: 25px;
            margin-bottom: 10px;
            border-left: 4px solid #62BF04;
            padding-left: 10px;
          }
          .info-box {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
          }
          .info-row {
            display: flex;
            margin-bottom: 8px;
          }
          .info-label {
            font-weight: bold;
            width: 180px;
            color: #0477BF;
          }
          .info-value {
            flex: 1;
          }
          .clause {
            background: #ffffff;
            border-left: 4px solid #0477BF;
            padding: 15px;
            margin: 15px 0;
            border-radius: 0 5px 5px 0;
          }
          .clause-title {
            font-weight: bold;
            color: #0477BF;
            margin-bottom: 8px;
          }
          .fees-table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
          }
          .fees-table td {
            padding: 10px;
            border: 1px solid #dee2e6;
          }
          .fees-table tr:first-child {
            background: #0477BF;
            color: white;
            font-weight: bold;
          }
          .facilities {
            background: #e8f4f8;
            border: 1px solid #2BB9D9;
            border-radius: 5px;
            padding: 15px;
            margin: 15px 0;
          }
          .signature-section {
            margin-top: 50px;
            padding-top: 30px;
            border-top: 2px solid #0477BF;
          }
          .signature-line {
            border-top: 2px solid #333;
            width: 300px;
            margin: 40px auto 10px;
            text-align: center;
            padding-top: 10px;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #dee2e6;
            text-align: center;
            font-size: 12px;
            color: #6c757d;
          }
          @media print {
            body {
              padding: 0;
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">MIRAFLORES PLUS</div>
          <div class="tagline">¡Tu salud, a un clic de distancia!</div>
        </div>

        <h1>CONSENTIMIENTO INFORMADO Y CONTRATO DE AFILIACIÓN</h1>

        <div class="info-box">
          <h2>Datos del Afiliado</h2>
          <div class="info-row">
            <span class="info-label">Número de Afiliado:</span>
            <span class="info-value">${contractData.affiliateId}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Nombre Completo:</span>
            <span class="info-value">${contractData.firstName} ${contractData.lastName}</span>
          </div>
          <div class="info-row">
            <span class="info-label">DPI:</span>
            <span class="info-value">${contractData.dpi}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Fecha de Nacimiento:</span>
            <span class="info-value">${new Date(contractData.dateOfBirth).toLocaleDateString('es-GT')}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Correo Electrónico:</span>
            <span class="info-value">${contractData.email}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Teléfono:</span>
            <span class="info-value">${contractData.phone}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Dirección:</span>
            <span class="info-value">${contractData.address}, ${contractData.city}, ${contractData.department}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Plan Seleccionado:</span>
            <span class="info-value">${contractData.plan}</span>
          </div>
        </div>

        <h2>Declaración del Afiliado</h2>
        <p style="text-align: justify;">
          Por medio del presente documento, declaro que la información proporcionada es verídica y 
          <strong>autorizo a Miraflores Plus</strong> a utilizarla exclusivamente con fines médicos, 
          administrativos y de gestión interna, en el marco del programa de asistencia médica al que 
          me estoy afiliando.
        </p>

        <h2>Términos y Condiciones</h2>

        <div class="clause">
          <div class="clause-title">1. Naturaleza del Programa</div>
          <p style="text-align: justify;">
            Este programa <strong>no sustituye un seguro médico ni servicios de emergencia</strong>. 
            Sin embargo, como persona afiliada, puedo recibir orientación y asistencia para ser dirigido 
            a centros médicos aliados o servicios de emergencia donde podré acceder a 
            <strong>tarifas preferenciales o descuentos exclusivos</strong>.
          </p>
        </div>

        <div class="clause">
          <div class="clause-title">2. Límites de Servicios</div>
          <p style="text-align: justify;">
            Los servicios incluidos en mi plan tienen <strong>límites definidos</strong>, y en caso de 
            requerir servicios adicionales como consultas con especialistas, exámenes de laboratorio, 
            procedimientos ambulatorios u hospitalización, tendré acceso a <strong>descuentos establecidos 
            previamente</strong> por Miraflores Plus con los proveedores afiliados.
          </p>
        </div>

        <div class="clause">
          <div class="clause-title">3. Obligación de Pago</div>
          <p style="text-align: justify;">
            Es <strong>obligatorio mantener el pago mensual al día</strong> para conservar el estatus 
            activo como afiliado y poder hacer uso de los beneficios correspondientes al plan seleccionado.
          </p>
        </div>

        <div class="clause">
          <div class="clause-title">4. Modificaciones del Programa</div>
          <p style="text-align: justify;">
            Miraflores Plus <strong>se reserva el derecho de actualizar o modificar</strong> las condiciones 
            del programa, ya sea por razones operativas, cambios en la red de proveedores, regulaciones del 
            sector salud o ajustes de políticas internas. Todo cambio será <strong>notificado de forma 
            oportuna</strong> a cada miembro afiliado a través de los medios de contacto registrados.
          </p>
        </div>

        <div class="clause">
          <div class="clause-title">5. No Transferibilidad de Beneficios</div>
          <p style="text-align: justify;">
            Las citas médicas y todos los beneficios del programa <strong>no son transferibles</strong> a 
            terceros. Los servicios están destinados <strong>únicamente a los afiliados titulares y dependientes 
            registrados</strong> que mantengan su cuota mensual al día y cuenten con estatus activo en el 
            sistema. El uso indebido o compartir beneficios con personas no autorizadas puede resultar en la 
            <strong>suspensión inmediata de la afiliación</strong>.
          </p>
        </div>

        <h2>Tarifas del Plan</h2>
        <table class="fees-table">
          <tr>
            <td>Concepto</td>
            <td>Tarifa Mensual</td>
          </tr>
          <tr>
            <td>Titular</td>
            <td>Q85.00</td>
          </tr>
          <tr>
            <td>Dependiente (por cada uno)</td>
            <td>Q49.00</td>
          </tr>
        </table>

        <h2>Instalaciones Autorizadas</h2>
        <div class="facilities">
          <ul style="margin: 0; padding-left: 20px;">
            <li>Hospital Miraflores Roosevelt - Ciudad de Guatemala</li>
            <li>Hospital Miraflores Zona 10 - Ciudad de Guatemala</li>
          </ul>
        </div>

        <div class="signature-section">
          <p style="text-align: justify;">
            Al firmar este documento, confirmo que he leído y comprendido toda la información proporcionada 
            y acepto voluntariamente afiliarme al programa Miraflores Plus bajo los términos aquí descritos.
          </p>
          
          <div class="signature-line">
            <div style="font-weight: bold;">${contractData.firstName} ${contractData.lastName}</div>
            <div style="font-size: 12px; color: #6c757d; margin-top: 5px;">Firma del Afiliado</div>
          </div>
          
          <p style="text-align: center; margin-top: 20px;">
            <strong>Fecha de Firma:</strong> ${new Date(contractData.signatureDate).toLocaleDateString('es-GT', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        <div class="footer">
          <p>
            <strong>Miraflores Plus</strong><br>
            Sistema de Asistencia Médica<br>
            Guatemala, Guatemala<br>
            Documento generado el ${new Date().toLocaleString('es-GT')}
          </p>
        </div>
      </body>
      </html>
    `;

    // Crear un Blob con el contenido HTML
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Abrir ventana de impresión
    const printWindow = window.open(url, '_blank');
    
    if (printWindow) {
      printWindow.onload = () => {
        // Esperar a que cargue el contenido
        setTimeout(() => {
          printWindow.print();
        }, 250);
      };
      
      toast.success("Documento preparado para impresión/descarga");
    } else {
      toast.error("No se pudo abrir la ventana de impresión. Verifique que no esté bloqueada.");
    }
    
    // Limpiar URL después de un tiempo
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  };

  return (
    <Button
      onClick={generatePDF}
      className={className}
      variant="outline"
    >
      <FileText className="w-4 h-4 mr-2" />
      Generar Contrato PDF
    </Button>
  );
}