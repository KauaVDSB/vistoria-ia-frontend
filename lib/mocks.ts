// =============================================================================
// VISTORIA IA - Mock Data
// Dados simulados baseados nos contratos da API Flask
// =============================================================================

import type { User, Atribuicao, AuditoriaItem } from './types';

// Mock Users
export const mockAdminUser: User = {
  id: 'admin-1',
  nome: 'Maria Santos',
  email: 'maria@empresa.com',
  role: 'admin',
};

export const mockStaffUser: User = {
  id: 'staff-1',
  nome: 'João Silva',
  email: 'joao@empresa.com',
  role: 'staff',
};

// Mock Atribuições (GET /api/atribuicoes)
export const mockAtribuicoes: Atribuicao[] = [
  {
    id: '1',
    titulo: 'Vistoria Pátio A',
    status: 'pendente',
    total_etapas: 6,
    etapas_concluidas: 0,
    criado_em: new Date(Date.now() - 7 * 60 * 1000).toISOString(), // 7 min atrás
    etapas: [
      { id: 'e1', descricao: 'Foto da entrada principal', requer_foto: true, status: 'pendente' },
      { id: 'e2', descricao: 'Verificar extintor corredor A', requer_foto: true, status: 'pendente' },
      { id: 'e3', descricao: 'Estado do portão de carga', requer_foto: true, status: 'pendente' },
      { id: 'e4', descricao: 'Iluminação área externa', requer_foto: true, status: 'pendente' },
      { id: 'e5', descricao: 'Verificar sinalização', requer_foto: false, status: 'pendente' },
      { id: 'e6', descricao: 'Foto panorâmica final', requer_foto: true, status: 'pendente' },
    ],
  },
  {
    id: '2',
    titulo: 'Inspeção Docas B',
    status: 'em_andamento',
    total_etapas: 4,
    etapas_concluidas: 2,
    criado_em: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 horas atrás
    etapas: [
      { id: 'e7', descricao: 'Doca 1 - Estado geral', requer_foto: true, foto_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400', status: 'concluida' },
      { id: 'e8', descricao: 'Doca 2 - Piso e marcações', requer_foto: true, foto_url: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=400', status: 'concluida' },
      { id: 'e9', descricao: 'Doca 3 - Equipamentos', requer_foto: true, status: 'pendente' },
      { id: 'e10', descricao: 'Doca 4 - Segurança', requer_foto: true, status: 'pendente' },
    ],
  },
  {
    id: '3',
    titulo: 'Checklist Armazém C',
    status: 'pendente',
    total_etapas: 3,
    etapas_concluidas: 0,
    criado_em: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 min atrás
    etapas: [
      { id: 'e11', descricao: 'Prateleiras - Organização', requer_foto: true, status: 'pendente' },
      { id: 'e12', descricao: 'Área de picking', requer_foto: true, status: 'pendente' },
      { id: 'e13', descricao: 'Saída de emergência', requer_foto: true, status: 'pendente' },
    ],
  },
];

// Mock Feed de Auditoria (GET /api/auditoria/feed)
export const mockAuditoriaFeed: AuditoriaItem[] = [
  {
    id_execucao: '99',
    staff_nome: 'João Silva',
    titulo: 'Vistoria Pátio Central',
    fotos: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600',
      'https://images.unsplash.com/photo-1553413077-190dd305871c?w=600',
      'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=600',
    ],
    impedimentos: ['Portão trancado - não foi possível fotografar área externa'],
    status: 'pendente',
    criado_em: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    etapas_concluidas: 5,
    etapas_total: 6,
  },
  {
    id_execucao: '98',
    staff_nome: 'Ana Costa',
    titulo: 'Inspeção Docas Norte',
    fotos: [
      'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=600',
      'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=600',
    ],
    impedimentos: [],
    status: 'pendente',
    criado_em: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    etapas_concluidas: 4,
    etapas_total: 4,
  },
  {
    id_execucao: '97',
    staff_nome: 'Carlos Mendes',
    titulo: 'Checklist Armazém Sul',
    fotos: [
      'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=600',
    ],
    impedimentos: ['Equipamento de medição indisponível', 'Área em manutenção'],
    status: 'pendente',
    criado_em: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    etapas_concluidas: 2,
    etapas_total: 5,
  },
  {
    id_execucao: '96',
    staff_nome: 'Fernanda Lima',
    titulo: 'Vistoria Área de Expedição',
    fotos: [
      'https://images.unsplash.com/photo-1553413077-190dd305871c?w=600',
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600',
      'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=600',
      'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=600',
    ],
    impedimentos: [],
    status: 'pendente',
    criado_em: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    etapas_concluidas: 8,
    etapas_total: 8,
  },
];

// Utility: Format relative time in Portuguese
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'agora mesmo';
  if (diffMins < 60) return `há ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
  if (diffHours < 24) return `há ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
  return `há ${diffDays} dia${diffDays > 1 ? 's' : ''}`;
}

// Utility: Get initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
