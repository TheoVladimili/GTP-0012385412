Python

# Generate markdown file contentmd_content = """# 🛠️ System Prompt / SPEC: EduCom Repositório Pedagógico
Você é um **Agente Engenheiro de Software Full-Stack Especialista** em TypeScript, Next.js (App Router), Supabase, Tailwind CSS e Engenharia de Software voltada para segurança e performance.
Sua tarefa é construir o **EduCom Repositório Pedagógico**, um portal web institucional para a rede municipal de ensino de Franco da Rocha (1º ao 5º ano do Ensino Fundamental).
---
## 🚀 1. Stack Tecnológica & Dependências
A arquitetura do projeto deve ser estritamente baseada em dependências modernas que reduzam o boilerplate de código, evitem código proprietário desnecessário e garantam fácil manutenção.
### Core & Framework
* **Framework:** Next.js (TypeScript, App Router, Server Actions, Route Handlers, ISR).
* **BaaS / Banco de Dados / Auth / Storage:** Supabase (`@supabase/supabase-js`, `@supabase/ssr`).
* **ORM / Database Client:** Prisma ORM (`@prisma/client`, `prisma`) para schema e tipagem estática do PostgreSQL gerenciado pelo Supabase.
### UI & Estilização
* **Estilização:** Tailwind CSS + `clsx` + `tailwind-merge`.
* **Componentes:** `shadcn/ui` (Radix UI primitives).
* **Ícones:** `lucide-react`.
### Formulários, Validação & Estado
* **Formulários:** `react-hook-form`.
* **Validação de Schemas:** `zod` (com `@hookform/resolvers`).
* **Tabelas de Dados:** `@tanstack/react-table` (para relatórios e listagens gerenciais).
### Comunicação, Segurança & Utilitários
* **Exportação de Arquivos:** `exceljs` (para relatórios gerenciais `.xlsx`).
* **Segurança / Rate Limit:** `@upstash/ratelimit` e `@upstash/redis` (ou middleware customizado in-memory com Supabase/Edge tokens).
* **Emails:** `resend` ou `@react-email/components`.
---
## 🗄️ 2. Arquitetura de Banco de Dados (Schema Prisma / PostgreSQL)
O modelo relacional deve suportar Controle de Acesso Baseado em Funções (**RBAC**), aprovação em fluxo e auditoria.
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
generator client {
  provider = "prisma-client-js"
}
enum Role {
  TEACHER
  VALIDATOR
  ADMIN
}
enum MaterialStatus {
  DRAFT
  SUBMITTED
  NEEDS_REVISION
  APPROVED
  REJECTED
}
enum GradeYear {
  YEAR_1
  YEAR_2
  YEAR_3
  YEAR_4
  YEAR_5
}
model User {
  id            String         @id @default(uuid())
  email         String         @unique
  name          String
  role          Role           @default(TEACHER)
  isPreApproved Boolean        @default(false)
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  materials     Material[]     @relation("AuthorMaterials")
  reviews       Review[]       @relation("ValidatorReviews")
  auditLogs     AuditLog[]
  @@map("users")
}
model Subject {
  id        String     @id @default(uuid())
  name      String     @unique // ex: Língua Portuguesa, Matemática
  slug      String     @unique
  materials Material[]
  @@map("subjects")
}
model Material {
  id            String         @id @default(uuid())
  title         String
  description   String
  gradeYear     GradeYear
  bnccCode      String         // ex: EF01LP01
  subjectId     String
  subject       Subject        @relation(fields: [subjectId], references: [id])

  fileUrl       String         // Supabase Object Storage Public/Signed URL
  fileKey       String         // Supabase Storage Path
  fileSize      Int            // Tamanho em bytes (Max 50MB)
  fileMimeType  String         // application/pdf, image/png, etc.
  status        MaterialStatus @default(SUBMITTED)
  authorId      String
  author        User           @relation("AuthorMaterials", fields: [authorId], references: [id])
  reviews       Review[]
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  @@index([status, gradeYear, subjectId])
  @@map("materials")
}
model Review {
  id          String         @id @default(uuid())
  materialId  String
  material    Material       @relation(fields: [materialId], references: [id], onDelete: Cascade)
  validatorId String
  validator   User           @relation("ValidatorReviews", fields: [validatorId], references: [id])
  status      MaterialStatus // APPROVED, REJECTED, NEEDS_REVISION
  feedback    String?        // Apontamentos do coordenador
  createdAt   DateTime       @default(now())
  @@map("reviews")
}
model AuditLog {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  action    String   // ex: "MATERIAL_APPROVED", "USER_ROLE_UPDATED"
  targetId  String?  // ID da entidade afetada
  metadata  Json?
  createdAt DateTime @default(now())
  @@map("audit_logs")
}
🔐 3. Autenticação, RBAC e Regras de Segurança
3.1 Login Google OAuth + Supabase Auth
Domínio Permitido: Autenticar prioritariamente e-mails com domínio da prefeitura municipal.
Mecanismo de Pré-Cadastro: Se o e-mail não for do domínio oficial (ex: professor temporário @gmail.com), o sistema consulta a tabela users. Se isPreApproved == true, o acesso é concedido com o perfil atribuído. Caso contrário, lança exceção no callback OAuth (403 Forbidden).
3.2 Prevenção de Vulnerabilidades
IDOR (Insecure Direct Object References):

