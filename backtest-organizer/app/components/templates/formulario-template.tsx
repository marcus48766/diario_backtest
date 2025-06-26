
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Template } from '@/lib/types';

interface FormularioTemplateProps {
  template?: Template | null;
  onClose: () => void;
}

export function FormularioTemplate({ template, onClose }: FormularioTemplateProps) {
  const [titulo, setTitulo] = useState(template?.titulo || '');
  const [conteudo, setConteudo] = useState(template?.conteudo || '');
  const [carregando, setCarregando] = useState(false);

  const salvarTemplate = async () => {
    if (!titulo.trim()) {
      alert('Por favor, preencha o título do template.');
      return;
    }

    if (!conteudo.trim()) {
      alert('Por favor, preencha o conteúdo do template.');
      return;
    }

    try {
      setCarregando(true);
      
      const dados = { 
        titulo: titulo.trim(), 
        conteudo: conteudo.trim() 
      };
      
      let resposta;
      if (template) {
        resposta = await fetch(`/api/templates/${template.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dados)
        });
      } else {
        resposta = await fetch('/api/templates', {
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
        alert(erro.error || 'Erro ao salvar template.');
      }
    } catch (error) {
      console.error('Erro ao salvar template:', error);
      alert('Erro ao salvar template.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {template ? 'Editar Template' : 'Novo Template'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="titulo">Título do Template *</Label>
            <Input
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Digite o título do template"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="conteudo">Conteúdo do Template *</Label>
            <Textarea
              id="conteudo"
              value={conteudo}
              onChange={(e) => setConteudo(e.target.value)}
              placeholder="Digite o conteúdo do template que será reutilizado"
              rows={8}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Este conteúdo será inserido no campo de observações quando o template for selecionado.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={salvarTemplate} disabled={carregando}>
              {carregando ? 'Salvando...' : 'Salvar Template'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
