'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Library,
  UploadFile,
  Rule,
  TableChart,
  History,
  School,
  CloudDone,
  HelpOutline,
} from '@/components/icons';

interface SidebarProps {
  pendingReviewsCount?: number;
}

export function Sidebar({ pendingReviewsCount = 3 }: SidebarProps) {
  const pathname = usePathname();

  const navPedagogico = [
    {
      label: 'Acervo Público',
      href: '/materiais',
      icon: Library,
      active: pathname === '/materiais',
    },
    {
      label: 'Meus Materiais',
      href: '/materiais/meus',
      icon: UploadFile,
      active: pathname.startsWith('/materiais/meus') || pathname.startsWith('/materiais/novo'),
    },
    {
      label: 'Moderação',
      href: '/moderacao',
      icon: Rule,
      active: pathname === '/moderacao',
      badge: pendingReviewsCount > 0 ? pendingReviewsCount : undefined,
    },
  ];

  const navGestaored = [
    {
      label: 'Relatórios & XLSX',
      href: '/admin/relatorios',
      icon: TableChart,
      active: pathname === '/admin/relatorios',
    },
    {
      label: 'Auditoria & Logs',
      href: '/admin/auditoria',
      icon: History,
      active: pathname === '/admin/auditoria',
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#f2f3fa] shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between pt-4 pb-6 border-r border-[#e1e2e9]">
      <div className="flex flex-col">
        {/* Header da Sidebar */}
        <div className="px-4 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#005eb3]" />
            <span className="text-[0.75rem] font-semibold uppercase tracking-wider text-[#44474c]">
              Rede Municipal
            </span>
          </div>
          <span className="text-[0.75rem] text-[#74777d] px-1.5 py-0.5 bg-[#eceef4] rounded font-mono">
            v2.4
          </span>
        </div>

        {/* Card da Escola Selecionada */}
        <div className="px-4 mb-4">
          <div className="bg-[#eceef4] p-2.5 rounded-xl flex items-center gap-2">
            <School className="w-5 h-5 text-[#005eb3]" />
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold text-[#191c20] truncate">
                EMEB Paulo Freire
              </span>
              <span className="text-[0.75rem] text-[#44474c] truncate">
                Franco da Rocha - SP
              </span>
            </div>
          </div>
        </div>

        {/* Menus de Navegação */}
        <nav className="px-2 flex flex-col gap-1">
          <div className="px-2 py-1 text-[#44474c] text-[0.75rem] font-semibold uppercase tracking-wider">
            Pedagógico
          </div>
          {navPedagogico.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-xl transition-colors ${
                  item.active
                    ? 'bg-[#415166] text-white font-semibold shadow-sm'
                    : 'text-[#44474c] hover:bg-[#e1e2e9] hover:text-[#191c20]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 rounded-full bg-[#8cbcff] text-[#001b3c] text-xs font-bold">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="px-2 pt-4 pb-1 text-[#44474c] text-[0.75rem] font-semibold uppercase tracking-wider">
            Gestão & Rede
          </div>
          {navGestaored.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-xl transition-colors ${
                  item.active
                    ? 'bg-[#415166] text-white font-semibold shadow-sm'
                    : 'text-[#44474c] hover:bg-[#e1e2e9] hover:text-[#191c20]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer da Sidebar */}
      <div className="px-4 flex flex-col gap-2">
        <div className="p-2.5 rounded-xl bg-[#eceef4] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#005eb3]" />
            <span className="text-xs text-[#44474c] font-medium">Sincronizado BNCC</span>
          </div>
          <CloudDone className="w-4 h-4 text-[#74777d]" />
        </div>
        <div className="pt-1 flex items-center justify-between text-[#44474c] text-xs">
          <span>Secretaria da Educação</span>
          <a href="#" className="hover:text-[#191c20] transition-colors">
            <HelpOutline className="w-4 h-4" />
          </a>
        </div>
      </div>
    </aside>
  );
}
