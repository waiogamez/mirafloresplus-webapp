import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { ScrollArea } from './ui/scroll-area';
import {
  Shield,
  Lock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Download,
  AlertCircle,
  Clock,
  Activity,
} from 'lucide-react';
import { rateLimiter } from '../utils/rateLimiter';
import { getCSPDirectives, directivesToString, getSecurityHeaders } from '../utils/csp';
import { logger } from '../utils/logger';
import { isDevelopment } from '../utils/env';
import { codeProtection } from '../utils/codeProtection';

/**
 * Security Dashboard Component
 * Monitors and configures security settings
 */
export function SecurityDashboard() {
  const [securityStatus, setSecurityStatus] = useState({
    csp: true,
    rateLimit: true,
    sanitization: true,
    encryption: true,
    codeProtection: !isDevelopment() && codeProtection.isActive(),
  });

  const [rateLimitStats, setRateLimitStats] = useState<
    Array<{ key: string; status: any }>
  >([]);

  useEffect(() => {
    refreshStats();
  }, []);

  const refreshStats = () => {
    // Get rate limit stats for common endpoints
    const keys = ['search', 'api', 'login', 'form-submit'];
    const stats = keys.map((key) => ({
      key,
      status: rateLimiter.getStatus(key),
    }));
    setRateLimitStats(stats);

    logger.info('Security stats refreshed');
  };

  const resetRateLimits = () => {
    rateLimiter.resetAll();
    refreshStats();
    logger.info('All rate limits reset');
  };

  const getStatusColor = (enabled: boolean) => {
    return enabled ? 'text-green-600' : 'text-red-600';
  };

  const getStatusIcon = (enabled: boolean) => {
    return enabled ? (
      <CheckCircle2 className="w-5 h-5 text-green-600" />
    ) : (
      <XCircle className="w-5 h-5 text-red-600" />
    );
  };

  const formatTime = (ms: number) => {
    if (ms === 0) return 'Ready';
    const seconds = Math.ceil(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
  };

  const exportSecurityConfig = () => {
    const config = {
      csp: getCSPDirectives(),
      securityHeaders: getSecurityHeaders(),
      rateLimits: rateLimitStats,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-config-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    logger.info('Security configuration exported');
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[#0477BF] mb-1">Panel de Seguridad</h1>
          <p className="text-gray-600">
            Monitoreo y configuración de seguridad de la aplicación
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={refreshStats} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
          <Button onClick={exportSecurityConfig} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar Config
          </Button>
        </div>
      </div>

      {/* Development Warning */}
      {isDevelopment() && (
        <Alert className="mb-6 border-yellow-500 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800">Modo de Desarrollo</AlertTitle>
          <AlertDescription className="text-yellow-700">
            Algunas configuraciones de seguridad están relajadas en modo de desarrollo.
            En producción, CSP será más estricto y la encriptación será más robusta.
          </AlertDescription>
        </Alert>
      )}

      {/* Security Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#0477BF]/10 rounded-lg">
                  <Shield className="w-5 h-5 text-[#0477BF]" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">CSP</p>
                  <p className="text-xs text-gray-500">Content Security</p>
                </div>
              </div>
              {getStatusIcon(securityStatus.csp)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#2BB9D9]/10 rounded-lg">
                  <Activity className="w-5 h-5 text-[#2BB9D9]" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Rate Limiting</p>
                  <p className="text-xs text-gray-500">Request Control</p>
                </div>
              </div>
              {getStatusIcon(securityStatus.rateLimit)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#9DD973]/10 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-[#62BF04]" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Sanitización</p>
                  <p className="text-xs text-gray-500">XSS Protection</p>
                </div>
              </div>
              {getStatusIcon(securityStatus.sanitization)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Lock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Encriptación</p>
                  <p className="text-xs text-gray-500">Data Security</p>
                </div>
              </div>
              {getStatusIcon(securityStatus.encryption)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Shield className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Protección Código</p>
                  <p className="text-xs text-gray-500">Anti-Copy</p>
                </div>
              </div>
              {getStatusIcon(securityStatus.codeProtection)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="rate-limits" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="rate-limits">Rate Limits</TabsTrigger>
          <TabsTrigger value="csp">CSP</TabsTrigger>
          <TabsTrigger value="headers">Security Headers</TabsTrigger>
          <TabsTrigger value="code-protection">Protección Código</TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
        </TabsList>

        {/* Rate Limits Tab */}
        <TabsContent value="rate-limits" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Rate Limiting Status</CardTitle>
                  <CardDescription>
                    Control de tasa de solicitudes para prevenir abuso
                  </CardDescription>
                </div>
                <Button onClick={resetRateLimits} variant="outline" size="sm">
                  Resetear Todos
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rateLimitStats.map(({ key, status }) => (
                  <div
                    key={key}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium capitalize">{key}</h3>
                          {status.isBlocked && (
                            <Badge variant="destructive" className="text-xs">
                              Bloqueado
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {status.maxRequests} solicitudes por{' '}
                          {Math.floor(status.windowMs / 1000)}s
                        </p>
                      </div>
                      <Button
                        onClick={() => {
                          rateLimiter.reset(key);
                          refreshStats();
                        }}
                        variant="ghost"
                        size="sm"
                      >
                        Resetear
                      </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 mb-1">Solicitudes Actuales</p>
                        <p className="text-lg font-medium">
                          {status.currentRequests}/{status.maxRequests}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Restantes</p>
                        <p
                          className={`text-lg font-medium ${
                            status.remainingRequests === 0
                              ? 'text-red-600'
                              : status.remainingRequests < status.maxRequests / 4
                              ? 'text-yellow-600'
                              : 'text-green-600'
                          }`}
                        >
                          {status.remainingRequests}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Próximo Reset
                        </p>
                        <p className="text-lg font-medium">
                          {formatTime(status.timeUntilReset)}
                        </p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            status.isBlocked
                              ? 'bg-red-600'
                              : status.remainingRequests < status.maxRequests / 4
                              ? 'bg-yellow-600'
                              : 'bg-green-600'
                          }`}
                          style={{
                            width: `${
                              (status.currentRequests / status.maxRequests) * 100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CSP Tab */}
        <TabsContent value="csp" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Security Policy</CardTitle>
              <CardDescription>
                Políticas de seguridad de contenido activas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-3">
                  {Object.entries(getCSPDirectives()).map(([directive, values]) => (
                    <div key={directive} className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-sm mb-2 text-[#0477BF]">
                        {directive}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {values.map((value, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {value}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-gray-600 mb-2">
                  Política CSP Completa:
                </p>
                <code className="text-xs bg-white p-2 rounded block overflow-x-auto">
                  {directivesToString(getCSPDirectives())}
                </code>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Headers Tab */}
        <TabsContent value="headers" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Headers</CardTitle>
              <CardDescription>
                Headers HTTP de seguridad recomendados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(getSecurityHeaders()).map(([header, value]) => (
                  <div key={header} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm text-[#0477BF]">
                        {header}
                      </h4>
                      <Badge variant="outline" className="text-xs">
                        {value ? 'Activo' : 'Deshabilitado'}
                      </Badge>
                    </div>
                    {value && (
                      <code className="text-xs bg-white p-2 rounded block">
                        {value}
                      </code>
                    )}
                  </div>
                ))}
              </div>

              <Alert className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Nota sobre Headers</AlertTitle>
                <AlertDescription>
                  Estos headers deben configurarse en el servidor web (nginx, Apache)
                  o en el edge (Cloudflare, Vercel). La configuración aquí es solo
                  informativa.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Code Protection Tab */}
        <TabsContent value="code-protection" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Protección de Código Fuente</CardTitle>
              <CardDescription>
                Medidas anti-copia y anti-inspección (Solo Producción)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isDevelopment() ? (
                <Alert className="border-yellow-500 bg-yellow-50">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertTitle className="text-yellow-800">
                    Deshabilitado en Desarrollo
                  </AlertTitle>
                  <AlertDescription className="text-yellow-700">
                    La protección de código solo se activa en producción para no
                    interferir con el desarrollo. En producción, se activarán todas
                    las protecciones contra copia y sabotaje.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  <Alert className="border-green-500 bg-green-50">
                    <Shield className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">
                      Protección Activa
                    </AlertTitle>
                    <AlertDescription className="text-green-700">
                      Tu código está protegido contra copia, inspección y sabotaje.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              <div className="mt-6 space-y-4">
                <h3 className="font-medium text-[#0477BF] mb-3">
                  Protecciones Implementadas
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-[#0477BF] mt-0.5" />
                      <div>
                        <h4 className="font-medium mb-1">Domain Lock</h4>
                        <p className="text-sm text-gray-600">
                          Solo funciona en dominios autorizados
                        </p>
                        <Badge variant="outline" className="mt-2 text-xs">
                          {isDevelopment() ? 'Deshabilitado' : 'Activo'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-start gap-3">
                      <Lock className="w-5 h-5 text-[#2BB9D9] mt-0.5" />
                      <div>
                        <h4 className="font-medium mb-1">DevTools Detection</h4>
                        <p className="text-sm text-gray-600">
                          Detecta y bloquea herramientas de desarrollo
                        </p>
                        <Badge variant="outline" className="mt-2 text-xs">
                          {isDevelopment() ? 'Deshabilitado' : 'Activo'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-[#62BF04] mt-0.5" />
                      <div>
                        <h4 className="font-medium mb-1">Right-Click Disabled</h4>
                        <p className="text-sm text-gray-600">
                          Click derecho bloqueado para prevenir copia
                        </p>
                        <Badge variant="outline" className="mt-2 text-xs">
                          {isDevelopment() ? 'Deshabilitado' : 'Activo'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-start gap-3">
                      <Activity className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium mb-1">View Source Disabled</h4>
                        <p className="text-sm text-gray-600">
                          Ctrl+U y ver código fuente bloqueados
                        </p>
                        <Badge variant="outline" className="mt-2 text-xs">
                          {isDevelopment() ? 'Deshabilitado' : 'Activo'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium mb-1">Iframe Protection</h4>
                        <p className="text-sm text-gray-600">
                          Previene embedding en otros sitios
                        </p>
                        <Badge variant="outline" className="mt-2 text-xs">
                          {isDevelopment() ? 'Deshabilitado' : 'Activo'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-start gap-3">
                      <Lock className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium mb-1">Console Obfuscation</h4>
                        <p className="text-sm text-gray-600">
                          Console.log y mensajes ofuscados
                        </p>
                        <Badge variant="outline" className="mt-2 text-xs">
                          {isDevelopment() ? 'Deshabilitado' : 'Activo'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium mb-1">Automation Detection</h4>
                        <p className="text-sm text-gray-600">
                          Detecta bots y scrapers automatizados
                        </p>
                        <Badge variant="outline" className="mt-2 text-xs">
                          {isDevelopment() ? 'Deshabilitado' : 'Activo'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium mb-1">DOM Watermark</h4>
                        <p className="text-sm text-gray-600">
                          Marca invisible en el código para rastreo
                        </p>
                        <Badge variant="outline" className="mt-2 text-xs">
                          {isDevelopment() ? 'Deshabilitado' : 'Activo'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <Alert className="mt-6 border-blue-500 bg-blue-50">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-800">
                    Protección Legal Adicional
                  </AlertTitle>
                  <AlertDescription className="text-blue-700">
                    <ul className="list-disc list-inside space-y-1 mt-2">
                      <li>Código con copyright registrado</li>
                      <li>Términos de uso que prohíben copia</li>
                      <li>Watermarks legales en el código</li>
                      <li>Rastreo de violaciones de licencia</li>
                    </ul>
                    <p className="mt-3 text-sm">
                      <strong>Importante:</strong> Estas protecciones técnicas deben
                      complementarse con protección legal. Consulta con un abogado de
                      propiedad intelectual para mayor protección.
                    </p>
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Seguridad</CardTitle>
              <CardDescription>
                Activar/desactivar características de seguridad
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <Label htmlFor="csp-toggle" className="text-base">
                      Content Security Policy
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Previene XSS y data injection attacks
                    </p>
                  </div>
                  <Switch
                    id="csp-toggle"
                    checked={securityStatus.csp}
                    onCheckedChange={(checked) =>
                      setSecurityStatus({ ...securityStatus, csp: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <Label htmlFor="rate-limit-toggle" className="text-base">
                      Rate Limiting
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Limita solicitudes para prevenir abuso
                    </p>
                  </div>
                  <Switch
                    id="rate-limit-toggle"
                    checked={securityStatus.rateLimit}
                    onCheckedChange={(checked) =>
                      setSecurityStatus({ ...securityStatus, rateLimit: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <Label htmlFor="sanitization-toggle" className="text-base">
                      Sanitización de Inputs
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Limpia y valida todos los inputs de usuario
                    </p>
                  </div>
                  <Switch
                    id="sanitization-toggle"
                    checked={securityStatus.sanitization}
                    onCheckedChange={(checked) =>
                      setSecurityStatus({
                        ...securityStatus,
                        sanitization: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <Label htmlFor="encryption-toggle" className="text-base">
                      Encriptación de Storage
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Encripta datos sensibles en localStorage
                    </p>
                  </div>
                  <Switch
                    id="encryption-toggle"
                    checked={securityStatus.encryption}
                    onCheckedChange={(checked) =>
                      setSecurityStatus({
                        ...securityStatus,
                        encryption: checked,
                      })
                    }
                  />
                </div>
              </div>

              <Alert className="mt-6 border-green-500 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">
                  Configuración Segura
                </AlertTitle>
                <AlertDescription className="text-green-700">
                  Todas las características de seguridad están activas. Tu
                  aplicación está protegida contra las amenazas más comunes.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