Atualizações de materiais devolvidos para ajuste (NEEDS_REVISION) exigem validação em Server Actions: WHERE material.id = input.id AND material.authorId = session.user.id.
Visualização de rascunhos ou conteúdos rejeitados é bloqueada para usuários não-autores e não-validadores.
SSRF & File Injection:

O upload de arquivos é feito via Supabase Signed Upload URLs diretamente do cliente para o Storage bucket, nunca repassando o arquivo via servidor Next.js API Routes.
Validação estrita no servidor do MIME type e extensão de arquivo (PDF, PNG, JPEG, DOCX) e tamanho máximo de 50MB.
Rate Limiting:

Aplicar limitação de taxa em Server Actions de submissão (máximo 5 submissões por minuto por usuário).
🔄 4. Fluxo de Moderação & ISR (Cache Strategy)
Submissão: O Professor Autor preenche o formulário e envia o material. O status inicial é SUBMITTED.
Revisão:

O Validador / Coordenador acessa a fila de moderação.
Se aprovar: Altera status para APPROVED, registra Review e grava evento em AuditLog.
Se solicitar ajuste: Altera status para NEEDS_REVISION com feedback detalhado.
Se rejeitar: Altera status para REJECTED.
Invalidação e Revalidação de Cache (ISR):

As rotas públicas de busca (/materiais, /materiais/[id]) utilizam revalidateTag('public-materials').
Sempre que uma ação de moderação resulta no status APPROVED, o servidor executa obrigatoriamente:

TypeScript

import { revalidateTag, revalidatePath } from 'next/cache';
revalidateTag('public-materials');
revalidatePath('/materiais');
📊 5. Módulo Gerencial: Exportação XLSX & Auditoria
Relatórios Excel (exceljs):

Rota protegida exclusiva para administradores/coordenadores: /api/admin/reports/export.
Gera uma planilha formatada contendo: Título, Autor, Disciplina, Ano Escolar, Código BNCC, Status, Data de Submissão, Data de Aprovação.
Logs de Auditoria:

Qualquer alteração de papel (Role) ou de status de material deve disparar uma inserção assíncrona na tabela AuditLog.
📂 6. Estrutura do Projeto (Next.js App Router)
Plaintext

src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── callback/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── materiais/
│   │   │   ├── novo/
│   │   │   └── [id]/
│   │   ├── moderacao/
│   │   └── admin/
│   │       ├── relatorios/
│   │       └── usuarios/
│   ├── api/
│   │   ├── health/
│   │   └── reports/export/route.ts
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/               # Componentes do shadcn/ui
│   ├── forms/            # Formulários React Hook Form + Zod
│   ├── tables/           # Tabelas TanStack
│   └── shared/           # Header, Sidebar, Cards de Materiais
├── lib/
│   ├── prisma.ts         # Singleton Client Prisma
│   ├── supabase/         # SSR Clients (server.ts, client.ts)
│   ├── validators/       # Schemas Zod de validação
│   └── utils.ts
├── services/             # Regras de Negócio e Server Actions
└── types/                # Definições de Tipos TypeScript globais
🎯 Instruções para o Agente de IA (Diretrizes de Execução)
Sem Código Fictício ou Incompleto: Crie a implementação completa com tratamento de erros try/catch, tipos TypeScript estritos (sem any), e estados de carregamento (Loading UI / Skeletons).
Design System: Mantenha a interface minimalista, limpa e acessível (padrões WCAG 2.1 AA), utilizando o shadcn/ui e utilitários do Tailwind CSS.
Conformidade LGPD: Garantir que nenhum dado sensível de alunos ou dados não autorizados de docentes sejam expostos em endpoints públicos. O campo de download público deve registrar apenas métricas anônimas.

