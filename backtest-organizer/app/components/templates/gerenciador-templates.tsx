
'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormularioTemplate } from './formulario-template';
import { truncarTexto, formatarDataHora } from '@/lib/utils';
import type { Template } from '@/lib/types';

export function GerenciadorTemplates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [templateEditando, setTemplateEditando] = useState<Template | null>(null);

  useEffect(() => {
    carregarTemplates();
  }, []);

  const carregarTemplates = async () => {
    try {
      setCarregando(true);
      const resposta = await fetch('/api/templates');
      const dados = await resposta.json();
      setTemplates(dados);
    } catch (error) {
      console.error('Erro ao carregar templates:', error);
    } finally {
      setCarregando(false);
    }
  };

  const excluirTemplate = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este template?')) {
      try {
        await fetch(`/api/templates/${id}`, {
          method: 'DELETE'
        });
        carregarTemplates();
      } catch (error) {
        console.error('Erro ao excluir template:', error);
      }
    }
  };

  const editarTemplate = (template: Template) => {
    setTemplateEditando(template);
    setMostrarFormulario(true);
  };

  const fecharFormulario = () => {
    setMostrarFormulario(false);
    setTemplateEditando(null);
    carregarTemplates();
  };

  if (carregando) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Carregando templates...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            {templates.length} {templates.length === 1 ? 'template' : 'templates'} disponíveis
          </p>
        </div>
        <Button
          onClick={() => setMostrarFormulario(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Novo Template
        </Button>
      </div>

      {/* Lista de Templates */}
      {templates.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum template configurado
            </h3>
            <p className="text-gray-500 mb-6">
              Crie templates para reutilizar observações em seus backtests.
            </p>
            <Button onClick={() => setMostrarFormulario(true)}>
              Criar Primeiro Template
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <Card key={template.id} className="group hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {template.titulo}
                  </CardTitle>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => editarTemplate(template)}
                      className="h-8 w-8"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => excluirTemplate(template.id)}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  {formatarDataHora(template.criadoEm)}
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-600">
                  {truncarTexto(template.conteudo, 120)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal do Formulário */}
      {mostrarFormulario && (
        <FormularioTemplate
          template={templateEditando}
          onClose={fecharFormulario}
        />
      )}
    </div>
  );
}
