'use client';

import { useState, useEffect, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminHeader } from './admin-header';
import { KPICards } from './kpi-cards';
import { FilterPills } from './filter-pills';
import { AuditCard } from './audit-card';
import { CreateChecklistSheet } from './create-checklist-sheet';
import type { User, FilterOption, AuditoriaItem, CreateChecklistPayload } from '@/lib/types';
import { mockAuditoriaFeed } from '@/lib/mocks';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

export function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [feed, setFeed] = useState<AuditoriaItem[]>(mockAuditoriaFeed);
  const [activeFilter, setActiveFilter] = useState<FilterOption>('todos');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // TODO: Conectar à API Flask
  // useEffect(() => {
  //   const fetchFeed = async () => {
  //     const response = await fetch('API_BASE_URL/api/auditoria/feed', {
  //       headers: {
  //         'Authorization': `Bearer ${localStorage.getItem('token')}`,
  //       },
  //     });
  //     const data = await response.json();
  //     setFeed(data);
  //   };
  //   fetchFeed();
  // }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simula refresh
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleValidate = (id: string) => {
    setFeed(prev => prev.map(item => 
      item.id_execucao === id ? { ...item, status: 'validado' as const } : item
    ));
  };

  const handleReject = (id: string) => {
    setFeed(prev => prev.map(item => 
      item.id_execucao === id ? { ...item, status: 'reprovado' as const } : item
    ));
  };

  const handleCreateChecklist = (data: CreateChecklistPayload) => {
    console.log('[v0] Checklist criado:', data);
    // TODO: Conectar à API Flask - a criação já está comentada no componente Sheet
  };

  // KPIs calculados do feed atual
  const kpis = useMemo(() => ({
    pendentes: feed.filter(f => f.status === 'pendente').length,
    validados: feed.filter(f => f.status === 'validado').length,
    reprovados: feed.filter(f => f.status === 'reprovado').length,
  }), [feed]);

  // Feed filtrado
  const filteredFeed = useMemo(() => {
    if (activeFilter === 'todos') return feed;
    const statusMap: Record<FilterOption, string> = {
      todos: '',
      pendentes: 'pendente',
      validados: 'validado',
      reprovados: 'reprovado',
    };
    return feed.filter(f => f.status === statusMap[activeFilter]);
  }, [feed, activeFilter]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <AdminHeader
        user={user}
        onRefresh={handleRefresh}
        onLogout={onLogout}
        isRefreshing={isRefreshing}
      />

      {/* KPIs */}
      <KPICards
        pendentes={kpis.pendentes}
        validados={kpis.validados}
        reprovados={kpis.reprovados}
      />

      {/* Filters */}
      <FilterPills
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {/* Feed */}
      <div className="px-4 space-y-4">
        {filteredFeed.length === 0 ? (
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

      {/* FAB - Floating Action Button */}
      <Button
        onClick={() => setIsSheetOpen(true)}
        className="fixed bottom-6 left-6 h-14 w-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl z-50"
        size="icon"
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Create Checklist Sheet */}
      <CreateChecklistSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        onSubmit={handleCreateChecklist}
      />
    </div>
  );
}
