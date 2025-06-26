
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/backtests/[id] - Buscar backtest específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const backtest = await prisma.backtest.findUnique({
      where: { id: params.id },
      include: {
        imagens: {
          orderBy: { posicao: 'asc' }
        },
        tags: {
          include: {
            tag: true
          }
        }
      }
    });

    if (!backtest) {
      return NextResponse.json(
        { error: 'Backtest não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(backtest);
  } catch (error) {
    console.error('Erro ao buscar backtest:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PUT /api/backtests/[id] - Atualizar backtest
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const dados = await request.json();
    const { titulo, data, observacoes, tags, imagens } = dados;

    // Excluir tags e imagens existentes
    await prisma.backtestTag.deleteMany({
      where: { backtestId: params.id }
    });
    await prisma.backtestImagem.deleteMany({
      where: { backtestId: params.id }
    });

    const backtestAtualizado = await prisma.backtest.update({
      where: { id: params.id },
      data: {
        titulo,
        data: new Date(data),
        observacoes,
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

    return NextResponse.json(backtestAtualizado);
  } catch (error) {
    console.error('Erro ao atualizar backtest:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE /api/backtests/[id] - Excluir backtest
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.backtest.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Backtest excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir backtest:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
