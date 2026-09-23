'use client';

import { useState } from 'react';
import { reviewMaterial } from '@/services/reviews';
import {
  Rule,
  FileText,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Eye,
  RefreshCw,
} from '@/components/icons';

const GRADE_LABELS: Record<string, string> = {
  YEAR_1: '1º Ano',
  YEAR_2: '2º Ano',
  YEAR_3: '3º Ano',
  YEAR_4: '4º Ano',
  YEAR_5: '5º Ano',
};

interface PendingItem {
  id: string;
  title: string;
  description: string;
  gradeYear: string;
  bnccCode: string;
  fileUrl: string;
  fileSize: number;
  createdAt: Date | string;
  subject: { name: string };
  author: { name: string; email: string };
}

export default function ModerationPage() {
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([
    {
      id: 'mod-1',
      title: 'Plano de Aula: Operações Fundamentais com Resolução de Problemas',
      description: 'Atividade prática para fixação da adição e subtração com reserva no cotidiano do estudante.',
      gradeYear: 'YEAR_4',
      bnccCode: 'EF04MA03',
      fileUrl: '#',
      fileSize: 1850000,
      createdAt: new Date(),
      subject: { name: 'Matemática' },
      author: { name: 'Profa. Mariana Costa', email: 'mariana.costa@educa.francodarocha.sp.gov.br' },
    },
    {
      id: 'mod-2',
      title: 'Sequência Didática: Ecossistemas da Serra do Japi e Bacia do Juquery',
      description: 'Estudo de meio local focado no bioma da Mata Atlântica e preservação de mananciais em Franco da Rocha.',
      gradeYear: 'YEAR_5',
      bnccCode: 'EF05CI02',
      fileUrl: '#',
      fileSize: 3200000,
      createdAt: new Date(),
      subject: { name: 'Ciências' },
      author: { name: 'Prof. Carlos Eduardo', email: 'carlos.eduardo@educa.francodarocha.sp.gov.br' },
    },
  ]);

  const [selectedItem, setSelectedItem] = useState<PendingItem | null>(null);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleDecision = async (status: 'APPROVED' | 'NEEDS_REVISION' | 'REJECTED') => {
    if (!selectedItem) return;

    if ((status === 'NEEDS_REVISION' || status === 'REJECTED') && !feedback.trim()) {
      setMsg({ text: 'Por favor, detalhe os apontamentos do parecer pedagógico.', type: 'error' });
      return;
    }

    try {
      setIsSubmitting(true);
      setMsg(null);

      const mockValidatorId = 'validator-default-id';

      await reviewMaterial({
        materialId: selectedItem.id,
        validatorId: mockValidatorId,
        status,
        feedback: feedback.trim() || undefined,
      });

      // Remover item da fila local
      setPendingItems((prev) => prev.filter((item) => item.id !== selectedItem.id));
      setSelectedItem(null);
      setFeedback('');
      setMsg({ text: `Material avaliado como ${status} com sucesso. Cache ISR atualizado!`, type: 'success' });
    } catch {
      // Mock Fallback se sem banco ativo
      setPendingItems((prev) => prev.filter((item) => item.id !== selectedItem.id));
      setSelectedItem(null);
      setFeedback('');
      setMsg({ text: `Material avaliado como ${status} com sucesso (Modo Mock).`, type: 'success' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto py-4">
      {/* Banner Superior */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#e1e2e9] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#8cbcff]/20 text-[#005eb3] flex items-center justify-center shrink-0">
            <Rule className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="px-2 py-0.5 rounded text-[0.7rem] font-semibold bg-[#8cbcff]/20 text-[#005eb3] uppercase">
                Moderação Pedagógica
              </span>
              <span className="text-xs text-[#44474c] font-medium">
                Pendente: {pendingItems.length} materiais
              </span>
            </div>
            <h1 className="font-heading font-bold text-2xl text-[#191c20] tracking-tight">
              Fila de Moderação e Validação de Conteúdos
            </h1>
          </div>
        </div>
      </div>

      {msg && (
        <div
          className={`p-4 rounded-xl border text-sm flex items-center gap-3 ${
            msg.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {msg.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Grid Principal: Fila vs Painel de Parecer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tabela de Fila */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#e1e2e9] shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[#e1e2e9] bg-[#f8f9ff] flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#44474c]">
              Fila Pendente de Avaliação
            </span>
          </div>

          {pendingItems.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center gap-2">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
              <p className="text-sm font-semibold text-[#191c20]">
                Fila de moderação limpa!
              </p>
              <p className="text-xs text-[#44474c]">
                Todos os materiais submetidos foram devidamente analisados.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#e1e2e9]">
              {pendingItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`p-5 flex flex-col gap-2 cursor-pointer transition-colors ${
                    selectedItem?.id === item.id
                      ? 'bg-[#eceef4] border-l-4 border-l-[#005eb3]'
                      : 'hover:bg-[#f8f9ff]'
                  }`}
                >
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="font-semibold text-[#005eb3]">{item.subject.name}</span>
                    <span className="text-[#74777d]">·</span>
                    <span className="font-medium text-[#44474c]">
                      {GRADE_LABELS[item.gradeYear] || item.gradeYear}
                    </span>
                    <span className="text-[#74777d]">·</span>
                    <span className="font-mono bg-[#8cbcff]/20 px-1.5 py-0.5 rounded text-[#005eb3]">
                      {item.bnccCode}
                    </span>
                  </div>

                  <h3 className="font-heading font-semibold text-sm text-[#191c20]">
                    {item.title}
                  </h3>

                  <div className="flex items-center justify-between text-xs text-[#44474c] pt-1">
                    <span>Autor: {item.author.name}</span>
                    <span className="text-[#005eb3] font-semibold flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" /> Analisar
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal/Painel Lateral de Emissão do Parecer */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#e1e2e9] shadow-sm p-6 flex flex-col gap-5">
          <h2 className="font-heading font-bold text-lg text-[#191c20] border-b border-[#e1e2e9] pb-3">
            Emissão de Parecer Pedagógico
          </h2>

          {!selectedItem ? (
            <div className="p-8 text-center flex flex-col items-center justify-center gap-2 text-[#74777d]">
              <FileText className="w-10 h-10 opacity-50" />
              <p className="text-sm font-medium">Selecione um item da fila ao lado para iniciar o parecer.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="p-4 rounded-xl bg-[#f8f9ff] border border-[#e1e2e9] flex flex-col gap-2">
                <span className="text-[0.7rem] font-semibold uppercase text-[#005eb3]">
                  {selectedItem.subject.name} · {GRADE_LABELS[selectedItem.gradeYear]}
                </span>
                <h3 className="font-heading font-semibold text-sm text-[#191c20]">
                  {selectedItem.title}
                </h3>
                <p className="text-xs text-[#44474c]">{selectedItem.description}</p>
                <div className="text-[0.75rem] text-[#74777d] pt-1 flex items-center justify-between border-t border-[#e1e2e9] mt-1">
                  <span>BNCC: {selectedItem.bnccCode}</span>
                  <span>Por: {selectedItem.author.name}</span>
                </div>
              </div>

              {/* Campo de Apontamentos / Feedback */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#44474c]">
                  Apontamentos e Justificativa da Decisão
                </label>
                <textarea
                  rows={4}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Elogios ou ajustes pedagógicos necessários..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e1e2e9] bg-[#f8f9ff] text-sm text-[#191c20] focus:outline-none focus:ring-2 focus:ring-[#005eb3]"
                />
              </div>

              {/* Botões de Ação */}
              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleDecision('APPROVED')}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  <span>Aprovar e Publicar no Acervo (ISR)</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleDecision('NEEDS_REVISION')}
                    className="py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Solicitar Ajustes</span>
                  </button>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleDecision('REJECTED')}
                    className="py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Rejeitar Material</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
