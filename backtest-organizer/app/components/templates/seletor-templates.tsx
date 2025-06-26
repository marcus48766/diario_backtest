
'use client';

import { X, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { truncarTexto, formatarDataHora } from '@/lib/utils';
import type { Template } from '@/lib/types';

interface SeletorTemplatesProps {
  templates: Template[];
  onSelect: (template: Template) => void;
  onClose: () => void;
}

export function SeletorTemplates({ templates, onSelect, onClose }: SeletorTemplatesProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Selecionar Template
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-3">
          {templates.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum template disponível</p>
              <p className="text-sm text-gray-400 mt-2">
                Crie templates na página de gerenciamento para reutilizar observações
              </p>
            </div>
          ) : (
            templates.map((template) => (
              <Card 
                key={template.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onSelect(template)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{template.titulo}</CardTitle>
                  <p className="text-xs text-gray-500">
                    Criado em {formatarDataHora(template.criadoEm)}
                  </p>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600">
                    {truncarTexto(template.conteudo, 150)}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
