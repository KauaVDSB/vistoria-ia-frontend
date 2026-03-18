'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminHeader } from './admin-header';
import { KPICards } from './kpi-cards';
import { FilterPills } from './filter-pills';
import { AuditCard } from './audit-card';
import { CreateChecklistSheet } from './create-checklist-sheet';
import type { User, FilterOption, AuditoriaItem, CreateChecklistPayload } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

export function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [feed, setFeed] = useState<AuditoriaItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterOption>('todos');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { toast } = useToast();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const fetchFeed = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch(`${API_URL}/api/auditoria/feed`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Falha ao buscar vistorias');
      const data = await response.json();
      setFeed(data);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erro de Conexão", description: error.message });
    } finally {
      setIsRefreshing(false);
    }
  }, [API_URL, toast]);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  const updateAuditStatus = async (id: string, novoStatus: 'aprovado' | 'rejeitado') => {
    try {
      const response = await fetch(`${API_URL}/api/auditoria/execucoes/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status: novoStatus })
      });
      
      if (!response.ok) throw new Error('Erro ao atualizar status');
      
      // Atualiza o feed localmente para refletir na UI instantaneamente
      setFeed(prev => prev.map(item => 
        item.id_execucao === id ? { ...item, status: novoStatus === 'aprovado' ? 'validado' : 'reprovado' } : item
      ));
      
      toast({ title: "Sucesso", description: `Vistoria ${novoStatus} com sucesso!` });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erro", description: error.message });
    }
  };

  const handleValidate = (id: string) => updateAuditStatus(id, 'aprovado');
  const handleReject = (id: string) => updateAuditStatus(id, 'rejeitado');

  const handleCreateChecklist = async (data: CreateChecklistPayload) => {
    try {
      const response = await fetch(`${API_URL}/api/checklists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Erro ao criar checklist');
      
      toast({ title: "Sucesso", description: "Checklist criado e atribuído ao operador!" });
      setIsSheetOpen(false);
      // Se houvesse uma rota para listar os criados, chamaríamos aqui. 
      // Como o dashboard é focado no feed de *execuções*, não precisamos recarregar o feed agora.
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erro", description: error.message });
    }
  };

  const kpis = useMemo(() => ({
    pendentes: feed.filter(f => f.status === 'pendente_validacao' || f.status === 'pendente').length,
    validados: feed.filter(f => f.status === 'validado' || f.status === 'aprovado').length,
    reprovados: feed.filter(f => f.status === 'reprovado' || f.status === 'rejeitado').length,
  }), [feed]);

  const filteredFeed = useMemo(() => {
    if (activeFilter === 'todos') return feed;
    const statusMap: Record<FilterOption, string[]> = {
      todos: [],
      pendentes: ['pendente', 'pendente_validacao'],
      validados: ['validado', 'aprovado'],
      reprovados: ['reprovado', 'rejeitado'],
    };
    return feed.filter(f => statusMap[activeFilter].includes(f.status));
  }, [feed, activeFilter]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <AdminHeader
        user={user}
        onRefresh={fetchFeed}
        onLogout={onLogout}
        isRefreshing={isRefreshing}
      />

      <KPICards pendentes={kpis.pendentes} validados={kpis.validados} reprovados={kpis.reprovados} />

      <FilterPills activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      <div className="px-4 space-y-4">
        {isRefreshing && feed.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground animate-pulse">Carregando dados...</div>
        ) : filteredFeed.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Nenhuma vistoria {activeFilter !== 'todos' ? activeFilter.slice(0, -1) + 'a' : 'encontrada'}
            </p>
          </div>
        ) : (
          filteredFeed.map((item) => (
            <AuditCard
              key={item.id_execucao}
              item={item}
              onValidate={handleValidate}
              onReject={handleReject}
            />
          ))
        )}
      </div>

      <Button
        onClick={() => setIsSheetOpen(true)}
        className="fixed bottom-6 left-6 h-14 w-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl z-50"
        size="icon"
      >
        <Plus className="w-6 h-6" />
      </Button>

      <CreateChecklistSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        onSubmit={handleCreateChecklist}
      />
    </div>
  );
}