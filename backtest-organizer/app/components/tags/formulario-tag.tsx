
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CORES_TAGS, type Tag, type CorTag } from '@/lib/types';

interface FormularioTagProps {
  tag?: Tag | null;
  onClose: () => void;
}

export function FormularioTag({ tag, onClose }: FormularioTagProps) {
  const [nome, setNome] = useState(tag?.nome || '');
  const [cor, setCor] = useState(tag?.cor || CORES_TAGS.azul);
  const [carregando, setCarregando] = useState(false);

  const salvarTag = async () => {
    if (!nome.trim()) {
      alert('Por favor, preencha o nome da tag.');
      return;
    }

    try {
      setCarregando(true);
      
      const dados = { nome: nome.trim(), cor };
      
      let resposta;
      if (tag) {
        resposta = await fetch(`/api/tags/${tag.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dados)
        });
      } else {
        resposta = await fetch('/api/tags', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dados)
        });
      }

      if (resposta.ok) {
        onClose();
      } else {
        const erro = await resposta.json();
        alert(erro.error || 'Erro ao salvar tag.');
      }
    } catch (error) {
      console.error('Erro ao salvar tag:', error);
      alert('Erro ao salvar tag.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {tag ? 'Editar Tag' : 'Nova Tag'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome da Tag *</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite o nome da tag"
              className="mt-1"
            />
          </div>

          <div>
            <Label>Cor da Tag *</Label>
            <div className="grid grid-cols-4 gap-3 mt-2">
              {Object.entries(CORES_TAGS).map(([nomeCor, valorCor]) => (
                <button
                  key={nomeCor}
                  type="button"
                  onClick={() => setCor(valorCor)}
                  className={`
                    relative w-full aspect-square rounded-lg border-2 transition-all
                    ${cor === valorCor ? 'border-gray-900 scale-110' : 'border-gray-300 hover:border-gray-400'}
                  `}
                  style={{ backgroundColor: valorCor }}
                >
                  {cor === valorCor && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full" />
                    </div>
                  )}
                  <span className="sr-only">{nomeCor}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={salvarTag} disabled={carregando}>
              {carregando ? 'Salvando...' : 'Salvar Tag'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
