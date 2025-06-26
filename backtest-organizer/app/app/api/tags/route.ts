
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/tags - Listar todas as tags
export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { posicao: 'asc' },
      include: {
        _count: {
          select: { backtests: true }
        }
      }
    });

    return NextResponse.json(tags);
  } catch (error) {
    console.error('Erro ao buscar tags:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST /api/tags - Criar nova tag
export async function POST(request: NextRequest) {
  try {
    const dados = await request.json();
    const { nome, cor } = dados;

    // Verificar se já existe uma tag com esse nome
    const tagExistente = await prisma.tag.findUnique({
      where: { nome }
    });

    if (tagExistente) {
      return NextResponse.json(
        { error: 'Já existe uma tag com esse nome' },
        { status: 400 }
      );
    }

    // Buscar a maior posição atual
    const ultimaTag = await prisma.tag.findFirst({
      orderBy: { posicao: 'desc' }
    });
    const novaPosicao = (ultimaTag?.posicao || 0) + 1;

    const novaTag = await prisma.tag.create({
      data: {
        nome,
        cor,
        posicao: novaPosicao
      }
    });

    return NextResponse.json(novaTag, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar tag:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
