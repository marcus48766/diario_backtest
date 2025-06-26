
import { notFound } from 'next/navigation';
import { MainLayout } from '@/components/layout/main-layout';
import { DetalhesBacktest } from '@/components/backtest/detalhes-backtest';
import { prisma } from '@/lib/db';

interface Props {
  params: { id: string };
}

async function buscarBacktest(id: string) {
  try {
    const backtest = await prisma.backtest.findUnique({
      where: { id },
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

    return backtest;
  } catch (error) {
    console.error('Erro ao buscar backtest:', error);
    return null;
  }
}

export default async function PaginaDetalhesBacktest({ params }: Props) {
  const backtest = await buscarBacktest(params.id);

  if (!backtest) {
    notFound();
  }

  return (
    <MainLayout>
      <DetalhesBacktest backtest={backtest} />
    </MainLayout>
  );
}
