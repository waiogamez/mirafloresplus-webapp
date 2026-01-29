import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { useAffiliateStore } from '../store/useAffiliateStore';
import { Search, UserPlus } from 'lucide-react';
import { Button } from '../components/ui/button';

export function AffiliatesListPage() {
  const affiliates = useAffiliateStore(state => state.affiliates);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#0477BF]">Gestión de Afiliados</h1>
        <Button className="bg-[#0477BF]">
          <UserPlus className="w-4 h-4 mr-2" />
          Nuevo Afiliado
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Buscar por nombre o ID..." 
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {affiliates.slice(0, 10).map(affiliate => (
              <div key={affiliate.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#0477BF] text-white flex items-center justify-center font-bold">
                    {affiliate.firstName[0]}{affiliate.lastName[0]}
                  </div>
                  <div>
                    <p className="font-semibold">{affiliate.firstName} {affiliate.lastName}</p>
                    <p className="text-sm text-gray-600">ID: {affiliate.id} • {affiliate.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={affiliate.plan === 'Premium' ? 'default' : 'secondary'}>
                    {affiliate.plan}
                  </Badge>
                  <Badge variant={affiliate.status === 'active' ? 'default' : 'destructive'}>
                    {affiliate.status === 'active' ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
