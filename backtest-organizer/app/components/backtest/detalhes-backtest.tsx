
'use client';

import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowLeft, Edit, Trash2, Calendar, Tag as TagIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GaleriaImagens } from './galeria-imagens';
import type { Backtest } from '@/lib/types';

interface DetalhesBacktestProps {
  backtest: Backtest;
}

export function DetalhesBacktest({ backtest }: DetalhesBacktestProps) {
  const router = useRouter();

  const excluirBacktest = async () => {
    if (confirm('Tem certeza que deseja excluir este backtest?')) {
      try {
        await fetch(`/api/backtests/${backtest.id}`, {
          method: 'DELETE'
        });
        router.push('/');
      } catch (error) {
        console.error('Erro ao excluir backtest:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {backtest.titulo}
            </h1>
            <div className="flex items-center gap-2 mt-2 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>
                {format(new Date(backtest.data), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/registro/${backtest.id}/editar`)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Editar
          </Button>
          <Button
            variant="destructive"
            onClick={excluirBacktest}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Excluir
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Galeria de Imagens */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TagIcon className="h-5 w-5" />
                Imagens ({backtest.imagens?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <GaleriaImagens imagens={backtest.imagens || []} />
            </CardContent>
          </Card>
        </div>

        {/* Informações e Tags */}
        <div className="space-y-6">
          {/* Tags */}
          {backtest.tags && backtest.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TagIcon className="h-5 w-5" />
                  Tags Aplicadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {backtest.tags.map((backtestTag) => (
                    <div key={backtestTag.id} className="space-y-2">
                      <Badge
                        style={{ backgroundColor: backtestTag.tag?.cor }}
                        className="text-white"
                      >
                        {backtestTag.tag?.nome}
                      </Badge>
                      {backtestTag.observacao && (
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                          {backtestTag.observacao}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Observações Gerais */}
          {backtest.observacoes && (
            <Card>
              <CardHeader>
                <CardTitle>Observações Gerais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap text-gray-700">
                    {backtest.observacoes}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Metadados */}
          <Card>
            <CardHeader>
              <CardTitle>Metadados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Criado em:</span>
                <p className="text-sm">
                  {format(new Date(backtest.criadoEm), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Última atualização:</span>
                <p className="text-sm">
                  {format(new Date(backtest.atualizadoEm), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
