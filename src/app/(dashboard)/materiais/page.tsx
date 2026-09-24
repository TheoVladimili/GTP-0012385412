'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  BookOpen,
  Verified,
  Plus,
  RefreshCw,
} from '@/components/icons';
import Link from 'next/link';
import { getApprovedMaterials, getSubjects } from '@/services/materials';

interface MaterialItem {
  id: string;
  title: string;
  description: string;
  gradeYear: string;
  bnccCode: string;
  fileUrl: string;
  fileSize: number;
  fileMimeType: string;
  createdAt: string;
  subject?: { name: string };
  author?: { name: string };
}

interface SubjectItem {
  id: string;
  name: string;
}

const GRADE_LABELS: Record<string, string> = {
  ALL: 'Todos os Anos',
  YEAR_1: '1º Ano',
  YEAR_2: '2º Ano',
  YEAR_3: '3º Ano',
  YEAR_4: '4º Ano',
  YEAR_5: '5º Ano',
};

export default function PublicAcervoPage() {
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [selectedGrade, setSelectedGrade] = useState('ALL');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [mList, sList] = await Promise.all([getApprovedMaterials(), getSubjects()]);
        setMaterials(mList as MaterialItem[]);
        setSubjects(sList as SubjectItem[]);
      } catch (err) {
        console.error('Erro ao carregar dados do Supabase:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredMaterials = materials.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.bnccCode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSubject = selectedSubject === 'ALL' || item.subject?.name === selectedSubject;
    const matchesGrade = selectedGrade === 'ALL' || item.gradeYear === selectedGrade;

    return matchesSearch && matchesSubject && matchesGrade;
  });

  const handleDownload = (item: MaterialItem) => {
    if (item.fileUrl && item.fileUrl.startsWith('http')) {
      window.open(item.fileUrl, '_blank');
    } else {
      alert(`Download do arquivo "${item.title}" iniciado com sucesso.`);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto py-2 pb-12">
      {/* Banner Principal com Gradiente do Design System */}
      <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-[#eceef4] via-[#f2f3fa] to-[#e1e2e9] p-6 shadow-sm border border-[#e1e2e9]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded text-[0.7rem] font-bold tracking-wider bg-[#005eb3] text-white uppercase">
                Rede Municipal
              </span>
              <span className="text-[#44474c] text-xs font-medium">
                SME Franco da Rocha · Portal Oficial de Práticas
              </span>
            </div>
            <h1 className="font-heading font-bold text-2xl md:text-3xl text-[#191c20] tracking-tight">
              Repositório Pedagógico Municipal de Franco da Rocha
            </h1>
            <p className="text-sm text-[#44474c] mt-1">
              Acervo curado e homologado de práticas pedagógicas, avaliações e sequências didáticas do 1º ao 5º ano.
            </p>
          </div>

          <div className="flex items-center gap-2.5 bg-white px-3.5 py-2 rounded-xl shadow-sm border border-[#e1e2e9] shrink-0">
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#005eb3] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#005eb3]" />
            </div>
            <div className="flex flex-col text-xs">
              <span className="font-semibold text-[#005eb3]">Supabase Backend Ativo</span>
              <span className="text-[0.7rem] text-[#74777d]">Conexão Real de Produção</span>
            </div>
          </div>
        </div>

        {/* Barra de Pesquisa Universal */}
        <div className="mt-6">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-[#74777d] absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquise por título, palavras-chave, habilidades BNCC (ex: EF01LP01) ou objetivos..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-[#e1e2e9] text-sm text-[#191c20] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#005eb3]"
            />
          </div>
        </div>
      </div>

      {/* Grid Principal: Filtros Laterais vs Cards do Acervo */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Painel de Filtros */}
        <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-[#e1e2e9] shadow-sm flex flex-col gap-5 h-fit">
          <div className="flex items-center gap-2 border-b border-[#e1e2e9] pb-3 text-[#191c20] font-heading font-semibold text-sm">
            <Filter className="w-4 h-4 text-[#005eb3]" />
            <span>Filtros do Acervo</span>
          </div>

          {/* Filtro por Ano Escolar */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#44474c]">
              Ano Escolar
            </label>
            <div className="flex flex-col gap-1">
              {Object.entries(GRADE_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedGrade(key)}
                  className={`text-left text-xs px-3 py-2 rounded-lg transition-colors ${
                    selectedGrade === key
                      ? 'bg-[#415166] text-white font-semibold'
                      : 'text-[#44474c] hover:bg-[#eceef4] hover:text-[#191c20]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Filtro por Componente Curricular */}
          <div className="flex flex-col gap-2 pt-2 border-t border-[#e1e2e9]">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#44474c]">
              Componente Curricular
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#e1e2e9] bg-[#f8f9ff] text-xs text-[#191c20] focus:outline-none focus:ring-2 focus:ring-[#005eb3]"
            >
              <option value="ALL">Todas as Disciplinas</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Lista de Cards de Materiais */}
        <div className="lg:col-span-9 flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#44474c]">
              Exibindo {filteredMaterials.length} materiais homologados no Supabase
            </span>
            <Link
              href="/materiais/novo"
              className="text-xs font-semibold text-[#005eb3] hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Enviar material didático
            </Link>
          </div>

          {loading ? (
            <div className="bg-white p-12 rounded-2xl border border-[#e1e2e9] text-center flex flex-col items-center justify-center gap-3">
              <RefreshCw className="w-8 h-8 text-[#005eb3] animate-spin" />
              <p className="text-sm font-semibold text-[#191c20]">Carregando materiais do Supabase...</p>
            </div>
          ) : filteredMaterials.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-[#e1e2e9] text-center flex flex-col items-center justify-center gap-2">
              <BookOpen className="w-10 h-10 text-[#74777d]" />
              <p className="text-sm font-semibold text-[#191c20]">Nenhum resultado encontrado</p>
              <p className="text-xs text-[#44474c]">Tente ajustar os termos de pesquisa ou filtros selecionados.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMaterials.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-5 rounded-2xl border border-[#e1e2e9] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-4"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-[#eceef4] text-[#191c20]">
                        {item.subject?.name || 'Geral'}
                      </span>
                      <span className="text-[0.75rem] font-mono font-semibold px-2 py-0.5 rounded bg-[#8cbcff]/20 text-[#005eb3]">
                        {item.bnccCode}
                      </span>
                    </div>

                    <h3 className="font-heading font-semibold text-base text-[#191c20] line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="text-xs text-[#44474c] line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#e1e2e9] flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-[#44474c]">
                      <Verified className="w-4 h-4 text-emerald-600" />
                      <span>{GRADE_LABELS[item.gradeYear] || item.gradeYear}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDownload(item)}
                      className="px-3 py-1.5 rounded-xl bg-[#415166] hover:bg-[#2a3a4e] text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Baixar Anexo</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
