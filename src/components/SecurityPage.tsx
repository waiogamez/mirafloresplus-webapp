/**
 * Security Page - Miraflores Plus
 * Página de gestión de seguridad (solo Super Admin)
 */

import { SecurityDashboard } from "./SecurityDashboard";

export function SecurityPage() {
  return (
    <div className="p-8">
      <SecurityDashboard />
    </div>
  );
}
