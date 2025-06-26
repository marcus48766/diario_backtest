
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Backtest } from '@/lib/types';

interface BacktestCardProps {
  backtest: Backtest;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function BacktestCard({ backtest, onEdit, onDelete }: BacktestCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const primeiraImagem = backtest.imagens?.[0];

  return (
    <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-300">
      <Link href={`/registro/${backtest.id}`}>
        <div className="aspect-video relative bg-gray-200">
          {primeiraImagem ? (
            <Image
              src={primeiraImagem.urlImagem}
              alt={backtest.titulo}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-100">
              <span className="text-gray-400 text-sm">Sem imagem</span>
            </div>
          )}
        </div>
      </Link>

      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Link href={`/registro/${backtest.id}`}>
              <h3 className="font-semibold text-lg mb-2 hover:text-blue-600 transition-colors">
                {backtest.titulo}
              </h3>
            </Link>
            
            <p className="text-sm text-gray-500 mb-3">
              {format(new Date(backtest.data), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {backtest.tags?.map((backtestTag) => (
                <Badge
                  key={backtestTag.id}
                  style={{ backgroundColor: backtestTag.tag?.cor }}
                  className="text-white text-xs"
                >
                  {backtestTag.tag?.nome}
                </Badge>
              ))}
            </div>
          </div>

          {/* Menu de Ações */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowMenu(!showMenu)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg z-10">
                <button
                  onClick={() => {
                    onEdit?.(backtest.id);
                    setShowMenu(false);
                  }}
                  className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100"
                >
                  <Edit className="h-3 w-3 mr-2" />
                  Editar
                </button>
                <button
                  onClick={() => {
                    onDelete?.(backtest.id);
                    setShowMenu(false);
                  }}
                  className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  <Trash2 className="h-3 w-3 mr-2" />
                  Excluir
                </button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
