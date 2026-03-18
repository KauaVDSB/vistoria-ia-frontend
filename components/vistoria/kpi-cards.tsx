'use client';

import { Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface KPICardsProps {
  pendentes: number;
  validados: number;
  reprovados: number;
}

export function KPICards({ pendentes, validados, reprovados }: KPICardsProps) {
  const cards = [
    {
      label: 'Pendentes',
      value: pendentes,
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
    },
    {
      label: 'Validados',
      value: validados,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Reprovados',
      value: reprovados,
      icon: XCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-100',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 px-4 py-4">
      {cards.map((card) => (
        <Card
          key={card.label}
          className="p-3 border-0 shadow-sm bg-card"
        >
          <div className="flex flex-col items-center text-center">
            <div className={`w-8 h-8 rounded-full ${card.bgColor} flex items-center justify-center mb-2`}>
              <card.icon className={`w-4 h-4 ${card.color}`} />
            </div>
            <span className="text-2xl font-bold text-foreground">{card.value}</span>
            <span className="text-xs text-muted-foreground">{card.label}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}
