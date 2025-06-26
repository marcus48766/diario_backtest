
// Tipos para o Sistema de Backtests
export interface Backtest {
  id: string;
  titulo: string;
  data: Date;
  observacoes?: string | null;
  posicao: number;
  criadoEm: Date;
  atualizadoEm: Date;
  imagens: BacktestImagem[];
  tags: BacktestTag[];
}

export interface Tag {
  id: string;
  nome: string;
  cor: string;
  posicao: number;
  criadoEm: Date;
  atualizadoEm: Date;
  backtests?: BacktestTag[];
  _count?: {
    backtests: number;
  };
}

export interface Template {
  id: string;
  titulo: string;
  conteudo: string;
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface BacktestImagem {
  id: string;
  backtestId: string;
  nomeArquivo: string;
  urlImagem: string;
  posicao: number;
  criadoEm: Date;
  backtest?: Backtest;
}

export interface BacktestTag {
  id: string;
  backtestId: string;
  tagId: string;
  observacao?: string | null;
  criadoEm: Date;
  backtest?: Backtest;
  tag?: Tag;
}

export type OrdenacaoTipo = 'data' | 'manual';

export interface BacktestFormData {
  titulo: string;
  data: Date;
  observacoes?: string;
  tags: Array<{
    tagId: string;
    observacao?: string;
  }>;
  imagens: File[];
}

export const CORES_TAGS = {
  vermelho: '#DC2626',
  azul: '#2563EB', 
  amarelo: '#FBBF24',
  verde: '#16A34A'
} as const;

export type CorTag = keyof typeof CORES_TAGS;
