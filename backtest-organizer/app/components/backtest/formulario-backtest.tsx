
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, X, FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UploadImagens } from './upload-imagens';
import { SeletorTags } from '../tags/seletor-tags';
import { SeletorTemplates } from '../templates/seletor-templates';
import type { Backtest, Tag, Template } from '@/lib/types';

interface FormularioBacktestProps {
  backtest?: Backtest;
}

export function FormularioBacktest({ backtest }: FormularioBacktestProps) {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [mostrarTemplates, setMostrarTemplates] = useState(false);

  // Estado do formulário
  const [titulo, setTitulo] = useState(backtest?.titulo || '');
  const [data, setData] = useState(
    backtest?.data ? new Date(backtest.data).toISOString().split('T')[0] : 
    new Date().toISOString().split('T')[0]
  );
  const [observacoes, setObservacoes] = useState(backtest?.observacoes || '');
  const [imagensSelecionadas, setImagensSelecionadas] = useState<File[]>([]);
  const [tagsSelecionadas, setTagsSelecionadas] = useState<Array<{
    tagId: string;
    observacao?: string;
  }>>(
    backtest?.tags?.map(bt => ({
      tagId: bt.tagId,
      observacao: bt.observacao || ''
    })) || []
  );

  useEffect(() => {
    carregarTags();
    carregarTemplates();
  }, []);

  const carregarTags = async () => {
    try {
      const resposta = await fetch('/api/tags');
      const dados = await resposta.json();
      setTags(dados);
    } catch (error) {
      console.error('Erro ao carregar tags:', error);
    }
  };

  const carregarTemplates = async () => {
    try {
      const resposta = await fetch('/api/templates');
      const dados = await resposta.json();
      setTemplates(dados);
    } catch (error) {
      console.error('Erro ao carregar templates:', error);
    }
  };

  const aplicarTemplate = (template: Template) => {
    setObservacoes(template.conteudo);
    setMostrarTemplates(false);
  };

  const uploadImagens = async (imagens: File[]) => {
    const imagensUpload = [];
    
    for (const imagem of imagens) {
      const formData = new FormData();
      formData.append('file', imagem);
      
      const resposta = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      const resultado = await resposta.json();
      imagensUpload.push({
        nomeArquivo: resultado.fileName,
        urlImagem: resultado.url
      });
    }
    
    return imagensUpload;
  };

  const salvarBacktest = async () => {
    if (!titulo.trim()) {
      alert('Por favor, preencha o título do backtest.');
      return;
    }

    try {
      setCarregando(true);
      
      // Upload das imagens
      const imagensUpload = await uploadImagens(imagensSelecionadas);
      
      const dados = {
        titulo,
        data,
        observacoes,
        tags: tagsSelecionadas,
        imagens: imagensUpload
      };

      let resposta;
      if (backtest) {
        // Editando backtest existente
        resposta = await fetch(`/api/backtests/${backtest.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dados)
        });
      } else {
        // Criando novo backtest
        resposta = await fetch('/api/backtests', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dados)
        });
      }

      if (resposta.ok) {
        router.push('/');
      } else {
        alert('Erro ao salvar backtest.');
      }
    } catch (error) {
      console.error('Erro ao salvar backtest:', error);
      alert('Erro ao salvar backtest.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setMostrarTemplates(true)}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Usar Template
          </Button>
          <Button
            onClick={salvarBacktest}
            disabled={carregando}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {carregando ? 'Salvando...' : 'Salvar Backtest'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário Principal */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="titulo">Título *</Label>
                <Input
                  id="titulo"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Digite o título do backtest"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="data">Data *</Label>
                <Input
                  id="data"
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Digite suas observações sobre este backtest"
                  rows={6}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Upload de Imagens */}
          <Card>
            <CardHeader>
              <CardTitle>Imagens</CardTitle>
            </CardHeader>
            <CardContent>
              <UploadImagens
                onImagensChange={setImagensSelecionadas}
                imagensIniciais={imagensSelecionadas}
              />
            </CardContent>
          </Card>
        </div>

        {/* Tags */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <SeletorTags
                tags={tags}
                tagsSelecionadas={tagsSelecionadas}
                onTagsChange={setTagsSelecionadas}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de Templates */}
      {mostrarTemplates && (
        <SeletorTemplates
          templates={templates}
          onSelect={aplicarTemplate}
          onClose={() => setMostrarTemplates(false)}
        />
      )}
    </div>
  );
}
