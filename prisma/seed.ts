import { PrismaClient, Role, MaterialStatus, GradeYear } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial subjects and default users...');

  // Subjects default
  const subjectsData = [
    { name: 'Língua Portuguesa', slug: 'lingua-portuguesa' },
    { name: 'Matemática', slug: 'matematica' },
    { name: 'Ciências', slug: 'ciencias' },
    { name: 'História', slug: 'historia' },
    { name: 'Geografia', slug: 'geografia' },
    { name: 'Arte', slug: 'arte' },
    { name: 'Educação Física', slug: 'educacao-fisica' },
    { name: 'Língua Inglesa', slug: 'lingua-inglesa' },
  ];

  const subjects = [];
  for (const s of subjectsData) {
    const subject = await prisma.subject.upsert({
      where: { slug: s.slug },
      update: { name: s.name },
      create: { name: s.name, slug: s.slug },
    });
    subjects.push(subject);
  }

  // Users default (Admin, Validador, Professor)
  const userAdmin = await prisma.user.upsert({
    where: { email: 'admin@francodarocha.sp.gov.br' },
    update: {},
    create: {
      email: 'admin@francodarocha.sp.gov.br',
      name: 'Coordenador Geral SME',
      role: Role.ADMIN,
      isPreApproved: true,
    },
  });

  const userValidator = await prisma.user.upsert({
    where: { email: 'marcelo.ramos@francodarocha.sp.gov.br' },
    update: {},
    create: {
      email: 'marcelo.ramos@francodarocha.sp.gov.br',
      name: 'Prof. Marcelo Ramos',
      role: Role.VALIDATOR,
      isPreApproved: true,
    },
  });

  const userTeacher = await prisma.user.upsert({
    where: { email: 'ana.silva@educa.francodarocha.sp.gov.br' },
    update: {},
    create: {
      email: 'ana.silva@educa.francodarocha.sp.gov.br',
      name: 'Profa. Ana Silva',
      role: Role.TEACHER,
      isPreApproved: true,
    },
  });

  // Material de Exemplo Aprovado para Acervo
  const portuguesSubject = subjects.find(s => s.slug === 'lingua-portuguesa');
  if (portuguesSubject) {
    await prisma.material.upsert({
      where: { id: 'sample-material-1' },
      update: {},
      create: {
        id: 'sample-material-1',
        title: 'Sequência Didática: Leitura e Interpretação de Fábulas',
        description: 'Sequência de 5 aulas focada na compreensão textual e identificação de moral em fábulas clássicas brasileiras.',
        gradeYear: GradeYear.YEAR_3,
        bnccCode: 'EF03LP01',
        subjectId: portuguesSubject.id,
        fileUrl: 'https://placehold.co/600x800/pdf',
        fileKey: 'materials/sample-fabulas.pdf',
        fileSize: 2450000,
        fileMimeType: 'application/pdf',
        status: MaterialStatus.APPROVED,
        authorId: userTeacher.id,
      },
    });
  }

  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
