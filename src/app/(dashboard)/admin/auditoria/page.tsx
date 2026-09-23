import { prisma } from '@/lib/prisma';
import { History, Person, Clock, CheckCircle } from '@/components/icons';

export default async function AuditLogsPage() {
  let logs = [];

  try {
    logs = await prisma.auditLog.findMany({
      include: {
        user: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  } catch {
    // Mock Fallback para exibição em dev/sandbox sem DB
    logs = [
      {
        id: 'log-1',
        action: 'MATERIAL_APPROVED',
        targetId: 'mat-1',
        createdAt: new Date('2025-09-12T14:30:00Z'),
        user: { name: 'Prof. Marcelo Ramos', email: 'marcelo.ramos@francodarocha.sp.gov.br' },
      },
      {
        id: 'log-2',
        action: 'MATERIAL_SUBMITTED',
        targetId: 'mat-2',
        createdAt: new Date('2025-09-10T10:15:00Z'),
        user: { name: 'Profa. Ana Silva', email: 'ana.silva@educa.francodarocha.sp.gov.br' },
      },
    ];
  }

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto py-4">
      <div className="flex items-center gap-3 bg-white p-6 rounded-2xl border border-[#e1e2e9] shadow-sm">
        <div className="w-12 h-12 rounded-xl bg-[#8cbcff]/20 text-[#005eb3] flex items-center justify-center shrink-0">
          <History className="w-6 h-6" />
        </div>
        <div>
          <span className="px-2 py-0.5 rounded text-[0.7rem] font-semibold bg-[#8cbcff]/20 text-[#005eb3] uppercase">
            Segurança & Conformidade
          </span>
          <h1 className="font-heading font-bold text-2xl text-[#191c20] tracking-tight mt-0.5">
            Trilha de Auditoria e Registros do Sistema (Audit Log)
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#e1e2e9] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#e1e2e9] bg-[#f8f9ff] flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#44474c]">
            Últimos 50 Eventos Registrados
          </span>
        </div>

        {logs.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#74777d]">Nenhum registro de auditoria disponível.</div>
        ) : (
          <div className="divide-y divide-[#e1e2e9]">
            {logs.map((log) => (
              <div key={log.id} className="p-4 flex items-center justify-between hover:bg-[#f8f9ff] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#eceef4] text-[#005eb3] flex items-center justify-center shrink-0">
                    <Person className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[#191c20]">
                      {log.user?.name || 'Usuário do Sistema'} ({log.user?.email || 'N/A'})
                    </span>
                    <span className="text-[0.75rem] font-mono font-semibold text-[#005eb3]">
                      Ação: {log.action}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#74777d]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(log.createdAt).toLocaleString('pt-BR')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
