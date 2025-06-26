
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// PUT /api/tags/[id] - Atualizar tag
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const dados = await request.json();
    const { nome, cor } = dados;

    // Verificar se já existe outra tag com esse nome
    const tagExistente = await prisma.tag.findFirst({
      where: { 
        nome,
        NOT: { id: params.id }
      }
    });

    if (tagExistente) {
      return NextResponse.json(
        { error: 'Já existe uma tag com esse nome' },
        { status: 400 }
      );
    }

    const tagAtualizada = await prisma.tag.update({
      where: { id: params.id },
      data: { nome, cor }
    });

    return NextResponse.json(tagAtualizada);
  } catch (error) {
    console.error('Erro ao atualizar tag:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE /api/tags/[id] - Excluir tag
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.tag.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Tag excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir tag:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
