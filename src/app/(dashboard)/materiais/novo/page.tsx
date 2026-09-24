'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { materialSchema, MaterialInput, ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '@/lib/validators/material';
import { generateSignedUploadUrl } from '@/services/storage';
import { submitMaterial, getSubjects } from '@/services/materials';
import { ArrowLeft, UploadFile, FileText, CheckCircle, AlertTriangle, RefreshCw } from '@/components/icons';
import Link from 'next/link';

interface Subject {
  id: string;
  name: string;
}

export default function NewMaterialPage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFileInfo, setUploadedFileInfo] = useState<{
    fileUrl: string;
    fileKey: string;
    fileSize: number;
    fileMimeType: string;
    fileName: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<MaterialInput>({
    resolver: zodResolver(materialSchema),
    defaultValues: {
      title: '',
      description: '',
      gradeYear: 'YEAR_1',
      bnccCode: 'EF01LP01',
    },
  });

  useEffect(() => {
    async function loadSubjects() {
      try {
        const data = await getSubjects();
        if (data && data.length > 0) {
          setSubjects(data as Subject[]);
          setValue('subjectId', data[0].id);
        }
      } catch (err) {
        console.error('Erro ao carregar disciplinas:', err);
      }
    }
    loadSubjects();
  }, [setValue]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);

    if (file.size > MAX_FILE_SIZE) {
      setErrorMsg('O arquivo selecionado excede o tamanho máximo permitido de 50MB.');
      return;
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setErrorMsg('Formato de arquivo não suportado. Envie PDF, PNG, JPEG ou DOCX.');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(30);

      const { signedUrl, fileKey, fileUrl } = await generateSignedUploadUrl(
        file.name,
        file.size,
        file.type
      );

      setUploadProgress(70);

      const fileData = {
        fileUrl,
        fileKey,
        fileSize: file.size,
        fileMimeType: file.type,
        fileName: file.name,
      };

      setUploadedFileInfo(fileData);
      setUploadProgress(100);

      setValue('fileUrl', fileUrl, { shouldValidate: true });
      setValue('fileKey', fileKey, { shouldValidate: true });
      setValue('fileSize', file.size, { shouldValidate: true });
      setValue('fileMimeType', file.type, { shouldValidate: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao realizar upload do arquivo.';
      setErrorMsg(message);
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: MaterialInput) => {
    try {
      setIsSubmitting(true);
      setErrorMsg(null);

      // Usar autor registrado no Supabase
      const authorId = 'd35d7308-5617-4641-8391-97dec02263f0';

      await submitMaterial({
        ...data,
        authorId,
      });

      router.push('/materiais/meus');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao enviar material pedagógico.';
      setErrorMsg(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto py-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/materiais/meus"
            className="p-2 rounded-xl bg-white text-[#44474c] hover:text-[#191c20] border border-[#e1e2e9] shadow-sm transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-heading font-bold text-2xl text-[#191c20] tracking-tight">
              Submeter Novo Material Pedagógico (Supabase)
            </h1>
            <p className="text-sm text-[#44474c]">
              Preencha os campos e anexe a proposta didática para moderação pedagógica em tempo real.
            </p>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl p-6 border border-[#e1e2e9] shadow-sm flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Título do Material */}
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#44474c]">
              Título da Proposta Didática / Atividade
            </label>
            <input
              type="text"
              placeholder="Ex: Sequência Didática: Leitura e Interpretação de Fábulas"
              className="w-full px-4 py-2.5 rounded-xl border border-[#e1e2e9] bg-[#f8f9ff] text-sm text-[#191c20] focus:outline-none focus:ring-2 focus:ring-[#005eb3]"
              {...register('title')}
            />
            {errors.title && (
              <span className="text-xs text-red-600 font-medium">{errors.title.message}</span>
            )}
          </div>

          {/* Ano Escolar */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#44474c]">
              Ano Escolar (Ensino Fundamental I)
            </label>
            <select
              className="w-full px-4 py-2.5 rounded-xl border border-[#e1e2e9] bg-[#f8f9ff] text-sm text-[#191c20] focus:outline-none focus:ring-2 focus:ring-[#005eb3]"
              {...register('gradeYear')}
            >
              <option value="YEAR_1">1º Ano</option>
              <option value="YEAR_2">2º Ano</option>
              <option value="YEAR_3">3º Ano</option>
              <option value="YEAR_4">4º Ano</option>
              <option value="YEAR_5">5º Ano</option>
            </select>
            {errors.gradeYear && (
              <span className="text-xs text-red-600 font-medium">{errors.gradeYear.message}</span>
            )}
          </div>

          {/* Código BNCC */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#44474c]">
              Código Habilidade BNCC
            </label>
            <input
              type="text"
              placeholder="EF01LP01"
              className="w-full px-4 py-2.5 rounded-xl border border-[#e1e2e9] bg-[#f8f9ff] text-sm text-[#191c20] focus:outline-none focus:ring-2 focus:ring-[#005eb3]"
              {...register('bnccCode')}
            />
            {errors.bnccCode && (
              <span className="text-xs text-red-600 font-medium">{errors.bnccCode.message}</span>
            )}
          </div>

          {/* Disciplina / Componente Curricular */}
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#44474c]">
              Disciplina / Componente Curricular (Carregado do Supabase)
            </label>
            <select
              className="w-full px-4 py-2.5 rounded-xl border border-[#e1e2e9] bg-[#f8f9ff] text-sm text-[#191c20] focus:outline-none focus:ring-2 focus:ring-[#005eb3]"
              {...register('subjectId')}
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            {errors.subjectId && (
              <span className="text-xs text-red-600 font-medium">{errors.subjectId.message}</span>
            )}
          </div>

          {/* Descrição Didática */}
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#44474c]">
              Descrição Detalhada e Objetivos de Aprendizagem
            </label>
            <textarea
              rows={4}
              placeholder="Descreva a metodologia, recursos necessários e etapas da aplicação pedagógica..."
              className="w-full px-4 py-2.5 rounded-xl border border-[#e1e2e9] bg-[#f8f9ff] text-sm text-[#191c20] focus:outline-none focus:ring-2 focus:ring-[#005eb3]"
              {...register('description')}
            />
            {errors.description && (
              <span className="text-xs text-red-600 font-medium">{errors.description.message}</span>
            )}
          </div>
        </div>

        {/* Upload de Arquivo Direct Storage */}
        <div className="flex flex-col gap-2 pt-2 border-t border-[#e1e2e9]">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#44474c]">
            Anexo do Arquivo Pedagógico (PDF, PNG, JPEG, DOCX até 50MB)
          </label>

          {!uploadedFileInfo ? (
            <div className="border-2 border-dashed border-[#e1e2e9] rounded-2xl p-6 flex flex-col items-center justify-center gap-3 bg-[#f8f9ff] hover:bg-[#eceef4] transition-colors cursor-pointer relative">
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.docx"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="w-12 h-12 rounded-full bg-[#8cbcff]/20 text-[#005eb3] flex items-center justify-center">
                {isUploading ? (
                  <RefreshCw className="w-6 h-6 animate-spin" />
                ) : (
                  <UploadFile className="w-6 h-6" />
                )}
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-[#191c20]">
                  {isUploading ? 'Gerando chave no Supabase...' : 'Clique ou arraste o arquivo aqui'}
                </p>
                <p className="text-xs text-[#44474c]">Formatos aceitos: PDF, DOCX, PNG, JPEG (Máx. 50MB)</p>
              </div>
              {isUploading && (
                <div className="w-full max-w-xs bg-[#e1e2e9] h-2 rounded-full overflow-hidden mt-2">
                  <div
                    className="bg-[#005eb3] h-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-[#eceef4] border border-[#e1e2e9] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-[#005eb3]" />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-[#191c20]">
                    {uploadedFileInfo.fileName}
                  </span>
                  <span className="text-xs text-[#44474c]">
                    {(uploadedFileInfo.fileSize / (1024 * 1024)).toFixed(2)} MB · Pronta para envio ao Supabase
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg">
                  <CheckCircle className="w-4 h-4" /> Anexado
                </span>
                <button
                  type="button"
                  onClick={() => setUploadedFileInfo(null)}
                  className="text-xs text-[#44474c] hover:text-red-600 font-medium underline pl-2"
                >
                  Substituir
                </button>
              </div>
            </div>
          )}

          {(errors.fileUrl || errors.fileKey) && (
            <span className="text-xs text-red-600 font-medium">
              É necessário anexar um arquivo pedagógico válido para submeter.
            </span>
          )}
        </div>

        {/* Botão de Envio */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[#e1e2e9]">
          <Link
            href="/materiais/meus"
            className="px-5 py-2.5 rounded-xl border border-[#e1e2e9] text-sm font-medium text-[#44474c] hover:bg-[#eceef4] transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || isUploading || !uploadedFileInfo}
            className="px-6 py-2.5 rounded-xl bg-[#415166] text-white font-semibold text-sm hover:bg-[#2a3a4e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
          >
            {isSubmitting && <RefreshCw className="w-4 h-4 animate-spin" />}
            <span>Salvar no Supabase e Submeter</span>
          </button>
        </div>
      </form>
    </div>
  );
}
