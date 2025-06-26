
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatarData(data: Date | string): string {
  const dataObj = typeof data === 'string' ? new Date(data) : data;
  return dataObj.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

export function formatarDataHora(data: Date | string): string {
  const dataObj = typeof data === 'string' ? new Date(data) : data;
  return dataObj.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function truncarTexto(texto: string, limite: number = 100): string {
  if (texto.length <= limite) return texto;
  return texto.substring(0, limite) + '...';
}

export function obterCorTag(cor: string): string {
  const coresValidas = ['#DC2626', '#2563EB', '#FBBF24', '#16A34A'];
  return coresValidas.includes(cor) ? cor : '#2563EB';
}

export function uploadImagem(arquivo: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // Simular upload para pasta public/uploads
    const nomeArquivo = `${Date.now()}-${arquivo.name}`;
    const url = `/uploads/${nomeArquivo}`;
    
    // Em uma aplicação real, aqui faria o upload para o servidor
    // Por agora, vamos simular o sucesso do upload
    setTimeout(() => {
      resolve(url);
    }, 1000);
  });
}
