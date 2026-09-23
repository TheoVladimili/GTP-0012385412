'use client';

import { TableChart, Download, FileSpreadsheet, CheckCircle } from '@/components/icons';

export default function ReportsPage() {
  const handleExportXlsx = () => {
    window.open('/api/admin/reports/export', '_blank');
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto py-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#e1e2e9] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#8cbcff]/20 text-[#005eb3] flex items-center justify-center shrink-0">
            <TableChart className="w-6 h-6" />
          </div>
          <div>
            <span className="px-2 py-0.5 rounded text-[0.7rem] font-semibold bg-[#8cbcff]/20 text-[#005eb3] uppercase">
              Módulo Gerencial
            </span>
            <h1 className="font-heading font-bold text-2xl text-[#191c20] tracking-tight mt-0.5">
              Relatórios e Exportação Gerencial (.XLSX)
            </h1>
          </div>
        </div>

        <button
          type="button"
          onClick={handleExportXlsx}
          className="px-5 py-2.5 rounded-xl bg-[#415166] text-white font-semibold text-sm hover:bg-[#2a3a4e] transition-colors flex items-center justify-center gap-2 shrink-0 shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span>Exportar Planilha Excel (.xlsx)</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#e1e2e9] shadow-sm p-6 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <FileSpreadsheet className="w-8 h-8 text-[#005eb3]" />
          <div>
            <h3 className="font-heading font-semibold text-base text-[#191c20]">
              Relatório Completo do Acervo e Fluxo de Moderação
            </h3>
            <p className="text-xs text-[#44474c]">
              Geração de planilha no padrão oficial da Secretaria Municipal de Educação de Franco da Rocha.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#f8f9ff] border border-[#e1e2e9] grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#44474c]">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Formatado com cabeçalho estilizado</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Dados de autores, códigos BNCC e datas</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Compatível com Microsoft Excel e Google Sheets</span>
          </div>
        </div>
      </div>
    </div>
  );
}
