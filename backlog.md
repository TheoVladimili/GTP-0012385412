# 📝 Backlog de Alterações & Decisões Arquiteturais

## [2025-09-17 00:40] - [Inicialização & Setup Base]
- **Componente/Arquivo:** `src/types/index.ts`, `src/app/globals.css`, `src/app/layout.tsx`
- **Descrição:** Configurado o Next.js App Router com TypeScript, fontes do Google (Inter para títulos e Montserrat para corpo text), Tailwind CSS com as cores do Design System (Stitch) e definição de contratos de tipos puros (`User`, `Material`, `Review`, `Subject`, `AuditLog`).
- **Impacto:** Estrutura base pronta com tipagem estrita para todas as entidades e módulos do projeto.

## [2025-09-17 00:45] - [Modelagem Banco de Dados & Prisma ORM]
- **Componente/Arquivo:** `prisma/schema.prisma`, `src/lib/prisma.ts`, `prisma/seed.ts`
- **Descrição:** Criado o schema relacional em Prisma com suporte a RBAC, fluxo de aprovação de materiais, reviews de moderação e audit logs. Criado o singleton client do Prisma e o script de seed para disciplinas oficiais e usuários de teste.
- **Impacto:** Camada de persistência relacional definida e pronta para integrações.

## [2025-09-17 00:50] - [Schemas de Validação Zod]
- **Componente/Arquivo:** `src/lib/validators/material.ts`, `src/lib/validators/user.ts`, `src/lib/validators/review.ts`
- **Descrição:** Criados schemas com Zod para validações estritas de formulários (extensão de arquivos, limite de 50MB, padrão BNCC, e-mails oficiais/pré-cadastro e pareceres pedagógicos).
- **Impacto:** Garantia de integridade de dados e validações unificadas no cliente e no servidor.

## [2025-09-17 00:55] - [Integração Supabase Auth e Direct Storage]
- **Componente/Arquivo:** `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, `src/app/(auth)/callback/route.ts`, `src/services/storage.ts`
- **Descrição:** Configurados os clientes do Supabase SSR, a rota de callback para validação de domínio institucional e pré-cadastro (`isPreApproved`), além do serviço Server Action `generateSignedUploadUrl` para uploads diretos no Storage.
- **Impacto:** Segurança RBAC no login e prevenção de vulnerabilidades de upload/SSRF.

## [2025-09-17 01:00] - [Componentes UI Shell & Design System baseado no Stitch]
- **Componente/Arquivo:** `src/components/icons.tsx`, `src/components/shared/Sidebar.tsx`, `src/components/shared/Header.tsx`, `src/app/(dashboard)/layout.tsx`
- **Descrição:** Implementado o layout base e os componentes de UI Shell fieis à especificação do Google Stitch (Sidebar fixo, Header com backdrop-blur, navegação por seções e iconografia Lucide limpa sem emojis).
- **Impacto:** Identidade visual e navegação unificada do portal EduCom para todas as páginas internas.

## [2025-09-17 01:05] - [Módulo do Professor: Submissão e Meus Materiais]
- **Componente/Arquivo:** `src/services/materials.ts`, `src/app/(dashboard)/materiais/novo/page.tsx`, `src/app/(dashboard)/materiais/meus/page.tsx`, `src/app/api/subjects/route.ts`
- **Descrição:** Desenvolvido o formulário com react-hook-form + zod para submissão de materiais pedagógicos com barra de progresso no upload de arquivo. Criada a tela de listagem e acompanhamento de pareceres com proteção IDOR e revalidação de cache.
- **Impacto:** Autonomia completa para os docentes enviarem conteúdos pedagógicos para moderação municipal.

## [2025-09-17 01:10] - [Módulo do Coordenador: Moderação e ISR Cache]
- **Componente/Arquivo:** `src/services/reviews.ts`, `src/app/(dashboard)/moderacao/page.tsx`
- **Descrição:** Criada a Fila de Moderação Pedagógica com emissão de pareceres em modal/painel lateral. Ações de aprovação disparam `revalidateTag('public-materials')` para revalidação estática (ISR) das rotas do acervo municipal.
- **Impacto:** Gestão eficiente de revisões e sincronização em tempo real do cache público sem gargalos no servidor.

## [2025-09-17 01:15] - [Módulo Público: Portal do Acervo & Downloads]
- **Componente/Arquivo:** `src/app/(dashboard)/materiais/page.tsx`
- **Descrição:** Desenvolvida a página do Acervo Público com barra de busca universal por título/BNCC, filtros dinâmicos por ano escolar e componente curricular, e mecanismo de download anonimizado compatível com a LGPD.
- **Impacto:** Facilidade de acesso público para todos os professores da rede municipal aos conteúdos pedagógicos homologados.

## [2025-09-17 01:20] - [Módulo Gerencial: Relatórios XLSX & Auditoria]
- **Componente/Arquivo:** `src/app/api/admin/reports/export/route.ts`, `src/app/(dashboard)/admin/relatorios/page.tsx`, `src/app/(dashboard)/admin/auditoria/page.tsx`
- **Descrição:** Implementada a exportação de relatórios gerenciais em formato .xlsx usando exceljs com colunas formatadas e estilizadas. Criadas as telas de gestão de relatórios e de trilha de auditoria (Audit Log).
- **Impacto:** Transparência administrativa, acompanhamento de métricas pedagógicas da rede e trilha de conformidade de ações no sistema.
