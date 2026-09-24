import { NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import { supabase } from '@/lib/supabase/client';

export const dynamic = 'force-static';

export async function GET() {
  try {
    const { data: materials, error } = await supabase
      .from('materials')
      .select('*, subject:subjects(*), author:users(*)')
      .order('createdAt', { ascending: false });

    if (error) {
      throw error;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Relatório Pedagógico SME');

    worksheet.columns = [
      { header: 'Título do Material', key: 'title', width: 40 },
      { header: 'Autor', key: 'authorName', width: 25 },
      { header: 'E-mail Autor', key: 'authorEmail', width: 30 },
      { header: 'Componente Curricular', key: 'subjectName', width: 22 },
      { header: 'Ano Escolar', key: 'gradeYear', width: 15 },
      { header: 'Código BNCC', key: 'bnccCode', width: 15 },
      { header: 'Status', key: 'status', width: 18 },
      { header: 'Data de Submissão', key: 'createdAt', width: 20 },
      { header: 'Última Atualização', key: 'updatedAt', width: 20 },
    ];

    (materials || []).forEach((m) => {
      worksheet.addRow({
        title: m.title,
        authorName: m.author?.name || 'Não informado',
        authorEmail: m.author?.email || 'N/A',
        subjectName: m.subject?.name || 'Geral',
        gradeYear: m.gradeYear,
        bnccCode: m.bnccCode,
        status: m.status,
        createdAt: new Date(m.createdAt).toLocaleDateString('pt-BR'),
        updatedAt: new Date(m.updatedAt).toLocaleDateString('pt-BR'),
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename=relatorio-educom-${Date.now()}.xlsx`,
      },
    });
  } catch (err) {
    console.error('Erro na exportação XLSX:', err);
    return NextResponse.json({ error: 'Erro ao gerar relatório' }, { status: 500 });
  }
}
