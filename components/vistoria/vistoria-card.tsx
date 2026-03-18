'use client';

import { ChevronRight, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Atribuicao } from '@/lib/types';
import { formatRelativeTime } from '@/lib/mocks';

interface VistoriaCardProps {
  atribuicao: Atribuicao;
  onClick: () => void;
}

export function VistoriaCard({ atribuicao, onClick }: VistoriaCardProps) {
  const isPendente = atribuicao.status === 'pendente';
  const isEmAndamento = atribuicao.status === 'em_andamento';
  const isConcluido = atribuicao.status === 'concluido';

  const etapasRestantes = atribuicao.total_etapas - atribuicao.etapas_concluidas;

  return (
    <Card
      onClick={onClick}
      className="p-4 border-0 shadow-sm bg-card cursor-pointer hover:shadow-md transition-all active:scale-[0.98]"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            {isPendente && (
              <Badge className="bg-amber-100 text-amber-800 border-0 text-xs font-medium">
                <Clock className="w-3 h-3 mr-1" />
                Pendente - {atribuicao.total_etapas} etapas
              </Badge>
            )}
            {isEmAndamento && (
              <Badge className="bg-blue-100 text-blue-700 border-0 text-xs font-medium">
                <AlertCircle className="w-3 h-3 mr-1" />
                Em andamento - {etapasRestantes} restantes
              </Badge>
            )}
            {isConcluido && (
              <Badge className="bg-green-100 text-green-700 border-0 text-xs font-medium">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Concluído
              </Badge>
            )}
          </div>
          <h3 className="font-semibold text-foreground truncate">
            {atribuicao.titulo}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {formatRelativeTime(atribuicao.criado_em)}
          </p>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0 ml-2" />
      </div>

      {/* Progress indicator */}
      {(isPendente || isEmAndamento) && (
        <div className="mt-3 flex gap-1">
          {Array.from({ length: atribuicao.total_etapas }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full ${
                i < atribuicao.etapas_concluidas
                  ? 'bg-green-500'
                  : 'bg-muted'
              }`}
            />
          ))}
        </div>
      )}
    </Card>
  );
}
