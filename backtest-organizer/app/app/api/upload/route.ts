
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo foi enviado' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Criar diretório de uploads se não existir
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Diretório já existe
    }

    // Gerar nome único para o arquivo
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${timestamp}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
    const filePath = join(uploadDir, fileName);

    // Salvar arquivo
    await writeFile(filePath, buffer);

    // Retornar URL da imagem
    const imageUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      url: imageUrl,
      fileName: fileName,
      originalName: file.name
    });
  } catch (error) {
    console.error('Erro no upload da imagem:', error);
    return NextResponse.json(
      { error: 'Erro no upload da imagem' },
      { status: 500 }
    );
  }
}
