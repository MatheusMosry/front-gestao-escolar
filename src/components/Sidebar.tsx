import { Link, useLocation } from 'react-router-dom';
import { LucideIcon, GraduationCap } from 'lucide-react';

interface MenuItem {
  path: string; // Mudamos de 'id' para 'path'
  label: string;
  icon: LucideIcon;
}

interface SidebarProps {
  menuItems: MenuItem[];
  onMobileClose?: () => void; // Adicionamos isso para fechar o menu ao clicar no mobile
}

export function Sidebar({ menuItems, onMobileClose }: SidebarProps) {
  const location = useLocation();

  return (
    <aside className="w-64 h-full bg-indigo-900 text-white flex flex-col"> {/* h-full garante altura */}
      <div className="p-6 border-b border-indigo-800">
        <div className="flex items-center gap-3">
          <GraduationCap className="w-8 h-8" />
          <div>
            <h1 className="font-bold text-lg">EduGestão</h1>
            <p className="text-indigo-300 text-sm">Sistema Escolar</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path; // Comparação pela URL

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={onMobileClose} // Fecha o menu se estiver no mobile
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                    ? 'bg-indigo-800 text-white'
                    : 'text-indigo-200 hover:bg-indigo-800/50'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Mantendo o footer do usuário */}
      <div className="p-4 border-t border-indigo-800">
        <div className="flex items-center gap-3 px-4">
          <div className="w-10 h-10 rounded-full bg-indigo-700 flex items-center justify-center">
            AD
          </div>
          <div>
            <p className="text-sm font-medium">Administrador</p>
            <p className="text-xs text-indigo-300">admin@escola.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}