// =============================================================================
// VISTORIA IA - Types & Contracts
// Tipos baseados nos contratos da API Flask
// =============================================================================

// User & Auth Types
export interface User {
  id: string;
  nome: string;
  email: string;
  role: 'admin' | 'staff';
  avatar?: string;
}

// Checklist Types (Admin cria)
export interface ChecklistEtapa {
  id: string;
  descricao: string;
  requer_foto: boolean;
}

export interface ChecklistTemplate {
  id: string;
  titulo: string;
  etapas: ChecklistEtapa[];
  staff_email: string;
  criado_em: string;
}

// Atribuição (Staff recebe)
export interface Atribuicao {
  id: string;
  titulo: string;
  status: 'pendente' | 'em_andamento' | 'concluido';
  total_etapas: number;
  etapas_concluidas: number;
  criado_em: string;
  etapas: EtapaExecucao[];
}

// Etapa durante execução (Staff executa)
export interface EtapaExecucao {
  id: string;
  descricao: string;
  requer_foto: boolean;
  foto_url?: string;
  justificativa?: string;
  status: 'pendente' | 'concluida' | 'impedida';
}

// Feed de Auditoria (Admin visualiza)
export interface AuditoriaItem {
  id_execucao: string;
  staff_nome: string;
  staff_avatar?: string;
  titulo: string;
  fotos: string[];
  impedimentos: string[];
  status: 'pendente' | 'validado' | 'reprovado';
  criado_em: string;
  etapas_concluidas: number;
  etapas_total: number;
}

// Navigation State
export type Screen = 
  | 'login' 
  | 'admin' 
  | 'staff' 
  | 'execucao';

// Filter Options
export type FilterOption = 'todos' | 'pendentes' | 'validados' | 'reprovados';

// API Payloads
export interface CreateChecklistPayload {
  titulo: string;
  etapas: { descricao: string; requer_foto: boolean }[];
  staff_email: string;
}

export interface ExecutarEtapaPayload {
  id_etapa: string;
  foto_url: string | null;
  justificativa: string | null;
}
