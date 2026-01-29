import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from './ui/button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
// import { logErrorBoundary } from '../utils/errorTracking';
// import { logger } from '../utils/logger';
import { isDevelopment } from '../utils/env';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary Component
 * Catches React errors and displays a fallback UI
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to error tracking - DISABLED FOR PERFORMANCE
    // logErrorBoundary(error, errorInfo);
    
    // Log to logger - DISABLED FOR PERFORMANCE
    // logger.error('React Error Boundary caught an error', {
    //   error: error.message,
    //   stack: error.stack,
    //   componentStack: errorInfo.componentStack,
    // });

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Update state with error info
    this.setState({
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#F2F2F2' }}>
          <div className="max-w-2xl w-full">
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>¡Algo salió mal!</AlertTitle>
              <AlertDescription>
                La aplicación encontró un error inesperado. Por favor, intenta recargar la página.
              </AlertDescription>
            </Alert>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h1 className="text-[#0477BF] mb-2">Error de Aplicación</h1>
                <p className="text-gray-600">
                  Ocurrió un error inesperado. Nuestro equipo ha sido notificado.
                </p>
              </div>

              {isDevelopment() && this.state.error && (
                <div className="mb-6">
                  <details className="bg-gray-50 rounded-lg p-4">
                    <summary className="cursor-pointer text-sm mb-2">
                      Detalles del Error (Solo en desarrollo)
                    </summary>
                    <div className="mt-2 space-y-2">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Mensaje:</p>
                        <pre className="text-xs bg-white p-2 rounded border border-gray-200 overflow-auto">
                          {this.state.error.message}
                        </pre>
                      </div>
                      {this.state.error.stack && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Stack Trace:</p>
                          <pre className="text-xs bg-white p-2 rounded border border-gray-200 overflow-auto max-h-48">
                            {this.state.error.stack}
                          </pre>
                        </div>
                      )}
                      {this.state.errorInfo?.componentStack && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Component Stack:</p>
                          <pre className="text-xs bg-white p-2 rounded border border-gray-200 overflow-auto max-h-48">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </details>
                </div>
              )}

              <div className="flex gap-3 justify-center">
                <Button
                  onClick={this.handleReset}
                  className="bg-[#0477BF] hover:bg-[#0477BF]/90"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Intentar de Nuevo
                </Button>
                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Ir al Inicio
                </Button>
              </div>
            </div>

            <div className="text-center mt-6">
              <p className="text-sm text-gray-500">
                Si el problema persiste, contacta a{' '}
                <a href="mailto:soporte@miraflores.com" className="text-[#0477BF] hover:underline">
                  soporte@miraflores.com
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook-based Error Boundary wrapper
 * For use in specific sections of the app
 */
export function ErrorBoundaryWrapper({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <ErrorBoundary fallback={fallback}>
      {children}
    </ErrorBoundary>
  );
}
