'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { History, Person, Clock, RefreshCw } from '@/components/icons';

interface AuditLogItem {
  id: string;
  action: string;
  createdAt: string;
  user?: { name: string; email: string };
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('audit_logs')
          .select('*, user:users(*)')
          .order('createdAt', { ascending: false })
          .limit(50);

        if (error) {
          console.error('Erro ao buscar audit logs:', error);
        } else {
          setLogs((data as AuditLogItem[]) || []);
        }
      } catch (err) {
        console.error('Erro ao conectar ao Supabase:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto py-4">
      <div className="flex items-center gap-3 bg-white p-6 rounded-2xl border border-[#e1e2e9] shadow-sm">
        <div className="w-12 h-12 rounded-xl bg-[#8cbcff]/20 text-[#005eb3] flex items-center justify-center shrink-0">
          <History className="w-6 h-6" />
        </div>
        <div>
          <span className="px-2 py-0.5 rounded text-[0.7rem] font-semibold bg-[#8cbcff]/20 text-[#005eb3] uppercase">
            Segurança & Conformidade (Supabase Real)
          </span>
          <h1 className="font-heading font-bold text-2xl text-[#191c20] tracking-tight mt-0.5">
            Trilha de Auditoria e Registros do Sistema (Audit Log)
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#e1e2e9] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#e1e2e9] bg-[#f8f9ff] flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#44474c]">
            Últimos Eventos Registrados no Banco
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-2">
            <RefreshCw className="w-8 h-8 text-[#005eb3] animate-spin" />
            <p className="text-xs text-[#44474c]">Carregando registros do Supabase...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#74777d]">Nenhum registro de auditoria disponível ainda.</div>
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
