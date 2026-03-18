'use client';

import { useState, useEffect, useCallback } from 'react';
import { ClipboardList } from 'lucide-react';
import { StaffHeader } from './staff-header';
import { VistoriaCard } from './vistoria-card';
import type { User, Atribuicao } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface StaffDashboardProps {
  user: User;
  onLogout: () => void;
  onSelectVistoria: (atribuicao: Atribuicao) => void;
}

export function StaffDashboard({ user, onLogout, onSelectVistoria }: StaffDashboardProps) {
  const [atribuicoes, setAtribuicoes] = useState<Atribuicao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const fetchAtribuicoes = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/atribuicoes`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!response.ok) throw new Error('Falha ao buscar vistorias pendentes');
      
      const data = await response.json();
      setAtribuicoes(data);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erro de Conexão", description: error.message });
    } finally {
      setIsLoading(false);
    }
  }, [API_URL, toast]);

  useEffect(() => {
    fetchAtribuicoes();
  }, [fetchAtribuicoes]);

  const pendentes = atribuicoes.filter(a => a.status !== 'concluido');
  const concluidas = atribuicoes.filter(a => a.status === 'concluido');

  return (
    <div className="min-h-screen bg-background">
      <StaffHeader user={user} onLogout={onLogout} />

      <div className="px-4 -mt-3">
        {/* Section: Suas Vistorias */}
        <div className="flex items-center gap-2 mb-4">
          <ClipboardList className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-foreground">Suas Vistorias</h2>
          <span className="text-sm text-muted-foreground">
            ({pendentes.length} pendente{pendentes.length !== 1 ? 's' : ''})
          </span>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-card rounded-xl animate-pulse" />
            ))}
          </div>
        ) : pendentes.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-xl border border-border">
            <ClipboardList className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              Nenhuma vistoria pendente
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendentes.map((atribuicao) => (
              <VistoriaCard
                key={atribuicao.id}
                atribuicao={atribuicao}
                onClick={() => onSelectVistoria(atribuicao)}
              />
            ))}
          </div>
        )}

        {/* Section: Concluídas */}
        {concluidas.length > 0 && (
          <>
            <h2 className="font-semibold text-muted-foreground mt-8 mb-4">
              Concluídas recentemente
            </h2>
            <div className="space-y-3 opacity-60">
              {concluidas.map((atribuicao) => (
                <VistoriaCard
                  key={atribuicao.id}
                  atribuicao={atribuicao}
                  onClick={() => {}} // Desabilitado para concluídas por design
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}