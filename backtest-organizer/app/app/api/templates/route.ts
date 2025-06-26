
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/templates - Listar todos os templates
export async function GET() {
  try {
    const templates = await prisma.template.findMany({
      orderBy: { criadoEm: 'desc' }
    });

    return NextResponse.json(templates);
  } catch (error) {
    console.error('Erro ao buscar templates:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST /api/templates - Criar novo template
export async function POST(request: NextRequest) {
  try {
    const dados = await request.json();
    const { titulo, conteudo } = dados;

    const novoTemplate = await prisma.template.create({
      data: {
        titulo,
        conteudo
      }
    });

    return NextResponse.json(novoTemplate, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar template:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
