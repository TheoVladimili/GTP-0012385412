'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, FileText, Clock, CheckCircle, AlertTriangle, XCircle, RefreshCw } from '@/components/icons';
import { getTeacherMaterials } from '@/services/materials';

const GRADE_LABELS: Record<string, string> = {
  YEAR_1: '1º Ano',
  YEAR_2: '2º Ano',
  YEAR_3: '3º Ano',
  YEAR_4: '4º Ano',
  YEAR_5: '5º Ano',
};

const STATUS_BADGES: Record<string, { label: string; bg: string; text: string; icon: React.ElementType }> = {
  SUBMITTED: { label: 'Em Moderação', bg: 'bg-amber-100', text: 'text-amber-800', icon: Clock },
  APPROVED: { label: 'Aprovado', bg: 'bg-emerald-100', text: 'text-emerald-800', icon: CheckCircle },
  NEEDS_REVISION: { label: 'Ajustes Solicitados', bg: 'bg-blue-100', text: 'text-blue-800', icon: AlertTriangle },
  REJECTED: { label: 'Não Aprovado', bg: 'bg-rose-100', text: 'text-rose-800', icon: XCircle },
};

interface MaterialItem {
  id: string;
  title: string;
  description: string;
  gradeYear: string;
  bnccCode: string;
  status: string;
  fileSize: number;
  createdAt: string;
  subject?: { name: string };
  reviews?: { feedback?: string }[];
}

export default function MyMaterialsPage() {
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMaterials() {
      try {
        setLoading(true);
        // ID da professora Ana Silva
        const authorId = 'd35d7308-5617-4641-8391-97dec02263f0';
        const data = await getTeacherMaterials(authorId);
        setMaterials(data as MaterialItem[]);
      } catch (err) {
        console.error('Erro ao carregar meus materiais:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMaterials();
  }, []);

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto py-4">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#e1e2e9] shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[0.7rem] font-semibold bg-[#8cbcff]/20 text-[#005eb3] uppercase">
              Painel do Docente (Supabase Real)
            </span>
          </div>
          <h1 className="font-heading font-bold text-2xl text-[#191c20] tracking-tight">
            Meus Materiais Pedagógicos
          </h1>
          <p className="text-sm text-[#44474c] mt-0.5">
            Gerencie suas submissões em tempo real e acompanhe pareceres pedagógicos do município.
          </p>
        </div>

        <Link
          href="/materiais/novo"
          className="px-5 py-2.5 rounded-xl bg-[#415166] text-white font-semibold text-sm hover:bg-[#2a3a4e] transition-colors flex items-center justify-center gap-2 shrink-0 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Submeter Novo Material</span>
        </Link>
      </div>

      {/* Lista de Materiais */}
      <div className="bg-white rounded-2xl border border-[#e1e2e9] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#e1e2e9] bg-[#f8f9ff] flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#44474c]">
            Histórico de Envios no Supabase ({materials.length})
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-2">
            <RefreshCw className="w-8 h-8 text-[#005eb3] animate-spin" />
            <p className="text-xs text-[#44474c]">Carregando seus materiais...</p>
          </div>
        ) : materials.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#eceef4] flex items-center justify-center text-[#74777d]">
              <FileText className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-[#191c20]">Nenhum material submetido ainda</p>
            <p className="text-xs text-[#44474c]">
              Envie propostas pedagógicas para enriquecer o acervo municipal de Franco da Rocha.
            </p>
            <Link
              href="/materiais/novo"
              className="mt-2 text-xs font-semibold text-[#005eb3] hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Enviar primeira proposta
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#e1e2e9]">
            {materials.map((m) => {
              const statusInfo = STATUS_BADGES[m.status] || STATUS_BADGES.SUBMITTED;
              const StatusIcon = statusInfo.icon;
              const lastReview = m.reviews?.[0];

              return (
                <div key={m.id} className="p-6 flex flex-col gap-3 hover:bg-[#f8f9ff] transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-[#eceef4] text-[#191c20]">
                        {m.subject?.name || 'Geral'}
                      </span>
                      <span className="text-xs font-medium px-2.5 py-0.5 rounded-md bg-[#e1e2e9] text-[#44474c]">
                        {GRADE_LABELS[m.gradeYear] || m.gradeYear}
                      </span>
                      <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[#8cbcff]/20 text-[#005eb3]">
                        {m.bnccCode}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.bg} ${statusInfo.text}`}
                      >
                        <StatusIcon className="w-3.5 h-3.5" />
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-heading font-semibold text-base text-[#191c20]">
                      {m.title}
                    </h3>
                    <p className="text-xs text-[#44474c] line-clamp-2 mt-1">{m.description}</p>
                  </div>

                  {/* Feedback se houver */}
                  {lastReview?.feedback && (
                    <div className="p-3 rounded-xl bg-[#eceef4] border border-[#e1e2e9] text-xs text-[#191c20] flex flex-col gap-1">
                      <span className="font-semibold text-[#005eb3]">Parecer do Coordenador:</span>
                      <p className="italic text-[#44474c]">"{lastReview.feedback}"</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 text-xs text-[#74777d]">
                    <span>
                      Enviado em {new Date(m.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
