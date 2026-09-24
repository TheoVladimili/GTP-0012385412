import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export const dynamic = 'force-static';

export async function GET() {
  try {
    const { data: subjects, error } = await supabase
      .from('subjects')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      throw error;
    }

    return NextResponse.json(subjects || []);
  } catch (err) {
    console.error('Erro na API de disciplinas:', err);
    return NextResponse.json([]);
  }
}
