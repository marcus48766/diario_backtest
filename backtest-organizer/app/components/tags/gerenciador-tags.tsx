
'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FormularioTag } from './formulario-tag';
import type { Tag } from '@/lib/types';

export function GerenciadorTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [tagEditando, setTagEditando] = useState<Tag | null>(null);

  useEffect(() => {
    carregarTags();
  }, []);

  const carregarTags = async () => {
    try {
      setCarregando(true);
      const resposta = await fetch('/api/tags');
      const dados = await resposta.json();
      setTags(dados);
    } catch (error) {
      console.error('Erro ao carregar tags:', error);
    } finally {
      setCarregando(false);
    }
  };

  const excluirTag = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta tag?')) {
      try {
        await fetch(`/api/tags/${id}`, {
          method: 'DELETE'
        });
        carregarTags();
      } catch (error) {
        console.error('Erro ao excluir tag:', error);
      }
    }
  };

  const editarTag = (tag: Tag) => {
    setTagEditando(tag);
    setMostrarFormulario(true);
  };

  const fecharFormulario = () => {
    setMostrarFormulario(false);
    setTagEditando(null);
    carregarTags();
  };

  if (carregando) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Carregando tags...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            {tags.length} {tags.length === 1 ? 'tag' : 'tags'} configuradas
          </p>
        </div>
        <Button
          onClick={() => setMostrarFormulario(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nova Tag
        </Button>
      </div>

      {/* Lista de Tags */}
      {tags.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma tag configurada
            </h3>
            <p className="text-gray-500 mb-6">
              Crie tags para categorizar e organizar seus backtests.
            </p>
            <Button onClick={() => setMostrarFormulario(true)}>
              Criar Primeira Tag
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {tags.map((tag) => (
            <Card key={tag.id} className="group hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                    <Badge
                      style={{ backgroundColor: tag.cor }}
                      className="text-white"
                    >
                      {tag.nome}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {tag._count?.backtests || 0} {(tag._count?.backtests || 0) === 1 ? 'backtest' : 'backtests'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => editarTag(tag)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => excluirTag(tag.id)}
                      disabled={(tag._count?.backtests || 0) > 0}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal do Formulário */}
      {mostrarFormulario && (
        <FormularioTag
          tag={tagEditando}
          onClose={fecharFormulario}
        />
      )}
    </div>
  );
}
