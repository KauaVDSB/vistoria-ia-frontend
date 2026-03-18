'use client';

import { useState, useEffect } from 'react';
import { ClipboardList } from 'lucide-react';
import { StaffHeader } from './staff-header';
import { VistoriaCard } from './vistoria-card';
import type { User, Atribuicao } from '@/lib/types';
import { mockAtribuicoes } from '@/lib/mocks';

interface StaffDashboardProps {
  user: User;
  onLogout: () => void;
  onSelectVistoria: (atribuicao: Atribuicao) => void;
}

export function StaffDashboard({ user, onLogout, onSelectVistoria }: StaffDashboardProps) {
  const [atribuicoes, setAtribuicoes] = useState<Atribuicao[]>(mockAtribuicoes);
  const [isLoading, setIsLoading] = useState(false);

  // TODO: Conectar à API Flask
  // useEffect(() => {
  //   const fetchAtribuicoes = async () => {
  //     setIsLoading(true);
  //     try {
  //       const response = await fetch('API_BASE_URL/api/atribuicoes', {
  //         headers: {
  //           'Authorization': `Bearer ${localStorage.getItem('token')}`,
  //         },
  //       });
  //       const data = await response.json();
  //       setAtribuicoes(data);
  //     } catch (error) {
  //       console.error('Erro ao buscar atribuições:', error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchAtribuicoes();
  // }, []);

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
          <div className="text-center py-12 bg-card rounded-xl">
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
                  onClick={() => {}}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
