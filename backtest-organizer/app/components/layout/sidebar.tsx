
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart3, 
  Tags, 
  FileText, 
  Plus,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  className?: string;
}

const menuItems = [
  {
    href: '/',
    label: 'Meus Backtests',
    icon: BarChart3
  },
  {
    href: '/gerenciar/tags',
    label: 'Gerenciar Tags',
    icon: Tags
  },
  {
    href: '/gerenciar/templates',
    label: 'Gerenciar Templates', 
    icon: FileText
  }
];

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn(
      "fixed left-0 top-0 z-40 h-screen bg-gray-900 text-white transition-all duration-300",
      isCollapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-gray-800">
        {!isCollapsed && (
          <h1 className="text-lg font-semibold">Backtest Organizer</h1>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-white hover:bg-gray-800"
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      {/* CTA Principal */}
      <div className="p-4 border-b border-gray-800">
        <Link href="/registro/novo">
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            {!isCollapsed && "Novo Registro"}
          </Button>
        </Link>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-blue-600 text-white" 
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  {!isCollapsed && item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
