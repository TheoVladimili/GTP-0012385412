'use client';

import { Notifications, Person, Verified } from '@/components/icons';

interface HeaderProps {
  userName?: string;
  userRole?: string;
  userSchool?: string;
}

export function Header({
  userName = 'Prof. Marcelo Ramos',
  userRole = 'Validador',
  userSchool = 'EMEB Paulo Freire',
}: HeaderProps) {
  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-[#f8f9ff]/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-6 border-b border-[#e1e2e9]">
      <div className="flex items-center gap-4">
        {/* Logo EduCom */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#2a3a4e] text-white flex items-center justify-center font-bold text-lg">
            E
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-semibold text-base text-[#2a3a4e] tracking-tight leading-none">
              EduCom
            </span>
            <span className="text-[0.7rem] text-[#44474c] mt-0.5">
              Repositório Pedagógico Municipal
            </span>
          </div>
        </div>

        <div className="hidden xl:flex items-center gap-2 pl-6 text-[#44474c] text-xs">
          <span className="px-2 py-0.5 rounded-full bg-[#e1e2e9] text-[#191c20] font-medium">
            1º ao 5º Ano
          </span>
          <span>Ensino Fundamental I</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#f2f3fa] text-[#44474c] text-xs font-medium border border-[#e1e2e9]">
          <Verified className="w-4 h-4 text-[#005eb3]" />
          <span>Franco da Rocha Conectada</span>
        </div>

        <button
          type="button"
          className="relative p-2 rounded-xl text-[#44474c] hover:bg-[#e1e2e9] hover:text-[#191c20] transition-colors"
          title="Notificações de Revisão"
        >
          <Notifications className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#005eb3]" />
        </button>

        <div className="flex items-center gap-3 pl-2 border-l border-[#e1e2e9]">
          <div className="flex flex-col text-right hidden sm:flex">
            <span className="text-xs font-semibold text-[#191c20]">{userName}</span>
            <span className="text-[0.7rem] text-[#44474c]">
              {userRole} · {userSchool}
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#2a3a4e] flex items-center justify-center text-white">
            <Person className="w-4 h-4" />
          </div>
        </div>
      </div>
    </header>
  );
}
