import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login, isLoading } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
    } catch (err) {
      setError('Correo o contraseña incorrectos');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" 
         style={{ background: 'linear-gradient(135deg, #0477BF 0%, #2BB9D9 100%)' }}>
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="mb-4">
            <div className="text-3xl font-bold text-[#0477BF]">MIRAFLORES PLUS</div>
            <p className="text-sm text-[#2BB9D9] italic mt-2">¡Tu salud, a un clic de distancia!</p>
          </div>
          <CardTitle>Iniciar Sesión</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium mb-2">Correo Electrónico</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Contraseña</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#0477BF] hover:bg-[#0469a8]"
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>

          <Card className="mt-6 bg-blue-50">
            <CardContent className="pt-4">
              <p className="text-xs font-semibold mb-2">🔐 Credenciales de Producción:</p>
              <div className="text-xs space-y-1">
                <div><strong>Recepción:</strong> recepcion@mirafloresplus.com / recepcion123</div>
                <div><strong>Doctor:</strong> doctor@mirafloresplus.com / doctor123</div>
                <div><strong>Finanzas:</strong> finanzas@mirafloresplus.com / finanzas123</div>
                <div><strong>Junta:</strong> junta@mirafloresplus.com / junta123</div>
                <div><strong>Afiliado:</strong> afiliado@gmail.com / afiliado123</div>
                <div><strong>Admin:</strong> admin@mirafloresplus.com / admin123</div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
