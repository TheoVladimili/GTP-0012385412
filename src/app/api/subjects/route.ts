import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-static';

export async function GET() {
  try {
    const subjects = await prisma.subject.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(subjects);
  } catch {
    // Fallback Mock Subjects em ambiente sem DB inicializado
    const mockSubjects = [
      { id: 'sub-1', name: 'Língua Portuguesa', slug: 'lingua-portuguesa' },
      { id: 'sub-2', name: 'Matemática', slug: 'matematica' },
      { id: 'sub-3', name: 'Ciências', slug: 'ciencias' },
      { id: 'sub-4', name: 'História', slug: 'historia' },
      { id: 'sub-5', name: 'Geografia', slug: 'geografia' },
      { id: 'sub-6', name: 'Arte', slug: 'arte' },
      { id: 'sub-7', name: 'Educação Física', slug: 'educacao-fisica' },
      { id: 'sub-8', name: 'Língua Inglesa', slug: 'lingua-inglesa' },
    ];
    return NextResponse.json(mockSubjects);
  }
}