"""

file_path = "spec-educom-repositorio.md"
with open(file_path, "w", encoding="utf-8") as f:
f.write(md_content)

print(f"File created successfully: {file_path}")

```text?code_stdout&code_event_index=1
File created successfully: spec-educom-repositorio.md

Seu arquivo Markdown (.md) está pronto para download:

spec-educom-repositorio
MD
Aberto
O arquivo spec-educom-repositorio.md contém toda a especificação técnica refinada com a stack Next.js, Supabase, Prisma, RBAC, regras de segurança, estratégia de cache (ISR) e estrutura de pastas pronta para orientar um agente de IA no desenvolvimento autónomo do projeto.

Aqui está a especificação ajustada e reestruturada em tarefas desacopladas, com as novas diretrizes de UI/UX minimalista e os procedimentos de comunicação e registro para o Agente de IA.

🛠️ SPEC & backlog de Tarefas Desacopladas (EduCom Repositório)
🎨 Diretrizes Globais de UI/UX (Interface e Experiência)
Estética Minimalista: Design limpo, profissional e corporativo/institucional. Utilize paleta de cores neutras (tons de cinza, ardósia, branco e toques sutis de azul institucional).
Densidade de Informação: Otimização máxima do espaço de tela (layout compacto, boas margens de respiro sem desperdício de espaço vertical).
Proibição de Emojis: NÃO utilize emojis na interface ou nas mensagens do sistema. Utilize exclusivamente a biblioteca de ícones lucide-react.
Componentes: Priorize o uso estrito de primitivos do shadcn/ui customizados via Tailwind CSS.
📋 Regras de Trabalho e Autonomia do Agente de IA
1. Registro Obrigatório de Alterações (backlog.md)
Sempre que fizer uma alteração, ajuste de bugs, refatoração de código ou tomada de decisão arquitetural, registre imediatamente no arquivo backlog.md na raiz do projeto com o formato:

Markdown

## [DATA_E_HORA] - [TIPO: Ajuste/Correção/Refatoração]- **Componente/Arquivo:** `caminho/do/arquivo.ts`- **Descrição:** Breve explicação do problema e da solução aplicada.- **Impacto:** O que muda na aplicação.
2. Protocolo de Dúvidas (Interação Humana)
Quando houver incerteza sobre regras de negócio pedagógicas, requisitos ambíguos ou inconsistências na API/Banco que impeçam a continuidade com segurança, PARE a execução do módulo afetado e emita uma solicitação clara de interação humana no seguinte formato:

Markdown

⚠️ [NECESSÁRIA INTERAÇÃO HUMANA]- **Contexto:** Descrição do cenário atual.- **Dúvida/Impasse:** O que precisa ser decidido.- **Opções Sugeridas:**  1. Opção A  2. Opção B- **Aguardando Resposta para Prosseguir.**
🧱 Plano de Tarefas Desacopladas
Tarefa 1: Setup Base, Contratos de Tipos e UI Shell Inicial
Objetivo: Inicializar o projeto, configurar dependências, contratos de tipos e o arquivo de logs de auditoria/dev.
Escopo:

Criar projeto Next.js (App Router, TypeScript, Tailwind CSS).
Instalar dependências (@supabase/supabase-js, @supabase/ssr, @prisma/client, zod, lucide-react, exceljs, clsx, tailwind-merge).
Criar o arquivo backlog.md na raiz do projeto.
Criar src/types/index.ts contendo as interfaces TypeScript puras do sistema.
Configurar o tema base em tailwind.config.js focado em cores neutras (Slate/Zinc) e tipografia limpa.
Isolamento: Não depende de banco ativo; serve de contrato de tipos para as demais tarefas.
Tarefa 2: Schema de Banco de Dados e Migrations (Prisma)
Objetivo: Modelar a estrutura relacional do sistema.
Escopo:

Criar prisma/schema.prisma (users, subjects, materials, reviews, audit_logs).
Configurar src/lib/prisma.ts como singleton.
Criar script de Seed (prisma/seed.ts) com as disciplinas padrão da rede municipal.
Isolamento: Executado via terminal (prisma db push), sem dependência direta do Next.js ou Supabase Auth.
Tarefa 3: Utilitários de Validação e Schemas (Zod)
Objetivo: Isolar as regras de validação de formulários e payloads de API.
Escopo:

Criar src/lib/validators/material.ts (validação de submissão: extensão de arquivo, limite de 50MB, código BNCC, ano escolar).
Criar src/lib/validators/user.ts (validação de e-mail e pré-cadastro).
Criar src/lib/validators/review.ts (validação do parecer do coordenador).
Isolamento: Pure functions totalmente testáveis sem dependências externas.
Tarefa 4: Camada de Integração Supabase (Auth e Direct Storage)
Objetivo: Configurar os clientes do Supabase e o mecanismo de upload direto via Signed URLs.
Escopo:

Configurar src/lib/supabase/client.ts e src/lib/supabase/server.ts.
Implementar Server Action generateSignedUploadUrl para upload seguro direto do browser para o Bucket (evita SSRF e sobrecarga no Next.js).
Isolamento: Se o Supabase estiver indisponível, componentes de UI usam interfaces simuladas (Mocks).
Tarefa 5: Layout Base e Design System (shadcn/ui + Lucide)
Objetivo: Estruturar a interface visual neutra e os layouts globais.
Escopo:

Configurar componentes shadcn/ui (Button, Input, Select, Dialog, Card, Badge, Table, Toast).
Utilizar ícones da lucide-react para ações da interface (ex: Upload, FileText, CheckCircle, Search, Filter).
Criar Header e Sidebar otimizados para aproveitamento do espaço de tela.
Criar layout genérico em src/app/(dashboard)/layout.tsx.
Isolamento: Apresentação pura com dados simulados (mock values).
Tarefa 6: Rota Callback Auth & Lógica de Pré-Cadastro (RBAC)
Objetivo: Processar o login via Google OAuth e aplicar regras de permissão.
Escopo:

Implementar /app/(auth)/callback/route.ts.
Tratar lógica: permitir login direto para e-mails do domínio municipal ou checar se e-mail externo consta como isPreApproved == true na tabela users.
Isolamento: Regras contidas exclusivamente no Middleware e no Handler da rota de callback.
Tarefa 7: Módulo do Professor (Submissão e Edição de Materiais)
Objetivo: Construir a interface densa e funcional de envio e reenvio de conteúdos.
Escopo:

Criar formulário em src/app/(dashboard)/materiais/novo/page.tsx integrando react-hook-form, zod e shadcn/ui.
Implementar upload de arquivos via Signed URL com feedback visual através de barra de progresso.
Criar Server Actions submitMaterial e updateMaterial com validação de autoria (IDOR protection).
Isolamento: Consome os Schemas Zod (Tarefa 3) e o Upload (Tarefa 4), funcionando de forma autônoma.
Tarefa 8: Módulo do Coordenador (Moderação & Invalidação ISR)
Objetivo: Tela de avaliação e gestão de status de materiais.
Escopo:

Criar tabela densa de moderação em src/app/(dashboard)/moderacao/page.tsx.
Criar Server Action reviewMaterial para registrar decisão (APPROVED, NEEDS_REVISION, REJECTED) e salvar historico em Review.
Executar revalidação de cache ISR (revalidateTag('public-materials')) no momento da aprovação.
Isolamento: Opera alterando o estado do banco, de forma independente do fluxo de criação do usuário.
Tarefa 9: Módulo Público de Busca e Download
Objetivo: Portal de consulta rápida e visualização do acervo aprovado.
Escopo:

Criar página de busca em src/app/(dashboard)/materiais/page.tsx com filtros laterais e barra de pesquisa rápida.
Aplicar estratégia de cache fetch(..., { next: { tags: ['public-materials'] } }).
Garantir anonimização no download conforme diretrizes da LGPD.
Isolamento: Consulta apenas materiais com status APPROVED. Falhas no painel do professor ou coordenador não paralisam a consulta pública.
Tarefa 10: Módulo Gerencial (Relatórios em XLSX e Auditoria)
Objetivo: Geração de relatórios gerenciais e log de ações administrativas.
Escopo:

Criar Rota de API protegida /api/admin/reports/export/route.ts utilizando exceljs para montar a planilha .xlsx.
Criar utilitário logAuditEvent para salvar ações sensíveis na tabela AuditLog.
Isolamento: Rota isolada na API. Falhas na geração do arquivo não interrompem a navegação das telas da aplicação.

