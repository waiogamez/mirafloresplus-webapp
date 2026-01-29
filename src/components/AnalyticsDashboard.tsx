import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import {
  BarChart3,
  Activity,
  AlertCircle,
  TrendingUp,
  Users,
  FileText,
  Download,
  RefreshCw,
  Clock,
  MousePointer,
} from 'lucide-react';
import { analytics, type AnalyticsEvent, type PageView } from '../utils/analytics';
import { errorTracker, type ErrorEvent } from '../utils/errorTracking';
import { logger } from '../utils/logger';
import { isDevelopment } from '../utils/env';
import { useWebVitals } from './hooks/usePerformance';

/**
 * Analytics Dashboard Component
 * Shows analytics data, errors, and performance metrics
 */
export function AnalyticsDashboard() {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [pageViews, setPageViews] = useState<PageView[]>([]);
  const [errors, setErrors] = useState<ErrorEvent[]>([]);
  const [sessionStats, setSessionStats] = useState(analytics.getSessionStats());
  const vitals = useWebVitals();

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setEvents(analytics.getEvents());
    setPageViews(analytics.getPageViews());
    setErrors(errorTracker.getErrors());
    setSessionStats(analytics.getSessionStats());
    logger.info('Analytics dashboard refreshed');
  };

  const getEventCountsByCategory = () => {
    const counts: Record<string, number> = {};
    events.forEach((event) => {
      counts[event.category] = (counts[event.category] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);
  };

  const getMostVisitedPages = () => {
    const counts: Record<string, number> = {};
    pageViews.forEach((pv) => {
      counts[pv.page] = (counts[pv.page] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([page, count]) => ({ page, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const getErrorStats = () => {
    const counts = errorTracker.getErrorCounts();
    return [
      { level: 'Fatal', count: counts.fatal, color: 'bg-red-600' },
      { level: 'Error', count: counts.error, color: 'bg-orange-600' },
      { level: 'Warning', count: counts.warning, color: 'bg-yellow-600' },
      { level: 'Info', count: counts.info, color: 'bg-blue-600' },
    ];
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };

  const formatTimestamp = (date: Date) => {
    return new Date(date).toLocaleTimeString('es-GT', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const downloadLogs = () => {
    logger.downloadLogs();
  };

  const clearData = () => {
    if (confirm('¿Estás seguro de que quieres limpiar todos los datos de analytics?')) {
      analytics.clearData();
      errorTracker.clearErrors();
      logger.clearLogs();
      refreshData();
      logger.info('Analytics data cleared');
    }
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[#0477BF] mb-1">Panel de Monitoreo</h1>
          <p className="text-gray-600">
            Analytics, errores y métricas de rendimiento en tiempo real
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={refreshData} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
          <Button onClick={downloadLogs} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Descargar Logs
          </Button>
          <Button onClick={clearData} variant="outline" size="sm">
            Limpiar Datos
          </Button>
        </div>
      </div>

      {/* Session Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#0477BF]/10 rounded-lg">
                <MousePointer className="w-5 h-5 text-[#0477BF]" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Eventos</p>
                <p className="text-2xl">{sessionStats.totalEvents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#2BB9D9]/10 rounded-lg">
                <FileText className="w-5 h-5 text-[#2BB9D9]" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Páginas Vistas</p>
                <p className="text-2xl">{sessionStats.totalPageViews}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Errores</p>
                <p className="text-2xl">{errors.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#9DD973]/10 rounded-lg">
                <Clock className="w-5 h-5 text-[#62BF04]" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Duración Sesión</p>
                <p className="text-2xl">
                  {formatDuration(sessionStats.sessionDuration)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="events" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="events">Eventos</TabsTrigger>
          <TabsTrigger value="pages">Páginas</TabsTrigger>
          <TabsTrigger value="errors">Errores</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="categories">Categorías</TabsTrigger>
        </TabsList>

        {/* Events Tab */}
        <TabsContent value="events" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Eventos Recientes</CardTitle>
              <CardDescription>
                Últimos {events.length} eventos registrados en esta sesión
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-2">
                  {events.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No hay eventos registrados aún
                    </div>
                  ) : (
                    events
                      .slice()
                      .reverse()
                      .map((event) => (
                        <div
                          key={event.id}
                          className="flex items-start justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs">
                                {event.category}
                              </Badge>
                              <span className="text-sm">{event.action}</span>
                            </div>
                            {event.label && (
                              <p className="text-xs text-gray-600">{event.label}</p>
                            )}
                            {event.properties && (
                              <pre className="text-xs text-gray-500 mt-1">
                                {JSON.stringify(event.properties, null, 2)}
                              </pre>
                            )}
                          </div>
                          <div className="text-xs text-gray-400 ml-4">
                            {formatTimestamp(event.timestamp)}
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pages Tab */}
        <TabsContent value="pages" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Páginas Más Visitadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getMostVisitedPages().map(({ page, count }) => (
                    <div key={page} className="flex items-center justify-between">
                      <span className="text-sm">{page || '/'}</span>
                      <Badge>{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Historial de Navegación</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {pageViews
                      .slice()
                      .reverse()
                      .map((pv) => (
                        <div
                          key={pv.id}
                          className="flex items-start justify-between p-2 bg-gray-50 rounded"
                        >
                          <div>
                            <p className="text-sm">{pv.page}</p>
                            {pv.duration && (
                              <p className="text-xs text-gray-500">
                                Duración: {formatDuration(pv.duration)}
                              </p>
                            )}
                          </div>
                          <span className="text-xs text-gray-400">
                            {formatTimestamp(pv.timestamp)}
                          </span>
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Errors Tab */}
        <TabsContent value="errors" className="mt-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-4 gap-4">
              {getErrorStats().map((stat) => (
                <Card key={stat.level}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{stat.level}</p>
                        <p className="text-2xl">{stat.count}</p>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Errores Recientes</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2">
                    {errors.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <AlertCircle className="w-12 h-12 mx-auto mb-2 text-green-600" />
                        ¡Sin errores! Todo funciona correctamente.
                      </div>
                    ) : (
                      errors
                        .slice()
                        .reverse()
                        .map((error) => (
                          <div
                            key={error.id}
                            className="p-3 bg-red-50 border border-red-100 rounded-lg"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <Badge
                                variant={
                                  error.level === 'fatal' || error.level === 'error'
                                    ? 'destructive'
                                    : 'outline'
                                }
                              >
                                {error.level}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {formatTimestamp(error.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm mb-2">{error.message}</p>
                            {error.stack && (
                              <details className="mt-2">
                                <summary className="text-xs text-gray-600 cursor-pointer">
                                  Stack Trace
                                </summary>
                                <pre className="text-xs text-gray-500 mt-1 p-2 bg-white rounded overflow-auto max-h-32">
                                  {error.stack}
                                </pre>
                              </details>
                            )}
                          </div>
                        ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>LCP</CardTitle>
                <CardDescription>Largest Contentful Paint</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl mb-2">
                  {vitals.lcp ? `${Math.round(vitals.lcp)}ms` : '-'}
                </div>
                <p className="text-xs text-gray-600">
                  {vitals.lcp && vitals.lcp < 2500 ? (
                    <span className="text-green-600">✓ Bueno</span>
                  ) : vitals.lcp && vitals.lcp < 4000 ? (
                    <span className="text-yellow-600">⚠ Necesita mejorar</span>
                  ) : (
                    <span className="text-red-600">✗ Pobre</span>
                  )}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>FID</CardTitle>
                <CardDescription>First Input Delay</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl mb-2">
                  {vitals.fid ? `${Math.round(vitals.fid)}ms` : '-'}
                </div>
                <p className="text-xs text-gray-600">
                  {vitals.fid && vitals.fid < 100 ? (
                    <span className="text-green-600">✓ Bueno</span>
                  ) : vitals.fid && vitals.fid < 300 ? (
                    <span className="text-yellow-600">⚠ Necesita mejorar</span>
                  ) : (
                    <span className="text-red-600">✗ Pobre</span>
                  )}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>CLS</CardTitle>
                <CardDescription>Cumulative Layout Shift</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl mb-2">
                  {vitals.cls ? vitals.cls.toFixed(3) : '-'}
                </div>
                <p className="text-xs text-gray-600">
                  {vitals.cls && vitals.cls < 0.1 ? (
                    <span className="text-green-600">✓ Bueno</span>
                  ) : vitals.cls && vitals.cls < 0.25 ? (
                    <span className="text-yellow-600">⚠ Necesita mejorar</span>
                  ) : (
                    <span className="text-red-600">✗ Pobre</span>
                  )}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Eventos por Categoría</CardTitle>
              <CardDescription>Distribución de eventos registrados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getEventCountsByCategory().map(({ category, count }) => (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm capitalize">{category}</span>
                      <span className="text-sm text-gray-600">{count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#0477BF] h-2 rounded-full transition-all"
                        style={{
                          width: `${(count / events.length) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dev Info */}
      {isDevelopment() && (
        <Card className="mt-6 border-dashed">
          <CardHeader>
            <CardTitle className="text-sm">Información de Desarrollo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-gray-600">Session ID:</p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {sessionStats.sessionId}
                </code>
              </div>
              <div>
                <p className="text-gray-600">Página Actual:</p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {sessionStats.currentPage}
                </code>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
