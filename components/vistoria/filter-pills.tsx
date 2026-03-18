'use client';

import { cn } from '@/lib/utils';
import type { FilterOption } from '@/lib/types';

interface FilterPillsProps {
  activeFilter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
}

const filters: { value: FilterOption; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'pendentes', label: 'Pendentes' },
  { value: 'validados', label: 'Validados' },
  { value: 'reprovados', label: 'Reprovados' },
];

export function FilterPills({ activeFilter, onFilterChange }: FilterPillsProps) {
  return (
    <div className="px-4 pb-4">
      {/* Correção Demanda C: 
        Classes injetadas para esconder a scrollbar em todos os navegadores (Chrome, Firefox, Edge) 
        mantendo o touch-drag perfeito no mobile.
      */}
      <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
              activeFilter === filter.value
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}