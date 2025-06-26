
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUpDown, Calendar, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BacktestCard } from './backtest-card';
import { OrdenacaoTipo, type Backtest } from '@/lib/types';

export function DashboardBacktests() {
  const router = useRouter();
  const [backtests, setBacktests] = useState<Backtest[]>([]);
  const [ordenacao, setOrdenacao] = useState<OrdenacaoTipo>('data');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarBacktests();
  }, [ordenacao]);

  const carregarBacktests = async () => {
    try {
      setCarregando(true);
      const resposta = await fetch(`/api/backtests?ordenacao=${ordenacao}`);
      const dados = await resposta.json();
      setBacktests(dados);
    } catch (error) {
      console.error('Erro ao carregar backtests:', error);
    } finally {
      setCarregando(false);
    }
  };

  const alternarOrdenacao = () => {
    setOrdenacao(ordenacao === 'data' ? 'manual' : 'data');
  };

  const editarBacktest = (id: string) => {
    router.push(`/registro/${id}/editar`);
  };

  const excluirBacktest = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este backtest?')) {
      try {
        await fetch(`/api/backtests/${id}`, {
          method: 'DELETE'
        });
        carregarBacktests();
      } catch (error) {
        console.error('Erro ao excluir backtest:', error);
      }
    }
  };

  if (carregando) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Carregando backtests...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controles */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={alternarOrdenacao}
            className="flex items-center gap-2"
          >
            {ordenacao === 'data' ? (
              <>
                <Calendar className="h-4 w-4" />
                Ordenar por: Data
              </>
            ) : (
              <>
                <Move className="h-4 w-4" />
                Ordenar por: Posição Manual
              </>
            )}
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
        
        <p className="text-sm text-gray-500">
          {backtests.length} {backtests.length === 1 ? 'backtest' : 'backtests'}
        </p>
      </div>

      {/* Grid de Backtests */}
      {backtests.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum backtest encontrado
          </h3>
          <p className="text-gray-500 mb-6">
            Comece criando seu primeiro registro de backtest.
          </p>
          <Button onClick={() => router.push('/registro/novo')}>
            Criar Primeiro Backtest
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {backtests.map((backtest) => (
            <BacktestCard
              key={backtest.id}
              backtest={backtest}
              onEdit={editarBacktest}
              onDelete={excluirBacktest}
            />
          ))}
        </div>
      )}
    </div>
  );
}
