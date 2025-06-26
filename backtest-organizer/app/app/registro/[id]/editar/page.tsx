
import { notFound } from 'next/navigation';
import { MainLayout } from '@/components/layout/main-layout';
import { FormularioBacktest } from '@/components/backtest/formulario-backtest';
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

export default async function EditarBacktestPage({ params }: Props) {
  const backtest = await buscarBacktest(params.id);

  if (!backtest) {
    notFound();
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Editar Backtest
          </h1>
          <p className="text-gray-600 mt-2">
            Atualize as informações do seu registro de backtest
          </p>
        </div>
        
        <FormularioBacktest backtest={backtest} />
      </div>
    </MainLayout>
  );
}
