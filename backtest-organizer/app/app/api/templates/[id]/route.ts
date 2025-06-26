
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// PUT /api/templates/[id] - Atualizar template
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const dados = await request.json();
    const { titulo, conteudo } = dados;

    const templateAtualizado = await prisma.template.update({
      where: { id: params.id },
      data: { titulo, conteudo }
    });

    return NextResponse.json(templateAtualizado);
  } catch (error) {
    console.error('Erro ao atualizar template:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE /api/templates/[id] - Excluir template
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.template.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Template excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir template:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
