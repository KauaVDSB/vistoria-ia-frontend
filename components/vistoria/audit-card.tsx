'use client';

import { useState } from 'react';
import { Check, X, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import type { AuditoriaItem } from '@/lib/types';
import { formatRelativeTime, getInitials } from '@/lib/mocks';

interface AuditCardProps {
  item: AuditoriaItem;
  onValidate: (id: string) => void;
  onReject: (id: string) => void;
}

export function AuditCard({ item, onValidate, onReject }: AuditCardProps) {
  const [localStatus, setLocalStatus] = useState<'pendente' | 'validado' | 'reprovado'>(item.status);

  const handleValidate = () => {
    setLocalStatus('validado');
    onValidate(item.id_execucao);
    
    // TODO: Conectar à API Flask
    // await fetch('API_BASE_URL/api/auditoria/validar', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
    //   },
    //   body: JSON.stringify({ id_execucao: item.id_execucao }),
    // });
  };

  const handleReject = () => {
    setLocalStatus('reprovado');
    onReject(item.id_execucao);
    
    // TODO: Conectar à API Flask
    // await fetch('API_BASE_URL/api/auditoria/reprovar', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
    //   },
    //   body: JSON.stringify({ id_execucao: item.id_execucao }),
    // });
  };

  const isProcessed = localStatus !== 'pendente';

  return (
    <Card className={`overflow-hidden border-0 shadow-md bg-card transition-all duration-300 ${isProcessed ? 'opacity-60' : ''}`}>
      {/* Card Header */}
      <div className="flex items-start gap-3 p-4 pb-2">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-secondary text-secondary-foreground text-sm font-medium">
            {getInitials(item.staff_nome)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-foreground">{item.staff_nome}</p>
            <span className="text-xs text-muted-foreground">
              {formatRelativeTime(item.criado_em)}
            </span>
          </div>
          <p className="text-sm text-muted-foreground truncate">{item.titulo}</p>
        </div>
      </div>

      {/* Carousel de Fotos */}
      <CardContent className="p-0 relative">
        {item.fotos.length > 0 && (
          <Carousel className="w-full">
            <CarouselContent className="-ml-0">
              {item.fotos.map((foto, index) => (
                <CarouselItem key={index} className="pl-0">
                  <div className="aspect-square bg-muted relative">
                    <img
                      src={foto}
                      alt={`Foto ${index + 1} de ${item.titulo}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {item.fotos.length > 1 && (
              <>
                <CarouselPrevious className="left-2 h-8 w-8" />
                <CarouselNext className="right-2 h-8 w-8" />
              </>
            )}
          </Carousel>
        )}

        {/* Status Overlay */}
        {isProcessed && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className={`flex items-center gap-3 px-6 py-4 rounded-xl ${
              localStatus === 'validado' 
                ? 'bg-green-600 text-white' 
                : 'bg-red-500 text-white'
            }`}>
              {localStatus === 'validado' ? (
                <CheckCircle2 className="w-8 h-8" />
              ) : (
                <XCircle className="w-8 h-8" />
              )}
              <span className="text-xl font-bold">
                {localStatus === 'validado' ? 'APROVADA' : 'REPROVADA'}
              </span>
            </div>
          </div>
        )}
      </CardContent>

      {/* Info & Actions */}
      <div className="p-4 space-y-3">
        {/* Counters */}
        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted-foreground">
            <span className="font-medium text-foreground">{item.etapas_concluidas}</span> Concluídas
          </span>
          {item.impedimentos.length > 0 && (
            <span className="text-amber-600 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-medium">{item.impedimentos.length}</span> Impedimento{item.impedimentos.length > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Impedimentos */}
        {item.impedimentos.length > 0 && (
          <div className="bg-muted rounded-lg p-3 space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Justificativas de Impedimento
            </p>
            {item.impedimentos.map((imp, i) => (
              <p key={i} className="text-sm text-foreground flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                {imp}
              </p>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        {!isProcessed && (
          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleValidate}
              className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white font-semibold"
            >
              <Check className="w-5 h-5 mr-2" />
              Validar Vistoria
            </Button>
            <Button
              onClick={handleReject}
              variant="outline"
              size="icon"
              className="h-12 w-12 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
