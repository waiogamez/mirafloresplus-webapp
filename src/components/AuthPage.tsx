import { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Logo } from "./Logo";
import { useAuthStore } from "../store";
import { toast } from "sonner";

type AuthState = "login" | "register" | "forgot-password";

export function AuthPage() {
  const [authState, setAuthState] = useState<AuthState>("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string>("");
  
  const { login, isLoading } = useAuthStore();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(""); // Clear error when user types
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      await login(formData.email, formData.password);
      toast.success("¡Bienvenido a Miraflores Plus!");
    } catch (err) {
      setError("Correo o contraseña incorrectos. Por favor, intente nuevamente.");
      toast.error("Error al iniciar sesión");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    
    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    
    toast.info("Registro no disponible en esta versión. Contacte al administrador.");
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!formData.email) {
      setError("Por favor ingrese su correo electrónico");
      return;
    }
    
    toast.success(`Se ha enviado un enlace de recuperación a ${formData.email}`);
    setTimeout(() => {
      switchAuthState("login");
    }, 2000);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setError("");
  };

  const switchAuthState = (newState: AuthState) => {
    setAuthState(newState);
    resetForm();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0477BF] via-[#2BB9D9] to-[#0477BF]">
      <div className="w-full max-w-md">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-3 px-6 py-3 bg-white rounded-2xl shadow-lg">
            <Logo className="h-12 w-auto" />
          </div>
          <p className="text-white/90">¡Tu salud, a un clic de distancia!</p>
        </div>

        {/* Auth Card */}
        <Card className="p-8 shadow-2xl border-0">
          {/* Login State */}
          {authState === "login" && (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-[#0477BF] mb-2">Iniciar Sesión</h2>
                <p className="text-sm text-gray-600">
                  Accede a tu panel de administración
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    className="border-gray-300 focus:border-[#0477BF] focus:ring-[#0477BF]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    className="border-gray-300 focus:border-[#0477BF] focus:ring-[#0477BF]"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                style={{ backgroundColor: "#0477BF" }}
                disabled={isLoading}
              >
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
              
              {/* Demo Credentials Info */}
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                <p className="text-xs font-semibold text-blue-900 mb-2">Credenciales de prueba:</p>
                <div className="text-xs text-blue-800 space-y-1">
                  <p><strong>Recepción:</strong> recepcion@mirafloresplus.com</p>
                  <p><strong>Doctor:</strong> doctor@mirafloresplus.com</p>
                  <p><strong>Finanzas:</strong> finanzas@mirafloresplus.com</p>
                  <p><strong>Junta:</strong> junta@mirafloresplus.com</p>
                  <p><strong>Admin:</strong> admin@mirafloresplus.com</p>
                  <p className="mt-2"><strong>Contraseña para todos:</strong> [rol]123</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={() => switchAuthState("forgot-password")}
                  className="text-[#0477BF] hover:text-[#2BB9D9] transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </button>
                <button
                  type="button"
                  onClick={() => switchAuthState("register")}
                  className="text-[#0477BF] hover:text-[#2BB9D9] transition-colors"
                >
                  Crear cuenta
                </button>
              </div>
            </form>
          )}

          {/* Register State */}
          {authState === "register" && (
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="flex items-center gap-2 mb-6">
                <button
                  type="button"
                  onClick={() => switchAuthState("login")}
                  className="text-[#0477BF] hover:text-[#2BB9D9] transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-[#0477BF]">Crear Cuenta</h2>
                  <p className="text-sm text-gray-600">
                    Regístrate para comenzar
                  </p>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Juan Pérez"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="border-gray-300 focus:border-[#0477BF] focus:ring-[#0477BF]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email">Correo Electrónico</Label>
                  <Input
                    id="register-email"
                    name="email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="border-gray-300 focus:border-[#0477BF] focus:ring-[#0477BF]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password">Contraseña</Label>
                  <Input
                    id="register-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="border-gray-300 focus:border-[#0477BF] focus:ring-[#0477BF]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                  <Input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="border-gray-300 focus:border-[#0477BF] focus:ring-[#0477BF]"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                style={{ backgroundColor: "#0477BF" }}
              >
                Crear Cuenta
              </Button>

              <p className="text-center text-sm text-gray-600">
                ¿Ya tienes cuenta?{" "}
                <button
                  type="button"
                  onClick={() => switchAuthState("login")}
                  className="text-[#0477BF] hover:text-[#2BB9D9] transition-colors"
                >
                  Inicia sesión aquí
                </button>
              </p>
            </form>
          )}

          {/* Forgot Password State */}
          {authState === "forgot-password" && (
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div className="flex items-center gap-2 mb-6">
                <button
                  type="button"
                  onClick={() => switchAuthState("login")}
                  className="text-[#0477BF] hover:text-[#2BB9D9] transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-[#0477BF]">Recuperar Contraseña</h2>
                  <p className="text-sm text-gray-600">
                    Te enviaremos un enlace de recuperación
                  </p>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="forgot-email">Correo Electrónico</Label>
                  <Input
                    id="forgot-email"
                    name="email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="border-gray-300 focus:border-[#0477BF] focus:ring-[#0477BF]"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                style={{ backgroundColor: "#0477BF" }}
              >
                Enviar Enlace de Recuperación
              </Button>

              <p className="text-center text-sm text-gray-600">
                ¿Recordaste tu contraseña?{" "}
                <button
                  type="button"
                  onClick={() => switchAuthState("login")}
                  className="text-[#0477BF] hover:text-[#2BB9D9] transition-colors"
                >
                  Volver al inicio de sesión
                </button>
              </p>
            </form>
          )}
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-white/80 text-xs">
            © 2025 Miraflores Plus. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}