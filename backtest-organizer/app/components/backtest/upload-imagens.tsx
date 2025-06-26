
'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface UploadImagensProps {
  onImagensChange: (imagens: File[]) => void;
  imagensIniciais?: File[];
  className?: string;
}

export function UploadImagens({ 
  onImagensChange, 
  imagensIniciais = [], 
  className 
}: UploadImagensProps) {
  const [imagens, setImagens] = useState<File[]>(imagensIniciais);

  const onDrop = useCallback((arquivosAceitos: File[]) => {
    const novasImagens = [...imagens, ...arquivosAceitos];
    setImagens(novasImagens);
    onImagensChange(novasImagens);
  }, [imagens, onImagensChange]);

  const removerImagem = (index: number) => {
    const novasImagens = imagens.filter((_, i) => i !== index);
    setImagens(novasImagens);
    onImagensChange(novasImagens);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: true
  });

  return (
    <div className={cn("space-y-4", className)}>
      {/* Área de Upload */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragActive 
            ? "border-blue-500 bg-blue-50" 
            : "border-gray-300 hover:border-gray-400"
        )}
      >
        <input {...getInputProps()} />
        <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        {isDragActive ? (
          <p className="text-lg">Solte as imagens aqui...</p>
        ) : (
          <>
            <p className="text-lg mb-2">
              Arraste e solte as imagens aqui, ou clique para selecionar
            </p>
            <p className="text-sm text-gray-500">
              Suporte para JPEG, PNG, GIF e WebP
            </p>
          </>
        )}
      </div>

      {/* Preview das Imagens */}
      {imagens.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium">Imagens Selecionadas ({imagens.length})</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {imagens.map((imagem, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={URL.createObjectURL(imagem)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removerImagem(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
                <p className="text-xs text-gray-500 mt-1 truncate">
                  {imagem.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
