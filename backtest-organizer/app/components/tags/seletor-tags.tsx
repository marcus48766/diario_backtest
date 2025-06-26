
'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import type { Tag } from '@/lib/types';

interface SeletorTagsProps {
  tags: Tag[];
  tagsSelecionadas: Array<{
    tagId: string;
    observacao?: string;
  }>;
  onTagsChange: (tags: Array<{ tagId: string; observacao?: string }>) => void;
}

export function SeletorTags({ tags, tagsSelecionadas, onTagsChange }: SeletorTagsProps) {
  const [tagSelecionada, setTagSelecionada] = useState<string>('');

  const adicionarTag = () => {
    if (!tagSelecionada) return;
    
    // Verificar se a tag já foi selecionada
    if (tagsSelecionadas.some(ts => ts.tagId === tagSelecionada)) {
      return;
    }

    const novasTags = [...tagsSelecionadas, { tagId: tagSelecionada, observacao: '' }];
    onTagsChange(novasTags);
    setTagSelecionada('');
  };

  const removerTag = (tagId: string) => {
    const novasTags = tagsSelecionadas.filter(ts => ts.tagId !== tagId);
    onTagsChange(novasTags);
  };

  const atualizarObservacaoTag = (tagId: string, observacao: string) => {
    const novasTags = tagsSelecionadas.map(ts => 
      ts.tagId === tagId ? { ...ts, observacao } : ts
    );
    onTagsChange(novasTags);
  };

  const obterTag = (tagId: string) => tags.find(t => t.id === tagId);

  return (
    <div className="space-y-4">
      {/* Adicionar Nova Tag */}
      <div className="flex gap-2">
        <Select value={tagSelecionada} onValueChange={setTagSelecionada}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Selecione uma tag" />
          </SelectTrigger>
          <SelectContent>
            {tags
              .filter(tag => !tagsSelecionadas.some(ts => ts.tagId === tag.id))
              .map(tag => (
                <SelectItem key={tag.id} value={tag.id}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: tag.cor }}
                    />
                    {tag.nome}
                  </div>
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <Button
          type="button"
          onClick={adicionarTag}
          disabled={!tagSelecionada}
          size="icon"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Tags Selecionadas */}
      {tagsSelecionadas.length > 0 && (
        <div className="space-y-3">
          <Label>Tags Aplicadas</Label>
          {tagsSelecionadas.map((tagSelecionadaItem) => {
            const tag = obterTag(tagSelecionadaItem.tagId);
            if (!tag) return null;

            return (
              <div key={tagSelecionadaItem.tagId} className="border rounded-lg p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge
                    style={{ backgroundColor: tag.cor }}
                    className="text-white"
                  >
                    {tag.nome}
                  </Badge>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removerTag(tagSelecionadaItem.tagId)}
                    className="h-6 w-6"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                
                <div>
                  <Label htmlFor={`observacao-${tagSelecionadaItem.tagId}`} className="text-xs">
                    Observação da tag (opcional)
                  </Label>
                  <Textarea
                    id={`observacao-${tagSelecionadaItem.tagId}`}
                    value={tagSelecionadaItem.observacao || ''}
                    onChange={(e) => atualizarObservacaoTag(tagSelecionadaItem.tagId, e.target.value)}
                    placeholder={`Observação específica para a tag "${tag.nome}"`}
                    rows={2}
                    className="mt-1"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tagsSelecionadas.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">
          Nenhuma tag selecionada
        </p>
      )}
    </div>
  );
}
