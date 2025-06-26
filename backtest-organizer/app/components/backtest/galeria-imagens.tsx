
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import type { BacktestImagem } from '@/lib/types';

interface GaleriaImagensProps {
  imagens: BacktestImagem[];
  className?: string;
}

export function GaleriaImagens({ imagens, className }: GaleriaImagensProps) {
  const [imagemSelecionada, setImagemSelecionada] = useState<number | null>(null);

  const abrirModal = (index: number) => {
    setImagemSelecionada(index);
  };

  const fecharModal = () => {
    setImagemSelecionada(null);
  };

  const imagemAnterior = () => {
    if (imagemSelecionada !== null && imagemSelecionada > 0) {
      setImagemSelecionada(imagemSelecionada - 1);
    }
  };

  const proximaImagem = () => {
    if (imagemSelecionada !== null && imagemSelecionada < imagens.length - 1) {
      setImagemSelecionada(imagemSelecionada + 1);
    }
  };

  if (!imagens || imagens.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhuma imagem disponível
      </div>
    );
  }

  return (
    <>
      <div className={`grid gap-4 ${className}`}>
        {imagens.length === 1 ? (
          <div 
            className="aspect-video relative rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => abrirModal(0)}
          >
            <Image
              src={imagens[0].urlImagem}
              alt={imagens[0].nomeArquivo}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {imagens.map((imagem, index) => (
              <div
                key={imagem.id}
                className="aspect-square relative rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => abrirModal(index)}
              >
                <Image
                  src={imagem.urlImagem}
                  alt={imagem.nomeArquivo}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Visualização */}
      <Dialog open={imagemSelecionada !== null} onOpenChange={() => fecharModal()}>
        <DialogContent className="max-w-4xl w-full h-[90vh] flex flex-col p-0">
          {imagemSelecionada !== null && (
            <>
              {/* Header com controles */}
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-semibold">
                  {imagens[imagemSelecionada].nomeArquivo}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {imagemSelecionada + 1} de {imagens.length}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={fecharModal}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Imagem principal */}
              <div className="flex-1 relative">
                <Image
                  src={imagens[imagemSelecionada].urlImagem}
                  alt={imagens[imagemSelecionada].nomeArquivo}
                  fill
                  className="object-contain"
                />

                {/* Controles de navegação */}
                {imagens.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-4 top-1/2 transform -translate-y-1/2"
                      onClick={imagemAnterior}
                      disabled={imagemSelecionada === 0}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2"
                      onClick={proximaImagem}
                      disabled={imagemSelecionada === imagens.length - 1}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
