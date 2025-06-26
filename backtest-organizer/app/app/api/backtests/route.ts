
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/backtests - Listar todos os backtests
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ordenacao = searchParams.get('ordenacao') || 'data';

    const backtests = await prisma.backtest.findMany({
      include: {
        imagens: {
          orderBy: { posicao: 'asc' }
        },
        tags: {
          include: {
            tag: true
          }
        }
      },
      orderBy: ordenacao === 'manual' 
        ? { posicao: 'asc' }
        : { data: 'desc' }
    });

    return NextResponse.json(backtests);
  } catch (error) {
    console.error('Erro ao buscar backtests:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST /api/backtests - Criar novo backtest
export async function POST(request: NextRequest) {
  try {
    const dados = await request.json();
    const { titulo, data, observacoes, tags, imagens } = dados;

    // Buscar a maior posição atual
    const ultimoBacktest = await prisma.backtest.findFirst({
      orderBy: { posicao: 'desc' }
    });
    const novaPosicao = (ultimoBacktest?.posicao || 0) + 1;

    const novoBacktest = await prisma.backtest.create({
      data: {
        titulo,
        data: new Date(data),
        observacoes,
        posicao: novaPosicao,
        imagens: {
          create: imagens?.map((img: any, index: number) => ({
            nomeArquivo: img.nomeArquivo,
            urlImagem: img.urlImagem,
            posicao: index
          })) || []
        },
        tags: {
          create: tags?.map((tag: any) => ({
            tagId: tag.tagId,
            observacao: tag.observacao
          })) || []
        }
      },
      include: {
        imagens: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    });

    return NextResponse.json(novoBacktest, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar backtest:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
