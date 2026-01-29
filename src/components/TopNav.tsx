import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { NotificationCenter } from "./NotificationCenter";
import { HelpCenterButton, HelpCenter } from "./HelpCenter";

interface TopNavProps {
  title: string;
  subtitle: string;
  userRole?: "recepcion" | "doctor" | "finanzas" | "junta" | "affiliate" | "superadmin";
  pendingApprovals?: number;
}

export function TopNav({ title, subtitle, userRole = "recepcion", pendingApprovals = 0 }: TopNavProps) {
  const [helpCenterOpen, setHelpCenterOpen] = useState(false);
  
  const getUserInfo = () => {
    if (userRole === "superadmin") {
      return {
        name: "Ing. Mario Rodríguez",
        role: "Super Admin - Plataforma",
        avatar: "https://images.unsplash.com/photo-1708195886023-3ecb00ac7a49?w=400&h=400&fit=crop&crop=faces",
        initials: "MR"
      };
    }
    if (userRole === "junta") {
      return {
        name: "Lic. Roberto Morales",
        role: "Junta Directiva",
        avatar: "https://images.unsplash.com/photo-1629507208649-70919ca33793?w=400&h=400&fit=crop&crop=faces",
        initials: "RM"
      };
    }
    if (userRole === "finanzas") {
      return {
        name: "Carlos Méndez",
        role: "Jefe de Finanzas",
        avatar: "https://images.unsplash.com/photo-1708195886023-3ecb00ac7a49?w=400&h=400&fit=crop&crop=faces",
        initials: "CM"
      };
    }
    if (userRole === "doctor") {
      return {
        name: "Dr. Carlos Hernández",
        role: "Médico Especialista",
        avatar: "https://images.unsplash.com/photo-1758691463605-f4a3a92d6d37?w=400&h=400&fit=crop&crop=faces",
        initials: "CH"
      };
    }
    if (userRole === "affiliate") {
      return {
        name: "María González Hernández",
        role: "Afiliado Premium",
        avatar: "https://images.unsplash.com/photo-1655249493799-9cee4fe983bb?w=400&h=400&fit=crop&crop=faces",
        initials: "MG"
      };
    }
    return {
      name: "Ana Martínez López",
      role: "Recepción",
      avatar: "https://images.unsplash.com/photo-1736939666660-d4c776e0532c?w=400&h=400&fit=crop&crop=faces",
      initials: "AM"
    };
  };

  const userInfo = getUserInfo();
  return (
    <header 
      className="bg-white border-b border-gray-200 px-8 py-4"
      role="banner"
    >
      <div className="flex items-center justify-between">
        {/* Left: Page Title */}
        <div role="heading" aria-level={1}>
          <h1 className="text-[#0477BF]">{title}</h1>
          <p className="text-sm text-gray-500 mt-2">
            {subtitle}
          </p>
        </div>

        {/* Right: Search, Help, Notifications, User */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Search Bar - Hidden on mobile */}
          <div className="relative hidden lg:block" id="search" data-tour="search">
            <label htmlFor="global-search" className="sr-only">
              Buscar en la plataforma
            </label>
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" 
              aria-hidden="true"
            />
            <input
              id="global-search"
              type="search"
              placeholder="Buscar..."
              aria-label="Campo de búsqueda global"
              className="pl-10 pr-4 py-2 w-64 bg-[#F2F2F2] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0477BF] focus:border-[#0477BF]"
            />
          </div>

          {/* Help Center Button */}
          <HelpCenterButton onClick={() => setHelpCenterOpen(true)} />

          {/* Notifications */}
          <NotificationCenter 
            userRole={
              userRole === "recepcion" ? "Recepción" :
              userRole === "doctor" ? "Doctor" :
              userRole === "finanzas" ? "Finanzas" :
              userRole === "junta" ? "Junta Directiva" :
              userRole === "affiliate" ? "Afiliado" :
              "Super Admin"
            }
            pendingApprovals={pendingApprovals}
          />

          {/* User Menu */}
          <button 
            className="flex items-center gap-2 md:gap-4 pl-2 md:pl-4 border-l border-gray-200 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0477BF] focus-visible:ring-offset-2"
            aria-label={`Menú de usuario: ${userInfo.name}, ${userInfo.role}`}
            aria-haspopup="true"
          >
            <Avatar className="w-8 h-8 md:w-10 md:h-10">
              <AvatarImage src={userInfo.avatar} alt={`Foto de perfil de ${userInfo.name}`} />
              <AvatarFallback aria-label={`Iniciales: ${userInfo.initials}`}>
                {userInfo.initials}
              </AvatarFallback>
            </Avatar>
            <div className="text-left hidden md:block">
              <p className="text-sm text-[#0477BF]">{userInfo.name}</p>
              <p className="text-xs text-gray-500">{userInfo.role}</p>
            </div>
            <ChevronDown 
              className="w-4 h-4 text-gray-400 hidden md:block" 
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      {/* Help Center Dialog */}
      <HelpCenter open={helpCenterOpen} onOpenChange={setHelpCenterOpen} />
    </header>
  );
}
